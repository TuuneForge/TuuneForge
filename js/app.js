/**
 * TUUNEFORGE - NEXT GEN 3D APPLICATION
 * Features: Advanced 3D Background, Interactive Effects, Discord Integration
 */

// ==========================================
// 3D BACKGROUND SYSTEM (Canvas)
// ==========================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let connections = [];
let mouse = { x: 0, y: 0 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle3D {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1000;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.speedZ = Math.random() * 2 + 0.5;
        this.color = Math.random() > 0.5 ? '#6366f1' : '#06b6d4';
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.z -= this.speedZ;

        if (this.z <= 0) {
            this.z = 1000;
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
        }

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        const scale = 1000 / (1000 + this.z);
        const x2d = this.x * scale + (canvas.width / 2) * (1 - scale);
        const y2d = this.y * scale + (canvas.height / 2) * (1 - scale);
        const size = this.size * scale * 2;
        const alpha = this.opacity * scale;

        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function initParticles() {
    particles = [];
    const particleCount = window.innerWidth < 768 ? 80 : 150;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle3D());
    }
}

function drawConnections() {
    const maxConnections = 3;
    const connectionDistance = 100;

    particles.forEach((particle, i) => {
        let connections = 0;
        for (let j = i + 1; j < particles.length; j++) {
            if (connections >= maxConnections) break;
            
            const dx = particle.x - particles[j].x;
            const dy = particle.y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                const alpha = (1 - distance / connectionDistance) * 0.2;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
                connections++;
            }
        }
    });
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid effect
    const gridSize = 50;
    const gridAlpha = 0.03;
    ctx.strokeStyle = `rgba(99, 102, 241, ${gridAlpha})`;
    ctx.lineWidth = 1;

    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    drawConnections();
    requestAnimationFrame(animateParticles);
}

// ==========================================
// CUSTOM CURSOR SYSTEM
// ==========================================
const cursorGlow = document.querySelector('.cursor-glow');
const cursorDot = document.querySelector('.cursor-dot');
let cursorX = 0, cursorY = 0;
let currentX = 0, currentY = 0;

function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function animateCursor() {
        currentX += (cursorX - currentX) * 0.1;
        currentY += (cursorY - currentY) * 0.1;

        cursorGlow.style.left = currentX - 20 + 'px';
        cursorGlow.style.top = currentY - 20 + 'px';
        cursorDot.style.left = cursorX - 4 + 'px';
        cursorDot.style.top = cursorY - 4 + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const interactiveElements = document.querySelectorAll('button, a, .product-card, .feature-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorGlow.style.transform = 'scale(1.5)';
            cursorGlow.style.borderColor = '#f59e0b';
        });
        el.addEventListener('mouseleave', () => {
            cursorGlow.style.transform = 'scale(1)';
            cursorGlow.style.borderColor = '#6366f1';
        });
    });
}

// ==========================================
// ANIMATED COUNTERS
// ==========================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-num');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isFloat = target % 1 !== 0;
        const duration = 2000;
        const start = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            let current = easeProgress * target;
            
            if (isFloat) {
                counter.textContent = current.toFixed(1);
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                if (isFloat) {
                    counter.textContent = target.toFixed(1);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            }
        }
        
        requestAnimationFrame(updateCounter);
    });
}

// ==========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                if (entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.product-card, .feature-card, .stat-item, .desktop-text, .hero-stats').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// NAVIGATION SCROLL EFFECT
// ==========================================
function initNavScroll() {
    const nav = document.querySelector('.main-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(15, 15, 26, 0.95)';
            nav.style.padding = '0.8rem 5%';
        } else {
            nav.style.background = 'rgba(15, 15, 26, 0.8)';
            nav.style.padding = '1.2rem 5%';
        }
        
        lastScroll = currentScroll;
    });
}

// ==========================================
// DISCORD MODAL
// ==========================================
function openDiscord() {
    const modal = document.getElementById('discordModal');
    modal.classList.add('active');
    
    // Confetti effect
    createConfetti();
}

function closeModal() {
    const modal = document.getElementById('discordModal');
    modal.classList.remove('active');
}

// Close on overlay click
window.onclick = function(event) {
    const modal = document.getElementById('discordModal');
    if (event.target === modal) {
        closeModal();
    }
}

// ==========================================
// CONFETTI EFFECT
// ==========================================
function createConfetti() {
    const colors = ['#6366f1', '#06b6d4', '#f59e0b', '#10b981'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            position: fixed;
            left: ${Math.random() * 100}vw;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            z-index: 10001;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        const duration = Math.random() * 2 + 1;
        const delay = Math.random() * 0.5;
        
        confetti.animate([
            { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => confetti.remove();
    }
}

// ==========================================
// PRODUCT CARD HOVER EFFECTS
// ==========================================
function initProductCards() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ==========================================
// APP GAUGE ANIMATION
// ==========================================
function animateGauges() {
    const gauges = document.querySelectorAll('.gauge-val');
    
    setInterval(() => {
        gauges.forEach(gauge => {
            const base = parseInt(gauge.textContent);
            const variation = Math.floor(Math.random() * 10) - 5;
            let newVal = base + variation;
            newVal = Math.max(10, Math.min(95, newVal));
            gauge.textContent = newVal + '%';
        });
    }, 2000);
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// PARALLAX EFFECT
// ==========================================
function initParallax() {
    const hero3d = document.querySelector('.hero-3d');
    
    if (hero3d && !window.matchMedia('(pointer: coarse)').matches) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;
            
            hero3d.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    }
}

// ==========================================
// TYPEWRITER EFFECT FOR HERO
// ==========================================
function initTypewriter() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    
    const originalText = title.innerHTML;
    const texts = ['PERFORMANSI', 'GÜCÜ', 'HIZI'];
    let textIndex = 0;
    
    setInterval(() => {
        const glitchElements = document.querySelectorAll('.glitch');
        glitchElements.forEach((el, i) => {
            if (i === 0) {
                el.setAttribute('data-text', texts[textIndex]);
                el.textContent = texts[textIndex];
            }
        });
        textIndex = (textIndex + 1) % texts.length;
    }, 3000);
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    initParticles();
    animateParticles();
    initCursor();
    initScrollAnimations();
    initNavScroll();
    initProductCards();
    animateGauges();
    initParallax();
    initTypewriter();
});

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// Performance optimization
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            ticking = false;
        });
        ticking = true;
    }
});
