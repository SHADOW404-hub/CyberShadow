import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Client-side (public) Supabase config — VITE_ prefix is required for Vite to inject them.
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

const isRealConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isRealConfigured) {
  console.warn('Supabase client keys are not set. Activating Mock Client Fallback for development.');
}

// Initial Mock DB Setup in localStorage
if (typeof window !== 'undefined') {
  if (!localStorage.getItem('cs_profiles')) {
    localStorage.setItem('cs_profiles', JSON.stringify([
      { id: 'usr-admin', username: 'admin', email: 'admin@cybershadow.net', role: 'admin', country: 'Uzbekistan', score: 3500, challenges_solved: 12, created_at: new Date().toISOString() },
      { id: 'usr-ghost', username: 'ghost_operator', email: 'ghost@cybershadow.net', role: 'user', country: 'Canada', score: 1450, challenges_solved: 4, created_at: new Date(Date.now() - 86400000).toISOString() },
      { id: 'usr-cyber', username: 'cyber_ghost', email: 'cyber@cybershadow.net', role: 'user', country: 'United States', score: 850, challenges_solved: 2, created_at: new Date(Date.now() - 172800000).toISOString() }
    ]));
  }

  if (!localStorage.getItem('cs_challenges')) {
    localStorage.setItem('cs_challenges', JSON.stringify([
      { id: 'ch-1', name: 'SQL Injection: Ghost Echo', points: 100, category: 'Web', difficulty: 'Easy', description: 'Find the hidden admin credentials inside the ghost database. Standard login bypass wont be enough.', solved: true, solves_count: 142, flag: 'flag{sql_ghost_echo}' },
      { id: 'ch-2', name: 'Buffer Overflow: Memory Leaks', points: 250, category: 'Pwn', difficulty: 'Medium', description: 'Overwrite the return address on the stack to redirect execution flow to the secret function.', solved: false, solves_count: 54, flag: 'flag{stack_overflow_success}' },
      { id: 'ch-3', name: 'XOR Matrix Decoder', points: 150, category: 'Crypto', difficulty: 'Easy', description: 'A custom XOR encryption mechanism was used to scramble the flags. The key length is 4 bytes.', solved: false, solves_count: 98, flag: 'flag{xor_matrix_dec}' },
      { id: 'ch-4', name: 'Firmware Analyst: Router-v4', points: 400, category: 'Reverse', difficulty: 'Hard', description: 'Reverse engineer the router firmware binary to discover the hidden backdoor credentials.', solved: false, solves_count: 12, flag: 'flag{router_firmware_breach}' },
      { id: 'ch-5', name: 'Exfiltration: DNS Tunneling', points: 300, category: 'Forensics', difficulty: 'Medium', description: 'Analyze the packet capture file (PCAP) to extract the file being exfiltrated via DNS queries.', solved: false, solves_count: 38, flag: 'flag{dns_exfiltration_detect}' },
      { id: 'ch-6', name: 'Advanced API Bypass', points: 500, category: 'Web', difficulty: 'Insane', description: 'An API endpoint is protected by multiple rate limiters and signature validation checks. Exploit the logic flaw.', solved: false, solves_count: 3, flag: 'flag{api_bypass_insanity}' }
    ]));
  }

  if (!localStorage.getItem('cs_solves')) {
    localStorage.setItem('cs_solves', JSON.stringify([
      { id: 'sol-1', profile_id: 'usr-ghost', challenge_id: 'ch-1' },
      { id: 'sol-2', profile_id: 'usr-cyber', challenge_id: 'ch-1' }
    ]));
  }
}

