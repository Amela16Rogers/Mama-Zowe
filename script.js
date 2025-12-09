/**
 * Professional Website Interaction Manager
 * Handles navigation, form submissions, and visual effects
 */

class WebsiteInteractions {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.initObservers();
    }

    initializeElements() {
        // Navigation elements
        this.navToggle = document.getElementById('navToggle');
        this.navList = document.querySelector('.nav-list');
        this.navLinks = document.querySelectorAll('.nav-list a');
        
        // Form elements
        this.consultationForm = document.getElementById('consultationForm');
        this.whatsappBtn = document.getElementById('whatsappBtn');
        
        // UI elements
        this.header = document.querySelector('.header');
        this.lastScrollTop = 0;
        
        // Animation elements
        this.elementsToAnimate = document.querySelectorAll('.service-card, .testimonial-card, .about-image, .about-text, .feature');
        
        // Configuration
        this.config = {
            whatsappNumber: '1234567890',
            animationDuration: {
                short: 300,
                medium: 500,
                long: 1000
            },
            thresholds: {
                scroll: 100,
                observer: 0.1
            }
        };
    }

    bindEvents() {
        // Navigation
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleNavigation());
        }

        // Form submission
        if (this.consultationForm) {
            this.consultationForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }

        // Navigation link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeNavigation());
        });

        // WhatsApp button
        if (this.whatsappBtn) {
            this.whatsappBtn.addEventListener('click', () => this.handleWhatsAppClick());
        }

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleSmoothScroll(e, anchor));
        });

        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll());

        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    /**
     * Navigation Methods
     */
    toggleNavigation() {
        if (!this.navList || !this.navToggle) return;

        const isActive = this.navList.classList.toggle('active');
        const icon = this.navToggle.querySelector('i');
        
        if (icon) {
            icon.classList.toggle('fa-bars', !isActive);
            icon.classList.toggle('fa-times', isActive);
        }

        // Update visual effects
        this.navList.style.boxShadow = isActive 
            ? '0 10px 30px rgba(139, 0, 0, 0.4)' 
            : '';
    }

    closeNavigation() {
        if (!this.navList) return;

        this.navList.classList.remove('active');
        
        const icon = this.navToggle?.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        
        this.navList.style.boxShadow = '';
    }

    /**
     * Form Handling Methods
     */
    handleFormSubmission(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }

        const formData = this.collectFormData();
        this.processFormSubmission(formData);
    }

    validateForm() {
        let isValid = true;
        const requiredInputs = this.consultationForm.querySelectorAll('[required]');

        requiredInputs.forEach(input => {
            const hasValue = input.value.trim() !== '';
            
            if (!hasValue) {
                this.highlightInvalidInput(input);
                isValid = false;
            } else {
                this.resetInputStyle(input);
            }
        });

        return isValid;
    }

    highlightInvalidInput(input) {
        input.style.borderColor = '#ff0000';
        input.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
        input.classList.add('shake');
        
        setTimeout(() => input.classList.remove('shake'), this.config.animationDuration.medium);
    }

    resetInputStyle(input) {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    }

    collectFormData() {
        return {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            service: document.getElementById('service')?.value || '',
            message: document.getElementById('message')?.value || ''
        };
    }

    processFormSubmission(formData) {
        this.showLoadingAnimation();
        
        // In production, replace with actual API call
        setTimeout(() => {
            this.handleFormSuccess(formData);
        }, this.config.animationDuration.long);
    }

    handleFormSuccess(formData) {
        const serviceText = formData.service 
            ? document.getElementById('service').options[document.getElementById('service').selectedIndex].text 
            : 'Not specified';

        const whatsappMessage = this.formatWhatsAppMessage(formData, serviceText);
        this.redirectToWhatsApp(whatsappMessage);
        
        this.showNotification('Thank you for your inquiry. Redirecting to WhatsApp...', 'success');
        this.consultationForm.reset();
    }

    formatWhatsAppMessage(formData, serviceText) {
        return `New Consultation Request%0A%0AName: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0AService: ${serviceText}%0AMessage: ${formData.message}`;
    }

    redirectToWhatsApp(message) {
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${this.config.whatsappNumber}?text=${encodedMessage}`, '_blank');
    }

    /**
     * UI Interaction Methods
     */
    handleWhatsAppClick() {
        // Add subtle click feedback
        this.whatsappBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.whatsappBtn.style.transform = '';
        }, this.config.animationDuration.short);
        
        // Analytics tracking
        console.log('WhatsApp consultation initiated');
    }

    handleSmoothScroll(event, anchor) {
        event.preventDefault();
        
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            this.scrollToElement(targetElement);
        }
    }

    scrollToElement(element) {
        const headerHeight = this.header?.offsetHeight || 80;
        const targetPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    /**
     * Scroll Handling Methods
     */
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        this.updateHeaderState(scrollTop);
        this.applyParallaxEffect(scrollTop);
        
        this.lastScrollTop = scrollTop;
    }

    updateHeaderState(scrollTop) {
        if (!this.header) return;
        
        const shouldStick = scrollTop > this.config.thresholds.scroll;
        
        this.header.classList.toggle('sticky', shouldStick);
        this.header.style.boxShadow = shouldStick 
            ? '0 5px 20px rgba(139, 0, 0, 0.4)' 
            : '';
    }

    applyParallaxEffect(scrollTop) {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = scrollTop * 0.5;
            hero.style.transform = `translateY(${scrolled}px)`;
        }
    }

    handleResize() {
        // Handle responsive behavior adjustments
        this.closeNavigation();
    }

    /**
     * Animation Methods
     */
    initObservers() {
        const observerOptions = {
            threshold: this.config.thresholds.observer,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        this.elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }

    animateElement(element) {
        element.classList.add('animate-in-view');
        
        if (element.classList.contains('service-card')) {
            element.style.animation = 'fadeInUp 0.8s ease-out';
        }
    }

    showLoadingAnimation() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 10, 10, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9998;
        `;
        
        // Create spinner
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 69, 0, 0.3);
            border-radius: 50%;
            border-top-color: #FF4500;
            animation: spin 1s linear infinite;
        `;
        
        overlay.appendChild(spinner);
        document.body.appendChild(overlay);
        
        // Remove after animation
        setTimeout(() => {
            if (overlay.parentNode) {
                document.body.removeChild(overlay);
            }
        }, this.config.animationDuration.long * 2);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#00C851' : '#33b5e5'};
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after delay
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Utility Methods
     */
    addAnimationStyles() {
        if (document.getElementById('dynamic-animations')) return;
        
        const style = document.createElement('style');
        style.id = 'dynamic-animations';
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            .shake {
                animation: shake 0.5s ease-in-out;
            }
        `;
        
        document.head.appendChild(style);
    }

    initializePage() {
        this.addAnimationStyles();
        
        // Initial animations on page load
        setTimeout(() => {
            document.body.classList.add('page-loaded');
        }, 100);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new WebsiteInteractions();
    app.initializePage();
    
    // Make available globally if needed for debugging
    window.WebsiteApp = app;
});

// Export for module usage if applicable
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebsiteInteractions;
}