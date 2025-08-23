// Modern Portfolio Carousel - Clean Implementation
class ModernCarousel {
    constructor() {
        this.carousels = [];
        this.config = {
            autoSlideInterval: 4000, // 4 seconds
            transitionDuration: 500,  // 0.5 seconds
            pauseOnHover: true,
            enableSwipe: true
        };
        // Disable autoplay by default; set to true to enable automatic sliding
        this.autoSlideEnabled = false;
        this.init();
    }

    init() {
        console.log('🎠 Initializing Modern Carousel System...');
        
        // Find all carousel containers
        const carouselElements = document.querySelectorAll('.portfolio-carousel');
        console.log(`📊 Found ${carouselElements.length} carousels to initialize`);

        carouselElements.forEach((element, index) => {
            this.createCarousel(element, index);
        });

        console.log(`✅ Successfully initialized ${this.carousels.length} carousels`);
        
    // Do not start carousels automatically when autoSlide is disabled
    if (this.autoSlideEnabled) this.startAllCarousels();
    }

    createCarousel(element, index) {
        const category = element.dataset.category || `carousel-${index}`;
        const slides = element.querySelectorAll('.carousel-slide');
        const indicators = element.querySelectorAll('.carousel-indicator');
        const prevButton = element.querySelector('.carousel-btn.prev');
        const nextButton = element.querySelector('.carousel-btn.next');

        if (slides.length === 0) {
            console.warn(`⚠️ No slides found for carousel: ${category}`);
            return;
        }

        const carousel = {
            id: category,
            element: element,
            slides: Array.from(slides),
            indicators: Array.from(indicators),
            prevButton: prevButton,
            nextButton: nextButton,
            currentIndex: 0,
            totalSlides: slides.length,
            isPlaying: false,
            isPaused: false,
            timer: null,
            touchStartX: 0,
            touchEndX: 0
        };

        // Initialize carousel state
        this.setActiveSlide(carousel, 0);
        this.attachEventListeners(carousel);
        this.carousels.push(carousel);

        console.log(`🎪 Created carousel: ${category} (${slides.length} slides)`);
        return carousel;
    }

