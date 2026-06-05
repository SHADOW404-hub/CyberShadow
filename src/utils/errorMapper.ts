/**
 * Supabase xatolarini foydalanuvchi uchun tushunarli formatga o'tkazadi.
 */
export const mapAuthError = (error: any): string => {
  if (!error) return 'UNKNOWN_EXCEPTION: Sequence failed';
  
  const msg = error.message.toLowerCase();

  if (msg.includes('invalid login credentials')) return 'ACCESS_DENIED: Invalid identification';
  if (msg.includes('email not confirmed')) return 'SECURITY: Identity verification required';
  if (msg.includes('user already registered')) return 'REGISTRY_ERROR: Identity already exists';
  if (msg.includes('rate limit')) return 'SYSTEM_THROTTLED: Too many attempts';
  if (msg.includes('database') || msg.includes('server')) return 'LINK_FAILURE: Internal node error';
  if (msg.includes('same as old')) return 'POLICY_ERROR: New password must be unique';
  if (msg.includes('at least 6 characters')) return 'POLICY_ERROR: Password complexity insufficient';

  return `SYSTEM_ERROR: ${error.message}`;
};
