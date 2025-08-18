// GSAP Smooth Scrolling and Animations for Vedang Cinematography Portfolio

class GSAPAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        
        // Initialize all animations
        this.initSmoothScrolling();
        this.initScrollTriggerAnimations();
        this.initHeroAnimations();
        this.initPortfolioAnimations();
        this.initNavigationAnimations();
        this.initPageTransitions();
        
        console.log('🎬 GSAP Animations initialized');
    }

    // Smooth scrolling for navigation links
    initSmoothScrolling() {
        // Smooth scroll for all anchor links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: {
                            y: target,
                            offsetY: 80 // Account for fixed header
                        },
                        ease: "power2.inOut"
                    });
                }
            });
        });

        // Smooth scroll for CTA buttons
        const ctaButtons = document.querySelectorAll('.btn[href^="#"]');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    gsap.to(window, {
                        duration: 2,
                        scrollTo: {
                            y: target,
                            offsetY: 80
                        },
                        ease: "power3.inOut"
                    });
                }
            });
        });
    }

    // Hero section animations
    initHeroAnimations() {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroButtons = document.querySelectorAll('.hero-cta .btn');
        const heroImage = document.querySelector('.hero-image');

        // Create timeline for hero animations
        const heroTl = gsap.timeline({
            delay: 0.5
        });

        if (heroTitle) {
            heroTl.fromTo(heroTitle, 
                {
                    y: 100,
                    opacity: 0,
                    scale: 0.8
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1.2,
                    ease: "power3.out"
                }
            );
        }

        if (heroSubtitle) {
            heroTl.fromTo(heroSubtitle,
                {
                    y: 50,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out"
                },
                "-=0.8"
            );
        }

        if (heroButtons.length > 0) {
            heroTl.fromTo(heroButtons,
                {
                    y: 30,
                    opacity: 0,
                    scale: 0.9
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "back.out(1.7)"
                },
                "-=0.5"
            );
        }

        if (heroImage) {
            heroTl.fromTo(heroImage,
                {
                    x: 100,
                    opacity: 0,
                    scale: 0.9
                },
                {
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1.5,
                    ease: "power3.out"
                },
                "-=1.2"
            );
        }
    }

    // Portfolio section animations
    initPortfolioAnimations() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        const sectionTitle = document.querySelector('#portfolio .section-title');
        const sectionSubtitle = document.querySelector('#portfolio .section-subtitle');

        // Animate section header
        if (sectionTitle) {
            gsap.fromTo(sectionTitle,
                {
                    y: 50,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionTitle,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        if (sectionSubtitle) {
            gsap.fromTo(sectionSubtitle,
                {
                    y: 30,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionSubtitle,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // Animate portfolio items
        portfolioItems.forEach((item, index) => {
            gsap.fromTo(item,
                {
                    y: 100,
                    opacity: 0,
                    scale: 0.9
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        end: "bottom 15%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Hover animations for portfolio items
            item.addEventListener('mouseenter', () => {
                gsap.to(item, {
                    scale: 1.02,
                    y: -10,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                const image = item.querySelector('.portfolio-image');
                if (image) {
                    gsap.to(image, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                const image = item.querySelector('.portfolio-image');
                if (image) {
                    gsap.to(image, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        });
    }

    // Navigation animations
    initNavigationAnimations() {
        const header = document.querySelector('.header');
        const navLinks = document.querySelectorAll('.nav-link');
        const brandTitle = document.querySelector('.brand-title');
        const brandSubtitle = document.querySelector('.brand-subtitle');

        // Header entrance animation
        if (header) {
            gsap.fromTo(header,
                {
                    y: -100,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    delay: 0.2
                }
            );
        }

        // Brand text animations
        if (brandTitle) {
            gsap.fromTo(brandTitle,
                {
                    x: -50,
                    opacity: 0
                },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    delay: 0.5
                }
            );
        }

        if (brandSubtitle) {
            gsap.fromTo(brandSubtitle,
                {
                    x: -30,
                    opacity: 0
                },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: 0.7
                }
            );
        }

        // Nav links entrance
        if (navLinks.length > 0) {
            gsap.fromTo(navLinks,
                {
                    y: -30,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                    delay: 0.8
                }
            );
        }

        // Header hide/show on scroll
        let lastScrollY = 0;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                if (currentScrollY > lastScrollY) {
                    // Scrolling down - hide header
                    gsap.to(header, {
                        y: -100,
                        duration: 0.3,
                        ease: "power2.inOut"
                    });
                } else {
                    // Scrolling up - show header
                    gsap.to(header, {
                        y: 0,
                        duration: 0.3,
                        ease: "power2.inOut"
                    });
                }
            }
            
            lastScrollY = currentScrollY;
        });
    }

    // Scroll-triggered animations for various sections
    initScrollTriggerAnimations() {
        // About section animations
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            gsap.fromTo(aboutSection.children,
                {
                    y: 80,
                    opacity: 0,
                    stagger: 0.2
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: aboutSection,
                        start: "top 75%",
                        end: "bottom 25%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        // Contact section animations
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            const contactForm = contactSection.querySelector('.contact-form');
            const contactInfo = contactSection.querySelector('.contact-info');

            if (contactForm) {
                gsap.fromTo(contactForm,
                    {
                        x: -50,
                        opacity: 0
                    },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: contactForm,
                            start: "top 80%",
                            end: "bottom 20%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }

            if (contactInfo) {
                gsap.fromTo(contactInfo,
                    {
                        x: 50,
                        opacity: 0
                    },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: contactInfo,
                            start: "top 80%",
                            end: "bottom 20%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        }

        // Parallax effect for hero section
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            gsap.to(heroImage, {
                yPercent: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: heroImage,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
    }

    // Page transition effects
    initPageTransitions() {
        // Add loading animation for page
        const pageWrapper = document.querySelector('.page-wrapper');
        
        if (pageWrapper) {
            gsap.fromTo(pageWrapper,
                {
                    opacity: 0,
                    scale: 1.05
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "power2.out"
                }
            );
        }

        // Button hover animations
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        // Form field animations
        const formFields = document.querySelectorAll('input, textarea, select');
        formFields.forEach(field => {
            field.addEventListener('focus', () => {
                gsap.to(field, {
                    scale: 1.02,
                    borderColor: '#007bff',
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            field.addEventListener('blur', () => {
                gsap.to(field, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    // Method to add reveal animation to any element
    addRevealAnimation(selector, options = {}) {
        const elements = document.querySelectorAll(selector);
        const defaultOptions = {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.1,
            trigger: null,
            start: "top 80%",
            end: "bottom 20%"
        };

        const config = { ...defaultOptions, ...options };

        elements.forEach((element, index) => {
            gsap.fromTo(element,
                {
                    y: config.y,
                    opacity: config.opacity
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: config.duration,
                    ease: config.ease,
                    delay: config.stagger * index,
                    scrollTrigger: {
                        trigger: config.trigger || element,
                        start: config.start,
                        end: config.end,
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    // Method to refresh ScrollTrigger (useful for dynamic content)
    refreshScrollTrigger() {
        ScrollTrigger.refresh();
    }

    // Method to kill all ScrollTrigger instances
    killScrollTrigger() {
        ScrollTrigger.killAll();
    }
}

// Initialize GSAP animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gsapAnimations = new GSAPAnimations();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GSAPAnimations;
}
