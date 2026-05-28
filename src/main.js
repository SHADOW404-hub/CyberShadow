/* ==========================================================================
   CYBERSHADOW INTERACTION CONTROLLER
   ========================================================================== */

import { supabase } from './supabase.js'
import { showSuccessOverlay } from './ui-utils.js'
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
const regUsername    = document.getElementById('regUsername');
const regEmail       = document.getElementById('regEmail');
const regPassword    = document.getElementById('regPassword');
const regConfirm     = document.getElementById('regConfirm');
const regUsernameError = document.getElementById('regUsernameError');
const regEmailError  = document.getElementById('regEmailError');
const regPasswordError = document.getElementById('regPasswordError');
const regConfirmError = document.getElementById('regConfirmError');
const toggleRegPassword = document.getElementById('toggleRegPassword');
const toggleRegIcon = document.getElementById('toggleRegIcon');
const registerBtn = document.getElementById('registerBtn');

// Shared
const statusConsole = document.getElementById('statusConsole');
const statusIndicator = document.querySelector('.status-indicator');
const systemTime = document.getElementById('systemTime');
const glassCard = document.querySelector('.glass-card');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const footerLogin = document.getElementById('footerLogin');
const footerRegister = document.getElementById('footerRegister');
const forgotPasswordLink = document.getElementById('forgotPassword');
// ─── Success Overlay ──────────────────────────────────────────────────────────
// showSuccessOverlay endi ui-utils.js dan kelmoqda.
// Mahalliy funksiya koddagi chalkashlikni kamaytirish uchun olib tashlandi.

function updateClock() {
  if (!systemTime) return;
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  systemTime.textContent = `TIME: ${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
setInterval(updateClock, 1000);
updateClock();

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
      registerForm.style.display = 'flex';
      setTimeout(() => {
        registerForm.classList.add('active');
        loginForm.classList.remove('hide');
        
        brandSubtitle.textContent = 'CREATE NEW ACCOUNT';
        footerLogin.style.display = 'none';
        footerRegister.style.display = '';
        updateStatus('online', 'READY — Registration mode');
      }, 10);
    }, 400);

    // Login xatoliklarini tozalash
    clearErrors([
      [usernameInput, usernameError],
      [passwordInput, passwordError]
    ]);
  });
}

// ─── Switch back to Login ─────────────────────────────────────────────────────
if (showLoginLink) {
  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();

    // Hide register form
    registerForm.classList.remove('active');

    setTimeout(() => {
      registerForm.style.display = 'none';
      loginForm.style.display = 'flex';
      
      setTimeout(() => {
        loginForm.style.opacity = '1';
        loginForm.style.transform = 'translateX(0)';
        
        brandSubtitle.textContent = 'SECURE LOGIN PORTAL';
        footerLogin.style.display = '';
        footerRegister.style.display = 'none';
        updateStatus('online', 'READY');
      }, 10);
    }, 400);

    // Clear register errors
    clearErrors([
      [regUsername, regUsernameError],
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

    const identifier = usernameInput.value.trim();
    const pass = passwordInput.value; 
    let hasError = false;

    if (identifier.length < 3) {
      showError(usernameInput, usernameError, 'Please enter a valid username or email.');
      hasError = true;
    }
    if (pass.length < 6) {
      showError(passwordInput, passwordError, 'Password must be at least 6 characters.');
      hasError = true;
    }
    if (hasError) {
      triggerShake();
      updateStatus('error', 'Login failed — check your details');
      return;
    }

    performLogin(identifier, pass);
  });
}

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const identifier = usernameInput.value.trim();

    if (!identifier) {
      showError(usernameInput, usernameError, 'Please enter your username or email first.');
      return;
    }

    updateStatus('processing', 'Sending reset link...');

    let email = identifier;

    if (!identifier.includes('@')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', identifier)
        .single();
      
      if (!profile) {
        updateStatus('error', 'User not found');
        alert('Username topilmadi');
        return;
      }
      email = profile.email;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      updateStatus('error', 'Reset failed');
    } else {
      updateStatus('success', 'Reset link sent');
      alert('Parolni tiklash havolasi yuborildi!');
    }
  });
}

async function performLogin(identifier, password) {

  submitBtn.classList.add('loading')

  updateStatus(
    'processing',
    'Verifying credentials...'
  )

  submitBtn.disabled = true;

  let email = identifier;

  if (!identifier.includes('@')) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('username', identifier)
      .single();

    if (profileError || !profile) {
      updateStatus('error', 'User not found');
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      alert('Username topilmadi');
      return;
    }
    email = profile.email;
  }

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password
    })

  submitBtn.classList.remove('loading')
  submitBtn.disabled = false;

  if (error) {

    updateStatus(
      'error',
      'Login failed'
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
    'Redirecting to dashboard...', true
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
      [regUsername, regUsernameError],
      [regEmail, regEmailError],
      [regPassword, regPasswordError],
      [regConfirm, regConfirmError]
    ]);

    const username = regUsername.value.trim();
    const password = regPassword.value;
    const confirm = regConfirm.value;
    let hasError = false;

    if (username.length < 3) {
      showError(regUsername, regUsernameError, 'Username must be at least 3 characters.');
      hasError = true;
    }

    if (password.length < 6) {
      showError(regPassword, regPasswordError, 'Password must be at least 6 characters.');
      hasError = true;
    }

    if (password !== confirm) {
      showError(regConfirm, regConfirmError, 'Passwords do not match.');
      hasError = true;
    }

    if (hasError) {
      triggerShake();
      updateStatus('error', 'Registration failed — fix the errors');
      return;
    }

    performRegister(username, email, password);
  });
}

async function performRegister(username, email, password) {

  registerBtn.classList.add('loading')

  updateStatus(
    'processing',
    'Creating your account...'
  )

  registerBtn.disabled = true;

  const { data, error } =
    await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username
        }
      }
    })

  registerBtn.classList.remove('loading')
  registerBtn.disabled = false;

  if (error) {
    updateStatus(
      'error',
      'Registration failed'
    )

    let errorMsg = error.message;
    if (error.status === 429) {
      errorMsg = "Too many requests. Please try again later or disable email confirmation in Supabase.";
    } else if (error.message.includes("Email signups are disabled")) {
      errorMsg = "Supabase-da 'Email signups' o'chirilgan! Authentication -> Providers -> Email bo'limidan 'Allow new users to sign up'ni yoqing.";
    }

    alert(errorMsg)
    return
  }

  // Agar ro'yxatdan o'tish muvaffaqiyatli bo'lsa, 'profiles' jadvaliga ma'lumot qo'shamiz
  if (data && data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { id: data.user.id, username: username, email: email }
      ]);

    if (profileError) {
      updateStatus('error', 'Profile creation failed');
      alert(`Foydalanuvchi yaratildi, lekin profil bazaga yozilmadi: ${profileError.message}. RLS qoidalarini tekshiring!`);
      return;
    }
  }

  updateStatus(
    'success',
    `Welcome, ${username}!`
  )

  showSuccessOverlay(
    'ACCOUNT CREATED',
    `Welcome, ${username}! You can now log in.`, false
  )
}
