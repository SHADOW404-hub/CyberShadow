import { supabase } from './supabase.js'
import './style.css';

// --- DOIMIY QIYMATLAR (CONSTANTS) ---
const CATEGORY_CONFIG = {
    'Code': { color: '#00ffff', pattern: 'M7 8l-4 4 4 4M17 8l4 4-4 4M13 4l-2 16' },
    'OSINT': { color: '#007bff', pattern: 'M11 11m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0M21 21l-4.35-4.35' },
    'Web': { color: '#00f0ff', pattern: 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z' },
    'Pwn': { color: '#ff007f', pattern: 'M4 17l6-5-6-5M12 18h8' },
    'Crypto': { color: '#9d4edd', pattern: 'M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5zM12 16m-1.2 0a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0 -2.4 0M12 17.2v1.8' },
    'Forensics': { color: '#00ff66', pattern: 'M2 12c0 5.5 4.5 10 10 10s10-4.5 10-10S17.5 2 12 2M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0' },
    'Reverse': { color: '#ffb703', pattern: 'M5 5h14v14H5zM12 9v6M9 12h6M8 5V3m4 2V3m4 2V3M8 21v-2m4 2v-2m4 2v-2M5 8H3m2 4H3m2 4H3m18-8h-2m2 4h-2m2 4h-2' },
    'Miscellaneous': { color: '#64748b', pattern: 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16ZM3.3 7l8.7 5 8.7-5M12 22V12' }
};

const DIFF_THEMES = {
    'Easy': '#00ff66',
    'Medium': '#ffb703',
    'Hard': '#ff3366',
    'Insane': '#9d4edd'
};

// --- YORDAMCHI FUNKSIYALAR ---
const escapeHTML = (str) => {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
};

const getPatternSVG = (cat) => {
    const config = CATEGORY_CONFIG[cat];
    if (!config) return null;
    return `url('data:image/svg+xml,%3Csvg viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22${encodeURIComponent(config.color)}%22 stroke-width=%220.5%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22${config.pattern}%22/%3E%3C/svg%3E')`;
};

const notify = (message, type = 'info') => {
    const statusBar = document.querySelector('.status-bar');
    if (statusBar) {
        const text = statusBar.querySelector('.status-text');
        if (text) text.textContent = `[ ${type.toUpperCase()} ] ${message}`;
        // Alert o'rniga vizual signal berish mumkin
    }
    console.log(`[${type}] ${message}`);
};

// DOM elementlarini keshlaymiz
const userEmailDisplay = document.getElementById('userEmail');
const headerProfileAvatar = document.getElementById('headerProfileAvatar');
const profileDisplay = document.querySelector('.profile-display');
const profileDropdown = document.querySelector('.profile-dropdown');
const editProfileBtn = document.getElementById('editProfileBtn');
const profileModal = document.getElementById('editProfileModal');
const cancelModal = document.getElementById('cancelModal');
const modalUsernameInput = document.getElementById('modalUsername');
const modalEmailInput = document.getElementById('modalEmail');
const modalCountrySelect = document.getElementById('modalCountry');
const modalProfilePictureInput = document.getElementById('modalProfilePictureInput');
const changeProfilePictureBtn = document.getElementById('changeProfilePictureBtn');
const removeProfilePictureBtn = document.getElementById('removeProfilePictureBtn');
const profilePicturePreview = document.getElementById('profilePicturePreview');
const saveProfileBtn = document.getElementById('saveProfile');
const logoutBtn = document.getElementById('logoutBtn');
const logoutConfirmModal = document.getElementById('logoutConfirmModal');
const cancelLogoutBtn = document.getElementById('cancelLogout');
const confirmLogoutBtn = document.getElementById('confirmLogout');
const adminTerminalLink = document.getElementById('adminTerminalLink');
const adminSidebar = document.getElementById('adminSidebar');
const adminUsersLink = document.getElementById('adminUsersLink');
const adminChallengesLink = document.getElementById('adminChallengesLink');
const mainContentArea = document.querySelector('.dashboard-main-content');

// Add Challenge Modal elementlari
const addChallengeModal = document.getElementById('addChallengeModal');
const cancelAddChallenge = document.getElementById('cancelAddChallenge');
const saveChallengeBtn = document.getElementById('saveChallengeBtn');
const challengeNameInput = document.getElementById('challengeName');
const challengePointsInput = document.getElementById('challengePoints');
const challengeCategoryInput = document.getElementById('challengeCategory');
const challengeDifficultyInput = document.getElementById('challengeDifficulty');
const challengeFlagInput = document.getElementById('challengeFlag');
const challengeLinkInput = document.getElementById('challengeLink');
const challengeFileInput = document.getElementById('challengeFileInput');
const challengeFileTrigger = document.getElementById('challengeFileTrigger');
const challengeFileName = document.getElementById('challengeFileName');
const challengeFileWrapper = document.getElementById('challengeFileWrapper');

// Challenge Preview elementlari
const previewName = document.getElementById('previewName');
const previewPoints = document.getElementById('previewPoints');
const previewCategory = document.getElementById('previewCategory');
const previewDifficulty = document.getElementById('previewDifficulty');
const previewCard = document.querySelector('.challenge-card-horizontal');
const previewPattern = document.getElementById('previewCardPattern');

// Previewni yangilash funksiyasi
const updateChallengePreview = () => {
    const name = challengeNameInput.value.trim() || 'CHALLENGE NAME';
    const points = challengePointsInput.value || '0';
    const cat = challengeCategoryInput.value;
    const diff = challengeDifficultyInput.value;

    if (previewName) previewName.textContent = name;
    if (previewPoints) previewPoints.textContent = points;
    if (previewCategory) previewCategory.textContent = cat || 'CATEGORY';
    if (previewDifficulty) previewDifficulty.textContent = diff || 'DIFFICULTY';

    const catConfig = CATEGORY_CONFIG[cat];
    const catColor = catConfig?.color;
    const activeColor = DIFF_THEMES[diff];

    if (previewPattern) {
        const pattern = getPatternSVG(cat);
        if (pattern) {
            previewPattern.style.backgroundImage = pattern;
            previewPattern.style.opacity = '0.12';
            previewPattern.style.backgroundRepeat = 'no-repeat';
            previewPattern.style.backgroundPosition = 'center';
            previewPattern.style.backgroundSize = '65%';
            previewPattern.style.animation = 'iconPulse 4s ease-in-out infinite';
        } else {
            previewPattern.style.opacity = '0';
            previewPattern.style.animation = 'none';
        }
    }

    if (previewCard) {
        // Background logic
        previewCard.style.background = catColor 
            ? `linear-gradient(135deg, ${catColor}1a, rgba(15, 18, 32, 0.98))`
            : 'linear-gradient(135deg, rgba(15, 18, 32, 0.95), rgba(8, 9, 12, 0.98))';

        // Accent logic based on Difficulty
        if (activeColor) {
            previewCard.style.borderColor = activeColor;
            previewCard.style.boxShadow = `0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 30px ${activeColor}33`;
            if (previewPoints) previewPoints.parentElement.style.color = activeColor;
            if (previewName) previewName.style.color = activeColor;
            if (previewCategory) previewCategory.style.color = activeColor;
            if (previewDifficulty) previewDifficulty.style.color = activeColor;
            // Faqat preview kartasi burchaklarini bo'yash
            previewCard?.querySelectorAll('.card-corner').forEach(c => c.style.borderColor = activeColor);
            
            if (diff === 'Insane') previewCard.classList.add('glitch-active');
            else previewCard.classList.remove('glitch-active');
        } else {
            // Reset state
            previewCard.style.borderColor = 'rgba(0, 240, 255, 0.3)';
            previewCard.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(0, 240, 255, 0.05)';
            if (previewPoints) previewPoints.parentElement.style.color = 'var(--neon-cyan)';
            if (previewName) previewName.style.color = 'var(--color-text-bright)';
            if (previewCategory) previewCategory.style.color = catColor || 'var(--neon-purple)';
            if (previewDifficulty) previewDifficulty.style.color = 'var(--color-text-muted)';
            // Burchaklarni standart rangga qaytarish
            previewCard?.querySelectorAll('.card-corner').forEach(c => c.style.borderColor = 'var(--neon-cyan)');
            previewCard.classList.remove('glitch-active');
        }
    }
};

// Challenge kartasi uchun stil va ma'lumotlarni generatsiya qilish yordamchisi
const getChallengeStyles = (cat, diff) => {
    return {
        color: CATEGORY_CONFIG[cat]?.color || '#64748b',
        accent: DIFF_THEMES[diff] || 'var(--neon-cyan)',
        pattern: getPatternSVG(cat)
    };
};

// Inputlarga listenerlar qo'shish
challengeNameInput?.addEventListener('input', updateChallengePreview);
challengePointsInput?.addEventListener('input', updateChallengePreview);
challengeCategoryInput?.addEventListener('change', updateChallengePreview);
challengeDifficultyInput?.addEventListener('change', updateChallengePreview);

// 195 ta davlat ro'yxati
const COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
    "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
    "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const populateCountries = () => {
    if (!modalCountrySelect) return;
    
    // Boshlang'ich "Not selected" variantini qo'shamiz
    const placeholder = document.createElement('option');
    placeholder.value = "";
    placeholder.textContent = "Select a country";
    placeholder.disabled = true; // Uni qayta tanlab bo'lmaydi
    placeholder.selected = true; // Boshida tanlangan bo'ladi
    placeholder.hidden = true;   // Ro'yxat ochilganda ko'rinmaydi
    modalCountrySelect.appendChild(placeholder);

    COUNTRIES.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        modalCountrySelect.appendChild(option);
    });
};
populateCountries();

