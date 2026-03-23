/* ========================================
   Deepak Chandru S - Portfolio JavaScript
   Animations, Interactions & Effects
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initParticles();
    initNavigation();
    initTypewriter();
    initScrollAnimations();
    initCounters();
    initCursorGlow();
    initContactForm();
});

/* ========================================
   Particle Background
   ======================================== */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.3 + 0.1;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
            this.fadingIn = true;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.fadingIn) {
                this.opacity += this.fadeSpeed;
                if (this.opacity >= 0.4) this.fadingIn = false;
            } else {
                this.opacity -= this.fadeSpeed;
                if (this.opacity <= 0.05) this.reset();
            }
            
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(108, 92, 231, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Create particles
    const numParticles = Math.min(60, Math.floor((canvas.width * canvas.height) / 20000));
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
    
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.1;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(108, 92, 231, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        connectParticles();
        animationFrame = requestAnimationFrame(animate);
    }
    
    animate();
}

/* ========================================
   Navigation
   ======================================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollPos = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // Close mobile menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ========================================
   Typewriter Effect
   ======================================== */
function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;
    
    const texts = [
        'Laravel Full-Stack Developer',
        'REST API Architect',
        'PHP 8+ Specialist',
        'Server Management Expert',
        'Database Designer',
        'Problem Solver'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let speed = 100;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            speed = 50;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            speed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            speed = 500;
        }
        
        setTimeout(type, speed);
    }
    
    setTimeout(type, 1000);
}

/* ========================================
   Scroll Animations (Intersection Observer)
   ======================================== */
function initScrollAnimations() {
    // Add fade-in-up class to elements
    const animateElements = document.querySelectorAll(
        '.skill-category, .project-card, .timeline-item, .education-card, ' +
        '.contact-card, .about-text, .about-info-grid, .about-badges, ' +
        '.section-header, .about-avatar, .hero-content > *'
    );
    
    animateElements.forEach(el => {
        if (!el.classList.contains('fade-in-up')) {
            el.classList.add('fade-in-up');
        }
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
}

/* ========================================
   Counter Animation
   ======================================== */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
    
    function animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();
        const isDecimal = target % 1 !== 0;
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            
            element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = isDecimal ? target.toFixed(1) : target;
            }
        }
        
        requestAnimationFrame(update);
    }
}

/* ========================================
   Cursor Glow Effect
   ======================================== */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.matchMedia('(max-width: 768px)').matches) {
        if (glow) glow.style.display = 'none';
        return;
    }
    
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        
        requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
}

/* ========================================
   Contact Form
   ======================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const originalContent = btn.innerHTML;
        
        // Animate button
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
        btn.style.opacity = '0.7';
        
        // Simulate send
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = 'linear-gradient(135deg, #00cec9 0%, #00b894 100%)';
            
            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.background = '';
                form.reset();
            }, 3000);
        }, 1500);
    });
    
    // Input focus animation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.01)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
    });
}

/* ========================================
   Smooth Reveal on Page Load
   ======================================== */
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
