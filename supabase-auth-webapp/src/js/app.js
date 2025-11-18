// DOM Elements
const welcomeContainer = document.getElementById('welcome-container');
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const dashboardContainer = document.getElementById('dashboard-container');
const socialPanelContainer = document.getElementById('social-panel-container');
const verificationModal = document.getElementById('verification-modal');
const comingSoonContainer = document.getElementById('coming-soon-container');

const btnLogin = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
const backFromLogin = document.getElementById('back-from-login');
const backFromRegister = document.getElementById('back-from-register');
const goToRegister = document.getElementById('go-to-register');
const goToLogin = document.getElementById('go-to-login');
const logoutBtn = document.getElementById('logout-btn');
const backFromSocial = document.getElementById('back-from-social');
const backFromComing = document.getElementById('back-from-coming');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Menu Options
const optionLorem1 = document.getElementById('option-lorem-1');
const optionLorem2 = document.getElementById('option-lorem-2');
const optionFaq = document.getElementById('option-faq');
const faqContainer = document.getElementById('faq-container');
const backFromFaq = document.getElementById('back-from-faq');

// Verification
const verificationTabs = document.querySelectorAll('.verification-tab');
const verifyEmailBtn = document.getElementById('verify-email-btn');
const verifyPhoneBtn = document.getElementById('verify-phone-btn');
const skipVerification = document.getElementById('skip-verification');
const verificationStatus = document.getElementById('verification-status');

let currentUserEmail = null;

// Event Listeners - Welcome Screen
btnLogin.addEventListener('click', () => {
    welcomeContainer.style.display = 'none';
    loginContainer.style.display = 'flex';
});

btnRegister.addEventListener('click', () => {
    welcomeContainer.style.display = 'none';
    registerContainer.style.display = 'flex';
});

// Event Listeners - Back Buttons
backFromLogin.addEventListener('click', () => {
    loginContainer.style.display = 'none';
    welcomeContainer.style.display = 'flex';
});

backFromRegister.addEventListener('click', () => {
    registerContainer.style.display = 'none';
    welcomeContainer.style.display = 'flex';
});

// Event Listeners - Switch between Login and Register
goToRegister.addEventListener('click', () => {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'flex';
});

goToLogin.addEventListener('click', () => {
    registerContainer.style.display = 'none';
    loginContainer.style.display = 'flex';
});

// Event Listener - Login Form
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const result = await window.supabaseClient.signIn(email, password);

        if (result.error) {
            alert('Error al iniciar sesión: ' + (result.error.message || JSON.stringify(result.error)));
        } else {
            currentUserEmail = result.user.email;
            showDashboard(result.user.email);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al iniciar sesión: ' + error.message);
    }
});

// Event Listener - Register Form
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('register-fullname').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;

    try {
        const result = await window.supabaseClient.signUp(email, password, fullName, phone);

        if (result.error) {
            alert('Error al registrarse: ' + (result.error.message || JSON.stringify(result.error)));
        } else {
            currentUserEmail = email;
            registerContainer.style.display = 'none';
            verificationModal.style.display = 'flex';
            registerForm.reset();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrarse: ' + error.message);
    }
});

// Verification Tabs
verificationTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        // Update active tab
        verificationTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active content
        document.querySelectorAll('.verification-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// Verify Email
verifyEmailBtn.addEventListener('click', async () => {
    const code = document.getElementById('email-code').value;
    
    if (code.length !== 6 || isNaN(code)) {
        verificationStatus.textContent = '❌ Código inválido. Debe ser de 6 dígitos.';
        verificationStatus.style.color = '#ef4444';
        return;
    }

    try {
        verificationStatus.textContent = '⏳ Verificando...';
        verificationStatus.style.color = '#fbbf24';
        
        const result = await window.supabaseClient.verifyEmail(currentUserEmail, code);
        
        if (result.success) {
            verificationStatus.textContent = '✅ Email verificado correctamente';
            verificationStatus.style.color = '#10b981';
            document.getElementById('email-code').disabled = true;
            verifyEmailBtn.disabled = true;
        } else {
            verificationStatus.textContent = '❌ ' + (result.error || 'Error en verificación');
            verificationStatus.style.color = '#ef4444';
        }
    } catch (error) {
        verificationStatus.textContent = '❌ Error en la verificación';
        verificationStatus.style.color = '#ef4444';
        console.error('Error:', error);
    }
});

// Verify Phone
verifyPhoneBtn.addEventListener('click', async () => {
    const code = document.getElementById('phone-code').value;
    
    if (code.length !== 6 || isNaN(code)) {
        verificationStatus.textContent = '❌ Código inválido. Debe ser de 6 dígitos.';
        verificationStatus.style.color = '#ef4444';
        return;
    }

    try {
        verificationStatus.textContent = '⏳ Verificando...';
        verificationStatus.style.color = '#fbbf24';
        
        const result = await window.supabaseClient.verifyPhone(currentUserEmail, code);
        
        if (result.success) {
            verificationStatus.textContent = '✅ Teléfono verificado correctamente';
            verificationStatus.style.color = '#10b981';
            document.getElementById('phone-code').disabled = true;
            verifyPhoneBtn.disabled = true;
        } else {
            verificationStatus.textContent = '❌ ' + (result.error || 'Error en verificación');
            verificationStatus.style.color = '#ef4444';
        }
    } catch (error) {
        verificationStatus.textContent = '❌ Error en la verificación';
        verificationStatus.style.color = '#ef4444';
        console.error('Error:', error);
    }
});

// Skip Verification
skipVerification.addEventListener('click', () => {
    verificationModal.style.display = 'none';
    welcomeContainer.style.display = 'flex';
    alert('Registro completado. Por favor, verifica tu correo para acceder.');
});

// Menu Options
optionLorem1.addEventListener('click', () => {
    dashboardContainer.style.display = 'none';
    socialPanelContainer.style.display = 'flex';
});

optionLorem2.addEventListener('click', () => {
    // Show a dedicated "Proximamente" screen instead of the social panel
    dashboardContainer.style.display = 'none';
    socialPanelContainer.style.display = 'none';
    comingSoonContainer.style.display = 'flex';
});

optionFaq.addEventListener('click', () => {
    dashboardContainer.style.display = 'none';
    socialPanelContainer.style.display = 'none';
    faqContainer.style.display = 'flex';
    // load comments for all FAQ items
    loadAllFaqComments();
});

// Back from FAQ
if (backFromFaq) {
    backFromFaq.addEventListener('click', () => {
        faqContainer.style.display = 'none';
        dashboardContainer.style.display = 'block';
    });
}

// Back from Social Panel
backFromSocial.addEventListener('click', () => {
    socialPanelContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
});

// Back from Coming Soon
if (backFromComing) {
    backFromComing.addEventListener('click', () => {
        comingSoonContainer.style.display = 'none';
        dashboardContainer.style.display = 'block';
    });
}

// Event Listener - Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await window.supabaseClient.signOut();
        dashboardContainer.style.display = 'none';
        socialPanelContainer.style.display = 'none';
        welcomeContainer.style.display = 'flex';
        loginForm.reset();
        registerForm.reset();
        currentUserEmail = null;
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión');
    }
});

