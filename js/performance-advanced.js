// Advanced Performance Optimization for Vedang Cinematography Portfolio

class AdvancedPerformanceOptimizer {
    constructor() {
        this.isLowEndDevice = this.detectLowEndDevice();
        this.connectionSpeed = this.getConnectionSpeed();
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
        
        this.init();
    }

    init() {
        // Critical performance optimizations
        this.optimizeRenderingPerformance();
        this.setupImageOptimization();
        this.setupIntersectionObserver();
        this.setupResourceHints();
        this.optimizeAnimations();
        this.setupCriticalResourceLoading();
        
        // Defer non-critical optimizations
        requestIdleCallback(() => {
            this.setupAdvancedOptimizations();
        }, { timeout: 2000 });
    }

    detectLowEndDevice() {
        // Detect low-end devices based on various metrics
        const memory = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        const connection = navigator.connection;
        
        const isLowEnd = memory <= 2 || 
                        cores <= 2 || 
                        (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'));
        
        if (isLowEnd) {
            document.documentElement.classList.add('low-end-device');
        }
        
        return isLowEnd;
    }

    getConnectionSpeed() {
        const connection = navigator.connection;
        if (!connection) return 'unknown';
        
        return connection.effectiveType || 'unknown';
    }

    optimizeRenderingPerformance() {
        // Prevent layout thrashing
        const style = document.createElement('style');
        style.textContent = `
            * {
                will-change: auto;
            }
            
            .hero-title {
                contain: layout;
                will-change: contents;
            }
            
            .carousel-slide {
                contain: layout style;
                will-change: transform;
            }
            
            .portfolio-item {
                contain: layout;
            }
            
            img {
                content-visibility: auto;
                contain-intrinsic-size: 400px;
            }
        `;
        document.head.appendChild(style);
    }

    setupImageOptimization() {
        // Progressive image loading with blur-up technique
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    imageObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        images.forEach(img => imageObserver.observe(img));

        // Optimize existing images
        this.optimizeExistingImages();
    }

    loadImage(img) {
        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = tempImg.src;
            img.classList.add('loaded');
            img.classList.remove('loading');
        };
        tempImg.src = img.dataset.src;
    }

    optimizeExistingImages() {
        const images = document.querySelectorAll('img:not([data-src])');
        images.forEach(img => {
            if (!img.complete) {
                img.classList.add('loading');
                img.onload = () => {
                    img.classList.add('loaded');
                    img.classList.remove('loading');
                };
            } else {
                img.classList.add('loaded');
            }
        });
    }

