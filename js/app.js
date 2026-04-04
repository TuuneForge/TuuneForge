/**
 * TUNE FORGE - NEXT GEN 3D APPLICATION
 * Features: Advanced 3D Background, Cart System, Auth, Tickets, Cursor Effects
 */

// ==========================================
// STATE MANAGEMENT
// ==========================================
const AppState = {
    currentUser: null,
    isLoggedIn: false,
    tickets: [],
    cart: [],
    products: {
        tuneforge: { 
            id: 'tuneforge',
            name: 'Tune Forge Pro', 
            price: 79.99,
            icon: 'fa-tachometer-alt'
        },
        fivem: { 
            id: 'fivem',
            name: 'FiveM Ultimate Pack', 
            price: 119.99,
            icon: 'fa-gamepad'
        },
        tweak: { 
            id: 'tweak',
            name: 'System Optimizer', 
            price: 29.99,
            icon: 'fa-microchip'
        },
        fivemtweak: {
            id: 'fivemtweak',
            name: 'FiveM Tweak',
            price: 19.99,
            icon: 'fa-cogs'
        },
        windowstweak: {
            id: 'windowstweak',
            name: 'Windows Pro Tweak',
            price: 39.99,
            icon: 'fa-windows'
        },
        website: {
            id: 'website',
            name: 'Web Site Paketi',
            price: 199.99,
            icon: 'fa-globe'
        },
        application: {
            id: 'application',
            name: 'Özel Uygulama',
            price: 0,
            icon: 'fa-laptop-code'
        }
    }
};

// Admin user data
const ADMIN_USER = {
    id: 999,
    username: 'Admin',
    email: 'admin@tuneforge.com',
    password: 'admin123',
    isAdmin: true,
    createdAt: '2024-01-01'
};

// All tickets storage (for admin view)
let ALL_TICKETS = [];

// ==========================================
// LOADER
// ==========================================
function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 2000);
    });
}

