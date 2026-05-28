import { supabase } from './supabase.js'

// session tekshirish
const { data: { session } } =
    await supabase.auth.getSession()

if (!session) {
    window.location.href = '/'
}

// Username chiqarish (email o'rniga)
const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', session.user.id)
    .single()

if (profile) {
    document.getElementById('userEmail')
        .textContent = profile.username
}


// logout
document.getElementById('logoutBtn')
    .addEventListener('click', async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
    })