// session tekshirish
let session = null;
try {
    const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !currentSession) {
        window.location.replace('/');
        return;
    }
    session = currentSession;
} catch (e) {
    window.location.replace('/');
    return;
}

let { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username, email, avatar_url, country, role')
    .eq('id', session.user.id)
    .single()

if (profileError) console.error("Profile fetch error:", profileError);
let currentProfile = profile || { username: 'Agent', email: 'agent@cybershadow.com', avatar_url: null, country: null };

const updateHeaderUI = () => {
    if (userEmailDisplay) {
        userEmailDisplay.textContent = currentProfile.username || 'Agent';
    }

    // Avatar uchun bosh harfni o'rnatish
    if (headerProfileAvatar) {
        if (currentProfile.avatar_url) {
            const img = document.createElement('img');
            img.src = currentProfile.avatar_url;
            img.alt = "Avatar";
            img.style.cssText = "width: 100%; height: 100%; border-radius: 50%; object-fit: cover;";
            headerProfileAvatar.innerHTML = '';
            headerProfileAvatar.appendChild(img);
        } else {
            headerProfileAvatar.innerHTML = '';
            headerProfileAvatar.textContent = (currentProfile.username || 'A').charAt(0).toUpperCase();
        }
    }

    // Admin Terminal linkini faqat useri uchun ko'rsatish
    if (adminTerminalLink) {
        adminTerminalLink.style.display = currentProfile.role === 'admin' ? 'inline-block' : 'none';
    }
};

updateHeaderUI();

// Tugmalarni holatiga qarab ko'rsatish funksiyasi
const updateAvatarButtons = () => {
    const hasImage = modalProfilePictureInput.files.length > 0 || !!currentProfile.avatar_url;
    if (hasImage) {
        changeProfilePictureBtn.style.display = 'none';
        removeProfilePictureBtn.style.display = 'inline-block';
    } else {
        changeProfilePictureBtn.style.display = 'inline-block';
        removeProfilePictureBtn.style.display = 'none';
    }
};

// Dropdown menyuni ochish/yopish logikasi
if (profileDisplay && profileDropdown) {
    profileDisplay.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        profileDropdown.classList.remove('show');
    });
}

