// GSAP Performance-Optimized Animations for Vedang Cinematography Portfolio

class GSAPAnimationsOptimized {
    constructor() {
        this.isMobile = this.detectMobile();
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    detectMobile() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init() {
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        
        // Set GSAP defaults for performance
        gsap.defaults({
            duration: this.isMobile ? 0.8 : 1.2,
            ease: this.isMobile ? "power2.out" : "power3.out"
        });

        // Configure GSAP for better performance
        gsap.config({
            autoSleep: 60,
            force3D: false, // Disable for better mobile performance
            nullTargetWarn: false
        });

        // Configure ScrollTrigger for performance
        ScrollTrigger.config({
            autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
            ignoreMobileResize: true
        });

        // Only initialize animations if motion is not reduced
        if (!this.reducedMotion) {
            this.initOptimizedAnimations();
        } else {
            this.initReducedMotionFallbacks();
        }
        
        console.log('🚀 GSAP Optimized Animations initialized');
    }

    initOptimizedAnimations() {
        this.initSmoothScrolling();
        this.initHeroAnimations();
        this.initScrollBasedAnimations();
        this.initNavigationAnimations();
    }

    initReducedMotionFallbacks() {
        // Show all elements immediately without animations
        gsap.set(".hero-title, .hero-subtitle, .hero-cta .btn", { opacity: 1, y: 0 });
        gsap.set(".gallery-item", { opacity: 1, y: 0 });
    }

    // Optimized smooth scrolling
    initSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    gsap.to(window, {
                        duration: this.isMobile ? 1 : 1.5,
                        scrollTo: {
                            y: target,
                            offsetY: 80
                        },
                        ease: "power2.inOut"
                    });
                }
            });
        });
    }

    // Simplified hero animations
    initHeroAnimations() {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroButtons = document.querySelectorAll('.hero-cta .btn');

        console.log('Hero elements found:', {
            title: !!heroTitle,
            subtitle: !!heroSubtitle,
            buttons: heroButtons.length
        });

        // Set initial state for all hero elements
        if (heroTitle) gsap.set(heroTitle, { y: this.isMobile ? 30 : 50, opacity: 0 });
        if (heroSubtitle) gsap.set(heroSubtitle, { y: this.isMobile ? 30 : 50, opacity: 0 });
        heroButtons.forEach(btn => gsap.set(btn, { y: this.isMobile ? 30 : 50, opacity: 0 }));

        // Simple stagger animation
        const heroElements = [heroTitle, heroSubtitle, ...heroButtons].filter(Boolean);
        
        if (heroElements.length > 0) {
            gsap.to(heroElements, {
                y: 0,
                opacity: 1,
                duration: this.isMobile ? 0.8 : 1.2,
                stagger: 0.2,
                ease: "power2.out",
                delay: 0.3,
                onComplete: () => {
                    console.log('✅ Hero animations completed');
                }
            });
        } else {
            console.warn('⚠️ No hero elements found for animation');
        }
    }

    // Optimized scroll-based animations
    initScrollBasedAnimations() {
        // Disable gallery animations during scroll for performance
        // Use lightweight intersection observer instead
        const galleryItems = document.querySelectorAll('.portfolio-item');
        
        if (galleryItems.length > 0) {
            // Always use intersection observer for better performance
            this.initIntersectionObserver(galleryItems);
        }

        // Simplified about section animation
        const aboutSection = document.querySelector('#about');
        if (aboutSection && !this.isMobile) {
            gsap.fromTo(aboutSection.children,
                {
                    y: 30,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: aboutSection,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }
    }

    // Intersection Observer for mobile performance
    initIntersectionObserver(elements) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.fromTo(entry.target,
                        {
                            y: 20,
                            opacity: 0
                        },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.6,
                            ease: "power2.out"
                        }
                    );
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(item => observer.observe(item));
    }

    // ScrollTrigger for desktop
    initScrollTriggerGallery(galleryItems) {
        galleryItems.forEach((item, index) => {
            gsap.fromTo(item,
                {
                    y: 40,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }

    // Simplified navigation animations
    initNavigationAnimations() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            let isOpen = false;
            
            menuToggle.addEventListener('click', () => {
                isOpen = !isOpen;
                
                if (isOpen) {
                    gsap.to(navMenu, {
                        autoAlpha: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                } else {
                    gsap.to(navMenu, {
                        autoAlpha: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        }
    }

    // Performance monitoring
    static measurePerformance() {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('🔍 Performance Metrics:');
        
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
        
        console.log(`Page Load Time: ${loadTime > 0 ? loadTime : 'N/A'}ms`);
        console.log(`DOM Ready: ${domTime > 0 ? domTime : 'N/A'}ms`);
        
        // Monitor FPS
        let lastTime = performance.now();
        let frames = 0;
        
        function measureFPS() {
            const currentTime = performance.now();
            frames++;
            
            if (currentTime - lastTime >= 1000) {
                console.log(`FPS: ${frames}`);
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        }
        
        requestAnimationFrame(measureFPS);
    }
}

// Initialize optimized animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GSAPAnimationsOptimized();
    
    // Measure performance in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        GSAPAnimationsOptimized.measurePerformance();
    }
});

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        gsap.globalTimeline.pause();
    } else {
        // Resume animations when tab becomes visible
        gsap.globalTimeline.resume();
    }
});
