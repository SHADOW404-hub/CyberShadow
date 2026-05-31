import { supabase } from './supabase.js'
import './style.css';

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

// Challenge Preview elementlari
const previewName = document.getElementById('previewName');
const previewPoints = document.getElementById('previewPoints');
const previewCategory = document.getElementById('previewCategory');
const previewDifficulty = document.getElementById('previewDifficulty');
const previewCard = document.querySelector('.challenge-card-horizontal');
const previewPattern = document.getElementById('previewCardPattern');

// Previewni yangilash funksiyasi
const updateChallengePreview = () => {
    if (previewName) {
        previewName.textContent = challengeNameInput.value.trim() || 'CHALLENGE NAME';
    }
    if (previewPoints) previewPoints.textContent = challengePointsInput.value || '0';
    if (previewCategory) {
        const val = challengeCategoryInput.value;
        
        // Kategoriya uchun maxsus HUD naqshlari (SVG data-uris)
        const categoryPatterns = {
            'Code': `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='0' y='12' fill='%2300ff66' font-family='monospace' font-size='10' opacity='0.5'%3E101101%3C/text%3E%3Ctext x='15' y='30' fill='%2300ff66' font-family='monospace' font-size='10' opacity='0.5'%3E010110%3C/text%3E%3Ctext x='5' y='50' fill='%2300ff66' font-family='monospace' font-size='10' opacity='0.5'%3E110101%3C/text%3E%3Ctext x='25' y='70' fill='%2300ff66' font-family='monospace' font-size='10' opacity='0.5'%3E001011%3C/text%3E%3C/svg%3E")`,
            'OSINT': `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='0.5' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3C/svg%3E")`,
            'Web': `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='0.5' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='2' y1='12' x2='22' y2='12'/%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'/%3E%3C/svg%3E")`,
            'Pwn': `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='red' stroke-width='0.6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 17l6-5-6-5'/%3E%3Cpath d='M12 18h8'/%3E%3C/svg%3E")`,
            'Crypto': `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='gold' stroke-width='0.7' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4' stroke-linecap='round'/%3E%3Crect x='5' y='11' width='14' height='10' rx='2'/%3E%3Ccircle cx='12' cy='16' r='1.2' fill='gold'/%3E%3Cpath d='M12 17.2v1.8' stroke-linecap='round'/%3E%3C/svg%3E")`,
            'Forensics': `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='cyan' stroke-width='0.5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 12c0 5.5 4.5 10 10 10s10-4.5 10-10S17.5 2 12 2'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Cpath d='M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0' opacity='0.3'/%3E%3C/svg%3E")`,
            'Reverse': `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='orange' stroke-width='0.5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3C/svg%3E")`,
            'Miscellaneous': `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='0.5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z'/%3E%3Cpath d='m3.3 7 8.7 5 8.7-5'/%3E%3Cpath d='M12 22V12'/%3E%3C/svg%3E")`
        };

        if (previewPattern) {
            const pattern = categoryPatterns[val];
            if (pattern) {
                previewPattern.style.backgroundImage = pattern;
                const isTiled = val === 'Code';
                previewPattern.style.opacity = isTiled ? '0.15' : '0.12';
                previewPattern.style.backgroundRepeat = isTiled ? 'repeat' : 'no-repeat';
                previewPattern.style.backgroundPosition = isTiled ? '0 0' : 'center';
                previewPattern.style.backgroundSize = isTiled ? '100px 100px' : '65%';
                // Animatsiyani faqat tiled (takrorlanuvchi) naqshlar uchun yoqamiz
                previewPattern.style.animation = isTiled ? 'patternScroll 40s linear infinite' : 'none';
            } else {
                previewPattern.style.opacity = '0';
            }
        }

        previewCategory.textContent = val || 'CATEGORY';
        
        // Kategoriyaga qarab rangni o'zgartirish
        const categoryColors = {
            'Web': '#00f0ff',
            'Pwn': '#ff007f',
            'Crypto': '#9d4edd',
            'Forensics': '#00ff66',
            'Reverse': '#ffb703',
            'OSINT': '#007bff',
            'Miscellaneous': '#64748b',
            'Code': '#00ffff'
        };
        
        const activeColor = categoryColors[val];
        previewCategory.style.color = activeColor || 'var(--neon-purple)';

        if (previewCard) {
            if (activeColor) {
                // Juda shaffof rangdan boshlanib to'q kiber-fonga o'tadigan gradient
                previewCard.style.background = `linear-gradient(135deg, ${activeColor}1a, rgba(15, 18, 32, 0.98))`;
            } else {
                // Tanlanmagan holatdagi standart fon
                previewCard.style.background = 'linear-gradient(135deg, rgba(15, 18, 32, 0.95), rgba(8, 9, 12, 0.98))';
            }
        }
    }
    if (previewDifficulty) {
        const diff = challengeDifficultyInput.value;
        previewDifficulty.textContent = diff || 'DIFFICULTY';
        
        // Qiyinchilikka qarab mavzular (Mavzu ranglari)
        const diffThemes = {
            'Easy': '#00ff66',    // ochiq yashil
            'Medium': '#ffb703',  // olovrang
            'Hard': '#ff3366',    // qizil
            'Insane': '#9d4edd'   // binafsha
        };
        
        const activeColor = diffThemes[diff];
        previewDifficulty.style.color = activeColor || 'var(--color-text-muted)';

        if (previewCard) {
            if (activeColor) {
                // Butun kartaning chegarasi va ichki nuri (glow) o'zgaradi
                previewCard.style.borderColor = activeColor;
                previewCard.style.boxShadow = `0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 30px ${activeColor}33`;
                
                // Ballar nishonchasi (badge) ham moslashadi
                if (previewPoints) previewPoints.parentElement.style.color = activeColor;
                
                // Name va Category ham qiyinchilik rangiga kiradi
                if (previewName) previewName.style.color = activeColor;
                if (previewCategory) previewCategory.style.color = activeColor;

                // Burchaklar rangini yangilash
                document.querySelectorAll('.card-corner').forEach(c => c.style.borderColor = activeColor);
                
                // Insane uchun glitch qo'shish
                if (diff === 'Insane') previewCard.classList.add('glitch-active');
                else previewCard.classList.remove('glitch-active');
            } else {
                // Tanlanmagan holatda standart ranglar
                previewCard.style.borderColor = 'rgba(0, 240, 255, 0.3)';
                previewCard.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(0, 240, 255, 0.05)';
                if (previewPoints) previewPoints.parentElement.style.color = 'var(--neon-cyan)';
                previewCard.classList.remove('glitch-active');

                // Standart ranglarga qaytarish
                if (previewName) previewName.style.color = 'var(--color-text-bright)';
                document.querySelectorAll('.card-corner').forEach(c => c.style.borderColor = 'var(--neon-cyan)');
            }
        }
    }
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
    .select('username, email, avatar_url, country')
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

    // Admin Terminal linkini faqat "SHADOW" useri uchun ko'rsatish
    if (adminTerminalLink) {
        adminTerminalLink.style.display = currentProfile.username === 'SHADOW' ? 'inline-block' : 'none';
    }
};

