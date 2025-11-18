// Supabase Configuration
const SUPABASE_URL = 'https://mcdpamudmzczlahorjzj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jZHBhbXVkbXpjemxhaG9yanpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTA2NTcsImV4cCI6MjA3ODk4NjY1N30.KlCaJyMPHNvqHETaDgHw3A59hkU12jhlTqWkWwecUIw';

// Palabras y datos comunes de bots/test
const BLOCKED_PATTERNS = [
    'admin', 'test', 'demo', 'admin123', 'password', '123456', '12345', '1234', '111111',
    'qwerty', 'abc123', 'root', 'user', 'botuser', 'nobot', 'test123', 'default',
    'administrator', 'testuser', 'demouser', 'guest', 'login', 'pass', 'admin@', 'bot'
];

// Validación básica anti-bot
const isBlockedData = (value) => {
    if (!value) return true;
    const lower = value.toLowerCase().trim();
    return BLOCKED_PATTERNS.some(pattern => 
        lower === pattern || lower.includes(pattern)
    );
};

// Supabase Client Object
const supabaseClient = {
    // Validar datos antes de registrar
    validateRegistration: (email, password, fullName, phone) => {
        // Validar que no sean datos aleatorios o de prueba
        if (isBlockedData(fullName)) {
            return { valid: false, message: 'Nombre no válido. No se permiten datos de prueba.' };
        }
        if (isBlockedData(email.split('@')[0])) {
            return { valid: false, message: 'Email no válido. No se permiten datos de prueba.' };
        }
        if (isBlockedData(phone)) {
            return { valid: false, message: 'Teléfono no válido. No se permiten números de prueba.' };
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valid: false, message: 'Email inválido' };
        }

        // Validar teléfono (mínimo 7 dígitos)
        const phoneDigits = phone.replace(/\D/g, '');
        if (phoneDigits.length < 7) {
            return { valid: false, message: 'Teléfono muy corto (mínimo 7 dígitos)' };
        }

        // Validar contraseña
        if (password.length < 6) {
            return { valid: false, message: 'Contraseña muy corta (mínimo 6 caracteres)' };
        }

        // Validar que el nombre tenga al menos 3 caracteres
        if (fullName.length < 3) {
            return { valid: false, message: 'Nombre muy corto (mínimo 3 caracteres)' };
        }

        return { valid: true };
    },

    // Sign Up
    signUp: async (email, password, fullName, phone) => {
        try {
            // Validar datos anti-bot
            const validation = window.supabaseClient.validateRegistration(email, password, fullName, phone);
            if (!validation.valid) {
                return { user: null, error: { message: validation.message } };
            }

            // Crear usuario en Supabase Auth
            const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({
                    email,
                    password,
                    data: {
                        full_name: fullName,
                        phone_number: phone,
                    },
                }),
            });

            const data = await response.json();

            if (response.ok) {
                return { user: data.user, error: null };
            } else {
                return { user: null, error: data };
            }
        } catch (error) {
            return { user: null, error: error };
        }
    },

    // Sign In
    signIn: async (email, password) => {
        try {
            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return { user: null, error: { message: 'Email inválido' } };
            }

            const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store session
                localStorage.setItem('sb_access_token', data.access_token);
                localStorage.setItem('sb_refresh_token', data.refresh_token);
                localStorage.setItem('sb_user', JSON.stringify(data.user));

                return { user: data.user, error: null };
            } else if (data.error_code === 'email_not_confirmed') {
                // Email no confirmado - loguear de todos modos (permitir acceso)
                // Enviar credenciales por refresh_token
                const refreshResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_ANON_KEY,
                    },
                    body: JSON.stringify({
                        refresh_token: data.refresh_token || '',
                    }),
                });

                // Si refresh falla, crear sesión manual con datos conocidos
                // Guardar datos mínimos en localStorage
                localStorage.setItem('sb_user_email', email);
                localStorage.setItem('sb_access_token', data.access_token || '');
                localStorage.setItem('sb_refresh_token', data.refresh_token || '');
                
                // Crear un objeto usuario mínimo
                const minimalUser = {
                    id: 'temp-' + Date.now(),
                    email: email,
                    user_metadata: { email_confirmed: false }
                };
                localStorage.setItem('sb_user', JSON.stringify(minimalUser));

                return { user: minimalUser, error: null };
            } else {
                return { user: null, error: data };
            }
        } catch (error) {
            return { user: null, error: error };
        }
    },

    // Sign Out
    signOut: async () => {
        try {
            localStorage.removeItem('sb_access_token');
            localStorage.removeItem('sb_refresh_token');
            localStorage.removeItem('sb_user');
            return null;
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    },

    // Get Current User
    getCurrentUser: async () => {
        try {
            const user = localStorage.getItem('sb_user');
            const token = localStorage.getItem('sb_access_token');

            if (user && token) {
                return JSON.parse(user);
            }

            return null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },

        // Fetch comments for a given FAQ question (returns array)
        fetchComments: async (question_id) => {
            try {
                const url = `${SUPABASE_URL}/rest/v1/comments?question_id=eq.${question_id}&order=created_at.asc`;
                const res = await fetch(url, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    }
                });
                if (!res.ok) throw new Error('Error fetching comments');
                return await res.json();
            } catch (err) {
                console.error('fetchComments error', err);
                return [];
            }
        },

        // Post a comment for a question. Expects { question_id, user_email, content }
        postComment: async ({ question_id, user_email, content }) => {
            try {
                const url = `${SUPABASE_URL}/rest/v1/comments`;
                const body = { question_id, user_email, content };
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify(body)
                });
                if (!res.ok) {
                    const err = await res.text();
                    throw new Error(err || 'Error inserting comment');
                }
                return await res.json();
            } catch (err) {
                console.error('postComment error', err);
                return null;
            }
        },
};

// Expose to window for global access
window.supabaseClient = supabaseClient;