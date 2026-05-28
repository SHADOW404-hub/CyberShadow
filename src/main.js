/* ==========================================================================
   CYBERSHADOW INTERACTION CONTROLLER
   ========================================================================== */

import { supabase } from './supabase.js'
import './style.css';

// ─── DOM Elements ─────────────────────────────────────────────────────────────
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const brandSubtitle = document.querySelector('.brand-subtitle');

// Login fields
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const togglePassword = document.getElementById('togglePassword');
const toggleIcon = document.getElementById('toggleIcon');
const submitBtn = document.getElementById('submitBtn');

// Register fields
const regName = document.getElementById('regName');
const regEmail = document.getElementById('regEmail');
const regPassword = document.getElementById('regPassword');
const regConfirm = document.getElementById('regConfirm');
const regNameError = document.getElementById('regNameError');
const regEmailError = document.getElementById('regEmailError');
const regPasswordError = document.getElementById('regPasswordError');
const regConfirmError = document.getElementById('regConfirmError');
const toggleRegPassword = document.getElementById('toggleRegPassword');
const toggleRegIcon = document.getElementById('toggleRegIcon');
const registerBtn = document.getElementById('registerBtn');

// Shared
const statusConsole = document.getElementById('statusConsole');
const statusIndicator = document.querySelector('.status-indicator');
const terminalLog = document.getElementById('terminalLog');
const systemTime = document.getElementById('systemTime');
const glassCard = document.querySelector('.glass-card');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const footerLogin = document.getElementById('footerLogin');
const footerRegister = document.getElementById('footerRegister');

// ─── Real-time Clock ──────────────────────────────────────────────────────────
function updateClock() {
  if (!systemTime) return;
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  systemTime.textContent = `TIME: ${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
setInterval(updateClock, 1000);
updateClock();

// ─── Terminal Log Helper ──────────────────────────────────────────────────────
function addLogLine(text, type = '') {
  if (!terminalLog) return;
  const line = document.createElement('div');
  line.className = `log-line ${type}`;
  line.textContent = `> ${text}`;
  terminalLog.appendChild(line);
  terminalLog.scrollTop = terminalLog.scrollHeight;
}

// ─── Status Bar Update ───────────────────────────────────────────────────────
function updateStatus(stateClass, text) {
  if (!statusIndicator || !statusConsole) return;
  statusIndicator.className = `status-indicator ${stateClass}`;
  statusConsole.textContent = `SYSTEM: ${text}`;
}

// ─── Error Helpers ────────────────────────────────────────────────────────────
function showError(inputEl, errorEl, message) {
  inputEl.parentElement.parentElement.classList.add('has-error');
  errorEl.textContent = message;
  errorEl.classList.add('visible');
}

function clearErrors(pairs) {
  pairs.forEach(([input, err]) => {
    input.parentElement.parentElement.classList.remove('has-error');
    err.textContent = '';
    err.classList.remove('visible');
  });
}

function triggerShake() {
  glassCard.classList.add('shake-effect');
  setTimeout(() => glassCard.classList.remove('shake-effect'), 400);
}

// ─── 3D Parallax Tilt ────────────────────────────────────────────────────────
if (glassCard) {
  glassCard.addEventListener('mousemove', (e) => {
    const rect = glassCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    glassCard.style.transition = 'none';
    glassCard.style.transform = `perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  });
  glassCard.addEventListener('mouseleave', () => {
    glassCard.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    glassCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
}

// ─── Password Toggle (Login) ──────────────────────────────────────────────────
if (togglePassword) {
  togglePassword.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    toggleIcon.className = isHidden ? 'ph-bold ph-eye-slash' : 'ph-bold ph-eye';
    addLogLine(isHidden ? 'Password visibility: Shown' : 'Password visibility: Hidden');
  });
}

// ─── Password Toggle (Register) ──────────────────────────────────────────────
if (toggleRegPassword) {
  toggleRegPassword.addEventListener('click', () => {
    const isHidden = regPassword.type === 'password';
    regPassword.type = isHidden ? 'text' : 'password';
    toggleRegIcon.className = isHidden ? 'ph-bold ph-eye-slash' : 'ph-bold ph-eye';
  });
}

// ─── Switch to Register ───────────────────────────────────────────────────────
if (showRegisterLink) {
  showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();

    // Hide login form
    loginForm.classList.add('hide');
    setTimeout(() => {
      loginForm.style.display = 'none';
      loginForm.classList.remove('hide');

      // Show register form
      registerForm.classList.add('active');

      // Update UI
      brandSubtitle.textContent = 'CREATE NEW ACCOUNT';
      footerLogin.style.display = 'none';
      footerRegister.style.display = '';
      updateStatus('online', 'READY — Registration mode');
      addLogLine('Switched to registration mode', 'system');
    }, 250);
  });
}

// ─── Switch back to Login ─────────────────────────────────────────────────────
if (showLoginLink) {
  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();

    // Hide register form
    registerForm.classList.remove('active');
    registerForm.style.display = 'none';

    // Show login form
    loginForm.style.display = '';
    loginForm.style.opacity = '0';
    loginForm.style.transform = 'translateY(12px)';
    setTimeout(() => {
      loginForm.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      loginForm.style.opacity = '1';
      loginForm.style.transform = 'translateY(0)';
    }, 20);

    // Update UI
    brandSubtitle.textContent = 'SECURE LOGIN PORTAL';
    footerLogin.style.display = '';
    footerRegister.style.display = 'none';
    updateStatus('online', 'READY');
    addLogLine('Switched to login mode', 'system');

    // Clear register errors
    clearErrors([
      [regName, regNameError],
      [regEmail, regEmailError],
      [regPassword, regPasswordError],
      [regConfirm, regConfirmError]
    ]);
  });
}

