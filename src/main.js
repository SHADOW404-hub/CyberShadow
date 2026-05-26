/* ==========================================================================
   CYBERSHADOW INTERACTION CONTROLLER
   ========================================================================== */

import './style.css';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');

const togglePasswordBtn = document.getElementById('togglePassword');
const toggleIcon = document.getElementById('toggleIcon');

const submitBtn = document.getElementById('submitBtn');
const statusConsole = document.getElementById('statusConsole');
const statusIndicator = document.querySelector('.status-indicator');
const terminalLog = document.getElementById('terminalLog');
const systemTime = document.getElementById('systemTime');
const glassCard = document.querySelector('.glass-card');

// 1. Password Visibility Toggle
if (togglePasswordBtn && passwordInput && toggleIcon) {
  togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle Phosphor Icon class
    if (type === 'text') {
      toggleIcon.className = 'ph-bold ph-eye-slash';
      addLogLine('Password visibility: Shown');
    } else {
      toggleIcon.className = 'ph-bold ph-eye';
      addLogLine('Password visibility: Hidden');
    }
  });
}

// Helper to add lines in terminal console
function addLogLine(text, type = '') {
  if (!terminalLog) return;
  const line = document.createElement('div');
  line.className = `log-line ${type}`;
  line.textContent = `> ${text}`;
  terminalLog.appendChild(line);
  // Scroll to bottom
  terminalLog.scrollTop = terminalLog.scrollHeight;
}

