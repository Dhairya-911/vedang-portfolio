// Contact Form Handler with MongoDB Integration
class ContactFormHandler {
    constructor() {
        // Determine API URL based on environment
        this.apiUrl = this.getApiUrl();
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.submitText = document.getElementById('submitText');
        this.submitLoader = document.getElementById('submitLoader');
        this.formStatus = document.getElementById('formStatus');
        
        this.init();
    }

    getApiUrl() {
        // Check if we're in development or production
        const hostname = window.location.hostname;
        
        // Try to get API URL from environment variable (for build tools like Vite, Webpack, etc.)
        const envApiUrl = window.REACT_APP_API_URL || process.env.REACT_APP_API_URL;
        
        if (envApiUrl) {
            return `${envApiUrl}/api/contact`;
        }
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // Development environment
            return 'http://localhost:3000/api/contact';
        } else {
            // Production environment - Replace with your actual Render backend URL
            // Format: https://your-service-name.onrender.com/api/contact
            return 'https://vedang-portfolio-kgdn.onrender.com/api/contact';
        }
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            
            // Real-time validation
            const inputs = this.form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Collect form data
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            service: formData.get('service'),
            message: formData.get('message').trim()
        };

        try {
            this.setSubmitState(true);
            this.hideStatus();

            // Submit to MongoDB backend
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccess(result.message);
                this.form.reset();
                this.clearAllErrors();
                
                // Optional: Track successful submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        event_category: 'contact',
                        event_label: data.service,
                        value: 1
                    });
                }
            } else {
                this.handleError(result);
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('Network error. Please check your connection and try again.');
        } finally {
            this.setSubmitState(false);
        }
    }

    validateForm() {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const service = document.getElementById('service');
        const message = document.getElementById('message');

        let isValid = true;

        // Validate name
        if (!this.validateField(name)) isValid = false;
        if (!this.validateField(email)) isValid = false;
        if (!this.validateField(service)) isValid = false;
        if (!this.validateField(message)) isValid = false;

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearFieldError(field);

        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                } else if (value.length > 100) {
                    errorMessage = 'Name cannot exceed 100 characters';
                    isValid = false;
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    errorMessage = 'Name can only contain letters and spaces';
                    isValid = false;
                }
                break;

            case 'email':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;

            case 'service':
                if (!value) {
                    errorMessage = 'Please select a service';
                    isValid = false;
                }
                break;

            case 'message':
                if (!value) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                    isValid = false;
                } else if (value.length > 1000) {
                    errorMessage = 'Message cannot exceed 1000 characters';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }
    }

    clearAllErrors() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => this.clearFieldError(input));
    }

    setSubmitState(isSubmitting) {
        this.submitBtn.disabled = isSubmitting;
        
        if (isSubmitting) {
            this.submitText.style.display = 'none';
            this.submitLoader.style.display = 'inline-block';
        } else {
            this.submitText.style.display = 'inline';
            this.submitLoader.style.display = 'none';
        }
    }

    showSuccess(message) {
        this.formStatus.className = 'form-status success show';
        this.formStatus.textContent = message;
    }

    showError(message) {
        this.formStatus.className = 'form-status error show';
        this.formStatus.textContent = message;
    }

    hideStatus() {
        this.formStatus.className = 'form-status';
        this.formStatus.textContent = '';
    }

    handleError(result) {
        if (result.errors && result.errors.length > 0) {
            // Handle validation errors from server
            result.errors.forEach(error => {
                const field = document.getElementById(error.param);
                if (field) {
                    this.showFieldError(field, error.msg);
                }
            });
            this.showError('Please correct the highlighted fields');
        } else {
            this.showError(result.message || 'An error occurred. Please try again.');
        }
    }
}

// Character counter for message field
class CharacterCounter {
    constructor() {
        this.messageField = document.getElementById('message');
        this.init();
    }

    init() {
        if (this.messageField) {
            // Create counter element
            const counter = document.createElement('div');
            counter.id = 'messageCounter';
            counter.className = 'character-counter';
            counter.textContent = '0/1000';
            
            // Add counter after textarea
            this.messageField.parentNode.appendChild(counter);
            
            // Update counter on input
            this.messageField.addEventListener('input', this.updateCounter.bind(this));
        }
    }

    updateCounter() {
        const counter = document.getElementById('messageCounter');
        if (counter) {
            const length = this.messageField.value.length;
            counter.textContent = `${length}/1000`;
            
            // Color coding
            if (length > 900) {
                counter.style.color = '#e74c3c';
            } else if (length > 750) {
                counter.style.color = '#f39c12';
            } else {
                counter.style.color = '#7f8c8d';
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ContactFormHandler();
    new CharacterCounter();
});

// Add CSS for character counter
const counterCSS = `
.character-counter {
    font-size: 0.8rem;
    color: #7f8c8d;
    text-align: right;
    margin-top: 0.25rem;
    font-weight: 500;
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = counterCSS;
document.head.appendChild(style);