// ─── LOGIN Form Submit ────────────────────────────────────────────────────────
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors([
      [usernameInput, usernameError],
      [passwordInput, passwordError]
    ]);

    const user = usernameInput.value.trim();
    const pass = passwordInput.value;
    let hasError = false;

    if (user.length < 3) {
      showError(usernameInput, usernameError, 'Username must be at least 3 characters.');
      addLogLine('Error: Username is too short', 'error');
      hasError = true;
    }
    if (pass.length < 6) {
      showError(passwordInput, passwordError, 'Password must be at least 6 characters.');
      addLogLine('Error: Password is too short', 'error');
      hasError = true;
    }
    if (hasError) {
      triggerShake();
      updateStatus('error', 'Login failed — check your details');
      return;
    }

    performLogin(user, pass);
  });
}

async function performLogin(email, password) {

  submitBtn.classList.add('loading')

  updateStatus(
    'processing',
    'Verifying credentials...'
  )

  addLogLine(
    `Logging in: ${email}`,
    'system'
  )

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password
    })

  submitBtn.classList.remove('loading')

  if (error) {

    updateStatus(
      'error',
      'Login failed'
    )

    addLogLine(
      error.message,
      'error'
    )

    alert(error.message)

    return
  }

  updateStatus(
    'success',
    'Welcome back!'
  )

  showSuccessOverlay(
    'LOGIN SUCCESSFUL',
    'Redirecting to dashboard...'
  )

  setTimeout(() => {
    window.location.href = '/dashboard.html'
  }, 2000)
}

// ─── REGISTER Form Submit ─────────────────────────────────────────────────────
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors([
      [regName, regNameError],
      [regEmail, regEmailError],
      [regPassword, regPasswordError],
      [regConfirm, regConfirmError]
    ]);

    const name = regName.value.trim();
    const email = regEmail.value.trim();
    const pass = regPassword.value;
    const confirm = regConfirm.value;
    let hasError = false;

    if (name.length < 2) {
      showError(regName, regNameError, 'Please enter your full name.');
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError(regEmail, regEmailError, 'Please enter a valid email address.');
      hasError = true;
    }

    if (pass.length < 6) {
      showError(regPassword, regPasswordError, 'Password must be at least 6 characters.');
      hasError = true;
    }

    if (pass !== confirm) {
      showError(regConfirm, regConfirmError, 'Passwords do not match.');
      hasError = true;
    }

    if (hasError) {
      triggerShake();
      updateStatus('error', 'Registration failed — fix the errors');
      addLogLine('Error: Registration validation failed', 'error');
      return;
    }

    performRegister(name, email);
  });
}

async function performRegister(name, email, password) {

  registerBtn.classList.add('loading')

  updateStatus(
    'processing',
    'Creating your account...'
  )

  addLogLine(
    `Registering: ${email}`,
    'system'
  )

  const { data, error } =
    await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: name
        }
      }
    })

  registerBtn.classList.remove('loading')

  if (error) {

    updateStatus(
      'error',
      'Registration failed'
    )

    addLogLine(
      error.message,
      'error'
    )

    alert(error.message)

    return
  }

  updateStatus(
    'success',
    'Account created successfully'
  )

  showSuccessOverlay(
    'ACCOUNT CREATED',
    'You can now log in'
  )
}

// ─── Success Overlay ──────────────────────────────────────────────────────────
function showSuccessOverlay(title, subtitle) {
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(8,9,12,0.95)',
    zIndex: '1000', display: 'flex',
    flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', opacity: '0',
    transition: 'opacity 0.6s ease'
  });

  const ring = document.createElement('div');
  Object.assign(ring.style, {
    width: '120px', height: '120px',
    borderRadius: '50%', border: '4px solid #00f0ff',
    boxShadow: '0 0 30px #00f0ff, inset 0 0 30px #00f0ff',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '48px',
    color: '#00f0ff', marginBottom: '24px'
  });
  ring.innerHTML = '<i class="ph-bold ph-keyhole"></i>';
  ring.animate(
    [{ transform: 'scale(0.9)', opacity: 0.8 }, { transform: 'scale(1.1)', opacity: 1 }, { transform: 'scale(0.9)', opacity: 0.8 }],
    { duration: 1500, iterations: Infinity }
  );

  const h2 = document.createElement('h2');
  Object.assign(h2.style, {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '24px', letterSpacing: '6px',
    color: '#ffffff', marginBottom: '8px'
  });
  h2.textContent = title;

  const p = document.createElement('p');
  Object.assign(p.style, {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px', color: '#00f0ff', letterSpacing: '2px'
  });
  p.textContent = subtitle;

  overlay.append(ring, h2, p);
  document.body.appendChild(overlay);
  setTimeout(() => (overlay.style.opacity = '1'), 50);
  setTimeout(() => location.reload(), 2800);
}