// ==========================================
// CUSTOM CURSOR
// ==========================================
function initCustomCursor() {
    const trail = document.querySelector('.cursor-trail');
    const dot = document.querySelector('.cursor-dot');
    
    if (!trail || !dot) return;
    
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    let dotX = 0, dotY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Dot follows immediately
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        dot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
        
        // Trail follows with delay
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        trail.style.transform = `translate(${trailX - 20}px, ${trailY - 20}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .product-card, .service-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            trail.style.transform = `translate(${trailX - 20}px, ${trailY - 20}px) scale(1.5)`;
            trail.style.borderColor = 'var(--secondary)';
        });
        el.addEventListener('mouseleave', () => {
            trail.style.transform = `translate(${trailX - 20}px, ${trailY - 20}px) scale(1)`;
            trail.style.borderColor = 'var(--primary)';
        });
    });
}

// ==========================================
// THREE.JS 3D BACKGROUND - ADVANCED
// ==========================================
function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particle system with connections
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Positions - create a wave-like distribution
        const x = (Math.random() - 0.5) * 60;
        const y = (Math.random() - 0.5) * 60;
        const z = (Math.random() - 0.5) * 60;
        
        posArray[i] = x;
        posArray[i + 1] = y;
        posArray[i + 2] = z;

        // Colors - purple to cyan gradient
        const mixFactor = Math.random();
        colorArray[i] = mixFactor * 0.4 + (1 - mixFactor) * 0.02;     // R
        colorArray[i + 1] = mixFactor * 0.3 + (1 - mixFactor) * 0.7;    // G
        colorArray[i + 2] = mixFactor * 1 + (1 - mixFactor) * 0.9;      // B
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 20;

    // Mouse tracking for parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
    });

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotate particles slowly
        particlesMesh.rotation.y = elapsedTime * 0.03;
        particlesMesh.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

        // Smooth camera movement based on mouse
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        camera.position.x += (mouseX * 8 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 8 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ==========================================
// NAVIGATION
// ==========================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu
    hamburger?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ==========================================
// CART SYSTEM
// ==========================================
function initCart() {
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartClose = document.getElementById('cart-close');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Open cart
    cartBtn?.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });
    
    // Close cart
    const closeCart = () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    };
    
    cartClose?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);
    
    // Purchase button - opens ticket modal with product pre-selected
    document.querySelectorAll('.btn-cart-add').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.dataset.product;
            const product = AppState.products[productId];
            
            if (!product) return;
            
            // Check if user is logged in
            if (!AppState.isLoggedIn) {
                showToast('Satın almak için giriş yapmanız gerekli!', 'warning');
                openModal('auth-modal');
                return;
            }
            
            // Pre-fill ticket form with product info
            const ticketProductSelect = document.getElementById('ticket-product');
            if (ticketProductSelect) {
                ticketProductSelect.value = productId;
            }
            
            const ticketSubject = document.getElementById('ticket-subject');
            if (ticketSubject) {
                const priceText = product.price > 0 ? `$${product.price.toFixed(2)}` : 'Fiyat Sorunuz';
                ticketSubject.value = `Satın Alma Talebi: ${product.name} (${priceText})`;
            }
            
            const ticketCategory = document.getElementById('ticket-category');
            if (ticketCategory) {
                ticketCategory.value = 'sales';
            }
            
            openModal('ticket-modal');
            showToast(`${product.name} için ticket oluşturabilirsiniz`, 'success');
        });
    });
    
    // Update cart display
    function updateCart() {
        cartCount.textContent = AppState.cart.length;
        
        if (AppState.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Sepetiniz boş</p>
                </div>
            `;
            checkoutBtn.disabled = true;
        } else {
            let total = 0;
            cartItems.innerHTML = AppState.cart.map((item, index) => {
                total += item.price;
                return `
                    <div class="cart-item">
                        <div class="cart-item-icon">
                            <i class="fas ${item.icon}"></i>
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        </div>
                        <button class="cart-item-remove" data-index="${index}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            }).join('');
            
            cartTotal.textContent = `$${total.toFixed(2)}`;
            checkoutBtn.disabled = false;
            
            // Remove item
            cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    AppState.cart.splice(index, 1);
                    updateCart();
                });
            });
        }
    }
    
    // Checkout
    checkoutBtn?.addEventListener('click', () => {
        closeCart();
        openCheckoutModal();
    });
}

// ==========================================
// AUTHENTICATION SYSTEM
// ==========================================
function initAuth() {
    const loginBtn = document.getElementById('login-btn');
    const authModal = document.getElementById('auth-modal');
    const authModalClose = document.getElementById('auth-modal-close');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Check saved session
    const savedUser = localStorage.getItem('tuneforge_user');
    if (savedUser) {
        AppState.currentUser = JSON.parse(savedUser);
        AppState.isLoggedIn = true;
        // Load only this user's tickets
        const allTickets = JSON.parse(localStorage.getItem('all_tickets') || '[]');
        AppState.tickets = allTickets.filter(t => t.userId === AppState.currentUser.id);
        updateUIForLoggedInUser();
        updateTicketsList();
        updateTicketCounts();
    }
    
    // Check admin session
    const savedAdmin = localStorage.getItem('tuneforge_admin');
    if (savedAdmin) {
        AppState.currentUser = JSON.parse(savedAdmin);
        AppState.isLoggedIn = true;
        AppState.currentUser.isAdmin = true;
        updateUIForLoggedInUser();
        showAdminPanel();
    }
    
    // Open auth modal
    loginBtn?.addEventListener('click', () => {
        openModal('auth-modal');
    });
    
    // Close auth modal
    authModalClose?.addEventListener('click', () => {
        closeModal('auth-modal');
    });
    
    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            document.getElementById(`${tabName}-form`).classList.add('active');
        });
    });
    
    // Login form
    document.getElementById('login-form-element')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Admin login
        if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
            AppState.currentUser = { ...ADMIN_USER };
            delete AppState.currentUser.password;
            AppState.isLoggedIn = true;
            
            localStorage.setItem('tuneforge_admin', JSON.stringify(AppState.currentUser));
            
            updateUIForLoggedInUser();
            closeModal('auth-modal');
            showAdminPanel();
            showToast('Admin olarak giriş yaptınız!', 'success');
            return;
        }
        
        // Regular user login - check stored users
        let storedUsers = [];
        try {
            const stored = localStorage.getItem('tuneforge_users');
            if (stored) {
                storedUsers = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error reading users:', e);
        }
        
        console.log('Stored users:', storedUsers);
        console.log('Looking for:', email, password);
        
        const user = storedUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            AppState.currentUser = { 
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            };
            AppState.isLoggedIn = true;
            // Load only this user's tickets
            const allTickets = JSON.parse(localStorage.getItem('all_tickets') || '[]');
            AppState.tickets = allTickets.filter(t => t.userId === user.id);
            
            localStorage.setItem('tuneforge_user', JSON.stringify(AppState.currentUser));
            
            updateUIForLoggedInUser();
            closeModal('auth-modal');
            updateTicketsList();
            updateTicketCounts();
            showToast('Başarıyla giriş yaptınız!', 'success');
        } else {
            showToast('Email veya şifre hatalı!', 'error');
            console.log('Login failed: User not found');
        }
    });
    
    // Register form
    document.getElementById('register-form-element')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-password-confirm').value;
        
        if (password !== confirmPassword) {
            showToast('Şifreler eşleşmiyor!', 'error');
            return;
        }
        
        // Save user to users list
        let storedUsers = [];
        try {
            const stored = localStorage.getItem('tuneforge_users');
            if (stored) {
                storedUsers = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error reading stored users:', e);
            storedUsers = [];
        }
        
        // Check if user exists
        const existingUser = storedUsers.find(u => u.email === email);
        if (existingUser) {
            showToast('Bu email zaten kayıtlı!', 'error');
            return;
        }
        
        const newUser = {
            id: Date.now(),
            username,
            email,
            password,
            createdAt: new Date().toISOString().split('T')[0]
        };
        
        storedUsers.push(newUser);
        
        // Save to localStorage
        try {
            localStorage.setItem('tuneforge_users', JSON.stringify(storedUsers));
            console.log('User registered:', newUser);
            console.log('All users:', storedUsers);
        } catch (e) {
            console.error('Error saving user:', e);
            showToast('Kayıt sırasında hata oluştu!', 'error');
            return;
        }
        
        // Auto login after registration
        AppState.currentUser = {
            id: newUser.id,
            username,
            email,
            createdAt: newUser.createdAt
        };
        AppState.isLoggedIn = true;
        AppState.tickets = []; // New user starts with empty tickets
        
        localStorage.setItem('tuneforge_user', JSON.stringify(AppState.currentUser));
        
        updateUIForLoggedInUser();
        closeModal('auth-modal');
        updateTicketsList();
        updateTicketCounts();
        showToast('Kayıt başarılı! Hoş geldiniz.', 'success');
    });
    
    // Logout
    logoutBtn?.addEventListener('click', () => {
        AppState.currentUser = null;
        AppState.isLoggedIn = false;
        AppState.tickets = [];
        
        localStorage.removeItem('tuneforge_user');
        localStorage.removeItem('tuneforge_admin');
        
        // Hide admin panel if open
        document.getElementById('admin-panel')?.classList.add('hidden');
        
        document.getElementById('login-btn')?.classList.remove('hidden');
        document.getElementById('user-menu')?.classList.add('hidden');
        document.getElementById('login-required')?.classList.remove('hidden');
        document.getElementById('tickets-dashboard')?.classList.add('hidden');
        
        showToast('Çıkış yapıldı.', 'success');
    });
    
    // Admin button click
    document.getElementById('admin-btn')?.addEventListener('click', () => {
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel?.classList.contains('hidden')) {
            showAdminPanel();
            // Scroll to admin panel
            adminPanel.scrollIntoView({ behavior: 'smooth' });
        } else {
            adminPanel?.classList.add('hidden');
        }
    });
    
    // Tickets login button
    document.getElementById('tickets-login-btn')?.addEventListener('click', () => {
        openModal('auth-modal');
    });
    
    // Toggle password visibility
    document.querySelectorAll('.btn-toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const icon = btn.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

function updateUIForLoggedInUser() {
    if (!AppState.currentUser) return;
    
    document.getElementById('login-btn')?.classList.add('hidden');
    document.getElementById('user-menu')?.classList.remove('hidden');
    document.getElementById('user-name').textContent = AppState.currentUser.username;
    
    // Show admin button if admin
    if (AppState.currentUser.isAdmin) {
        document.getElementById('admin-btn')?.classList.remove('hidden');
        document.getElementById('login-required')?.classList.add('hidden');
        document.getElementById('tickets-dashboard')?.classList.add('hidden');
    } else {
        document.getElementById('admin-btn')?.classList.add('hidden');
        document.getElementById('login-required')?.classList.add('hidden');
        document.getElementById('tickets-dashboard')?.classList.remove('hidden');
    }
}

// Admin Panel Functions
function showAdminPanel() {
    document.getElementById('admin-panel')?.classList.remove('hidden');
    loadAllTicketsForAdmin();
}

function loadAllTicketsForAdmin(filter = 'all') {
    const adminTicketsList = document.getElementById('admin-tickets-list');
    if (!adminTicketsList) return;
    
    // Get all tickets from all users
    const allUserTickets = JSON.parse(localStorage.getItem('all_tickets') || '[]');
    
    // Update stats
    document.getElementById('admin-total-tickets').textContent = allUserTickets.length;
    document.getElementById('admin-open-tickets').textContent = allUserTickets.filter(t => t.status === 'open').length;
    document.getElementById('admin-pending-tickets').textContent = allUserTickets.filter(t => t.status === 'pending').length;
    
    // Filter tickets
    let filteredTickets = allUserTickets;
    if (filter !== 'all') {
        filteredTickets = allUserTickets.filter(t => t.status === filter);
    }
    
    if (filteredTickets.length === 0) {
        adminTicketsList.innerHTML = `
            <div class="no-tickets">
                <i class="fas fa-inbox"></i>
                <p>Henüz hiç ticket bulunmuyor.</p>
            </div>
        `;
        return;
    }
    
    const categoryLabels = {
        technical: 'Teknik Destek',
        sales: 'Satış & Ödeme',
        product: 'Ürün Desteği',
        general: 'Genel'
    };
    
    adminTicketsList.innerHTML = filteredTickets.map(ticket => `
        <div class="ticket-item">
            <div class="ticket-info">
                <h4>${ticket.subject}</h4>
                <div class="ticket-meta">
                    <span><i class="fas fa-user"></i> ${ticket.userEmail || 'Bilinmiyor'}</span>
                    <span><i class="fas fa-folder"></i> ${categoryLabels[ticket.category] || ticket.category}</span>
                    ${ticket.product ? `<span><i class="fas fa-box"></i> ${AppState.products[ticket.product]?.name || ticket.product}</span>` : ''}
                    <span><i class="fas fa-clock"></i> ${ticket.createdAt}</span>
                </div>
                <p class="ticket-message-preview">${ticket.message.substring(0, 100)}...</p>
            </div>
            <div class="ticket-actions">
                <span class="ticket-status status-${ticket.status}">${
                    ticket.status === 'open' ? 'Açık' : 
                    ticket.status === 'pending' ? 'Beklemede' : 'Kapalı'
                }</span>
                <button class="btn btn-sm btn-primary" onclick="viewTicketDetails(${ticket.id})">Detay</button>
            </div>
        </div>
    `).join('');
}

function filterAdminTickets(filter) {
    // Update active filter button
    document.querySelectorAll('#admin-panel .filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    loadAllTicketsForAdmin(filter);
}

function viewTicketDetails(ticketId) {
    const allUserTickets = JSON.parse(localStorage.getItem('all_tickets') || '[]');
    const ticket = allUserTickets.find(t => t.id === ticketId);
    
    if (!ticket) return;
    
    // Initialize attachment variables
    window.currentTicketId = ticketId;
    window.photoAttachments = window.photoAttachments || [];
    window.videoAttachment = window.videoAttachment || null;
    
    const modal = document.getElementById('ticket-detail-modal');
    const content = document.getElementById('ticket-detail-content');
    
    const categoryLabels = {
        technical: 'Teknik Destek',
        sales: 'Satış & Ödeme',
        product: 'Ürün Desteği',
        general: 'Genel'
    };
    
    // Load responses
    const responses = ticket.responses || [];
    const responsesHTML = responses.length > 0 
        ? responses.map(resp => `
            <div class="ticket-response ${resp.type}">
                <div class="response-header">
                    <span class="response-author">${resp.author}</span>
                    <span class="response-time">${resp.time}</span>
                </div>
                <div class="response-content">${resp.message}</div>
                ${resp.attachments ? `<div class="response-attachments">${resp.attachments}</div>` : ''}
            </div>
        `).join('')
        : '<p class="no-responses">Henüz yanıt yok.</p>';
    
    content.innerHTML = `
        <div class="ticket-detail">
            <h3>${ticket.subject}</h3>
            <div class="ticket-meta-detail">
                <p><strong>Kullanıcı:</strong> ${ticket.userEmail || 'Bilinmiyor'}</p>
                <p><strong>Kategori:</strong> ${categoryLabels[ticket.category] || ticket.category}</p>
                ${ticket.product ? `<p><strong>Ürün:</strong> ${AppState.products[ticket.product]?.name || ticket.product}</p>` : ''}
                <p><strong>Tarih:</strong> ${ticket.createdAt}</p>
                <p><strong>Durum:</strong> <span class="ticket-status status-${ticket.status}">${ticket.status === 'open' ? 'Açık' : ticket.status === 'pending' ? 'Beklemede' : 'Kapalı'}</span></p>
            </div>
            
            <div class="ticket-message-full">
                <h4>Mesaj:</h4>
                <p>${ticket.message}</p>
            </div>
            
            <div class="ticket-responses">
                <h4>Yanıtlar:</h4>
                <div id="ticket-responses-list">
                    ${responsesHTML}
                </div>
            </div>
            
            <div class="admin-reply-section">
                <h4>Admin Yanıtı:</h4>
                <textarea id="admin-reply-message" rows="4" placeholder="Yanıtınızı yazın..."></textarea>
                
                <div class="reply-attachments">
                    <div class="attachment-buttons">
                        <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('reply-photo').click()">
                            <i class="fas fa-image"></i> Fotoğraf Ekle
                        </button>
                        <button type="button" class="btn btn-secondary btn-sm" id="video-record-btn" onclick="toggleVideoRecord()">
                            <i class="fas fa-video"></i> Video Kaydet
                        </button>
                    </div>
                    
                    <input type="file" id="reply-photo" accept="image/*" multiple hidden onchange="previewPhotos(this)">
                    
                    <div id="video-recorder" class="hidden">
                        <video id="record-preview" autoplay muted></video>
                        <div class="record-controls">
                            <button type="button" class="btn btn-danger btn-sm" id="start-record" onclick="startVideoRecord()">
                                <i class="fas fa-circle"></i> Başlat
                            </button>
                            <button type="button" class="btn btn-warning btn-sm hidden" id="stop-record" onclick="stopVideoRecord()">
                                <i class="fas fa-stop"></i> Durdur
                            </button>
                            <span id="record-timer">00:00</span>
                        </div>
                    </div>
                    
                    <div id="attachment-preview" class="attachment-preview"></div>
                </div>
                
                <div class="reply-actions">
                    <button type="button" class="btn btn-success" onclick="sendAdminReply(${ticket.id})">
                        <i class="fas fa-paper-plane"></i> Yanıt Gönder
                    </button>
                </div>
            </div>
            
            <div class="ticket-status-actions">
                <h4>Durum Değiştir:</h4>
                <button class="btn btn-success" onclick="updateTicketStatus(${ticket.id}, 'open')">Açık</button>
                <button class="btn btn-warning" onclick="updateTicketStatus(${ticket.id}, 'pending')">Beklemede</button>
                <button class="btn btn-danger" onclick="updateTicketStatus(${ticket.id}, 'closed')">Kapat</button>
            </div>
        </div>
    `;
    
    // Store current ticket ID for file uploads
    window.currentTicketId = ticketId;
    window.photoAttachments = [];
    window.videoAttachment = null;
    
    openModal('ticket-detail-modal');
}

function previewPhotos(input) {
    const preview = document.getElementById('attachment-preview');
    if (!preview) return;
    
    // Ensure photoAttachments is initialized
    window.photoAttachments = window.photoAttachments || [];
    
    if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                window.photoAttachments.push(e.target.result);
                
                const photoDiv = document.createElement('div');
                photoDiv.className = 'attachment-item photo';
                photoDiv.innerHTML = `
                    <img src="${e.target.result}" alt="Photo">
                    <button type="button" class="remove-attachment" onclick="this.parentElement.remove(); removePhoto('${e.target.result}')">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                preview.appendChild(photoDiv);
            };
            reader.readAsDataURL(file);
        });
    }
}