updateHeaderUI();

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
        } else {
            if (currentProfile.avatar_url) {
                profilePicturePreview.style.backgroundImage = `url('${currentProfile.avatar_url}')`;
            } else {
                profilePicturePreview.style.backgroundImage = 'none';
                profilePicturePreview.textContent = (currentProfile.username || 'A').charAt(0).toUpperCase();
            }
            checkChanges();
        }
    });
}

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
        adminSidebar.classList.add('active');
        document.querySelector('.dashboard-wrapper').classList.add('admin-mode');
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
                                ${u.avatar_url ? `<img src="${u.avatar_url}" class="table-avatar">` : `<div class="profile-avatar" style="width:30px; height:30px; font-size:12px;">${(u.username || 'A').charAt(0)}</div>`}
                            </td>
                            <td style="color: var(--neon-cyan)">${u.username || 'N/A'} ${u.username === 'SHADOW' ? '⚡' : ''}</td>
                            <td>${u.email}</td>
                            <td>${u.country || 'Unknown'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    mainContentArea.innerHTML = tableHTML;
};

// Challenges ko'rsatish funksiyasi
const fetchAndDisplayChallenges = async () => {
    if (!mainContentArea) return;
    
    mainContentArea.innerHTML = `
        <div class="admin-section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; width: 100%; max-width: 1200px;">
            <div class="stat-value" style="font-size: 1.5rem;">CHALLENGES MANAGEMENT</div>
            <button class="btn-submit" id="openAddChallengeBtn" style="width: auto; padding: 10px 25px; margin-top: 0;">
                <i class="ph-bold ph-plus"></i> ADD CHALLENGE
            </button>
        </div>
        <div class="admin-table-container">
            <div style="padding: 40px; text-align: center; color: var(--color-text-muted);">
                <i class="ph-bold ph-database" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                No challenges deployed yet.
            </div>
        </div>
    `;

    document.getElementById('openAddChallengeBtn')?.addEventListener('click', () => {
        updateChallengePreview(); // Modal ochilganda previewni yangilab olamiz
        addChallengeModal.classList.add('active');
    });
};