    attachEventListeners(carousel) {
        const { element, prevButton, nextButton, indicators } = carousel;

        // Navigation buttons
        if (prevButton) {
            prevButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToPreviousSlide(carousel);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToNextSlide(carousel);
            });
        }

        // Indicator dots
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToSlide(carousel, index);
            });
        });

        // Hover pause/resume
        if (this.config.pauseOnHover) {
            element.addEventListener('mouseenter', () => this.pauseCarousel(carousel));
            element.addEventListener('mouseleave', () => this.resumeCarousel(carousel));
        }

        // Touch/swipe support
        if (this.config.enableSwipe) {
            this.attachSwipeListeners(carousel);
        }

        // Keyboard navigation
        element.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.goToPreviousSlide(carousel);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.goToNextSlide(carousel);
            }
        });

        // Make carousel focusable
        element.setAttribute('tabindex', '0');
    }

    attachSwipeListeners(carousel) {
        const { element } = carousel;

        element.addEventListener('touchstart', (e) => {
            carousel.touchStartX = e.touches[0].clientX;
        }, { passive: true });

        element.addEventListener('touchend', (e) => {
            carousel.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe(carousel);
        }, { passive: true });
    }

    handleSwipe(carousel) {
        const { touchStartX, touchEndX } = carousel;
        const swipeThreshold = 50; // Minimum distance for swipe
        const swipeDistance = touchStartX - touchEndX;

        if (Math.abs(swipeDistance) < swipeThreshold) return;

        if (swipeDistance > 0) {
            // Swiped left - next slide
            this.goToNextSlide(carousel);
        } else {
            // Swiped right - previous slide
            this.goToPreviousSlide(carousel);
        }
    }

    goToSlide(carousel, index) {
        if (index < 0 || index >= carousel.totalSlides || index === carousel.currentIndex) {
            return;
        }

        this.setActiveSlide(carousel, index);
        this.restartTimer(carousel);
        
        console.log(`📸 ${carousel.id}: Slide ${index + 1}/${carousel.totalSlides}`);
    }

    goToNextSlide(carousel) {
        const nextIndex = (carousel.currentIndex + 1) % carousel.totalSlides;
        this.goToSlide(carousel, nextIndex);
    }

    goToPreviousSlide(carousel) {
        const prevIndex = carousel.currentIndex === 0 
            ? carousel.totalSlides - 1 
            : carousel.currentIndex - 1;
        this.goToSlide(carousel, prevIndex);
    }

    setActiveSlide(carousel, index) {
        // Remove active class from current slide and indicator
        carousel.slides[carousel.currentIndex]?.classList.remove('active');
        carousel.indicators[carousel.currentIndex]?.classList.remove('active');

        // Update current index
        carousel.currentIndex = index;

        // Add active class to new slide and indicator
        carousel.slides[carousel.currentIndex]?.classList.add('active');
        carousel.indicators[carousel.currentIndex]?.classList.add('active');

        // Update ARIA attributes for accessibility
        carousel.slides.forEach((slide, i) => {
            slide.setAttribute('aria-hidden', i !== index ? 'true' : 'false');
            slide.setAttribute('tabindex', i !== index ? '-1' : '0');
        });
    }

    startCarousel(carousel) {
        if (!this.autoSlideEnabled) {
            console.log(`⛔ Auto-slide disabled; not starting carousel ${carousel.id}`);
            return;
        }

        if (carousel.isPlaying || carousel.isPaused) return;

        carousel.timer = setInterval(() => {
            if (!carousel.isPaused && !document.hidden) {
                this.goToNextSlide(carousel);
            }
        }, this.config.autoSlideInterval);

        carousel.isPlaying = true;
        console.log(`▶️ Started auto-slide: ${carousel.id}`);
    }

    pauseCarousel(carousel) {
        carousel.isPaused = true;
        console.log(`⏸️ Paused: ${carousel.id}`);
    }

    resumeCarousel(carousel) {
        carousel.isPaused = false;
        if (this.autoSlideEnabled && !carousel.isPlaying) {
            this.startCarousel(carousel);
        }
        console.log(`▶️ Resumed: ${carousel.id}`);
    }

    stopCarousel(carousel) {
        if (carousel.timer) {
            clearInterval(carousel.timer);
            carousel.timer = null;
        }
        carousel.isPlaying = false;
        carousel.isPaused = false;
        console.log(`⏹️ Stopped: ${carousel.id}`);
    }

    restartTimer(carousel) {
        if (this.autoSlideEnabled && carousel.isPlaying) {
            this.stopCarousel(carousel);
            this.startCarousel(carousel);
        }
    }

    startAllCarousels() {
        this.carousels.forEach(carousel => {
            this.startCarousel(carousel);
        });
        console.log(`🚀 Started ${this.carousels.length} carousels`);
    }

    stopAllCarousels() {
        this.carousels.forEach(carousel => {
            this.stopCarousel(carousel);
        });
        console.log(`🛑 Stopped all carousels`);
    }

    // Public API methods
    getCarousel(id) {
        return this.carousels.find(carousel => carousel.id === id);
    }

    getCarouselByElement(element) {
        return this.carousels.find(carousel => carousel.element === element);
    }

    // Handle page visibility changes
    handleVisibilityChange() {
        if (document.hidden) {
            this.carousels.forEach(carousel => {
                carousel.wasPlayingBeforeHidden = carousel.isPlaying;
                this.stopCarousel(carousel);
            });
        } else {
            this.carousels.forEach(carousel => {
                if (carousel.wasPlayingBeforeHidden) {
                    this.startCarousel(carousel);
                }
            });
        }
    }

    // Cleanup method
    destroy() {
        this.stopAllCarousels();
        this.carousels.forEach(carousel => {
            // Remove event listeners and clean up
            carousel.element.removeEventListener('mouseenter', this.pauseCarousel);
            carousel.element.removeEventListener('mouseleave', this.resumeCarousel);
        });
        this.carousels = [];
        console.log('🧹 Carousel system destroyed');
    }
}

// Initialize when DOM is ready
let modernCarousel;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM Ready - Initializing Modern Carousel');
    
    // Small delay to ensure CSS is loaded
    setTimeout(() => {
        modernCarousel = new ModernCarousel();
        
        // Make it globally available for debugging
        window.modernCarousel = modernCarousel;
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            modernCarousel.handleVisibilityChange();
        });
        
        // Expose debugging functions
        window.carouselDebug = {
            start: () => modernCarousel.startAllCarousels(),
            stop: () => modernCarousel.stopAllCarousels(),
            status: () => {
                modernCarousel.carousels.forEach(carousel => {
                    console.log(`${carousel.id}: ${carousel.isPlaying ? '▶️ Playing' : '⏹️ Stopped'} - Slide ${carousel.currentIndex + 1}/${carousel.totalSlides}`);
                });
            },
            next: (id) => {
                const carousel = modernCarousel.getCarousel(id);
                if (carousel) modernCarousel.goToNextSlide(carousel);
            }
        };
        
        console.log('🎉 Modern Carousel System Ready!');
        console.log('💡 Use carouselDebug.status() to check carousel status');
        
    }, 300);
});

// Auto-cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (modernCarousel) {
        modernCarousel.destroy();
    }
});
