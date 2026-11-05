import axiosInstance from './axiosInstance';
import type { SupabaseUploadParams } from '../utils/supabaseUpload';

export const getUploadSignature = async (folder?: string): Promise<SupabaseUploadParams> => {
  const { data } = await axiosInstance.post<SupabaseUploadParams>('/upload/signature', {
    folder: folder ?? 'rhshop/products',
  });
  return data;
};