cancelAddChallenge?.addEventListener('click', () => {
    addChallengeModal.classList.remove('active');
});

saveChallengeBtn?.addEventListener('click', async () => {
    const name = challengeNameInput.value.trim();
    const points = parseInt(challengePointsInput.value);
    const category = challengeCategoryInput.value.trim();
    const difficulty = challengeDifficultyInput.value;
    const flag = challengeFlagInput.value.trim();

    if (!name || !points || !category || !flag || !difficulty) {
        alert("Barcha maydonlarni to'ldiring!");
        return;
    }

    saveChallengeBtn.disabled = true;
    saveChallengeBtn.textContent = "Deploying...";

    const { error } = await supabase
        .from('challenges')
        .insert([{ 
            name, 
            points, 
            category, 
            difficulty,
            flag,
            created_by: session.user.id 
        }]);

    saveChallengeBtn.disabled = false;
    saveChallengeBtn.textContent = "Deploy";

    if (error) {
        alert("Xatolik: " + error.message);
    } else {
        alert("Challenge muvaffaqiyatli yuklandi!");
        addChallengeModal.classList.remove('active');
        challengeNameInput.value = '';
        challengePointsInput.value = '';
        challengeCategoryInput.value = '';
        challengeDifficultyInput.value = '';
        challengeFlagInput.value = '';
        updateChallengePreview(); // Previewni reset qilish
        fetchAndDisplayChallenges(); // Ro'yxatni yangilash
    }
});

adminUsersLink?.addEventListener('click', (e) => {
    e.preventDefault();
    adminChallengesLink?.classList.remove('active');
    adminUsersLink.classList.add('active');
    fetchAndDisplayUsers();
});

adminChallengesLink?.addEventListener('click', (e) => {
    e.preventDefault();
    adminUsersLink?.classList.remove('active');
    adminChallengesLink.classList.add('active');
    fetchAndDisplayChallenges();
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
                alert('Xatolik: Ma\'lumot saqlanmadi. Supabase RLS (Row Level Security) politsiyalarini tekshiring!');
                return;
            }

            currentProfile = data[0];
            updateHeaderUI(); // Headerdagi ma'lumotlarni yangilash funksiyasini chaqiramiz
            profileModal.classList.remove('active');

        } catch (err) {
            alert('Xatolik yuz berdi: ' + err.message);
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