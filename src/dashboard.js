import { supabase } from './supabase.js'
import './style.css';

// session tekshirish
const { data: { session }, error: sessionError } = await supabase.auth.getSession()

if (sessionError || !session) {
    window.location.replace('/') // replace ishlatish back tugmasi bosilganda login loopni oldini oladi
    return;
}

// Username chiqarish (email o'rniga)
let { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username, email, avatar_url') // avatar_url ni ham tanlab olamiz
    .eq('id', session.user.id)
    .single()

console.log("Fetched profile:", profile); // Debugging uchun: Supabase'dan kelgan profil ma'lumotlarini tekshiring

if (profileError) console.error("Profile fetch error:", profileError);
let currentProfile = profile || { username: 'Agent', email: 'agent@cybershadow.com', avatar_url: null }; // avatar_url ni ham qo'shamiz

if (document.getElementById('userEmail')) {
    document.getElementById('userEmail').textContent = currentProfile.username || 'Agent';

    // Avatar uchun bosh harfni o'rnatish
    const avatarEl = document.getElementById('headerProfileAvatar'); // ID orqali to'g'ri elementni tanlash
    if (avatarEl) {
        if (currentProfile.avatar_url) {
            avatarEl.innerHTML = `<img src="${currentProfile.avatar_url}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        } else if (currentProfile.username) {
            avatarEl.textContent = currentProfile.username.charAt(0).toUpperCase();
        }
    }
}

// Dropdown menyuni ochish/yopish logikasi
const profileDisplay = document.querySelector('.profile-display');
const profileDropdown = document.querySelector('.profile-dropdown');

if (profileDisplay && profileDropdown) {
    profileDisplay.addEventListener('click', (e) => {
        e.stopPropagation(); // Click hodisasi documentga o'tib ketmasligi uchun
        profileDropdown.classList.toggle('show');
    });

    // Tashqariga bosilganda dropdownni yopish
    document.addEventListener('click', () => {
        profileDropdown.classList.remove('show');
    });
}

// Modal logikasi
const editProfileBtn = document.getElementById('editProfileBtn');
const profileModal = document.getElementById('editProfileModal');
const cancelModal = document.getElementById('cancelModal');
const modalProfilePictureInput = document.getElementById('modalProfilePictureInput');
const changeProfilePictureBtn = document.getElementById('changeProfilePictureBtn');
const profilePicturePreview = document.getElementById('profilePicturePreview');
const headerProfileAvatar = document.getElementById('headerProfileAvatar');
const logoutConfirmModal = document.getElementById('logoutConfirmModal');
const cancelLogoutBtn = document.getElementById('cancelLogout');
const saveProfileBtn = document.getElementById('saveProfile'); // Save Changes tugmasi

// O'zgarishlarni tekshirish funksiyasi
const checkChanges = () => {
    const uInput = document.getElementById('modalUsername');
    const eInput = document.getElementById('modalEmail');
    const fileInput = document.getElementById('modalProfilePictureInput');
    const hasChanges = uInput.value.trim() !== (currentProfile.username || '') || 
                       eInput.value.trim() !== (currentProfile.email || '') ||
                       (fileInput && fileInput.files.length > 0);
    if (saveProfileBtn) saveProfileBtn.disabled = !hasChanges;
};

if (editProfileBtn && profileModal) {
    editProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Ma'lumotlarni modalga yozish
        const uInput = document.getElementById('modalUsername');
        const eInput = document.getElementById('modalEmail');
        
        uInput.value = currentProfile.username || '';
        eInput.value = currentProfile.email || '';

        // Profil rasmini modalda ko'rsatish
        if (currentProfile.avatar_url) {
            profilePicturePreview.style.backgroundImage = `url('${currentProfile.avatar_url}')`;
            profilePicturePreview.textContent = '';
        } else {
            profilePicturePreview.style.backgroundImage = 'none';
            profilePicturePreview.textContent = (currentProfile.username || 'A').charAt(0).toUpperCase();
        }
        
        // Modal ochilganda inputlarni yana qulflash
        uInput.readOnly = true;
        eInput.readOnly = true;
        modalProfilePictureInput.value = ''; // Oldingi tanlangan faylni tozalash
        // Tugmani boshlang'ich holatda bloklash
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
                    profilePicturePreview.textContent = ''; // Harfni olib tashlash
            };
            reader.readAsDataURL(file);
            checkChanges(); // O'zgarishlar borligini tekshirish
        } else {
            // Agar fayl tanlanmasa, avvalgi holatga qaytarish
            if (currentProfile.avatar_url) profilePicturePreview.style.backgroundImage = `url('${currentProfile.avatar_url}')`;
                else {
                    profilePicturePreview.style.backgroundImage = 'none';
                    profilePicturePreview.textContent = (currentProfile.username || 'A').charAt(0).toUpperCase();
                }
            checkChanges();
        }
    });
}

// Logout Confirmation Modal logikasi
const logoutBtn = document.getElementById('logoutBtn');
const confirmLogoutBtn = document.getElementById('confirmLogout');

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
        const uInput = document.getElementById('modalUsername');
        const eInput = document.getElementById('modalEmail');
        
        const newProfilePictureFile = modalProfilePictureInput.files[0];
        const newUsername = uInput.value.trim();
        const newEmail = eInput.value.trim();

        let changesMade = false;
        const updateData = {};
        let avatarUrlToUpdate = currentProfile.avatar_url;

        if (newProfilePictureFile) {
            // Rasmni Supabase Storage'ga yuklash
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars') // 'avatars' nomli bucket'ingiz bo'lishi kerak
                .upload(`${session.user.id}/${newProfilePictureFile.name}`, newProfilePictureFile, {
                    cacheControl: '3600',
                    upsert: true
                });
            if (uploadError) {
                alert('Profil rasmini yuklashda xatolik yuz berdi: ' + uploadError.message);
                return;
            }
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

        if (changesMade) {
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

            if (error) {
                alert('Profilni yangilashda xatolik yuz berdi: ' + error.message);
            } else if (!data || data.length === 0) {
                alert('Xatolik: Ma\'lumot saqlanmadi. Supabase RLS (Row Level Security) politsiyalarini tekshiring!');
            } else {
                currentProfile = data[0]; // Mahalliy holatni bazadan qaytgan ma'lumot bilan yangilash
                document.getElementById('userEmail').textContent = currentProfile.username; // Headerdagi usernameni yangilash
                
                // Avatar harfini yangilash
                const avatarEl = document.getElementById('headerProfileAvatar'); // Use the ID for the header avatar
                if (avatarEl) {
                    if (currentProfile.avatar_url) {
                        avatarEl.innerHTML = `<img src="${currentProfile.avatar_url}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                    } else {
                        avatarEl.textContent = currentProfile.username.charAt(0).toUpperCase();
                    }
                }
                profileModal.classList.remove('active'); // Modalni yopish
            }
        } else {
            profileModal.classList.remove('active'); // O'zgarish bo'lmasa ham modalni yopish
        }
    });
}

// Inline CHANGE tugmalari uchun logika
document.querySelectorAll('.btn-inline-change').forEach(btn => { //
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        input.readOnly = false; // Tahrirlashga ruxsat berish
        input.focus();
    });
});

// Confirm Logout funksiyasi
confirmLogoutBtn?.addEventListener('click', async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
})