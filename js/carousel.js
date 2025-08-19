// Portfolio Carousel Manager
class PortfolioCarousel {
    constructor() {
        this.carousels = new Map();
        this.autoSlideInterval = 2500; // 2.5 seconds
        this.init();
    }

    init() {
        // Initialize all carousels
        document.querySelectorAll('.portfolio-carousel').forEach(carousel => {
            this.setupCarousel(carousel);
        });
    }

    setupCarousel(carousel) {
        const category = carousel.dataset.category;
        const slides = carousel.querySelectorAll('.carousel-slide');
        const indicators = carousel.querySelectorAll('.indicator');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');

        if (slides.length === 0) return;

        const carouselData = {
            element: carousel,
            slides: slides,
            indicators: indicators,
            currentSlide: 0,
            totalSlides: slides.length,
            autoSlideTimer: null,
            isPlaying: true
        };

        // Store carousel data
        this.carousels.set(category, carouselData);

        // Setup event listeners
        this.setupEventListeners(carouselData, prevBtn, nextBtn);

        // Start auto-slide
        this.startAutoSlide(carouselData);

        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            this.pauseAutoSlide(carouselData);
        });

        carousel.addEventListener('mouseleave', () => {
            this.startAutoSlide(carouselData);
        });
    }

    setupEventListeners(carouselData, prevBtn, nextBtn) {
        // Previous button
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.previousSlide(carouselData);
            });
        }

        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.nextSlide(carouselData);
            });
        }

        // Indicator clicks
        carouselData.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.goToSlide(carouselData, index);
            });
        });

        // Touch/swipe support for mobile
        let startX = 0;
        let endX = 0;

        carouselData.element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        carouselData.element.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.nextSlide(carouselData);
                } else {
                    this.previousSlide(carouselData);
                }
            }
        });
    }

    goToSlide(carouselData, slideIndex) {
        // Remove active class from current slide and indicator
        carouselData.slides[carouselData.currentSlide].classList.remove('active');
        carouselData.indicators[carouselData.currentSlide].classList.remove('active');

        // Update current slide index
        carouselData.currentSlide = slideIndex;

        // Add active class to new slide and indicator
        carouselData.slides[carouselData.currentSlide].classList.add('active');
        carouselData.indicators[carouselData.currentSlide].classList.add('active');

        // Restart auto-slide timer
        this.restartAutoSlide(carouselData);
    }

    nextSlide(carouselData) {
        const nextIndex = (carouselData.currentSlide + 1) % carouselData.totalSlides;
        this.goToSlide(carouselData, nextIndex);
    }

    previousSlide(carouselData) {
        const prevIndex = carouselData.currentSlide === 0 
            ? carouselData.totalSlides - 1 
            : carouselData.currentSlide - 1;
        this.goToSlide(carouselData, prevIndex);
    }

    startAutoSlide(carouselData) {
        if (carouselData.autoSlideTimer) {
            clearInterval(carouselData.autoSlideTimer);
        }

        carouselData.autoSlideTimer = setInterval(() => {
            if (carouselData.isPlaying) {
                this.nextSlide(carouselData);
            }
        }, this.autoSlideInterval);

        carouselData.isPlaying = true;
    }

    pauseAutoSlide(carouselData) {
        carouselData.isPlaying = false;
    }

    restartAutoSlide(carouselData) {
        this.startAutoSlide(carouselData);
    }

    // Public methods for external control
    pauseAll() {
        this.carousels.forEach(carouselData => {
            this.pauseAutoSlide(carouselData);
        });
    }

    resumeAll() {
        this.carousels.forEach(carouselData => {
            this.startAutoSlide(carouselData);
        });
    }

    // Pause carousels when page is not visible
    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseAll();
        } else {
            this.resumeAll();
        }
    }

    // Initialize intersection observer to pause off-screen carousels
    initIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const category = entry.target.dataset.category;
                    const carouselData = this.carousels.get(category);
                    
                    if (carouselData) {
                        if (entry.isIntersecting) {
                            this.startAutoSlide(carouselData);
                        } else {
                            this.pauseAutoSlide(carouselData);
                        }
                    }
                });
            }, {
                threshold: 0.3 // Trigger when 30% of carousel is visible
            });

            // Observe all carousels
            document.querySelectorAll('.portfolio-carousel').forEach(carousel => {
                observer.observe(carousel);
            });
        }
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const portfolioCarousel = new PortfolioCarousel();
    
    // Setup visibility change listener
    document.addEventListener('visibilitychange', () => {
        portfolioCarousel.handleVisibilityChange();
    });
    
    // Initialize intersection observer for performance
    portfolioCarousel.initIntersectionObserver();
    
    // Make it globally available
    window.portfolioCarousel = portfolioCarousel;
});

// Preload carousel images for better performance
class CarouselImagePreloader {
    constructor() {
        this.preloadedImages = new Set();
        this.init();
    }

    init() {
        // Preload images after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.preloadCarouselImages();
            }, 1000);
        });
    }

    preloadCarouselImages() {
        const carousels = document.querySelectorAll('.portfolio-carousel');
        
        carousels.forEach(carousel => {
            const slides = carousel.querySelectorAll('.carousel-slide img');
            
            slides.forEach((img, index) => {
                // Preload first few images immediately, others with delay
                const delay = index === 0 ? 0 : index * 200;
                
                setTimeout(() => {
                    this.preloadImage(img.src);
                }, delay);
            });
        });
    }

    preloadImage(src) {
        if (this.preloadedImages.has(src)) return;
        
        const img = new Image();
        img.onload = () => {
            this.preloadedImages.add(src);
        };
        img.src = src;
    }
}

// Initialize image preloader
new CarouselImagePreloader();