// 2. Real-time Clock Update
function updateClock() {
  if (!systemTime) return;
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  systemTime.textContent = `TIME: ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock(); // Initial run

// 3. 3D Parallax Mouse Tilt Effect on Glass Card (Premium UX)
if (glassCard) {
  const handleMouseMove = (e) => {
    const rect = glassCard.getBoundingClientRect();
    
    // Calculate mouse position relative to card center (-1 to 1)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Max tilt angle (degrees)
    const maxTilt = 8;
    
    const tiltX = -y * maxTilt;
    const tiltY = x * maxTilt;
    
    glassCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    
    // Dynamic glare/gradient movement on hover
    const angle = Math.atan2(e.clientY - (rect.top + rect.height/2), e.clientX - (rect.left + rect.width/2)) * 180 / Math.PI;
    glassCard.style.setProperty('--glow-angle', `${angle}deg`);
  };

  const handleMouseLeave = () => {
    // Smoothly snap back to origin
    glassCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    glassCard.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
  };

  const handleMouseEnter = () => {
    // Remove transitions during active tracking for responsiveness
    glassCard.style.transition = 'none';
  };

  glassCard.addEventListener('mousemove', handleMouseMove);
  glassCard.addEventListener('mouseleave', handleMouseLeave);
  glassCard.addEventListener('mouseenter', handleMouseEnter);
}

// 4. Form Validation & Submission Handling
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear previous error states
    resetErrors();

    const usernameValue = usernameInput.value.trim();
    const passwordValue = passwordInput.value;
    let hasError = false;

    // Basic client validation checks
    if (usernameValue.length < 3) {
      showError(usernameInput, usernameError, 'Username must be at least 3 characters.');
      addLogLine('Error: Username is too short', 'error');
      hasError = true;
    }

    if (passwordValue.length < 6) {
      showError(passwordInput, passwordError, 'Password must be at least 6 characters.');
      addLogLine('Error: Password is too short', 'error');
      hasError = true;
    }

    if (hasError) {
      triggerShakeEffect();
      updateStatus('error', 'Login error');
      return;
    }

    // If no validation errors, proceed with mock auth handshake
    performDecryptionSequence(usernameValue, passwordValue);
  });
}

function showError(inputEl, errorEl, message) {
  inputEl.parentElement.parentElement.classList.add('has-error');
  errorEl.textContent = message;
  errorEl.classList.add('visible');
}

function resetErrors() {
  const inputGroups = document.querySelectorAll('.input-group');
  inputGroups.forEach(group => group.classList.remove('has-error'));
  
  [usernameError, passwordError].forEach(errEl => {
    if (errEl) {
      errEl.textContent = '';
      errEl.classList.remove('visible');
    }
  });
}

function triggerShakeEffect() {
  if (!glassCard) return;
  glassCard.classList.add('shake-effect');
  
  // Remove class after animation finishes (400ms)
  setTimeout(() => {
    glassCard.classList.remove('shake-effect');
  }, 400);
}

function updateStatus(stateClass, text) {
  if (!statusIndicator || !statusConsole) return;
  
  // Reset status classes
  statusIndicator.className = 'status-indicator';
  statusIndicator.classList.add(stateClass);
  statusConsole.textContent = `SYSTEM: ${text}`;
}

// 5. Decryption / Handshake Sequence Animation
function performDecryptionSequence(username, password) {
  // Enable loading states
  submitBtn.classList.add('loading');
  updateStatus('processing', 'Verifying credentials...');
  
  addLogLine(`Logging in user: ${username.toUpperCase()}`, 'system');
  
  // Sequence of mock operations
  const steps = [
    { delay: 400, log: 'Checking credentials...', type: 'system' },
    { delay: 900, log: 'Connecting to database...', type: 'system' },
    { delay: 1400, log: 'Loading dashboard settings...', type: 'system' },
    { delay: 2000, log: 'Login successful!', type: 'success' }
  ];

  steps.forEach(step => {
    setTimeout(() => {
      addLogLine(step.log, step.type);
    }, step.delay);
  });

  // Complete the process
  setTimeout(() => {
    if (password === 'admin1234') {
      // Mock error case for demo
      submitBtn.classList.remove('loading');
      updateStatus('error', 'Login failed');
      addLogLine('Error: Invalid password entered', 'error');
      showError(passwordInput, passwordError, 'Incorrect password.');
      triggerShakeEffect();
    } else {
      // Success case
      submitBtn.classList.remove('loading');
      updateStatus('success', 'Welcome back!');
      addLogLine('Login success! Welcome.', 'success');
      
      // Show success animation overlay
      createAccessGrantedOverlay();
    }
  }, 2500);
}

// 6. Access Granted Success Visual Overlay
function createAccessGrantedOverlay() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(8, 9, 12, 0.95)';
  overlay.style.zIndex = '1000';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.6s ease';
  
  const glowRing = document.createElement('div');
  glowRing.style.width = '120px';
  glowRing.style.height = '120px';
  glowRing.style.borderRadius = '50%';
  glowRing.style.border = '4px solid #00f0ff';
  glowRing.style.boxShadow = '0 0 30px #00f0ff, inset 0 0 30px #00f0ff';
  glowRing.style.display = 'flex';
  glowRing.style.alignItems = 'center';
  glowRing.style.justifyContent = 'center';
  glowRing.style.fontSize = '48px';
  glowRing.style.color = '#00f0ff';
  glowRing.style.marginBottom = '24px';
  glowRing.innerHTML = '<i class="ph-bold ph-keyhole"></i>';
  
  // Sparkle pulse
  glowRing.animate([
    { transform: 'scale(0.9)', opacity: 0.8 },
    { transform: 'scale(1.1)', opacity: 1 },
    { transform: 'scale(0.9)', opacity: 0.8 }
  ], {
    duration: 1500,
    iterations: Infinity
  });

  const title = document.createElement('h2');
  title.style.fontFamily = "'Space Grotesk', sans-serif";
  title.style.fontSize = '24px';
  title.style.letterSpacing = '6px';
  title.style.color = '#ffffff';
  title.style.marginBottom = '8px';
  title.textContent = 'ACCESS GRANTED';
  
  const subtitle = document.createElement('p');
  subtitle.style.fontFamily = "'JetBrains Mono', monospace";
  subtitle.style.fontSize = '12px';
  subtitle.style.color = '#00f0ff';
  subtitle.style.letterSpacing = '2px';
  subtitle.textContent = 'Redirecting to your dashboard...';
  
  overlay.appendChild(glowRing);
  overlay.appendChild(title);
  overlay.appendChild(subtitle);
  document.body.appendChild(overlay);
  
  // Trigger fade in
  setTimeout(() => {
    overlay.style.opacity = '1';
  }, 50);

  // Mock redirect after 3 seconds
  setTimeout(() => {
    alert('Login Successful! Redirecting...');
    location.reload();
  }, 2800);
}
