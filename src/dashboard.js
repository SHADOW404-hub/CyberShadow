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
    COUNTRIES.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        modalCountrySelect.appendChild(option);
    });
};
populateCountries();

// session tekshirish
const { data: { session }, error: sessionError } = await supabase.auth.getSession()

if (sessionError || !session) {
    window.location.replace('/')
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
            headerProfileAvatar.innerHTML = `<img src="${currentProfile.avatar_url}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        } else {
            headerProfileAvatar.innerHTML = '';
            headerProfileAvatar.textContent = (currentProfile.username || 'A').charAt(0).toUpperCase();
        }
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
// Inputlarga o'zgarishlarni kuzatish uchun listener qo'shish
document.getElementById('modalUsername')?.addEventListener('input', checkChanges);
document.getElementById('modalEmail')?.addEventListener('input', checkChanges);
modalCountrySelect?.addEventListener('change', checkChanges);
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