// Show Dashboard
function showDashboard(userEmail) {
    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
}

// Check if user is already logged in
window.addEventListener('load', async () => {
    try {
        const user = await window.supabaseClient.getCurrentUser();
        if (user) {
            currentUserEmail = user.email;
            showDashboard(user.email);
        }
    } catch (error) {
        console.error('Error checking user:', error);
    }
});

// --- FAQ comments logic ---
async function loadCommentsFor(questionId) {
    const commentsWrap = document.getElementById(`comments-${questionId}`);
    if (!commentsWrap) return;
    commentsWrap.innerHTML = 'Cargando comentarios...';
    const rows = await window.supabaseClient.fetchComments(questionId);
    if (!rows || rows.length === 0) {
        commentsWrap.innerHTML = '<div class="comment">Sin comentarios aún. Sé el primero.</div>';
        return;
    }
    commentsWrap.innerHTML = '';
    rows.forEach(r => {
        const d = document.createElement('div');
        d.className = 'comment';
        const meta = document.createElement('div');
        meta.className = 'comment-meta';
        const email = r.user_email || 'Anónimo';
        const date = new Date(r.created_at).toLocaleString();
        meta.textContent = `${email} · ${date}`;
        const content = document.createElement('div');
        content.textContent = r.content;
        d.appendChild(meta);
        d.appendChild(content);
        commentsWrap.appendChild(d);
    });
}

async function loadAllFaqComments() {
    document.querySelectorAll('.faq-item').forEach(item => {
        const id = item.dataset.questionId;
        loadCommentsFor(id);
    });
}

// Handle comment form submissions (delegated)
document.addEventListener('submit', async (e) => {
    if (!e.target.classList.contains('comment-form')) return;
    e.preventDefault();
    const form = e.target;
    const qid = form.dataset.questionId;
    const emailInput = form.querySelector('.comment-email');
    const contentInput = form.querySelector('.comment-content');
    const content = contentInput.value && contentInput.value.trim();
    const email = emailInput && emailInput.value && emailInput.value.trim();
    if (!content) {
        alert('Escribe un comentario antes de enviar.');
        return;
    }

    // prefer logged-in email
    let userEmail = email || currentUserEmail || '';

    // post via supabaseClient
    const res = await window.supabaseClient.postComment({ question_id: parseInt(qid, 10), user_email: userEmail, content });
    if (!res) {
        alert('No se pudo enviar el comentario. Intenta más tarde.');
        return;
    }
    // reset and reload
    contentInput.value = '';
    if (emailInput) emailInput.value = '';
    loadCommentsFor(qid);
});

// --- Social icons: persistent input panels with vertical transition ---
document.querySelectorAll('.social-icon-box').forEach(box => {
    box.addEventListener('click', (e) => {
        // Toggle this box open/closed. If it's open, close it.
        const isOpen = box.classList.contains('open');
        if (isOpen) {
            box.classList.remove('open');
            const inp = box.querySelector('.icon-input');
            if (inp) inp.blur();
            return;
        }

        // Close any other open boxes first
        document.querySelectorAll('.social-icon-box.open').forEach(other => {
            if (other === box) return;
            other.classList.remove('open');
            const i = other.querySelector('.icon-input');
            if (i) i.blur();
        });

        // Open this one and focus its input
        box.classList.add('open');
        const input = box.querySelector('.icon-input');
        if (input) {
            // small delay to allow CSS transition before focusing on mobile
            setTimeout(() => input.focus(), 200);
        }
    });
});
