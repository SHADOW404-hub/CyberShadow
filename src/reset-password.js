import { supabase } from './supabase.js'
import './style.css';

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
    
    // Notification display
    let notification = document.getElementById('cyber-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'cyber-notification';
      document.body.appendChild(notification);
    }
    notification.textContent = 'PASSWORD SECURED. REDIRECTING...';
    notification.className = 'notification-overlay show notification-success';

    setTimeout(() => {
      window.location.replace('/');
    }, 2500);

  } catch (err) {
    updateStatus('error', 'Update failed');
    resetBtn.classList.remove('loading');
    resetBtn.disabled = false;
    
    let notification = document.getElementById('cyber-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'cyber-notification';
      document.body.appendChild(notification);
    }
    notification.textContent = err.message.toUpperCase();
    notification.className = 'notification-overlay show notification-error';
    setTimeout(() => notification.classList.remove('show'), 3000);
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