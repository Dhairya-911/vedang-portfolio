// Dynamic JavaScript for Vedang Cinematography Portfolio

// Portfolio data for dynamic content
const portfolioData = {
    weddings: {
        title: "Wedding Films",
        description: "Cinematic wedding films that tell your love story with artistic vision and emotional depth.",
        items: [
            { title: "Romantic Garden Wedding", description: "Ethereal outdoor ceremony captured in golden hour", category: "ceremony", featured: true },
            { title: "Traditional Indian Wedding", description: "Rich cultural celebration with vibrant cinematography", category: "cultural", featured: false },
            { title: "Intimate Beach Wedding", description: "Coastal romance with natural lighting", category: "intimate", featured: true },
            { title: "Destination Wedding Film", description: "Multi-day celebration in exotic location", category: "destination", featured: false }
        ]
    },
    events: {
        title: "Event Films",
        description: "Dynamic event cinematography capturing the energy and essence of live experiences.",
        items: [
            { title: "Corporate Conference", description: "Professional multi-camera event coverage", category: "corporate", featured: true },
            { title: "Music Festival", description: "Multi-day festival documentation", category: "festival", featured: false },
            { title: "Award Ceremony", description: "Prestigious event with live streaming", category: "ceremony", featured: true },
            { title: "Product Launch", description: "High-energy brand reveal event", category: "launch", featured: false }
        ]
    },
    corporate: {
        title: "Corporate Films",
        description: "Professional corporate storytelling that showcases your brand and values.",
        items: [
            { title: "Company Profile", description: "Comprehensive brand story documentary", category: "profile", featured: true },
            { title: "Executive Interview", description: "Leadership insight series", category: "interview", featured: false },
            { title: "Training Video", description: "Educational content for employee development", category: "training", featured: true },
            { title: "Annual Report", description: "Visual business performance narrative", category: "report", featured: false }
        ]
    }
};

// Dynamic typing animation
class TypeWriter {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = Array.isArray(texts) ? texts : [texts];
        this.speed = speed;
        this.currentText = 0;
        this.currentChar = 0;
        this.isDeleting = false;
    }

    type() {
        const current = this.texts[this.currentText];
        
        if (this.isDeleting) {
            this.element.textContent = current.substring(0, this.currentChar - 1);
            this.currentChar--;
        } else {
            this.element.textContent = current.substring(0, this.currentChar + 1);
            this.currentChar++;
        }

        let typeSpeed = this.isDeleting ? this.speed / 2 : this.speed;

        if (!this.isDeleting && this.currentChar === current.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentChar === 0) {
            this.isDeleting = false;
            this.currentText = (this.currentText + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Parallax scrolling manager
class ParallaxManager {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            this.elements.push({ element, speed });
        });

        if (this.elements.length > 0) {
            this.bindEvents();
        }
    }

    bindEvents() {
        let ticking = false;

        const updateParallax = () => {
            const scrollTop = window.pageYOffset;
            
            this.elements.forEach(({ element, speed }) => {
                const yPos = -(scrollTop * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }
}

// Dynamic counter animation
class CounterAnimation {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = target;
        this.duration = duration;
        this.startValue = 0;
        this.suffix = element.textContent.includes('+') ? '+' : '';
    }

    animate() {
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(this.startValue + (this.target - this.startValue) * easeOutQuart);
            
            this.element.textContent = currentValue + this.suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
}

// Dynamic portfolio filtering with animations
class PortfolioFilter {
    constructor() {
        this.activeFilter = 'all';
        this.items = [];
        this.init();
    }

    init() {
        this.createFilterButtons();
        this.bindEvents();
        this.cacheItems();
    }

    createFilterButtons() {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'portfolio-filters';
        
        const categories = ['all', 'weddings', 'events', 'corporate', 'concerts', 'product', 'food', 'advertisement'];
        
        filterContainer.innerHTML = categories.map(cat => 
            `<button class="filter-btn ${cat === 'all' ? 'active' : ''}" data-filter="${cat}">
                ${cat === 'all' ? 'All Work' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>`
        ).join('');

        const portfolioSection = document.querySelector('.portfolio .container');
        if (portfolioSection) {
            portfolioSection.insertBefore(filterContainer, portfolioSection.querySelector('.portfolio-grid'));
        }
    }

    cacheItems() {
        this.items = Array.from(document.querySelectorAll('.portfolio-item'));
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.filter-btn')) {
                e.preventDefault();
                this.handleFilterClick(e.target);
            }
        });
    }

    handleFilterClick(button) {
        const filter = button.dataset.filter;
        
        if (filter === this.activeFilter) return;
        
        this.activeFilter = filter;
        this.updateActiveButton(button);
        this.filterItems(filter);
    }

    updateActiveButton(activeButton) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    filterItems(filter) {
        this.items.forEach((item, index) => {
            const category = item.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            setTimeout(() => {
                if (shouldShow) {
                    this.showItem(item);
                } else {
                    this.hideItem(item);
                }
            }, index * 50);
        });
    }

    showItem(item) {
        item.style.display = 'block';
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px) scale(0.9)';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
        }, 50);
    }

    hideItem(item) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(-30px) scale(0.9)';
        
        setTimeout(() => {
            item.style.display = 'none';
        }, 300);
    }
}

