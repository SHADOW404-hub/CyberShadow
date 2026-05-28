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
    .select('username, email')
    .eq('id', session.user.id)
    .single()

if (profileError) console.error("Profile fetch error:", profileError);
let currentProfile = profile || {}; // Supabase'dan olingan profil ma'lumotlarini saqlash

if (currentProfile.username && document.getElementById('userEmail')) {
    document.getElementById('userEmail').textContent = currentProfile.username;
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
const saveProfileBtn = document.getElementById('saveProfile'); // Save Changes tugmasi

if (editProfileBtn && profileModal) {
    editProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Ma'lumotlarni modalga yozish
        const uInput = document.getElementById('modalUsername');
        const eInput = document.getElementById('modalEmail');
        
        uInput.value = currentProfile.username || '';
        eInput.value = currentProfile.email || '';
        
        // Modal ochilganda inputlarni yana qulflash
        uInput.readOnly = true;
        eInput.readOnly = true;
        
        profileModal.classList.add('active');
    });

    cancelModal?.addEventListener('click', () => {
        profileModal.classList.remove('active');
    });
}

// Save Changes tugmasi logikasi
if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', async () => {
        const uInput = document.getElementById('modalUsername');
        const eInput = document.getElementById('modalEmail');
        
        const newUsername = uInput.value.trim();
        const newEmail = eInput.value.trim();

        let changesMade = false;
        const updateData = {};

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
                profileModal.classList.remove('active'); // Modalni yopish
            }
        } else {
            profileModal.classList.remove('active'); // O'zgarish bo'lmasa ham modalni yopish
        }
    });
}

// Inline CHANGE tugmalari uchun logika
document.querySelectorAll('.btn-inline-change').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        input.readOnly = false; // Tahrirlashga ruxsat berish
        input.focus();
    });
});

// Logout funksiyasi
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
})