// O'zgarishlarni tekshirish funksiyasi
const checkChanges = () => {
    const hasChanges = modalUsernameInput.value.trim() !== (currentProfile.username || '') || 
                       modalEmailInput.value.trim() !== (currentProfile.email || '') ||
                       modalCountrySelect.value !== (currentProfile.country || '') ||
                       (modalProfilePictureInput && modalProfilePictureInput.files.length > 0);
    if (saveProfileBtn) saveProfileBtn.disabled = !hasChanges;
};

if (editProfileBtn && profileModal) {
    editProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modalUsernameInput.value = currentProfile.username || '';
        modalEmailInput.value = currentProfile.email || '';
        modalCountrySelect.value = currentProfile.country || '';

        // Agar foydalanuvchida allaqachon tanlangan davlat bo'lsa, "Not selected"ni o'chiramiz
        if (currentProfile.country && modalCountrySelect.options.length > 0 && modalCountrySelect.options[0].value === "") {
            modalCountrySelect.options[0].remove();
        }

        if (currentProfile.avatar_url) {
            profilePicturePreview.style.backgroundImage = `url('${currentProfile.avatar_url}')`;
            profilePicturePreview.textContent = '';
        } else {
            profilePicturePreview.style.backgroundImage = 'none';
            profilePicturePreview.textContent = (currentProfile.username || 'A').charAt(0).toUpperCase();
        }
        
        modalUsernameInput.readOnly = true;
        modalEmailInput.readOnly = true;
        modalCountrySelect.disabled = true;
        modalProfilePictureInput.value = '';
        if (saveProfileBtn) saveProfileBtn.disabled = true;

        updateAvatarButtons();
        
        profileModal.classList.add('active');
    });

    cancelModal?.addEventListener('click', () => {
        profileModal.classList.remove('active');
    });
}

