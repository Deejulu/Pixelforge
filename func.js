document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Stats Counter
    const stats = document.querySelectorAll('.stat-number');
    const animateStats = () => {
        stats.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            let current = 0;
            const increment = target / 100;
            const update = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(update);
                } else {
                    stat.textContent = target;
                }
            };
            update();
        });
    };

    const statsSection = document.querySelector('.stats');
    let statsAnimated = false;
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !statsAnimated) {
                animateStats();
                statsAnimated = true;
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    });

    // Service Card Toggle
    const serviceCards = document.querySelectorAll('.service-card__cta');
    serviceCards.forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('aria-controls');
            const details = document.getElementById(targetId);
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            this.setAttribute('aria-expanded', !isExpanded);
            details.setAttribute('aria-hidden', isExpanded);

            const icon = this.querySelector('.cta-icon');
            if (isExpanded) {
                icon.style.transform = 'rotate(0deg)';
                this.innerHTML = 'Learn More <svg class="cta-icon" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>';
            } else {
                icon.style.transform = 'rotate(90deg)';
                this.innerHTML = 'Show Less <svg class="cta-icon" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>';
            }
        });
    });

    // Scroll Animation Controller
    class ScrollAnimator {
        constructor() {
            this.sections = document.querySelectorAll('section');
            this.init();
        }

        init() {
            // Set up initial states
            this.setupInitialAnimations();

            // Add intersection observer for sections
            this.setupIntersectionObserver();
        }

        setupInitialAnimations() {
            this.sections.forEach(section => {
                const elements = section.querySelectorAll('.section-header, .service-card, .process-step, .team-member, .testimonial-card');
                gsap.set(elements, {
                    y: 50,
                    opacity: 0,
                    scale: 0.95
                });
            });
        }

        setupIntersectionObserver() {
            const observerOptions = {
                threshold: 0.2,
                rootMargin: '0px 0px -100px 0px'
            };

            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateSection(entry.target);
                        sectionObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            this.sections.forEach(section => {
                sectionObserver.observe(section);
            });
        }

        animateSection(section) {
            const elements = section.querySelectorAll('.section-header, .service-card, .process-step, .team-member, .testimonial-card');
            elements.forEach((element, index) => {
                gsap.to(element, {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: 'back.out(1.2)',
                    onStart: () => {
                        element.style.willChange = 'transform, opacity';
                    },
                    onComplete: () => {
                        element.style.willChange = 'auto';
                    }
                });
            });
        }
    }

    // Initialize GSAP and ScrollAnimator
    if (typeof gsap !== 'undefined') {
        new ScrollAnimator();
    } else {
        console.warn('GSAP is not loaded. Scroll animations will not work.');
        const gsapScript = document.createElement('script');
        gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js';
        gsapScript.onload = () => new ScrollAnimator();
        document.head.appendChild(gsapScript);
    }
});