function removePhoto(photoData) {
    window.photoAttachments = window.photoAttachments.filter(p => p !== photoData);
}

let mediaRecorder = null;
let recordedChunks = [];
let recordInterval = null;

function toggleVideoRecord() {
    const recorder = document.getElementById('video-recorder');
    recorder.classList.toggle('hidden');
}

async function startVideoRecord() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const video = document.getElementById('record-preview');
        video.srcObject = stream;
        
        mediaRecorder = new MediaRecorder(stream);
        recordedChunks = [];
        
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const videoURL = URL.createObjectURL(blob);
            window.videoAttachment = videoURL;
            
            const preview = document.getElementById('attachment-preview');
            const videoDiv = document.createElement('div');
            videoDiv.className = 'attachment-item video';
            videoDiv.innerHTML = `
                <video src="${videoURL}" controls></video>
                <span class="video-label">Video Kaydı</span>
                <button type="button" class="remove-attachment" onclick="this.parentElement.remove(); window.videoAttachment = null;">
                    <i class="fas fa-times"></i>
                </button>
            `;
            preview.appendChild(videoDiv);
            
            stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        
        document.getElementById('start-record').classList.add('hidden');
        document.getElementById('stop-record').classList.remove('hidden');
        
        // Timer
        let seconds = 0;
        document.getElementById('record-timer').textContent = '00:00';
        recordInterval = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            document.getElementById('record-timer').textContent = `${mins}:${secs}`;
            
            // Auto stop at 5 minutes
            if (seconds >= 300) {
                stopVideoRecord();
            }
        }, 1000);
        
    } catch (err) {
        showToast('Kamera erişimi reddedildi!', 'error');
        console.error('Camera error:', err);
    }
}