// Navigation manager with dynamic states
class NavigationManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }

    init() {
        this.bindMobileMenu();
        this.bindSmoothScroll();
        this.bindScrollSpy();
        this.bindHeaderEffects();
    }

    bindMobileMenu() {
        if (this.menuToggle && this.navMenu) {
            // Toggle mobile menu with enhanced functionality
            this.menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = this.navMenu.classList.contains('active');
                
                if (isOpen) {
                    this.closeMobileMenu();
                } else {
                    this.openMobileMenu();
                }
            });

            // Close menu when clicking on nav links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav') && this.navMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            });

            // Handle screen resize - close menu if switching to desktop
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && this.navMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            });

            // Touch swipe to close menu (swipe up)
            let touchStartY = 0;
            this.navMenu.addEventListener('touchstart', (e) => {
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });

            this.navMenu.addEventListener('touchend', (e) => {
                const touchEndY = e.changedTouches[0].screenY;
                const swipeDistance = touchStartY - touchEndY;
                
                if (swipeDistance > 100) { // Swipe up to close
                    this.closeMobileMenu();
                }
            }, { passive: true });
        }
    }

    openMobileMenu() {
        this.navMenu.classList.add('active');
        this.menuToggle.classList.add('active');
        document.body.classList.add('menu-open');
        this.menuToggle.setAttribute('aria-expanded', 'true');
        
        // Focus first menu item for accessibility
        const firstLink = this.navMenu.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        this.menuToggle.setAttribute('aria-expanded', 'false');
    }

    bindSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = this.header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu
                    this.closeMobileMenu();
                }
            });
        });
    }

    bindScrollSpy() {
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 150;
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    bindHeaderEffects() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            
            // Add scrolled class for styling
            if (scrollTop > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
            
            // Hide/show header based on scroll direction
            if (scrollTop > lastScrollTop && scrollTop > 300) {
                this.header.classList.add('header-hidden');
            } else {
                this.header.classList.remove('header-hidden');
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all dynamic components
    setTimeout(() => {
        new NavigationManager();
        new ParallaxManager();
        new PortfolioFilter();
        
        // Start typing animation
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const typewriter = new TypeWriter(heroTitle, [
                'CINEMATIC STORYTELLING',
                'VISUAL NARRATIVES',
                'CREATIVE EXCELLENCE'
            ], 100);
            typewriter.type();
        }

        // Animate counters when stats come into view
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent.replace('+', ''));
            stat.setAttribute('data-target', target);
            stat.textContent = '0+';
            
            const counter = new CounterAnimation(stat, target);
            
            // Trigger animation when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        counter.animate();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(stat.closest('.about-stats'));
        });
        
        // Add dynamic hover effects to portfolio items
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px) scale(1.03)';
                this.style.boxShadow = '0 25px 50px rgba(0,0,0,0.3)';
                this.style.zIndex = '10';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                this.style.zIndex = '1';
            });
        });
        
        console.log('🎬 Vedang Cinematography Portfolio loaded with dynamic features!');
    }, 500);
});

// Portfolio Carousel Class
class PortfolioCarousel {
    constructor() {
        this.carousels = document.querySelectorAll('.portfolio-carousel');
        this.intervals = new Map();
        this.init();
    }
    
    init() {
        this.carousels.forEach((carousel, index) => {
            this.setupCarousel(carousel, index);
        });
    }
    
    setupCarousel(carousel, carouselIndex) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        if (slides.length <= 1) return;
        
        let currentSlide = 0;
        
