import { supabase } from './supabase.js'

// Autentifikatsiya holatini real-vaqtda kuzatish
supabase.auth.onAuthStateChange((event, session) => {
    if (!session) {
        window.location.href = '/'
        return
    }

    // Emailni chiqarish (null check bilan)
    const userEmail = document.getElementById('userEmail')
    if (userEmail) {
        userEmail.textContent = session.user.email
    }
})


// logout
document.getElementById('logoutBtn')
    .addEventListener('click', async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    })