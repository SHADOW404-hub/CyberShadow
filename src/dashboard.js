import { supabase } from './supabase.js'

// session tekshirish
const { data: { session }, error: sessionError } = await supabase.auth.getSession()

if (sessionError || !session) {
    window.location.replace('/') // replace ishlatish back tugmasi bosilganda login loopni oldini oladi
    return;
}

// Username chiqarish (email o'rniga)
const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', session.user.id)
    .single()

if (profile && document.getElementById('userEmail')) {
    document.getElementById('userEmail').textContent = profile.username
}

// Logout funksiyasi
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
})