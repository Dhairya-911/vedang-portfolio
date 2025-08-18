// Advanced Performance Optimization JavaScript

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupImageLazyLoading();
        this.setupCarouselOptimization();
        this.setupPerformanceMonitoring();
        this.setupResourcePreloading();
    }

    // Intersection Observer for lazy loading
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Load gallery items
                    if (element.classList.contains('gallery-item')) {
                        element.classList.add('in-view');
                        this.loadImagesInElement(element);
                    }
                    
                    // Load portfolio items
                    if (element.classList.contains('portfolio-item')) {
                        this.loadCarouselImages(element);
                    }
                    
                    observer.unobserve(element);
                }
            });
        }, options);

        // Observe all gallery items
        document.querySelectorAll('.gallery-item, .portfolio-item').forEach(item => {
            observer.observe(item);
        });
    }

    // Enhanced image lazy loading
    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
                img.parentElement.classList.add('loaded');
            });

            // Fallback for browsers that don't support loading="lazy"
            if ('loading' in HTMLImageElement.prototype) {
                return;
            }

            // Polyfill for older browsers
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            imageObserver.observe(img);
        });
    }

    // Load images within an element
    loadImagesInElement(element) {
        const images = element.querySelectorAll('img');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    }

    // Optimize carousel image loading
    loadCarouselImages(portfolioItem) {
        const carousel = portfolioItem.querySelector('.portfolio-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.carousel-slide');
        const activeSlide = carousel.querySelector('.carousel-slide.active');
        
        // Load active slide image immediately
        if (activeSlide) {
            this.loadImagesInElement(activeSlide);
        }

        // Preload next slide
        const nextSlide = activeSlide?.nextElementSibling || slides[0];
        if (nextSlide) {
            setTimeout(() => this.loadImagesInElement(nextSlide), 500);
        }
    }

    // Carousel optimization
    setupCarouselOptimization() {
        const carousels = document.querySelectorAll('.portfolio-carousel');
        
        carousels.forEach(carousel => {
            let currentSlide = 0;
            const slides = carousel.querySelectorAll('.carousel-slide');
            
            if (slides.length <= 1) return;

            // Auto-advance carousel
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
                
                // Preload next image
                const nextSlide = slides[(currentSlide + 1) % slides.length];
                this.loadImagesInElement(nextSlide);
            }, 4000);
        });
    }

    // Performance monitoring
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('web-vital' in window) {
            this.monitorWebVitals();
        }

        // Monitor resource loading
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
            
            // Report slow loading
            if (loadTime > 3000) {
                console.warn('Slow page load detected');
                this.optimizeForSlowConnection();
            }
        });

        // Monitor memory usage
        if (performance.memory) {
            setInterval(() => {
                const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
                if (memoryUsage > 50) { // 50MB threshold
                    console.warn('High memory usage detected');
                    this.cleanupMemory();
                }
            }, 30000);
        }
    }

    // Resource preloading
    setupResourcePreloading() {
        // Preload critical resources
        const criticalImages = [
            './images/weddings/KPS-34.jpg',
            './images/concerts/P1110229.jpg',
            './images/food/Paneer Final 1.jpg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });

        // Preload fonts
        const fontUrls = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
            'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap'
        ];

        fontUrls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = url;
            link.onload = function() { this.rel = 'stylesheet'; };
            document.head.appendChild(link);
        });
    }

    // Optimize for slow connections
    optimizeForSlowConnection() {
        // Reduce image quality
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src && !img.dataset.optimized) {
                img.style.imageRendering = 'optimizeSpeed';
                img.dataset.optimized = 'true';
            }
        });

        // Disable non-essential animations
        document.body.classList.add('reduced-motion');
    }

    // Memory cleanup
    cleanupMemory() {
        // Remove non-visible images from DOM temporarily
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const rect = img.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (!isVisible && img.src) {
                img.dataset.src = img.src;
                img.removeAttribute('src');
            }
        });

        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }

    // Web Vitals monitoring
    monitorWebVitals() {
        // This would integrate with web-vitals library
        // For now, we'll monitor basic metrics
        
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    console.log('FCP:', entry.startTime);
                }
                if (entry.name === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime);
                }
            }
        }).observe({entryTypes: ['paint', 'largest-contentful-paint']});
    }
}

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}
