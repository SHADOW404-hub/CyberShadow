import { supabase } from './supabase.js'
import './style.css';

// session tekshirish
const { data: { session }, error: sessionError } = await supabase.auth.getSession()

if (sessionError || !session) {
    window.location.replace('/') // replace ishlatish back tugmasi bosilganda login loopni oldini oladi
    return;
}

// Username chiqarish (email o'rniga)
const { data: profile } = await supabase
    .from('profiles')
    .select('username, email')
    .eq('id', session.user.id)
    .single()

if (profile && document.getElementById('userEmail')) {
    document.getElementById('userEmail').textContent = profile.username;
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

if (editProfileBtn && profileModal) {
    editProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Ma'lumotlarni modalga yozish
        document.getElementById('modalUsername').value = profile?.username || '';
        document.getElementById('modalEmail').value = profile?.email || '';
        
        profileModal.classList.add('active');
    });

    cancelModal?.addEventListener('click', () => {
        profileModal.classList.remove('active');
    });
}

// Inline CHANGE tugmalari uchun logika
document.querySelectorAll('.btn-inline-change').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        input.focus();
    });
});

// Logout funksiyasi
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
})