    setupIntersectionObserver() {
        // Optimize animations and heavy content based on visibility
        const observerOptions = {
            root: null,
            rootMargin: '10px 0px',
            threshold: 0.1
        };

        const performanceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                
                if (entry.isIntersecting) {
                    element.classList.add('in-viewport');
                    this.activateSection(element);
                } else {
                    element.classList.remove('in-viewport');
                    this.deactivateSection(element);
                }
            });
        }, observerOptions);

        // Observe portfolio sections
        document.querySelectorAll('.portfolio-item, .carousel-container').forEach(el => {
            performanceObserver.observe(el);
        });
    }

    activateSection(element) {
        // Activate animations and interactions for visible sections
        if (element.classList.contains('carousel-container')) {
            const carousel = element.closest('.portfolio-carousel');
            if (carousel && window.PortfolioCarousel) {
                // Resume carousel auto-rotation if it exists
                const carouselInstance = carousel.carouselInstance;
                if (carouselInstance && carouselInstance.resumeAutoRotation) {
                    carouselInstance.resumeAutoRotation();
                }
            }
        }
    }

    deactivateSection(element) {
        // Pause non-critical animations for invisible sections
        if (element.classList.contains('carousel-container')) {
            const carousel = element.closest('.portfolio-carousel');
            if (carousel) {
                const carouselInstance = carousel.carouselInstance;
                if (carouselInstance && carouselInstance.pauseAutoRotation) {
                    carouselInstance.pauseAutoRotation();
                }
            }
        }
    }

    setupResourceHints() {
        // Dynamic resource hints based on user behavior
        const addResourceHint = (href, as, type = 'prefetch') => {
            const link = document.createElement('link');
            link.rel = type;
            link.href = href;
            if (as) link.as = as;
            document.head.appendChild(link);
        };

        // Prefetch critical resources
        if (this.connectionSpeed !== 'slow-2g' && this.connectionSpeed !== '2g') {
            // Prefetch next likely images based on scroll behavior
            setTimeout(() => {
                const portfolioImages = document.querySelectorAll('.portfolio-item img');
                portfolioImages.forEach((img, index) => {
                    if (index < 6) { // Prefetch first 6 images
                        addResourceHint(img.src, 'image');
                    }
                });
            }, 3000);
        }
    }

    optimizeAnimations() {
        // Reduce animations for low-end devices or user preference
        if (this.isLowEndDevice || this.prefersReducedMotion) {
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupCriticalResourceLoading() {
        // Load non-critical CSS asynchronously
        const loadCSS = (href, media = 'all') => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.media = 'print';
            link.onload = () => { link.media = media; };
            document.head.appendChild(link);
        };

        // Load non-critical stylesheets
        requestIdleCallback(() => {
            if (!this.isLowEndDevice) {
                loadCSS('css/gallery.css');
                loadCSS('css/scroll-performance.css');
            }
        });
    }

    setupAdvancedOptimizations() {
        // Advanced optimizations for better user experience
        this.optimizeScrollPerformance();
        this.setupBundlePreloading();
        this.optimizeMemoryUsage();
        this.setupPerformanceMonitoring();
    }

    optimizeScrollPerformance() {
        // Throttled scroll handler for better performance
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.onScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    onScroll() {
        // Optimize based on scroll position
        const scrollY = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollPercentage = scrollY / (documentHeight - windowHeight);

        // Progressive enhancement based on scroll position
        if (scrollPercentage > 0.3 && !document.body.classList.contains('content-loaded')) {
            document.body.classList.add('content-loaded');
            this.loadRemainingContent();
        }
    }

    loadRemainingContent() {
        // Load remaining non-critical content
        const deferredImages = document.querySelectorAll('img[data-defer]');
        deferredImages.forEach(img => {
            if (img.dataset.defer) {
                img.src = img.dataset.defer;
                img.removeAttribute('data-defer');
            }
        });
    }

    setupBundlePreloading() {
        // Intelligent bundle preloading
        if (this.connectionSpeed === '4g' || this.connectionSpeed === '3g') {
            setTimeout(() => {
                // Preload contact form functionality
                const link = document.createElement('link');
                link.rel = 'modulepreload';
                link.href = 'js/contact.js';
                document.head.appendChild(link);
            }, 5000);
        }
    }

    optimizeMemoryUsage() {
        // Clean up inactive carousel slides
        setInterval(() => {
            const carousels = document.querySelectorAll('.portfolio-carousel');
            carousels.forEach(carousel => {
                if (!carousel.matches(':hover') && !carousel.closest('.in-viewport')) {
                    const slides = carousel.querySelectorAll('.carousel-slide:not(.active)');
                    slides.forEach(slide => {
                        const img = slide.querySelector('img');
                        if (img && img.src && !img.dataset.originalSrc) {
                            img.dataset.originalSrc = img.src;
                            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNjY2MiLz48L3N2Zz4=';
                        }
                    });
                }
            });
        }, 10000);
    }

    setupPerformanceMonitoring() {
        // Monitor and report performance metrics
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log('LCP:', entry.startTime);
                    }
                    if (entry.entryType === 'layout-shift') {
                        console.log('CLS:', entry.value);
                    }
                });
            });

            observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });
        }

        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
                    console.warn('High memory usage detected');
                    this.triggerMemoryCleanup();
                }
            }, 30000);
        }
    }

    triggerMemoryCleanup() {
        // Force garbage collection and cleanup
        if (window.gc) {
            window.gc();
        }
        
        // Remove unused event listeners
        document.querySelectorAll('[data-cleanup]').forEach(el => {
            el.remove();
        });
    }
}

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedPerformanceOptimizer();
});

// Export for use by other modules
window.AdvancedPerformanceOptimizer = AdvancedPerformanceOptimizer;
