import { supabase } from './supabase.js'

// session tekshirish
const { data: { session } } =
    await supabase.auth.getSession()

if (!session) {
    window.location.href = '/'
}

// email chiqarish
document.getElementById('userEmail')
    .textContent = session.user.email


// logout
document.getElementById('logoutBtn')
    .addEventListener('click', async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    })