// Profil rasmini o'zgartirish tugmasi logikasi
if (changeProfilePictureBtn && modalProfilePictureInput) {
    changeProfilePictureBtn.addEventListener('click', () => {
        modalProfilePictureInput.click(); // Yashirin inputni bosish
    });

    modalProfilePictureInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                profilePicturePreview.style.backgroundImage = `url('${event.target.result}')`;
                profilePicturePreview.textContent = '';
            };
            reader.readAsDataURL(file);
            checkChanges();
            updateAvatarButtons();
        } else {
            if (currentProfile.avatar_url) {
                profilePicturePreview.style.backgroundImage = `url('${currentProfile.avatar_url}')`;
            } else {
                profilePicturePreview.style.backgroundImage = 'none';
                profilePicturePreview.textContent = (currentProfile.username || 'A').charAt(0).toUpperCase();
            }
            checkChanges();
            updateAvatarButtons();
        }
    });
}

// Profil rasmini o'chirish logikasi
removeProfilePictureBtn?.addEventListener('click', async () => {
    // 1. Agar foydalanuvchi endigina rasm tanlagan bo'lsa (hali saqlamagan)
    if (modalProfilePictureInput.files.length > 0) {
        modalProfilePictureInput.value = '';
        if (currentProfile.avatar_url) {
            profilePicturePreview.style.backgroundImage = `url('${currentProfile.avatar_url}')`;
            profilePicturePreview.textContent = '';
        } else {
            profilePicturePreview.style.backgroundImage = 'none';
            profilePicturePreview.textContent = (currentProfile.username || 'A').charAt(0).toUpperCase();
        }
        updateAvatarButtons();
        checkChanges();
        return;
    }

    // 2. Agar bazadagi mavjud rasmni o'chirmoqchi bo'lsa
    if (currentProfile.avatar_url) {
        if (!confirm("Profil rasmini o'chirishni xohlaysizmi?")) return;

        try {
            removeProfilePictureBtn.disabled = true;
            removeProfilePictureBtn.textContent = 'Removing...';

            // Supabase storage'dan fayl yo'lini aniqlash (avatars/USER_ID/FILENAME)
            const urlParts = currentProfile.avatar_url.split('/');
            const fileName = urlParts.pop();
            const userId = urlParts.pop();
            const filePath = `${userId}/${fileName}`;

            // Storage'dan o'chirish
            const { error: storageError } = await supabase.storage
                .from('avatars')
                .remove([filePath]);

            if (storageError) throw storageError;

            // Bazada avatar_url'ni null qilish
            const { data, error: dbError } = await supabase
                .from('profiles')
                .update({ avatar_url: null })
                .eq('id', session.user.id)
                .select();

            if (dbError) throw dbError;

            currentProfile = data[0];
            updateHeaderUI();
            profilePicturePreview.style.backgroundImage = 'none';
            profilePicturePreview.textContent = (currentProfile.username || 'A').charAt(0).toUpperCase();
            updateAvatarButtons();
            notify('Avatar removed successfully', 'success');
        } catch (err) {
            notify(err.message, 'error');
        } finally {
            removeProfilePictureBtn.disabled = false;
            removeProfilePictureBtn.textContent = 'REMOVE';
        }
    }
});

