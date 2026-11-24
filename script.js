/* ================================================================
   SHAHMA CT — PORTFOLIO SCRIPTS
   Smooth scroll, typing animation, scroll reveals, form handling
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Element References ----
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navAnchors = document.querySelectorAll('[data-nav]');
    const typingTextEl = document.getElementById('typingText');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const reveals = document.querySelectorAll('.reveal');
    const statNumbers = document.querySelectorAll('.stat-number');

    // ================================================================
    // NAVBAR — Background on scroll
    // ================================================================
    let lastScroll = 0;

    function handleNavbarScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // ================================================================
    // MOBILE MENU — Hamburger toggle
    // ================================================================
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a nav link
    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ================================================================
    // ACTIVE NAV LINK — Scroll spy
    // ================================================================
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navAnchors.forEach(a => a.classList.remove('active'));
                const activeLink = document.querySelector(`[data-nav][href="#${sectionId}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink, { passive: true });

    // ================================================================
    // TYPING ANIMATION — Hero subtitle
    // ================================================================
    const typingPhrases = [
        'Software Developer',
        'MCA Graduate',
        'AI Enthusiast',
        'Web Developer',
        'Problem Solver',
        'Blockchain Explorer'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        const currentPhrase = typingPhrases[phraseIndex];

        if (isDeleting) {
            typingTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause before deleting
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % typingPhrases.length;
            typingSpeed = 300;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Start typing after hero animation
    setTimeout(typeEffect, 1500);

    // ================================================================
    // SCROLL REVEAL — Intersection Observer
    // ================================================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optionally unobserve after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));

    // ================================================================
    // STAT COUNTER — Animate numbers on scroll
    // ================================================================
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateStats();
            }
        });
    }, { threshold: 0.3 });

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        statsObserver.observe(aboutSection);
    }

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-count'));
            const isDecimal = target % 1 !== 0;
            const duration = 2000;
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const currentValue = eased * target;

                if (isDecimal) {
                    stat.textContent = currentValue.toFixed(2);
                } else {
                    stat.textContent = Math.floor(currentValue);
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = isDecimal ? target.toFixed(2) : target;
                }
            }

            requestAnimationFrame(updateCount);
        });
    }

    // ================================================================
    // CONTACT FORM — Validation & submission
    // ================================================================
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            // Basic validation
            if (!name || !email || !subject || !message) {
                showFormStatus('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showFormStatus('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = document.getElementById('contactSubmit');
            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'Sending...';

            setTimeout(() => {
                showFormStatus('Message sent successfully! I\'ll get back to you soon. ✨', 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = 'Send Message';
            }, 1500);
        });
    }

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;

        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.className = 'form-status';
        }, 5000);
    }

    // ================================================================
    // SMOOTH SCROLL — Enhanced smooth scrolling for all anchor links
    // ================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            
            if (targetEl) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ================================================================
    // HERO PHOTO FALLBACK — Show initials if photo is missing
    // ================================================================
    const heroPhoto = document.getElementById('heroPhoto');
    if (heroPhoto) {
        heroPhoto.addEventListener('error', function() {
            this.style.display = 'none';
            const wrapper = this.closest('.image-wrapper');
            
            // Create initials fallback
            const initials = document.createElement('div');
            initials.className = 'photo-initials';
            initials.textContent = 'SC';
            initials.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: var(--font-heading);
                font-size: 5rem;
                font-weight: 800;
                color: rgba(212, 149, 106, 0.6);
                background: linear-gradient(135deg, rgba(212, 149, 106, 0.1) 0%, rgba(184, 122, 80, 0.2) 100%);
                border-radius: 50%;
                position: relative;
                z-index: 2;
                border: 3px solid rgba(212, 149, 106, 0.3);
            `;
            wrapper.appendChild(initials);
        });
    }

    // ================================================================
    // SCROLL PROGRESS INDICATOR (optional visual flair)
    // ================================================================
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '';
                scrollIndicator.style.pointerEvents = '';
            }
        }, { passive: true });
    }

    // ================================================================
    // PARALLAX EFFECT — Subtle depth on hero shapes
    // ================================================================
    const shapes = document.querySelectorAll('.shape');

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 8;
            shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    }, { passive: true });

    // Initial nav scroll check
    handleNavbarScroll();
    highlightNavLink();
});