function stopVideoRecord() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    
    clearInterval(recordInterval);
    
    document.getElementById('start-record').classList.remove('hidden');
    document.getElementById('stop-record').classList.add('hidden');
    document.getElementById('record-timer').textContent = '00:00';
}

function sendAdminReply(ticketId) {
    const message = document.getElementById('admin-reply-message').value.trim();
    
    // Ensure photoAttachments is initialized
    window.photoAttachments = window.photoAttachments || [];
    
    if (!message && window.photoAttachments.length === 0 && !window.videoAttachment) {
        showToast('Lütfen bir mesaj veya dosya ekleyin!', 'warning');
        return;
    }
    
    let allUserTickets = JSON.parse(localStorage.getItem('all_tickets') || '[]');
    const ticketIndex = allUserTickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex === -1) return;
    
    // Build attachments HTML
    let attachmentsHTML = '';
    
    if (window.photoAttachments.length > 0) {
        attachmentsHTML += '<div class="photo-gallery">';
        window.photoAttachments.forEach(photo => {
            attachmentsHTML += `<img src="${photo}" alt="Attachment" class="response-photo">`;
        });
        attachmentsHTML += '</div>';
    }
    
    if (window.videoAttachment) {
        attachmentsHTML += `<video src="${window.videoAttachment}" controls class="response-video"></video>`;
    }
    
    const newResponse = {
        type: 'admin',
        author: 'Admin',
        time: new Date().toLocaleString('tr-TR'),
        message: message || 'Dosya eklendi',
        attachments: attachmentsHTML
    };
    
    if (!allUserTickets[ticketIndex].responses) {
        allUserTickets[ticketIndex].responses = [];
    }
    
    allUserTickets[ticketIndex].responses.push(newResponse);
    localStorage.setItem('all_tickets', JSON.stringify(allUserTickets));
    
    // Clear inputs safely
    const replyMessage = document.getElementById('admin-reply-message');
    if (replyMessage) replyMessage.value = '';
    
    const attachmentPreview = document.getElementById('attachment-preview');
    if (attachmentPreview) attachmentPreview.innerHTML = '';
    
    window.photoAttachments = [];
    window.videoAttachment = null;
    
    // Refresh modal
    viewTicketDetails(ticketId);
    
    showToast('Yanıt gönderildi!', 'success');
}

