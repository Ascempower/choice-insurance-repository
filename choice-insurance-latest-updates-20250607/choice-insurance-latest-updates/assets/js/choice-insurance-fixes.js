// Choice Insurance Complete JavaScript Optimizations
// Version: 20250606

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        phone: '(877) 204-9648',
        calendlyUrl: 'https://calendly.com/choiceinsurancehub',
        gtmId: 'GTM-PWJPMPC5',
        brandColor: '#42615A',
        accentColor: '#DD8B66'
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Core functionality
        initNavigation();
        initForms();
        initContactUpdates();
        initPerformanceOptimizations();
        initAccessibility();
        initAnalytics();
        
        console.log('Choice Insurance optimizations loaded successfully');
    }

    // Navigation functionality
    function initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Active navigation highlighting
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (sections.length && navLinks.length) {
            window.addEventListener('scroll', throttle(updateActiveNav, 100));
        }
    }

    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        
        document.querySelectorAll('section[id]').forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Form functionality
    function initForms() {
        // Contact form handling
        const contactForms = document.querySelectorAll('form[action*="contact"]');
        contactForms.forEach(form => {
            form.addEventListener('submit', handleFormSubmit);
        });

        // Input validation
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearErrors);
        });

        // Phone number formatting
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', formatPhoneNumber);
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        if (validateForm(form)) {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                showSuccessMessage(form);
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
            
            // Track form submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'contact',
                    event_label: form.id || 'contact_form'
                });
            }
        }
    }

    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateInput({ target: field })) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    function validateInput(e) {
        const input = e.target;
        const value = input.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation
        if (input.type === 'tel' && value) {
            const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        showFieldError(input, isValid ? '' : errorMessage);
        return isValid;
    }

    function showFieldError(input, message) {
        // Remove existing error
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error class
        input.classList.toggle('error', !!message);
        
        // Add error message
        if (message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            errorDiv.style.color = '#DC3545';
            errorDiv.style.fontSize = '14px';
            errorDiv.style.marginTop = '4px';
            input.parentNode.appendChild(errorDiv);
        }
    }

    function clearErrors(e) {
        const input = e.target;
        input.classList.remove('error');
        const error = input.parentNode.querySelector('.field-error');
        if (error) {
            error.remove();
        }
    }

    function formatPhoneNumber(e) {
        const input = e.target;
        let value = input.value.replace(/\D/g, '');
        
        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        }
        
        input.value = value;
    }

    function showSuccessMessage(form) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div style="background: #28A745; color: white; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                <strong>Thank you!</strong> Your message has been sent successfully. 
                We'll contact you at ${CONFIG.phone} within 24 hours.
            </div>
        `;
        
        form.parentNode.insertBefore(successDiv, form);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Contact information updates
    function initContactUpdates() {
        // Update phone numbers
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            if (!link.href.includes(CONFIG.phone.replace(/\D/g, ''))) {
                link.href = `tel:+1${CONFIG.phone.replace(/\D/g, '')}`;
                link.textContent = CONFIG.phone;
            }
        });

        // Update Calendly links
        document.querySelectorAll('a[href*="calendly"]').forEach(link => {
            if (!link.href.includes('choiceinsurancehub')) {
                link.href = CONFIG.calendlyUrl;
            }
        });

        // Add click tracking to contact elements
        document.querySelectorAll('a[href^="tel:"], a[href*="calendly"]').forEach(link => {
            link.addEventListener('click', function() {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        event_category: 'contact',
                        event_label: this.href.includes('tel:') ? 'phone' : 'calendly'
                    });
                }
            });
        });
    }

    // Performance optimizations
    function initPerformanceOptimizations() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Preload critical resources
        const criticalResources = [
            '/assets/css/choice-insurance-fixes.css',
            '/assets/js/choice-insurance-fixes.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    // Accessibility enhancements
    function initAccessibility() {
        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        }

        // Keyboard navigation for dropdowns
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // Focus management for modals
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            trigger.addEventListener('click', function() {
                const modalId = this.dataset.modal;
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.focus();
                    trapFocus(modal);
                }
            });
        });
    }

    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // Analytics and tracking
    function initAnalytics() {
        // Track page views
        if (typeof gtag !== 'undefined') {
            gtag('config', CONFIG.gtmId, {
                page_title: document.title,
                page_location: window.location.href
            });
        }

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', throttle(function() {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
                maxScroll = scrollPercent;
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll', {
                        event_category: 'engagement',
                        event_label: `${scrollPercent}%`
                    });
                }
            }
        }, 1000));

        // Track time on page
        let startTime = Date.now();
        window.addEventListener('beforeunload', function() {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            if (typeof gtag !== 'undefined' && timeOnPage > 10) {
                gtag('event', 'timing_complete', {
                    name: 'time_on_page',
                    value: timeOnPage
                });
            }
        });
    }

    // Utility functions
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Service Worker for PWA functionality
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed');
                });
        });
    }

    // Error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: e.error.toString(),
                fatal: false
            });
        }
    });

    // Export for testing
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            init,
            CONFIG,
            validateInput,
            formatPhoneNumber
        };
    }

})();

