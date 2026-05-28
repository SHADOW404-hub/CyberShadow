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
const closeModal = document.getElementById('closeModal');

if (editProfileBtn && profileModal) {
    editProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Ma'lumotlarni modalga yozish
        document.getElementById('modalUsername').textContent = profile?.username || 'N/A';
        document.getElementById('modalEmail').textContent = profile?.email || 'N/A';
        
        profileModal.classList.add('active');
    });

    closeModal.addEventListener('click', () => {
        profileModal.classList.remove('active');
    });
}

// Logout funksiyasi
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
})