import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { initAuth } from './redux/slices/authSlice';
import { fetchCartThunk, setCartItems, loadGuestCart } from './redux/slices/cartSlice';
import { AuthProvider } from './context/AuthContext';
import { audioAlert } from './utils/audio';

import Spinner from './components/common/Spinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import Toast from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/common/CartDrawer';
import SearchDialog from './components/common/SearchDialog';
import ScrollToTopButton from './components/common/ScrollToTopButton';

// Eagerly loaded storefront pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Lazily loaded storefront & customer pages
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const OrderHistory = lazy(() => import('./pages/profile/OrderHistory'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminOrderDetail = lazy(() => import('./pages/admin/OrderDetail'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const EditProduct = lazy(() => import('./pages/admin/EditProduct'));

// Real-Time Demo Multi-Role Lifecycle pages
const FulfillmentQueue = lazy(() =>
  import('./pages/fulfillment/FulfillmentQueue').then((m) => ({ default: m.FulfillmentQueue }))
);
const OrderStatusTracker = lazy(() =>
  import('./pages/customer/OrderStatusTracker').then((m) => ({ default: m.OrderStatusTracker }))
);
const LiveMetrics = lazy(() =>
  import('./pages/admin/LiveMetrics').then((m) => ({ default: m.LiveMetrics }))
);
const StorefrontHarness = lazy(() =>
  import('./pages/storefront/Storefront').then((m) => ({ default: m.Storefront }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
      staleTime: 0,
    },
  },
});

const PageSpinner = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Spinner size="lg" />
  </div>
);

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Navbar />
    <main style={{ flex: 1, background: '#fdfdfd' }}>{children}</main>
    <Footer />
  </div>
);

export const App = () => {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((s) => s.auth);

  useEffect(() => {
    audioAlert.initAutoplayUnlock();
    dispatch(initAuth()).then((result) => {
      if (initAuth.fulfilled.match(result)) {
        dispatch(fetchCartThunk());
      } else {
        dispatch(setCartItems(loadGuestCart()));
      }
    });
  }, [dispatch]);

  if (!isInitialized) return <Spinner fullPage />;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toast />
        <CartDrawer />
        <SearchDialog />
        <ScrollToTopButton />

        <ErrorBoundary>
          <Suspense fallback={<PageSpinner />}>
            <Routes>
              {/* Auth */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password/:token" element={<ResetPassword />} />

              {/* Public Catalog */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/shop" element={<PublicLayout><Shop /></PublicLayout>} />
              <Route path="/shop/:gender" element={<PublicLayout><Shop /></PublicLayout>} />
              <Route path="/shop/category/:cat" element={<PublicLayout><Shop /></PublicLayout>} />
              <Route path="/product/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
              <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
              <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
              <Route path="/terms-of-service" element={<PublicLayout><Terms /></PublicLayout>} />

              {/* Shopping Cart, Checkout & Confirmation */}
              <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
              <Route path="/order-confirmation/:id" element={<PublicLayout><OrderConfirmation /></PublicLayout>} />
              <Route path="/order-confirmation" element={<PublicLayout><OrderConfirmation /></PublicLayout>} />

              {/* Real-Time Order Status Tracker (3s Polling) */}
              <Route path="/track" element={<PublicLayout><OrderStatusTracker /></PublicLayout>} />
              <Route path="/track/:id" element={<PublicLayout><OrderStatusTracker /></PublicLayout>} />

              {/* Warehouse Fulfillment Queue (Role Guard: WAREHOUSE, ADMIN) */}
              <Route
                path="/fulfillment"
                element={
                  <ProtectedRoute allowedRoles={['WAREHOUSE', 'ADMIN']}>
                    <PublicLayout><FulfillmentQueue /></PublicLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Live Telemetry & Metrics (Role Guard: ADMIN) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <PublicLayout><LiveMetrics /></PublicLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/live"
                element={
                  <PublicLayout><LiveMetrics /></PublicLayout>
                }
              />
              <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/products/new" element={<ProtectedRoute adminOnly><EditProduct /></ProtectedRoute>} />
              <Route path="/admin/products/:id/edit" element={<ProtectedRoute adminOnly><EditProduct /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
              <Route path="/admin/orders/:id" element={<ProtectedRoute adminOnly><AdminOrderDetail /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />

              {/* Protected Customer Routes */}
              <Route path="/profile" element={<ProtectedRoute><PublicLayout><Profile /></PublicLayout></ProtectedRoute>} />
              <Route path="/profile/orders" element={<ProtectedRoute><PublicLayout><OrderHistory /></PublicLayout></ProtectedRoute>} />

              {/* Developer Test Form */}
              <Route path="/storefront-test" element={<PublicLayout><StorefrontHarness /></PublicLayout>} />

              {/* Fallback 404 */}
              <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
