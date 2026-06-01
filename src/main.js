/* ==========================================================================
   CYBERSHADOW INTERACTION CONTROLLER
   ========================================================================== */

import { supabase } from './supabase.js'
import './style.css';

// ─── Auth Session Check ───────────────────────────────────────────────────────
const { data: { session: activeSession } } = await supabase.auth.getSession();
if (activeSession) {
  window.location.replace('/dashboard.html');
}

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
const terminalLog = document.getElementById('terminalLog');
const systemTime = document.getElementById('systemTime');
const glassCard = document.querySelector('.glass-card');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const footerLogin = document.getElementById('footerLogin');
const footerRegister = document.getElementById('footerRegister');
const forgotPasswordLink = document.getElementById('forgotPassword');

// ─── Security Helpers ─────────────────────────────────────────────────────────
const escapeHTML = (str) => {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
};

const mapAuthError = (error) => {
  if (!error) return 'An unknown error occurred.';
  const msg = error.message.toLowerCase();

  if (msg.includes('invalid login credentials')) return 'Access Denied: Invalid identification.';
  if (msg.includes('email not confirmed')) return 'Security: Identity verification required via email.';
  if (msg.includes('user already registered')) return 'Registry Error: Identity already exists.';
  if (msg.includes('rate limit')) return 'System: Too many attempts. Connection throttled.';
  if (msg.includes('database') || msg.includes('server')) return 'System: Internal link failure.';
  
  return 'System Error: Authentication sequence failed.';
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validatePassword = (password) => {
  // Kamida 6 ta belgi va kamida bitta raqam
  return password.length >= 6 && /\d/.test(password);
};

// ─── Notification System ──────────────────────────────────────────────────────
const notify = (message, type = 'info') => {
  const stateClass = type === 'error' ? 'error' : (type === 'success' ? 'success' : 'online');
  updateStatus(stateClass, message.toUpperCase());
  addLogLine(message, type);

  let notification = document.getElementById('cyber-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'cyber-notification';
    document.body.appendChild(notification);
  }
  notification.textContent = message.toUpperCase();
  notification.className = `notification-overlay show notification-${type}`;
  setTimeout(() => notification.classList.remove('show'), 3000);
};

// ─── Success Overlay ──────────────────────────────────────────────────────────
function showSuccessOverlay(title, subtitle, isLogin = false) {
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
  
  if (!isLogin) {
    setTimeout(() => location.reload(), 2800);
  }
}
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
    } else if (identifier.includes('@') && !validateEmail(identifier)) {
      showError(usernameInput, usernameError, 'Email format is invalid.');
      hasError = true;
    }

    if (!validatePassword(pass)) {
      showError(passwordInput, passwordError, 'Password verification failed.');
      hasError = true;
      notify('Security policy: Min 6 chars with at least one digit', 'error');
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

    addLogLine(`Initiating password reset for: ${identifier}`, 'system');
    updateStatus('processing', 'Sending reset link...');

    let email = identifier;

    if (!identifier.includes('@')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', identifier)
        .single();
      
      if (!profile) {
        // Generic message to prevent account enumeration
        notify('If user exists, a link will be sent', 'info');
        return;
      }
      email = profile.email;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      updateStatus('error', 'Reset failed');
    } else {
      updateStatus('success', 'Sequence complete');
      notify('Recovery link transmitted to your terminal', 'success');
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
      notify('Access denied: User not found', 'error');
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

    const safeMessage = mapAuthError(error);
    addLogLine(safeMessage, 'error');
    notify(safeMessage, 'error');

    return
  }

  // ─── Self-Healing Profile Check (Muammo #2 yechimi) ────────────────────────
  // Agar foydalanuvchi authdan o'tgan bo'lsa-yu, profiles jadvalida qator bo'lmasa,
  // uni metadata asosida avtomatik tiklaymiz.
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!existingProfile && data.user) {
    const recoveryUsername = data.user.user_metadata?.username || 'Agent';
    await supabase.from('profiles').insert([
      { id: data.user.id, username: recoveryUsername, email: data.user.email }
    ]);
    addLogLine('System: Profile sync restored from metadata', 'system');
  }

  updateStatus(
    'success',
    `Welcome back, ${escapeHTML(identifier)}!`
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
    const email = regEmail.value.trim();
    const password = regPassword.value;
    const confirm = regConfirm.value;
    let hasError = false;

    if (username.length < 3) {
      showError(regUsername, regUsernameError, 'Username must be at least 3 characters.');
      hasError = true;
    }

    if (!validateEmail(email)) {
      showError(regEmail, regEmailError, 'Please enter a valid email address.');
      hasError = true;
    }

    if (!validatePassword(password)) {
      showError(regPassword, regPasswordError, 'Use at least 6 chars and one number.');
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
  updateStatus('processing', 'Checking username availability...')
  registerBtn.disabled = true;

  try {
    // 1. Check if username is already taken
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existingUser) {
      throw new Error('This username is already taken. Please choose another.');
    }

    updateStatus('processing', 'Establishing secure link...');

    // 2. Perform Supabase Auth SignUp
    const { data, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: { data: { username: username } }
    });

    if (authError) {
      if (authError.status === 429) throw new Error("Too many requests. Please try again later.");
      throw authError;
    }

    // 3. Create profile entry if user was created
    if (data && data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, username: username, email: email }]);

      if (profileError) {
        console.error("Critical: Auth succeeded but profile failed:", profileError);
        throw new Error('Identity secured, but profile sync failed. Please log in with your email to repair.');
      }
    }

    updateStatus('success', `Welcome, ${escapeHTML(username)}!`);
    showSuccessOverlay('ACCOUNT CREATED', `Identity verified. You can now log in.`, false);

  } catch (err) {
    const safeMessage = mapAuthError(err);
    updateStatus('error', 'Registration aborted');
    notify(safeMessage, 'error');
  } finally {
    registerBtn.classList.remove('loading')
    registerBtn.disabled = false;
  }
}