        const changeSlide = (direction = 1) => {
            // Remove active class from current slide
            slides[currentSlide].classList.remove('active');
            
            // Move to next/previous slide
            if (direction > 0) {
                currentSlide = (currentSlide + 1) % slides.length;
            } else {
                currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
            }
            
            // Add active class to new slide
            slides[currentSlide].classList.add('active');
        };
        
        // Auto-rotation every 2.5 seconds
        const startAutoRotation = () => {
            return setInterval(() => changeSlide(1), 2500);
        };
        
        let interval = startAutoRotation();
        this.intervals.set(carouselIndex, interval);
        
        // Desktop hover behavior
        const portfolioItem = carousel.closest('.portfolio-item');
        if (portfolioItem) {
            portfolioItem.addEventListener('mouseenter', () => {
                clearInterval(this.intervals.get(carouselIndex));
            });
            
            portfolioItem.addEventListener('mouseleave', () => {
                const newInterval = startAutoRotation();
                this.intervals.set(carouselIndex, newInterval);
            });
        }

        // Mobile touch functionality
        let touchStartX = 0;
        let touchStartY = 0;
        let isSwiping = false;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isSwiping = false;
            
            // Pause auto-rotation on touch
            clearInterval(this.intervals.get(carouselIndex));
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            if (!isSwiping) {
                const touchX = e.changedTouches[0].screenX;
                const touchY = e.changedTouches[0].screenY;
                const deltaX = Math.abs(touchX - touchStartX);
                const deltaY = Math.abs(touchY - touchStartY);
                
                // If horizontal movement is greater than vertical, start swiping
                if (deltaX > deltaY && deltaX > 10) {
                    isSwiping = true;
                    e.preventDefault(); // Prevent scroll when swiping horizontally
                }
            }
        }, { passive: false });

        carousel.addEventListener('touchend', (e) => {
            if (isSwiping) {
                const touchEndX = e.changedTouches[0].screenX;
                const swipeDistance = touchStartX - touchEndX;
                const swipeThreshold = 50;
                
                if (Math.abs(swipeDistance) > swipeThreshold) {
                    if (swipeDistance > 0) {
                        // Swipe left - next slide
                        changeSlide(1);
                    } else {
                        // Swipe right - previous slide
                        changeSlide(-1);
                    }
                }
            }
            
            // Resume auto-rotation after a delay
            setTimeout(() => {
                const newInterval = startAutoRotation();
                this.intervals.set(carouselIndex, newInterval);
            }, 3000);
        }, { passive: true });
    }
    
    destroy() {
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals.clear();
    }
}

// Add data attributes for parallax elements
document.addEventListener('DOMContentLoaded', function() {
    // Mobile optimization: reduce motion for better performance
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Add parallax data to hero elements (skip if user prefers reduced motion)
    if (!reduceMotion) {
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.setAttribute('data-parallax', '0.3');
        }
        
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.setAttribute('data-parallax', '0.1');
        }
    }
    
    // Initialize Portfolio Carousel
    const portfolioCarousel = new PortfolioCarousel();
    
    // Mobile-specific optimizations
    if (window.innerWidth <= 768) {
        // Reduce carousel autoplay speed on mobile for better UX
        const mobileCarousels = document.querySelectorAll('.portfolio-carousel');
        mobileCarousels.forEach(carousel => {
            carousel.style.setProperty('--carousel-speed', '3500ms');
        });
        
        // Add touch feedback class to interactive elements
        const interactiveElements = document.querySelectorAll('.btn, .nav-link, .menu-toggle, .portfolio-link');
        interactiveElements.forEach(element => {
            element.classList.add('touch-feedback');
        });
        
        // Optimize images for mobile
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
            img.style.willChange = 'transform';
        });
        
        // Add passive scroll listener for better performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Update any scroll-dependent UI here
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    // Preload critical images
    const criticalImages = [
        'images/weddings/KPS-34.jpg',
        'images/weddings/KPS-51.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Add error handling for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn(`Failed to load image: ${this.src}`);
        });
    });
    
    console.log('🎬 Vedang Cinematography Portfolio loaded with mobile optimizations!');
});

// Performance monitoring for mobile
if (window.innerWidth <= 768) {
    // Monitor and report performance issues on mobile
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData.loadEventEnd - perfData.loadEventStart > 3000) {
                console.warn('⚠️ Mobile page load slower than optimal (>3s)');
            }
        }, 1000);
    });
}
