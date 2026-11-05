export const VALID_TRANSITIONS = {
  PLACED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['READY_FOR_PICKUP', 'SHIPPED', 'CANCELLED'],
  READY_FOR_PICKUP: ['COMPLETED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  COMPLETED: [],
  DELIVERED: [],
  CANCELLED: [],
};

export const TRANSITION_ROLE_PERMISSIONS = {
  PLACED: ['CUSTOMER', 'ADMIN'],
  PROCESSING: ['WAREHOUSE', 'ADMIN'],
  READY_FOR_PICKUP: ['WAREHOUSE', 'ADMIN'],
  SHIPPED: ['WAREHOUSE', 'ADMIN'],
  COMPLETED: ['WAREHOUSE', 'ADMIN'],
  DELIVERED: ['WAREHOUSE', 'ADMIN'],
  CANCELLED: ['CUSTOMER', 'ADMIN', 'WAREHOUSE'],
};

export function validateStateTransition(currentStatus, nextStatus, actorRole, fulfillmentType) {
  const allowedNext = VALID_TRANSITIONS[currentStatus] || [];

  if (!allowedNext.includes(nextStatus)) {
    return {
      valid: false,
      error: `Invalid transition from ${currentStatus} to ${nextStatus}. Allowed: [${allowedNext.join(', ')}]`,
      allowedNextStates: allowedNext,
    };
  }

  const allowedRoles = TRANSITION_ROLE_PERMISSIONS[nextStatus] || [];
  if (!allowedRoles.includes(actorRole)) {
    return {
      valid: false,
      error: `Role ${actorRole} is not authorized to transition order to ${nextStatus}. Required roles: [${allowedRoles.join(', ')}]`,
      allowedNextStates: allowedNext,
    };
  }

  // Customer cancellation is restricted to PLACED status before fulfillment starts
  if (actorRole === 'CUSTOMER' && nextStatus === 'CANCELLED' && currentStatus !== 'PLACED') {
    return {
      valid: false,
      error: 'Customers may only cancel orders while in PLACED status.',
      allowedNextStates: [],
    };
  }

  if (fulfillmentType === 'PICKUP' && nextStatus === 'SHIPPED') {
    return {
      valid: false,
      error: 'Order with PICKUP fulfillment should transition to READY_FOR_PICKUP, not SHIPPED.',
      allowedNextStates: ['READY_FOR_PICKUP', 'CANCELLED'],
    };
  }

  if (fulfillmentType === 'DELIVERY' && nextStatus === 'READY_FOR_PICKUP') {
    return {
      valid: false,
      error: 'Order with DELIVERY fulfillment should transition to SHIPPED, not READY_FOR_PICKUP.',
      allowedNextStates: ['SHIPPED', 'CANCELLED'],
    };
  }

  return {
    valid: true,
    allowedNextStates: allowedNext,
  };
}

export function getAvailableNextStates(currentStatus, actorRole, fulfillmentType = 'DELIVERY') {
  const transitions = VALID_TRANSITIONS[currentStatus] || [];
  return transitions.filter((next) => {
    const res = validateStateTransition(currentStatus, next, actorRole, fulfillmentType);
    return res.valid;
  });
}
