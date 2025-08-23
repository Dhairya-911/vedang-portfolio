// Optimized Main JavaScript for Vedang Cinematography Portfolio

// Performance-optimized portfolio manager
class OptimizedPortfolio {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
        this.initHeroTextAnimation();
    }

    init() {
        // Use requestIdleCallback for non-critical initialization
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.initPortfolioFilters();
                this.initIntersectionObserver();
                this.initScrollOptimizations();
            });
        } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(() => {
                this.initPortfolioFilters();
                this.initIntersectionObserver();
                this.initScrollOptimizations();
            }, 100);
        }

        // Initialize critical features immediately
        this.initNavigation();
        this.initSmoothScrolling();
        this.initContactForm();
    }

    // Hero text animation
    initHeroTextAnimation() {
        const heroTitle = document.getElementById('heroTitle');
        if (!heroTitle) return;

        // Prevent any interaction
        heroTitle.style.userSelect = 'none';
        heroTitle.style.webkitUserSelect = 'none';
        heroTitle.style.mozUserSelect = 'none';
        heroTitle.style.msUserSelect = 'none';
        heroTitle.style.pointerEvents = 'none';
        heroTitle.setAttribute('unselectable', 'on');

        const texts = [
            'CINEMATIC STORYTELLING',
            'VISUAL EXCELLENCE', 
            'CREATIVE VIDEOGRAPHY',
            'PROFESSIONAL FILMING',
            'ARTISTIC VISION',
            'CINEMATIC MASTERY'
        ];

        let currentIndex = 0;

        const changeText = () => {
            currentIndex = (currentIndex + 1) % texts.length;
            
            // Use GSAP to animate the entire title element
            gsap.to(heroTitle, {
                opacity: 0,
                duration: 0.4,
                ease: "power2.inOut",
                onComplete: () => {
                    heroTitle.textContent = texts[currentIndex];
                    gsap.to(heroTitle, {
                        opacity: 1,
                        duration: 0.4,
                        ease: "power2.inOut"
                    });
                }
            });
        };

        // Start animation after initial delay
        setTimeout(() => {
            setInterval(changeText, 3000);
        }, 2000);
    }

    // Optimized portfolio filters
    initPortfolioFilters() {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        const portfolioSection = document.querySelector('#portfolio .section-header');
        
        if (!portfolioGrid || !portfolioSection) return;

        // Create filter buttons with minimal DOM manipulation
        const filterContainer = document.createElement('div');
        filterContainer.className = 'portfolio-filters';
        filterContainer.innerHTML = `
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="weddings">Weddings</button>
            <button class="filter-btn" data-filter="events">Events</button>
            <button class="filter-btn" data-filter="concerts">Concerts</button>
            <button class="filter-btn" data-filter="food">Food</button>
        `;

        portfolioSection.appendChild(filterContainer);

        // Optimized filter event handling
        filterContainer.addEventListener('click', (e) => {
            if (!e.target.classList.contains('filter-btn')) return;

            const filter = e.target.dataset.filter;
            const items = portfolioGrid.querySelectorAll('.portfolio-item');

            // Update active button
            filterContainer.querySelectorAll('.filter-btn').forEach(btn => 
                btn.classList.remove('active'));
            e.target.classList.add('active');

            // Filter items with optimized transitions
            this.filterPortfolioItems(items, filter);
        });
    }

    filterPortfolioItems(items, filter) {
        // Use different animation strategies for mobile vs desktop
        if (this.isMobile) {
            // Simple show/hide for mobile without transitions
            items.forEach((item) => {
                const category = item.dataset.category;
                const shouldShow = filter === 'all' || category === filter;
                
                if (shouldShow) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                } else {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                }
            });
        } else {
            // Smooth animations for desktop
            items.forEach((item, index) => {
                const category = item.dataset.category;
                const shouldShow = filter === 'all' || category === filter;

                if (shouldShow) {
                    item.style.display = 'block';
                    if (!this.reducedMotion) {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 50);
                    } else {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, this.reducedMotion ? 0 : 300);
                }
            });
        }
    }

    // Intersection Observer for performance
    initIntersectionObserver() {
        const observerOptions = {
            threshold: this.isMobile ? 0.05 : 0.1,
            rootMargin: this.isMobile ? '20px 0px -20px 0px' : '50px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Load images lazily - more aggressive on mobile
                    const images = entry.target.querySelectorAll('img[loading="lazy"]');
                    images.forEach(img => {
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                    });

                    // Disconnect observer on mobile to save resources
                    if (this.isMobile) {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe different elements based on device
        const elementsToObserve = this.isMobile 
            ? document.querySelectorAll('.portfolio-item, #contact')
            : document.querySelectorAll('.portfolio-item, .about, #contact');
            
        elementsToObserve.forEach(el => observer.observe(el));
    }

    // Optimized navigation
    initNavigation() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!menuToggle || !navMenu) return;

        let isMenuOpen = false;

        menuToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            menuToggle.classList.toggle('active', isMenuOpen);
            navMenu.classList.toggle('active', isMenuOpen);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                isMenuOpen = false;
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Smooth scroll for navigation links with GSAP
        navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    
                    // Use GSAP ScrollToPlugin for smooth scrolling
                    gsap.to(window, {
                        duration: 1.2,
                        scrollTo: {
                            y: targetElement,
                            offsetY: headerHeight
                        },
                        ease: "power2.inOut"
                    });

                    // Close mobile menu
                    if (this.isMobile) {
                        isMenuOpen = false;
                        menuToggle.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            }
        });
    }

    // Initialize smooth scrolling for all anchor links
    initSmoothScrolling() {
        // Handle all anchor links that point to sections on the same page
        document.addEventListener('click', (e) => {
            // Check if clicked element is an anchor link
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            
            // Use GSAP ScrollToPlugin for smooth scrolling
            gsap.to(window, {
                duration: 1.2,
                scrollTo: {
                    y: targetElement,
                    offsetY: headerHeight
                },
                ease: "power2.inOut"
            });
        });
    }

    // Optimized contact form
    initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData);

                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    this.showNotification('Message sent successfully!', 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                this.showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Optimized scroll behavior
    initScrollOptimizations() {
        let scrollTimeout;
        let isScrolling = false;

        const handleScroll = () => {
            if (!isScrolling) {
                document.body.classList.add('scrolling');
                isScrolling = true;
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('scrolling');
                isScrolling = false;
            }, 150);
        };

        // Throttled scroll listener
        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });
        
        // Debounced resize handler for mobile optimization
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.isMobile = window.innerWidth <= 768;
                
                // Reinitialize if device type changed
                if (wasMobile !== this.isMobile) {
                    console.log('Device type changed, reinitializing...');
                    this.reinitializeForDevice();
                }
            }, 250);
        }, { passive: true });
    }
    
    // Reinitialize components when switching between mobile/desktop
    reinitializeForDevice() {
        console.log('📱 Device switch detected - reinitializing components');
        // Additional device-specific reinitializations can be added here
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Performance monitoring
    static measurePerformance() {
        if (typeof performance !== 'undefined' && performance.getEntriesByType) {
            const navigationEntries = performance.getEntriesByType('navigation');
            if (navigationEntries.length > 0) {
                const nav = navigationEntries[0];
                console.log('🔍 Page Performance Metrics:');
                
                const domTime = nav.domContentLoadedEventEnd - nav.navigationStart;
                const loadTime = nav.loadEventEnd - nav.navigationStart;
                const firstPaint = nav.responseStart - nav.navigationStart;
                
                console.log(`DOM Content Loaded: ${domTime > 0 ? Math.round(domTime) : 'N/A'}ms`);
                console.log(`Page Load Complete: ${loadTime > 0 ? Math.round(loadTime) : 'N/A'}ms`);
                console.log(`First Paint: ${firstPaint > 0 ? Math.round(firstPaint) : 'N/A'}ms`);
            }
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new OptimizedPortfolio();
    
    // Initialize GSAP animations with retry mechanism
    const initGSAP = () => {
        if (typeof GSAPAnimationsOptimized !== 'undefined' && typeof gsap !== 'undefined') {
            new GSAPAnimationsOptimized();
            console.log('✅ GSAP Animations initialized');
        } else {
            console.log('⏳ Waiting for GSAP to load...');
            setTimeout(initGSAP, 100);
        }
    };
    
    // Try to initialize GSAP immediately, with fallback
    initGSAP();
    
    // Performance monitoring in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        OptimizedPortfolio.measurePerformance();
    }
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any intensive operations when tab is hidden
        console.log('Tab hidden - pausing operations');
    } else {
        // Resume operations when tab becomes visible
        console.log('Tab visible - resuming operations');
    }
});

// Final fallback for GSAP animations on window load
window.addEventListener('load', () => {
    // Double-check GSAP animations are running
    if (typeof GSAPAnimationsOptimized !== 'undefined' && typeof gsap !== 'undefined') {
        // Force re-initialize hero animations if they haven't run
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && gsap.getProperty(heroTitle, 'opacity') === 0) {
            console.log('🔄 Re-initializing hero animations');
            const gsapInstance = new GSAPAnimationsOptimized();
        }
    }
});
