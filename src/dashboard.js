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
const modalProfilePictureInput = document.getElementById('modalProfilePictureInput');
const changeProfilePictureBtn = document.getElementById('changeProfilePictureBtn');
const profilePicturePreview = document.getElementById('profilePicturePreview');
const saveProfileBtn = document.getElementById('saveProfile');
const logoutBtn = document.getElementById('logoutBtn');
const logoutConfirmModal = document.getElementById('logoutConfirmModal');
const cancelLogoutBtn = document.getElementById('cancelLogout');
const confirmLogoutBtn = document.getElementById('confirmLogout');

// session tekshirish
const { data: { session }, error: sessionError } = await supabase.auth.getSession()

if (sessionError || !session) {
    window.location.replace('/')
    return;
}

let { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username, email, avatar_url')
    .eq('id', session.user.id)
    .single()

if (profileError) console.error("Profile fetch error:", profileError);
let currentProfile = profile || { username: 'Agent', email: 'agent@cybershadow.com', avatar_url: null };

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
                       (modalProfilePictureInput && modalProfilePictureInput.files.length > 0);
    if (saveProfileBtn) saveProfileBtn.disabled = !hasChanges;
};

if (editProfileBtn && profileModal) {
    editProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modalUsernameInput.value = currentProfile.username || '';
        modalEmailInput.value = currentProfile.email || '';

        if (currentProfile.avatar_url) {
            profilePicturePreview.style.backgroundImage = `url('${currentProfile.avatar_url}')`;
            profilePicturePreview.textContent = '';
        } else {
            profilePicturePreview.style.backgroundImage = 'none';
            profilePicturePreview.textContent = (currentProfile.username || 'A').charAt(0).toUpperCase();
        }
        
        modalUsernameInput.readOnly = true;
        modalEmailInput.readOnly = true;
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
modalProfilePictureInput?.addEventListener('change', checkChanges);

// Save Changes tugmasi logikasi
if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', async () => {
        const newProfilePictureFile = modalProfilePictureInput.files[0];
        const newUsername = modalUsernameInput.value.trim();
        const newEmail = modalEmailInput.value.trim();

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
            input.readOnly = false; // Tahrirlashga ruxsat berish
            input.focus();
        }
    });
});

// Confirm Logout funksiyasi
confirmLogoutBtn?.addEventListener('click', async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
})