if (logoutBtn && logoutConfirmModal) {
    logoutBtn.addEventListener('click', () => {
        logoutConfirmModal.classList.add('active');
    });
    cancelLogoutBtn?.addEventListener('click', () => {
        logoutConfirmModal.classList.remove('active');
    });
}

// Admin Sidebar Panel logikasi
if (adminTerminalLink && adminSidebar) {
    adminTerminalLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Header menyusidagi barcha faol holatlarni o'chirish va Admin Terminalni belgilash
        document.querySelectorAll('.menu-link').forEach(l => l.classList.remove('active'));
        adminTerminalLink.classList.add('active');

        adminSidebar.classList.add('active');
        document.querySelector('.dashboard-wrapper').classList.add('admin-mode');

        // Admin Terminal ochilganda default holatda foydalanuvchilar ro'yxatini yuklash
        adminChallengesLink?.classList.remove('active');
        adminUsersLink?.classList.add('active');
        fetchAndDisplayUsers();
    });
}

// Foydalanuvchilarni yuklash va ko'rsatish funksiyasi
const fetchAndDisplayUsers = async () => {
    if (!mainContentArea) return;
    
    mainContentArea.innerHTML = `<div class="stat-value" style="font-size: 1.5rem;">ACCESSING DATABASE...</div>`;

    const { data: users, error } = await supabase
        .from('profiles')
        .select('username, email, avatar_url, country');

    if (error) {
        mainContentArea.innerHTML = `<div class="color-error">Error: ${error.message}</div>`;
        return;
    }

    let tableHTML = `
        <div class="admin-table-container">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>AVATAR</th>
                        <th>USERNAME</th>
                        <th>EMAIL</th>
                        <th>COUNTRY</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(u => `
                        <tr>
                            <td>
                                ${u.avatar_url ? `<img src="${escapeHTML(u.avatar_url)}" class="table-avatar">` : `<div class="profile-avatar" style="width:30px; height:30px; font-size:12px;">${escapeHTML((u.username || 'A').charAt(0).toUpperCase())}</div>`}
                            </td>
                            <td style="color: var(--neon-cyan)">${escapeHTML(u.username || 'N/A')} ${u.username === 'SHADOW' ? '⚡' : ''}</td>
                            <td>${escapeHTML(u.email)}</td>
                            <td>${escapeHTML(u.country || 'Unknown')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    mainContentArea.innerHTML = tableHTML;
};

// Challenges ko'rsatish funksiyasi
const fetchAndDisplayChallenges = async (isAdmin = false) => {
    if (!mainContentArea) return;
    
    mainContentArea.innerHTML = `<div class="stat-value" style="font-size: 1.5rem;">LOADING CHALLENGES...</div>`;

    const { data: challenges, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        mainContentArea.innerHTML = `<div class="color-error">Error: ${error.message}</div>`;
        return;
    }

    let html = isAdmin ? `
        <div class="admin-section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 45px; width: 100%; max-width: 1200px;">
            <div class="stat-value" style="font-size: 1.6rem; text-shadow: 0 0 15px var(--neon-cyan-glow);">CHALLENGES MANAGEMENT</div>
            <button class="btn-submit" id="openAddChallengeBtn" style="width: auto; padding: 12px 25px; margin: 0; font-size: 12px; border-radius: 6px;">
                <i class="ph-bold ph-plus"></i> ADD CHALLENGE
            </button>
        </div>` : '';

    html += `<div class="dashboard-grid">`;

    if (challenges.length === 0) {
        html += `<div style="grid-column: 1/-1; padding: 60px; text-align: center; color: var(--color-text-muted); font-family: var(--font-mono); letter-spacing: 2px;">[ NO CHALLENGES DEPLOYED ]</div>`;
    } else {
        challenges.forEach(ch => {
            const styles = getChallengeStyles(ch.category, ch.difficulty);
            const cardBg = `linear-gradient(135deg, ${styles.color}1a, rgba(15, 18, 32, 0.98))`;
            const glitchClass = ch.difficulty === 'Insane' ? 'glitch-active' : '';
            const solveCount = ch.solves_count || 0; // Agar bazada yechimlar soni bo'lsa
            
            html += `
                <div class="challenge-card-horizontal ${glitchClass}" style="background: ${cardBg}; border-color: ${styles.accent}; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 30px ${styles.accent}33;">
                    <div class="card-corner top-left" style="border-color: ${styles.accent}"></div>
                    <div class="card-corner top-right" style="border-color: ${styles.accent}"></div>
                    <div class="card-corner bottom-left" style="border-color: ${styles.accent}"></div>
                    <div class="card-corner bottom-right" style="border-color: ${styles.accent}"></div>
                    <div class="card-pattern-overlay" style="background-image: ${styles.pattern || 'none'}; animation: iconPulse 4s ease-in-out infinite;"></div>
                    <div class="preview-top-left">
                        <div class="preview-difficulty" style="color: ${styles.accent}">${ch.difficulty}</div>
                        <span class="preview-category" style="color: ${styles.accent}">${escapeHTML(ch.category)}</span>
                    </div>
                    <div class="preview-main-info">
                        <div class="preview-name" style="color: ${styles.accent}">${escapeHTML(ch.name)}</div>
                    </div>
                    <div class="preview-points-badge" style="color: ${styles.accent}; background: ${styles.accent}1a; border-color: ${styles.accent}33;">
                        <span>${parseInt(ch.points)}</span>
                        <small style="font-size: 0.6rem; margin-left: 4px; opacity: 0.8;">${escapeHTML('PTS')}</small>
                    </div>
                    ${isAdmin ? `
                    <div class="admin-card-overlay">
                        <div class="challenge-stats">
                            <i class="ph-bold ph-check-square"></i> <span>${solveCount} SOLVES</span>
                        </div>
                        <button class="btn-delete-challenge" data-id="${ch.id}" data-file="${ch.file_url}" title="Delete Challenge">
                            <i class="ph-bold ph-trash"></i> DELETE
                        </button>
                    </div>
                    ` : ''}
                </div>`;
        });
    }

    html += `</div>`;
    mainContentArea.innerHTML = html;

    document.getElementById('openAddChallengeBtn')?.addEventListener('click', () => {
        updateChallengePreview(); // Modal ochilganda previewni yangilab olamiz
        addChallengeModal.classList.add('active');
    });

    // O'chirish logikasi (Admin uchun)
    if (isAdmin) {
        mainContentArea.querySelectorAll('.btn-delete-challenge').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = btn.getAttribute('data-id');
                const fileUrl = btn.getAttribute('data-file');
                
                if (!confirm("Haqiqatdan ham ushbu challengeni butunlay o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.")) return;

                try {
                    btn.disabled = true;
                    btn.innerHTML = '<i class="ph-bold ph-spinner-gap"></i> DELETING...';

                    // 1. Faylni storagedan o'chirish (agar bo'lsa)
                    if (fileUrl && fileUrl !== 'null') {
                        const path = fileUrl.split('challenges/')[1];
                        if (path) {
                            await supabase.storage.from('challenges').remove([path]);
                        }
                    }

                    // 2. Bazadan o'chirish
                    const { error } = await supabase.from('challenges').delete().eq('id', id);
                    if (error) throw error;

                    notify("Challenge neutralized", "success");
                    fetchAndDisplayChallenges(true); // Ro'yxatni yangilash
                } catch (err) {
                    notify(err.message, "error");
                    btn.disabled = false;
                    btn.innerHTML = '<i class="ph-bold ph-trash"></i> DELETE';
                }
            });
        });
    }
};