// Create Mock Auth and Query Builder client
const createMockClient = (): any => {
  const getProfiles = () => JSON.parse(localStorage.getItem('cs_profiles') || '[]');
  const setProfiles = (p: any) => localStorage.setItem('cs_profiles', JSON.stringify(p));
  const getChallenges = () => JSON.parse(localStorage.getItem('cs_challenges') || '[]');
  const setChallenges = (c: any) => localStorage.setItem('cs_challenges', JSON.stringify(c));
  const getSolves = () => JSON.parse(localStorage.getItem('cs_solves') || '[]');

  const authChangeListeners: Array<(event: string, session: any) => void> = [];

  const getSessionUser = () => {
    const sess = localStorage.getItem('cs_session');
    if (!sess) return null;
    return JSON.parse(sess);
  };

  const notifyAuthChange = (event: string, session: any) => {
    authChangeListeners.forEach(cb => cb(event, session));
  };

  return {
    auth: {
      async getSession() {
        const user = getSessionUser();
        return { data: { session: user ? { user } : null }, error: null };
      },
      onAuthStateChange(callback: any) {
        authChangeListeners.push(callback);
        const user = getSessionUser();
        // Fire initially
        setTimeout(() => callback('SIGNED_IN', user ? { user } : null), 0);
        return {
          data: {
            subscription: {
              unsubscribe() {
                const idx = authChangeListeners.indexOf(callback);
                if (idx !== -1) authChangeListeners.splice(idx, 1);
              }
            }
          }
        };
      },
      async signInWithPassword({ email, password }: any) {
        const profiles = getProfiles();
        // Since we are mocking, we accept correct matching credentials (e.g. check username or email)
        const user = profiles.find((p: any) => p.email === email || p.username === email);
        if (!user) {
          return { data: { user: null }, error: new Error('invalid login credentials') };
        }
        // Let's accept any password ending in 'password' or match exactly
        if (password && password.length >= 4) {
          const sessionUser = { id: user.id, email: user.email, user_metadata: { username: user.username } };
          localStorage.setItem('cs_session', JSON.stringify(sessionUser));
          notifyAuthChange('SIGNED_IN', { user: sessionUser });
          return { data: { user: sessionUser }, error: null };
        }
        return { data: { user: null }, error: new Error('invalid login credentials') };
      },
      async signUp({ email, password: _password, options }: any) {
        const profiles = getProfiles();
        const username = options?.data?.username || email.split('@')[0];
        if (profiles.some((p: any) => p.username === username || p.email === email)) {
          return { data: { user: null }, error: new Error('user already registered') };
        }

        const newId = 'usr-' + Math.random().toString(36).substr(2, 9);
        const newProfile = {
          id: newId,
          username,
          email,
          role: 'user',
          country: 'Uzbekistan',
          score: 0,
          challenges_solved: 0,
          created_at: new Date().toISOString()
        };
        profiles.push(newProfile);
        setProfiles(profiles);

        const sessionUser = { id: newId, email, user_metadata: { username } };
        return { data: { user: sessionUser }, error: null };
      },
      async updateUser({ password }: any) {
        if (!password || password.length < 6) {
          return { error: new Error('at least 6 characters') };
        }
        return { data: {}, error: null };
      },
      async resetPasswordForEmail(_email: string, _options: any) {
        return { data: {}, error: null };
      },
      async signOut() {
        localStorage.removeItem('cs_session');
        notifyAuthChange('SIGNED_OUT', null);
        return { error: null };
      }
    },

    from(table: string) {
      const getTableData = () => {
        if (table === 'profiles') return getProfiles();
        if (table === 'challenges') return getChallenges();
        if (table === 'solves') return getSolves();
        return [];
      };

      const setTableData = (data: any) => {
        if (table === 'profiles') setProfiles(data);
        if (table === 'challenges') setChallenges(data);
        if (table === 'solves') localStorage.setItem('cs_solves', JSON.stringify(data));
      };

      let chainData = [...getTableData()];
      let singleRow = false;
      let maybeSingleRow = false;

      const builder = {
        select(_fields?: string) {
          // No-op filtering on columns in mock implementation
          return builder;
        },
        order(field: string, options?: any) {
          chainData.sort((a, b) => {
            const valA = a[field];
            const valB = b[field];
            const asc = options?.ascending !== false;
            if (valA < valB) return asc ? -1 : 1;
            if (valA > valB) return asc ? 1 : -1;
            return 0;
          });
          return builder;
        },
        eq(column: string, value: any) {
          chainData = chainData.filter(row => row[column] === value);
          return builder;
        },
        single() {
          singleRow = true;
          return builder;
        },
        maybeSingle() {
          maybeSingleRow = true;
          return builder;
        },
        async insert(rows: any[]) {
          const current = getTableData();
          const inserted = rows.map(r => ({
            id: r.id || 'id-' + Math.random().toString(36).substr(2, 9),
            ...r
          }));
          setTableData([...current, ...inserted]);
          return { data: inserted, error: null };
        },
        async update(fields: any) {
          const current = getTableData();
          let updatedCount = 0;
          const updated = current.map((row: any) => {
            // Check if row matches the filters applied to chainData so far
            const isMatch = chainData.some(filteredRow => filteredRow.id === row.id);
            if (isMatch) {
              updatedCount++;
              return { ...row, ...fields };
            }
            return row;
          });
          setTableData(updated);
          return { data: updated.filter((r: any) => chainData.some(f => f.id === r.id)), error: null };
        },
        async delete() {
          const current = getTableData();
          const remaining = current.filter((row: any) => !chainData.some(filteredRow => filteredRow.id === row.id));
          setTableData(remaining);
          return { data: chainData, error: null };
        },
        // Standard then/Promise method to execute query builder
        then(onfulfilled?: any) {
          let result: any = chainData;
          if (singleRow) {
            result = chainData[0] || null;
          } else if (maybeSingleRow) {
            result = chainData[0] || null;
          }
          const payload = { data: result, error: null };
          if (onfulfilled) {
            onfulfilled(payload);
          }
          return Promise.resolve(payload);
        }
      };

      return builder as any;
    }
  };
};

export const supabase: SupabaseClient = isRealConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (createMockClient() as unknown as SupabaseClient);

// Server-only admin client factory.
export function getAdminClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error('getAdminClient() called in browser: admin client must only be created on the server. Use a server-side endpoint.');
  }
  return supabase;
}

// Helpers for common tables
export const db = {
  profiles: () => supabase.from('profiles'),
  challenges: () => supabase.from('challenges'),
};