function updateTicketStatus(ticketId, newStatus) {
    let allUserTickets = JSON.parse(localStorage.getItem('all_tickets') || '[]');
    const ticketIndex = allUserTickets.findIndex(t => t.id === ticketId);
    
    if (ticketIndex !== -1) {
        allUserTickets[ticketIndex].status = newStatus;
        localStorage.setItem('all_tickets', JSON.stringify(allUserTickets));
        loadAllTicketsForAdmin();
        closeModal('ticket-detail-modal');
        showToast('Ticket durumu güncellendi!', 'success');
    }
}

// ==========================================
// DATA EXPORT/IMPORT
// ==========================================
function exportAllData() {
    const data = {
        users: JSON.parse(localStorage.getItem('tuneforge_users') || '[]'),
        tickets: JSON.parse(localStorage.getItem('all_tickets') || '[]'),
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `tuneforge_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('Veriler yedeklendi!', 'success');
}

function importAllData(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.users) {
                localStorage.setItem('tuneforge_users', JSON.stringify(data.users));
            }
            if (data.tickets) {
                localStorage.setItem('all_tickets', JSON.stringify(data.tickets));
            }
            
            showToast('Veriler geri yüklendi! Sayfa yenileniyor...', 'success');
            
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (err) {
            showToast('Dosya okunamadı! Geçersiz format.', 'error');
            console.error('Import error:', err);
        }
    };
    reader.readAsText(file);
    input.value = '';
}

// ==========================================
// TICKET SYSTEM
// ==========================================
function initTickets() {
    const newTicketBtn = document.getElementById('new-ticket-btn');
    const ticketModal = document.getElementById('ticket-modal');
    const ticketModalClose = document.getElementById('ticket-modal-close');
    
    // Open ticket modal
    newTicketBtn?.addEventListener('click', () => {
        openModal('ticket-modal');
    });
    
    // Close ticket modal
    ticketModalClose?.addEventListener('click', () => {
        closeModal('ticket-modal');
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            updateTicketsList(filter);
        });
    });
    
    // New ticket form
    document.getElementById('new-ticket-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!AppState.isLoggedIn) {
            showToast('Lütfen önce giriş yapın!', 'error');
            closeModal('ticket-modal');
            openModal('auth-modal');
            return;
        }
        
        const subject = document.getElementById('ticket-subject').value;
        const category = document.getElementById('ticket-category').value;
        const product = document.getElementById('ticket-product').value;
        const message = document.getElementById('ticket-message').value;
        
        const newTicket = {
            id: Date.now(),
            userId: AppState.currentUser.id,
            userEmail: AppState.currentUser.email,
            subject,
            category,
            product,
            status: 'open',
            createdAt: new Date().toLocaleString('tr-TR'),
            message
        };
        
        AppState.tickets.unshift(newTicket);
        
        // Also save to global tickets for admin view
        const allUserTickets = JSON.parse(localStorage.getItem('all_tickets') || '[]');
        allUserTickets.unshift(newTicket);
        localStorage.setItem('all_tickets', JSON.stringify(allUserTickets));
        
        updateTicketsList();
        updateTicketCounts();
        closeModal('ticket-modal');
        showToast('Ticket başarıyla oluşturuldu!', 'success');
        
        document.getElementById('new-ticket-form').reset();
    });
}

function updateTicketsList(filter = 'all') {
    const ticketsList = document.getElementById('tickets-list');
    if (!ticketsList) return;
    
    let filteredTickets = AppState.tickets;
    if (filter !== 'all') {
        filteredTickets = AppState.tickets.filter(t => t.status === filter);
    }
    
    if (filteredTickets.length === 0) {
        ticketsList.innerHTML = `
            <div class="no-tickets">
                <i class="fas fa-inbox"></i>
                <p>Henüz ticket bulunmuyor.</p>
            </div>
        `;
        return;
    }
    
    const categoryLabels = {
        technical: 'Teknik Destek',
        sales: 'Satış & Ödeme',
        product: 'Ürün Desteği',
        general: 'Genel'
    };
    
    ticketsList.innerHTML = filteredTickets.map(ticket => `
        <div class="ticket-item" onclick="viewUserTicketDetails(${ticket.id})" style="cursor: pointer;">
            <div class="ticket-info">
                <h4>${ticket.subject}</h4>
                <div class="ticket-meta">
                    <span><i class="fas fa-folder"></i> ${categoryLabels[ticket.category] || ticket.category}</span>
                    ${ticket.product ? `<span><i class="fas fa-box"></i> ${AppState.products[ticket.product]?.name || ticket.product}</span>` : ''}
                    <span><i class="fas fa-clock"></i> ${ticket.createdAt}</span>
                </div>
            </div>
            <span class="ticket-status status-${ticket.status}">${
                ticket.status === 'open' ? 'Açık' : 
                ticket.status === 'pending' ? 'Beklemede' : 'Kapalı'
            }</span>
        </div>
    `).join('');
}

// User Ticket Detail View
function viewUserTicketDetails(ticketId) {
    const allTickets = JSON.parse(localStorage.getItem('all_tickets') || '[]');
    const ticket = allTickets.find(t => t.id === ticketId);
    
    if (!ticket) return;
    
    const modal = document.getElementById('ticket-detail-modal');
    const content = document.getElementById('ticket-detail-content');
    
    const categoryLabels = {
        technical: 'Teknik Destek',
        sales: 'Satış & Ödeme',
        product: 'Ürün Desteği',
        general: 'Genel'
    };
    
    // Load responses
    const responses = ticket.responses || [];
    const responsesHTML = responses.length > 0 
        ? responses.map(resp => `
            <div class="ticket-response ${resp.type}">
                <div class="response-header">
                    <span class="response-author">${resp.author}</span>
                    <span class="response-time">${resp.time}</span>
                </div>
                <div class="response-content">${resp.message}</div>
                ${resp.attachments ? `<div class="response-attachments">${resp.attachments}</div>` : ''}
            </div>
        `).join('')
        : '<p class="no-responses">Henüz yanıt yok. En kısa sürede size dönüş yapılacak.</p>';
    
    content.innerHTML = `
        <div class="ticket-detail">
            <h3>${ticket.subject}</h3>
            <div class="ticket-meta-detail">
                <p><strong>Kategori:</strong> ${categoryLabels[ticket.category] || ticket.category}</p>
                ${ticket.product ? `<p><strong>Ürün:</strong> ${AppState.products[ticket.product]?.name || ticket.product}</p>` : ''}
                <p><strong>Tarih:</strong> ${ticket.createdAt}</p>
                <p><strong>Durum:</strong> <span class="ticket-status status-${ticket.status}">${ticket.status === 'open' ? 'Açık' : ticket.status === 'pending' ? 'Beklemede' : 'Kapalı'}</span></p>
            </div>
            
            <div class="ticket-message-full">
                <h4>Mesajınız:</h4>
                <p>${ticket.message}</p>
            </div>
            
            <div class="ticket-responses">
                <h4>Yanıtlar:</h4>
                <div id="ticket-responses-list">
                    ${responsesHTML}
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateTicketCounts() {
    const counts = {
        all: AppState.tickets.length,
        open: AppState.tickets.filter(t => t.status === 'open').length,
        pending: AppState.tickets.filter(t => t.status === 'pending').length,
        closed: AppState.tickets.filter(t => t.status === 'closed').length
    };
    
    document.getElementById('count-all').textContent = counts.all;
    document.getElementById('count-open').textContent = counts.open;
    document.getElementById('count-pending').textContent = counts.pending;
    document.getElementById('count-closed').textContent = counts.closed;
}

// ==========================================
// CHECKOUT MODAL
// ==========================================
function openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    const items = document.getElementById('checkout-items');
    const totalPrice = document.getElementById('checkout-total-price');
    
    let total = 0;
    items.innerHTML = AppState.cart.map(item => {
        total += item.price;
        return `
            <div class="checkout-item">
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
            </div>
        `;
    }).join('');
    
    totalPrice.textContent = `$${total.toFixed(2)}`;
    openModal('checkout-modal');
}

function initCheckout() {
    const checkoutModalClose = document.getElementById('checkout-modal-close');
    const cancelCheckout = document.getElementById('cancel-checkout');
    const checkoutForm = document.getElementById('checkout-form');
    
    checkoutModalClose?.addEventListener('click', () => closeModal('checkout-modal'));
    cancelCheckout?.addEventListener('click', () => closeModal('checkout-modal'));
    
    checkoutForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const notes = document.getElementById('checkout-notes').value;
        
        closeModal('checkout-modal');
        AppState.cart = [];
        updateCart();
        showToast('Siparişiniz alındı! En kısa sürede size dönüş yapacağız.', 'success');
    });
}

// ==========================================
// MODAL SYSTEM
// ==========================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function initModals() {
    // Close on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// ==========================================
// ANIMATED COUNTERS
// ==========================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        counter.textContent = target.toLocaleString();
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current).toLocaleString();
                    }
                }, 16);
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCustomCursor();
    initThreeJS();
    initNavigation();
    initCart();
    initAuth();
    initTickets();
    initCheckout();
    initModals();
    initCounters();
    
    // Initial updates
    if (AppState.isLoggedIn) {
        updateTicketsList();
        updateTicketCounts();
    }
    
    console.log('🚀 Tune Forge Next Gen initialized successfully!');
});