cancelAddChallenge?.addEventListener('click', () => {
    addChallengeModal.classList.remove('active');
});

// Fayl tanlash logikasi
challengeFileTrigger?.addEventListener('click', () => {
    challengeFileInput.click();
});

challengeFileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        challengeFileName.textContent = file.name;
        challengeFileWrapper.classList.add('has-file');
    } else {
        challengeFileName.textContent = 'No file selected';
        challengeFileWrapper.classList.remove('has-file');
    }
});

saveChallengeBtn?.addEventListener('click', async () => {
    const name = challengeNameInput.value.trim();
    const points = parseInt(challengePointsInput.value);
    const category = challengeCategoryInput.value.trim();
    const difficulty = challengeDifficultyInput.value;
    const flag = challengeFlagInput.value.trim();
    const link = challengeLinkInput.value.trim();
    const file = challengeFileInput?.files[0];

    if (!name || !points || !category || !flag || !difficulty) {
        notify("All mandatory fields must be filled", "error");
        return;
    }

    saveChallengeBtn.disabled = true;
    saveChallengeBtn.textContent = "Deploying...";

    try {
        let file_url = null;

        if (file) {
            const fileExt = file.name.split('.').pop();
            const safeFileName = `${Date.now()}.${fileExt}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('challenges') // Supabase'da 'challenges' bucketi bo'lishi shart
                .upload(`${session.user.id}/${safeFileName}`, file);

            if (uploadError) throw uploadError;
            file_url = supabase.storage.from('challenges').getPublicUrl(uploadData.path).data.publicUrl;
        }

    const { error } = await supabase
        .from('challenges')
        .insert([{ 
            name, 
            points, 
            category, 
            difficulty,
            flag,
            link: link || null,
            file_url,
            created_by: session.user.id
        }]);

    saveChallengeBtn.disabled = false;
    saveChallengeBtn.textContent = "Deploy";

    if (error) {
        notify(error.message, "error");
    } else {
        notify("Challenge deployed to grid", "success");
        addChallengeModal.classList.remove('active');
        challengeNameInput.value = '';
        challengePointsInput.value = '';
        challengeCategoryInput.value = '';
        challengeDifficultyInput.value = '';
        challengeFlagInput.value = '';
        challengeLinkInput.value = '';
        challengeFileInput.value = '';
        challengeFileName.textContent = 'No file selected';
        challengeFileWrapper.classList.remove('has-file');

        updateChallengePreview(); // Previewni reset qilish
        fetchAndDisplayChallenges(true); // Ro'yxatni yangilash
    }
    } catch (err) {
        notify(err.message, "error");
        saveChallengeBtn.disabled = false;
        saveChallengeBtn.textContent = "Deploy";
    }
});

adminUsersLink?.addEventListener('click', (e) => {
    e.preventDefault();
    adminChallengesLink?.classList.remove('active');
    adminUsersLink.classList.add('active');
    fetchAndDisplayUsers();
});

document.querySelector('.menu-link[href="#"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.menu-link').forEach(l => l.classList.remove('active'));
    e.target.classList.add('active');
    
    // Sidebar va admin rejimini yopish
    adminSidebar?.classList.remove('active');
    document.querySelector('.dashboard-wrapper')?.classList.remove('admin-mode');
    
    fetchAndDisplayChallenges(false); // User ko'rinishi
});

// Headerdagi "Scoreboard" havolasi uchun listener
document.querySelectorAll('.menu-link').forEach(link => {
    if (link.textContent.trim() === 'Scoreboard') {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.menu-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Sidebar va admin rejimini yopish
            adminSidebar?.classList.remove('active');
            document.querySelector('.dashboard-wrapper')?.classList.remove('admin-mode');
            
            if (mainContentArea) {
                mainContentArea.innerHTML = `
                    <div class="stat-value" style="font-size: 1.5rem;">SCOREBOARD COMING SOON...</div>
                `;
            }
        });
    }
});

adminChallengesLink?.addEventListener('click', (e) => {
    e.preventDefault();
    adminUsersLink?.classList.remove('active');
    adminChallengesLink.classList.add('active');
    fetchAndDisplayChallenges(true);
});

// Inputlarga o'zgarishlarni kuzatish uchun listener qo'shish
modalUsernameInput?.addEventListener('input', checkChanges);
modalEmailInput?.addEventListener('input', checkChanges);
modalCountrySelect?.addEventListener('change', () => {
    // Davlat tanlanganda "Not selected" variantini o'chirib tashlash
    if (modalCountrySelect.value !== "" && modalCountrySelect.options.length > 0 && modalCountrySelect.options[0].value === "") {
        modalCountrySelect.options[0].remove();
    }
    checkChanges();
});
modalProfilePictureInput?.addEventListener('change', checkChanges);

// Save Changes tugmasi logikasi
if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', async () => {
        const newProfilePictureFile = modalProfilePictureInput.files[0];
        const newUsername = modalUsernameInput.value.trim();
        const newEmail = modalEmailInput.value.trim();
        const newCountry = modalCountrySelect.value;

        let changesMade = false;
        const updateData = {};
        let avatarUrlToUpdate = currentProfile.avatar_url;

        try {
            if (newProfilePictureFile) {
                // Fayl nomidagi maxsus belgi va joylarni chetlab o'tish uchun vaqt tamg'asidan foydalanamiz
                const fileExt = newProfilePictureFile.name.split('.').pop();
                const safeFileName = `${Date.now()}.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(`${session.user.id}/${safeFileName}`, newProfilePictureFile, {
                        cacheControl: '3600',
                        upsert: true
                    });
                
                if (uploadError) throw uploadError;

                avatarUrlToUpdate = supabase.storage.from('avatars').getPublicUrl(uploadData.path).data.publicUrl;
                updateData.avatar_url = avatarUrlToUpdate;
                changesMade = true;
            }

            if (newUsername !== currentProfile.username) {
                updateData.username = newUsername;
                changesMade = true;
            }
            if (newEmail !== currentProfile.email) {
                updateData.email = newEmail;
                changesMade = true;
            }
            if (newCountry !== (currentProfile.country || '')) {
                updateData.country = newCountry;
                changesMade = true;
            }

            if (!changesMade) {
                profileModal.classList.remove('active');
                return;
            }

            // Tugmani vaqtincha bloklash
            saveProfileBtn.disabled = true;
            saveProfileBtn.textContent = 'Saving...';

            const { data, error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', session.user.id)
                .select(); // Yangilangan qatorni qaytarib olish

            saveProfileBtn.disabled = false;
            saveProfileBtn.textContent = 'Save Changes';

            if (error) throw error;
            
            if (!data || data.length === 0) {
                notify('Update failed. Check RLS policies.', 'error');
                return;
            }

            currentProfile = data[0];
            updateHeaderUI(); // Headerdagi ma'lumotlarni yangilash funksiyasini chaqiramiz
            profileModal.classList.remove('active');
            notify('Profile synced successfully', 'success');
        } catch (err) {
            notify(err.message, 'error');
            saveProfileBtn.disabled = false;
            saveProfileBtn.textContent = 'Save Changes';
        }
    });
}

// Inline CHANGE tugmalari uchun logika
document.querySelectorAll('.btn-inline-change').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        if (!targetId) return; // Rasm uchun bo'lgan tugmani chetlab o'tish
        const input = document.getElementById(targetId);
        if (input) {
            input.readOnly = false;
            input.disabled = false; // Select uchun
            input.focus();
        }
    });
});

// Confirm Logout funksiyasi
confirmLogoutBtn?.addEventListener('click', async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
})