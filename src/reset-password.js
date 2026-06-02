import { supabase } from './supabase.js'
import './style.css';

// ─── Session Security Check ──────────────────────────────────────────────────
// Foydalanuvchi haqiqatdan ham recovery link orqali kelganini tekshiramiz.
// Sessiyasiz bu sahifaga kirishga ruxsat bermaymiz.
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  window.location.replace('/');
}

// ─── Security Helpers ─────────────────────────────────────────────────────────
const mapResetError = (error) => {
  if (!error) return 'Update sequence failed.';
  const msg = error.message.toLowerCase();
  
  // Xavfsizlik qoidalariga mos keladigan xabarlar
  if (msg.includes('same as old')) return 'Security: New password must differ from previous.';
  if (msg.includes('at least 6 characters')) return 'Policy: Password must be min 6 characters.';
  if (msg.includes('rate limit')) return 'System: Connection throttled. Wait before retrying.';
  if (msg.includes('expired')) return 'Security: Recovery session expired. Request new link.';
  
  return 'System Error: User identity update aborted.';
};

const resetForm = document.getElementById('resetPasswordForm');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const passwordError = document.getElementById('passwordError');
const confirmError = document.getElementById('confirmError');
const resetBtn = document.getElementById('resetBtn');
const statusConsole = document.getElementById('statusConsole');
const statusIndicator = document.querySelector('.status-indicator');

const updateStatus = (state, text) => {
  statusIndicator.className = `status-indicator ${state}`;
  statusConsole.textContent = `SYSTEM: ${text.toUpperCase()}`;
};

const notify = (message, type = 'info') => {
  let notification = document.getElementById('cyber-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'cyber-notification';
    document.documentElement.appendChild(notification);
  }
  notification.textContent = message.toUpperCase();
  notification.className = `notification-overlay show notification-${type}`;
  
  const stateClass = type === 'error' ? 'error' : (type === 'success' ? 'success' : 'online');
  updateStatus(stateClass, message.toUpperCase());

  setTimeout(() => notification.classList.remove('show'), 3000);
};

// Password toggle
document.getElementById('togglePassword').addEventListener('click', () => {
  const isHidden = newPasswordInput.type === 'password';
  newPasswordInput.type = isHidden ? 'text' : 'password';
  document.getElementById('toggleIcon').className = isHidden ? 'ph-bold ph-eye-slash' : 'ph-bold ph-eye';
});

resetForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const password = newPasswordInput.value;
  const confirm = confirmPasswordInput.value;
  let hasError = false;

  // Reset UI
  passwordError.classList.remove('visible');
  confirmError.classList.remove('visible');
  newPasswordInput.parentElement.parentElement.classList.remove('has-error');
  confirmPasswordInput.parentElement.parentElement.classList.remove('has-error');

  if (password.length < 6 || !/\d/.test(password)) {
    newPasswordInput.parentElement.parentElement.classList.add('has-error');
    passwordError.textContent = 'Min 6 chars with at least one digit.';
    passwordError.classList.add('visible');
    hasError = true;
  }

  if (password !== confirm) {
    confirmPasswordInput.parentElement.parentElement.classList.add('has-error');
    confirmError.textContent = 'Passwords do not match.';
    confirmError.classList.add('visible');
    hasError = true;
  }

  if (hasError) return;

  resetBtn.classList.add('loading');
  resetBtn.disabled = true;
  updateStatus('processing', 'Updating sequence...');

  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;

    updateStatus('success', 'Password updated');
    notify('Password secured. Redirecting...', 'success');

    setTimeout(() => {
      window.location.replace('/');
    }, 2500);

  } catch (err) {
    updateStatus('error', 'Update failed');
    resetBtn.classList.remove('loading');
    resetBtn.disabled = false;
    
    const safeMessage = mapResetError(err);
    notify(safeMessage, 'error');
  }
});

// Clock update
const updateClock = () => {
  const el = document.getElementById('systemTime');
  if (!el) return;
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  el.textContent = `TIME: ${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};
setInterval(updateClock, 1000); updateClock();