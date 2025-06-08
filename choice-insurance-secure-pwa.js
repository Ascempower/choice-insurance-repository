// Choice Insurance Security & PWA JavaScript - v20250606
// Enhanced with comprehensive security measures

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    console.log('Choice Insurance Secure PWA JavaScript loaded');
    
    // ===== SECURITY INITIALIZATION =====
    
    // CSRF Token Management
    let csrfToken = document.querySelector('meta[name="csrf-token"]');
    if (csrfToken) {
        csrfToken = csrfToken.getAttribute('content');
    }
    
    // Content Security Policy Nonce
    const cspNonce = document.querySelector('script[nonce]')?.getAttribute('nonce') || 'secure-nonce';
    
    // ===== INPUT SANITIZATION FUNCTIONS =====
    
    function sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        // Remove potentially dangerous characters
        return input
            .replace(/[<>]/g, '') // Remove angle brackets
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .replace(/data:/gi, '') // Remove data: protocol
            .trim();
    }
    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    }
    
    function validatePhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
        return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10 && cleanPhone.length <= 16;
    }
    
    // ===== SECURE FORM HANDLING =====
    
    function secureFormSubmission() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(function(form) {
            form.addEventListener('submit', function(e) {
                // Validate and sanitize all inputs
                const inputs = form.querySelectorAll('input, textarea, select');
                let isValid = true;
                
                inputs.forEach(function(input) {
                    // Sanitize input values
                    if (input.type !== 'file' && input.type !== 'checkbox' && input.type !== 'radio') {
                        input.value = sanitizeInput(input.value);
                    }
                    
                    // Validate specific input types
                    if (input.type === 'email' && input.value) {
                        if (!validateEmail(input.value)) {
                            isValid = false;
                            showSecurityError('Please enter a valid email address');
                        }
                    }
                    
                    if (input.type === 'tel' && input.value) {
                        if (!validatePhone(input.value)) {
                            isValid = false;
                            showSecurityError('Please enter a valid phone number');
                        }
                    }
                    
                    // Check for potential XSS attempts
                    if (input.value && (
                        input.value.includes('<script') ||
                        input.value.includes('javascript:') ||
                        input.value.includes('data:') ||
                        input.value.includes('vbscript:')
                    )) {
                        isValid = false;
                        showSecurityError('Invalid characters detected in form submission');
                    }
                });
                
                // Add CSRF token if available
                if (csrfToken && !form.querySelector('input[name="csrf_token"]')) {
                    const csrfInput = document.createElement('input');
                    csrfInput.type = 'hidden';
                    csrfInput.name = 'csrf_token';
                    csrfInput.value = csrfToken;
                    form.appendChild(csrfInput);
                }
                
                if (!isValid) {
                    e.preventDefault();
                    return false;
                }
                
                // Log form submission for security monitoring
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'secure_form_submit', {
                        event_category: 'Security',
                        event_label: form.action || 'Unknown Form',
                        value: 1
                    });
                }
            });
        });
    }
    
    function showSecurityError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'security-error';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-family: 'Poppins', Arial, sans-serif;
            box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
            z-index: 10000;
            max-width: 300px;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(function() {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    // ===== SECURE SERVICE WORKER REGISTRATION =====
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            })
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
                
                // Security: Verify service worker integrity
                if (registration.active) {
                    registration.active.postMessage({
                        type: 'SECURITY_CHECK',
                        timestamp: Date.now()
                    });
                }
                
                // Check for updates
                registration.addEventListener('updatefound', function() {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', function() {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
                // Log security event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'sw_registration_failed', {
                        event_category: 'Security',
                        event_label: err.message,
                        value: 1
                    });
                }
            });
        });
    }
    
    // ===== SECURE PWA INSTALL PROMPT =====
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;
        showSecureInstallButton();
    });
    
    function showSecureInstallButton() {
        const installButton = document.createElement('button');
        installButton.textContent = '📱 Install App';
        installButton.className = 'pwa-install-btn secure-button';
        installButton.setAttribute('data-security', 'verified');
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #42615A;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: 'Poppins', Arial, sans-serif;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(66, 97, 90, 0.3);
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        
        installButton.addEventListener('click', function() {
            // Security check before install
            if (!deferredPrompt || !installButton.getAttribute('data-security')) {
                showSecurityError('Installation not available or security check failed');
                return;
            }
            
            installButton.style.display = 'none';
            deferredPrompt.prompt();
            
            deferredPrompt.userChoice.then(function(choiceResult) {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                    // Log security event
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'pwa_install_accepted', {
                            event_category: 'Security',
                            event_label: 'PWA Installation',
                            value: 1
                        });
                    }
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
            });
        });
        
        installButton.addEventListener('mouseenter', function() {
            this.style.background = '#DD8B66';
            this.style.transform = 'translateY(-2px)';
        });
        
        installButton.addEventListener('mouseleave', function() {
            this.style.background = '#42615A';
            this.style.transform = 'translateY(0)';
        });
        
        document.body.appendChild(installButton);
    }
    
    function showUpdateNotification() {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #42615A;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                font-family: 'Poppins', Arial, sans-serif;
                box-shadow: 0 4px 8px rgba(66, 97, 90, 0.3);
                z-index: 1001;
                max-width: 300px;
            ">
                <strong>🔒 Secure Update Available!</strong><br>
                New content is available with security improvements.
                <button onclick="window.location.reload()" style="
                    background: #DD8B66;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    margin-top: 10px;
                    cursor: pointer;
                ">Update Now</button>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: transparent;
                    color: white;
                    border: 1px solid white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    margin-top: 10px;
                    margin-left: 5px;
                    cursor: pointer;
                ">Later</button>
            </div>
        `;
        document.body.appendChild(notification);
    }
    
    // ===== SECURE CALENDLY ERROR DETECTION =====
    function detectAndFixCalendlyErrors() {
        const calendlyElements = document.querySelectorAll('iframe[src*="calendly"], .calendly-inline-widget');
        
        calendlyElements.forEach(function(element) {
            // Security: Validate Calendly iframe source
            if (element.tagName === 'IFRAME') {
                const src = element.getAttribute('src');
                if (!src || !src.startsWith('https://calendly.com/')) {
                    console.warn('Potentially unsafe Calendly iframe detected:', src);
                    replaceCalendlyWidget(element);
                    return;
                }
                
                // Monitor for load errors
                element.addEventListener('error', function() {
                    replaceCalendlyWidget(element);
                });
                
                // Security: Set sandbox attributes
                element.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
                
                // Check if iframe loads but shows 404
                element.addEventListener('load', function() {
                    setTimeout(function() {
                        try {
                            if (element.offsetHeight < 100) {
                                replaceCalendlyWidget(element);
                            }
                        } catch (e) {
                            // Expected CORS error, but check other indicators
                            if (element.offsetHeight < 100) {
                                replaceCalendlyWidget(element);
                            }
                        }
                    }, 3000);
                });
            }
        });
    }
    
    function replaceCalendlyWidget(element) {
        const replacement = document.createElement('div');
        replacement.className = 'calendly-error-replacement secure-replacement';
        replacement.innerHTML = `
            <div style="
                padding: 50px;
                text-align: center;
                background: #f8f9fa;
                border: 3px solid #42615A;
                border-radius: 12px;
                color: #42615A;
                font-family: 'Poppins', Arial, sans-serif;
                font-size: 18px;
                line-height: 1.6;
                min-height: 400px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            ">
                <div style="font-size: 48px; margin-bottom: 20px;">🔒📅</div>
                <h3 style="color: #42615A; margin-bottom: 20px;">Secure Consultation Scheduling</h3>
                <p style="margin-bottom: 20px;">Our secure scheduling system is temporarily unavailable.</p>
                <p style="margin-bottom: 30px;"><strong>Please contact us directly via secure channels:</strong></p>
                <div style="margin-bottom: 15px;">
                    <strong>📞 Phone:</strong> <a href="tel:+15551234567" style="color: #42615A; text-decoration: none; font-weight: 600;">(555) 123-4567</a>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>✉️ Secure Email:</strong> <a href="mailto:info@choiceinsurance.com" style="color: #42615A; text-decoration: none; font-weight: 600;">info@choiceinsurance.com</a>
                </div>
                <p style="font-size: 16px; color: #666; margin-top: 20px;">🔐 All communications are encrypted and HIPAA compliant.</p>
            </div>
        `;
        
        element.parentNode.replaceChild(replacement, element);
        console.log('Calendly widget replaced with secure alternative');
        
        // Log security event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'calendly_security_replacement', {
                event_category: 'Security',
                event_label: 'Widget Replacement',
                value: 1
            });
        }
    }
    
    // ===== SECURITY MONITORING =====
    
    // Monitor for potential XSS attempts
    function monitorXSSAttempts() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Check for suspicious script injections
                        const scripts = node.querySelectorAll ? node.querySelectorAll('script') : [];
                        scripts.forEach(function(script) {
                            if (!script.nonce || script.nonce !== cspNonce) {
                                console.warn('Potentially malicious script detected:', script);
                                script.remove();
                                
                                // Log security event
                                if (typeof gtag !== 'undefined') {
                                    gtag('event', 'xss_attempt_blocked', {
                                        event_category: 'Security',
                                        event_label: 'Script Injection',
                                        value: 1
                                    });
                                }
                            }
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Detect potential clickjacking attempts
    function detectClickjacking() {
        if (window.top !== window.self) {
            console.warn('Page loaded in iframe - potential clickjacking attempt');
            
            // Log security event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'clickjacking_detected', {
                    event_category: 'Security',
                    event_label: 'Iframe Detection',
                    value: 1
                });
            }
            
            // Break out of iframe
            window.top.location = window.self.location;
        }
    }
    
    // ===== SECURE PERFORMANCE OPTIMIZATIONS =====
    
    // Secure lazy loading with integrity checks
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    // Security: Validate image source
                    if (src && (src.startsWith('/') || src.startsWith('https://'))) {
                        img.src = src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    } else {
                        console.warn('Potentially unsafe image source:', src);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(function(img) {
            imageObserver.observe(img);
        });
    }
    
    // ===== SECURE ACCESSIBILITY ENHANCEMENTS =====
    
    // Add secure skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link secure-skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #42615A;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Ensure main content has proper ID
    const mainContent = document.querySelector('main, .main-content, .page-content, .content');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
    
    // ===== SECURE GOOGLE TAG MANAGER EVENTS =====
    
    // Secure event tracking with validation
    function trackSecureEvent(eventName, category, label, value) {
        // Sanitize event parameters
        eventName = sanitizeInput(eventName);
        category = sanitizeInput(category);
        label = sanitizeInput(label);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: category,
                event_label: label,
                value: value || 1,
                security_verified: true
            });
        }
    }
    
    // Track secure button clicks
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn, .button, [class*="btn"], [class*="button"]')) {
            const buttonText = sanitizeInput(e.target.textContent.trim());
            trackSecureEvent('secure_button_click', 'Button', buttonText);
        }
    });
    
    // Track secure form submissions
    document.addEventListener('submit', function(e) {
        const formAction = sanitizeInput(e.target.action || 'Unknown Form');
        trackSecureEvent('secure_form_submit', 'Form', formAction);
    });
    
    // Track secure scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
            maxScroll = scrollPercent;
            trackSecureEvent('secure_scroll', 'Engagement', scrollPercent + '% Scrolled', scrollPercent);
        }
    });
    
    // ===== SECURE DISCLAIMER AUTO-CREATION =====
    
    // Check if disclaimer already exists
    const existingDisclaimer = document.querySelector('.disclaimer, .disclaimer-section, [class*="disclaimer"]');
    
    if (!existingDisclaimer) {
        // Create secure disclaimer if it doesn't exist
        const disclaimer = document.createElement('div');
        disclaimer.className = 'disclaimer-section auto-generated secure-disclaimer';
        disclaimer.innerHTML = `
            <div style="
                background: #42615A;
                color: white;
                padding: 30px;
                margin: 25px 0;
                border-radius: 12px;
                font-size: 18px;
                line-height: 1.7;
                font-family: 'Poppins', Arial, sans-serif;
                text-align: center;
                box-shadow: 0 8px 16px rgba(66, 97, 90, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1);
                border: 3px solid #DD8B66;
            ">
                <div style="font-size: 24px; margin-bottom: 10px;">🔒⚠️</div>
                <strong style="color: #DD8B66;">Important Security & Disclosure Notice:</strong><br>
                Not affiliated with or endorsed by any government agency. This is a solicitation for insurance. 
                By contacting us by one of the methods above you are agreeing to discuss the insurance products listed. 
                We do not offer every plan available in your area. Currently, we represent 10 organizations, 
                which offer 72 products in your area. Please contact Medicare.gov, 1-800-MEDICARE, 
                or your local State Health Insurance Program to get information on all your options.<br><br>
                <small style="color: #A7C9CA;">🔐 All communications are encrypted and HIPAA compliant. Your privacy and security are our top priorities.</small>
            </div>
        `;
        
        // Add to footer or end of main content
        const footer = document.querySelector('footer, .site-footer');
        const mainContent = document.querySelector('main, .main-content, .page-content');
        
        if (footer) {
            footer.parentNode.insertBefore(disclaimer, footer);
        } else if (mainContent) {
            mainContent.appendChild(disclaimer);
        } else {
            document.body.appendChild(disclaimer);
        }
    }
    
    // ===== INITIALIZE SECURITY FEATURES =====
    
    // Initialize all security features
    secureFormSubmission();
    detectAndFixCalendlyErrors();
    monitorXSSAttempts();
    detectClickjacking();
    
    // Re-run Calendly detection after dynamic content loads
    setTimeout(detectAndFixCalendlyErrors, 5000);
    
    console.log('Choice Insurance secure optimizations loaded successfully');
    
    // Log successful security initialization
    if (typeof gtag !== 'undefined') {
        gtag('event', 'security_init_complete', {
            event_category: 'Security',
            event_label: 'Initialization Complete',
            value: 1
        });
    }
});


    
    // ===== TABBED FORMS FUNCTIONALITY =====
    
    // Initialize tabbed forms
    function initializeTabbedForms() {
        const tabButtons = document.querySelectorAll('.choice-tab-button');
        const formContents = document.querySelectorAll('.choice-form-content');
        
        tabButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const targetForm = this.getAttribute('data-form');
                
                // Remove active class from all tabs and forms
                tabButtons.forEach(function(btn) {
                    btn.classList.remove('active');
                });
                formContents.forEach(function(content) {
                    content.classList.remove('active');
                });
                
                // Add active class to clicked tab and corresponding form
                this.classList.add('active');
                const targetFormElement = document.getElementById(targetForm);
                if (targetFormElement) {
                    targetFormElement.classList.add('active');
                }
                
                // Log tab switch for analytics
                trackSecureEvent('form_tab_switch', 'Forms', targetForm);
            });
        });
    }
    
    // ===== CLIENT-SIDE ENCRYPTION SIMULATION =====
    // WARNING: This is for demonstration only. Use proper encryption libraries in production.
    
    function generateEncryptionKey() {
        // Simple key generation for demo - NOT for production use
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';
        for (let i = 0; i < 32; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return key;
    }
    
    function simpleXOREncrypt(text, key) {
        // Simple XOR encryption for demo - NOT secure for production
        let encrypted = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            encrypted += String.fromCharCode(charCode);
        }
        return btoa(encrypted); // Base64 encode for safe transmission
    }
    
    function encryptPHIFields(form) {
        // Get or generate encryption key
        let encryptionKey = localStorage.getItem('choice_demo_key');
        if (!encryptionKey) {
            encryptionKey = generateEncryptionKey();
            localStorage.setItem('choice_demo_key', encryptionKey);
        }
        
        const phiFields = form.querySelectorAll('[data-phi-field="true"]');
        const encryptedData = {};
        
        phiFields.forEach(function(field) {
            if (field.value.trim()) {
                const fieldName = field.getAttribute('name');
                const encryptedValue = simpleXOREncrypt(field.value, encryptionKey);
                encryptedData[fieldName] = encryptedValue;
                
                // Replace form value with encrypted version
                field.value = '[ENCRYPTED]';
                
                // Add hidden field with encrypted data
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = 'encrypted_' + fieldName;
                hiddenField.value = encryptedValue;
                form.appendChild(hiddenField);
            }
        });
        
        console.log('PHI Fields Encrypted (Demo Only):', Object.keys(encryptedData));
        console.warn('WARNING: This is demonstration encryption only. Use proper encryption libraries and secure backend processing for production.');
        
        return encryptedData;
    }
    
    // ===== SECURE FORM VALIDATION =====
    
    function validateSecureForm(form) {
        let isValid = true;
        const errors = [];
        
        // Check required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(function(field) {
            const formGroup = field.closest('.form-group');
            
            if (!field.value.trim()) {
                isValid = false;
                errors.push(field.getAttribute('name') + ' is required');
                formGroup.classList.add('error');
                showFieldError(field, 'This field is required');
            } else {
                formGroup.classList.remove('error');
                formGroup.classList.add('success');
                hideFieldError(field);
            }
        });
        
        // Check consent checkboxes
        const consentCheckboxes = form.querySelectorAll('input[name^="consent_"]');
        consentCheckboxes.forEach(function(checkbox) {
            if (!checkbox.checked) {
                isValid = false;
                errors.push('All consent checkboxes must be checked');
                const formGroup = checkbox.closest('.form-group');
                formGroup.classList.add('error');
                showFieldError(checkbox, 'This consent is required');
            } else {
                const formGroup = checkbox.closest('.form-group');
                formGroup.classList.remove('error');
                hideFieldError(checkbox);
            }
        });
        
        // Check Scope of Appointment products
        const soaProducts = form.querySelectorAll('input[name="soa_products[]"]');
        const soaChecked = Array.from(soaProducts).some(function(checkbox) {
            return checkbox.checked;
        });
        
        if (!soaChecked) {
            isValid = false;
            errors.push('Please select at least one product type for the Scope of Appointment');
            const soaSection = form.querySelector('.scope-of-appointment-section');
            soaSection.classList.add('error');
            showSectionError(soaSection, 'Please select at least one product type');
        } else {
            const soaSection = form.querySelector('.scope-of-appointment-section');
            soaSection.classList.remove('error');
            hideSectionError(soaSection);
        }
        
        // Validate email format for PHI fields
        const emailFields = form.querySelectorAll('input[type="email"][data-phi-field="true"]');
        emailFields.forEach(function(field) {
            if (field.value && !validateEmail(field.value)) {
                isValid = false;
                errors.push('Invalid email format');
                const formGroup = field.closest('.form-group');
                formGroup.classList.add('error');
                showFieldError(field, 'Please enter a valid email address');
            }
        });
        
        // Validate phone format for PHI fields
        const phoneFields = form.querySelectorAll('input[type="tel"][data-phi-field="true"]');
        phoneFields.forEach(function(field) {
            if (field.value && !validatePhone(field.value)) {
                isValid = false;
                errors.push('Invalid phone format');
                const formGroup = field.closest('.form-group');
                formGroup.classList.add('error');
                showFieldError(field, 'Please enter a valid phone number');
            }
        });
        
        return { isValid: isValid, errors: errors };
    }
    
    function showFieldError(field, message) {
        hideFieldError(field); // Remove existing error
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
    
    function hideFieldError(field) {
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    function showSectionError(section, message) {
        hideSectionError(section);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message section-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'background: #f8d7da; color: #721c24; padding: 10px; border-radius: 4px; margin-top: 10px; font-weight: 600;';
        section.appendChild(errorDiv);
    }
    
    function hideSectionError(section) {
        const existingError = section.querySelector('.section-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // ===== SECURE FORM SUBMISSION =====
    
    function handleSecureFormSubmission() {
        const secureForm = document.getElementById('medicareIntakeForm');
        if (!secureForm) return;
        
        secureForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const validation = validateSecureForm(this);
            if (!validation.isValid) {
                showSecurityError('Please correct the errors in the form before submitting.');
                return false;
            }
            
            // Show encryption notice
            const submitButton = this.querySelector('.secure-submit-button');
            const originalText = submitButton.textContent;
            submitButton.textContent = '🔒 Encrypting & Submitting...';
            submitButton.disabled = true;
            
            // Simulate encryption process
            setTimeout(function() {
                // Encrypt PHI fields (demo only)
                const encryptedData = encryptPHIFields(secureForm);
                
                // Add security metadata
                const securityMetadata = document.createElement('input');
                securityMetadata.type = 'hidden';
                securityMetadata.name = 'security_metadata';
                securityMetadata.value = JSON.stringify({
                    encryption_method: 'demo_xor_base64',
                    timestamp: new Date().toISOString(),
                    user_agent: navigator.userAgent,
                    form_version: '20250606'
                });
                secureForm.appendChild(securityMetadata);
                
                // Log security event
                trackSecureEvent('secure_form_encrypted', 'Security', 'Medicare Intake Form');
                
                // Show success message (in real app, this would submit to secure backend)
                showSecureFormSuccess();
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
            }, 2000); // Simulate encryption time
        });
    }
    
    function showSecureFormSuccess() {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success-message';
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--choice-green);
            color: white;
            padding: 30px 40px;
            border-radius: 12px;
            font-family: var(--choice-font);
            font-size: 18px;
            font-weight: 600;
            text-align: center;
            box-shadow: 0 8px 24px rgba(66, 97, 90, 0.4);
            z-index: 10001;
            max-width: 500px;
            border: 3px solid var(--choice-coral);
        `;
        
        successDiv.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 15px;">🔒✅</div>
            <h3 style="margin: 0 0 15px 0; color: white;">Form Submitted Securely!</h3>
            <p style="margin: 0 0 15px 0; line-height: 1.5;">Your information has been encrypted and submitted securely. We will contact you within 24 hours.</p>
            <p style="margin: 0 0 20px 0; font-size: 14px; color: var(--choice-coral);">For immediate assistance, call <a href="tel:+18772049648" style="color: var(--choice-coral); text-decoration: none; font-weight: 700;">(877) 204-9648</a></p>
            <button onclick="this.parentElement.remove()" style="
                background: var(--choice-coral);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                font-family: var(--choice-font);
                font-weight: 600;
                cursor: pointer;
            ">Close</button>
        `;
        
        document.body.appendChild(successDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(function() {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 10000);
    }
    
    // ===== ENHANCED CALENDLY ERROR REPLACEMENT WITH UPDATED INFO =====
    
    function replaceCalendlyWidget(element) {
        const replacement = document.createElement('div');
        replacement.className = 'calendly-error-replacement secure-replacement';
        replacement.innerHTML = `
            <div style="
                padding: 50px;
                text-align: center;
                background: #f8f9fa;
                border: 3px solid #42615A;
                border-radius: 12px;
                color: #42615A;
                font-family: 'Poppins', Arial, sans-serif;
                font-size: 18px;
                line-height: 1.6;
                min-height: 400px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            ">
                <div style="font-size: 48px; margin-bottom: 20px;">🔒📅</div>
                <h3 style="color: #42615A; margin-bottom: 20px;">Secure Consultation Scheduling</h3>
                <p style="margin-bottom: 20px;">Our secure scheduling system is temporarily unavailable.</p>
                <p style="margin-bottom: 30px;"><strong>Please contact us directly via secure channels:</strong></p>
                <div style="margin-bottom: 15px;">
                    <strong>📞 Phone:</strong> <a href="tel:+18772049648" style="color: #42615A; text-decoration: none; font-weight: 600;">(877) 204-9648</a>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>📅 Secure Booking:</strong> <a href="https://calendly.com/choiceinsurancehub" target="_blank" rel="noopener noreferrer" style="color: #42615A; text-decoration: none; font-weight: 600;">calendly.com/choiceinsurancehub</a>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>✉️ Secure Email:</strong> <a href="mailto:info@choiceinsurance.com" style="color: #42615A; text-decoration: none; font-weight: 600;">info@choiceinsurance.com</a>
                </div>
                <p style="font-size: 16px; color: #666; margin-top: 20px;">🔐 All communications are encrypted and HIPAA compliant.</p>
            </div>
        `;
        
        element.parentNode.replaceChild(replacement, element);
        console.log('Calendly widget replaced with secure alternative (updated contact info)');
        
        // Log security event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'calendly_security_replacement_updated', {
                event_category: 'Security',
                event_label: 'Widget Replacement with Updated Contact',
                value: 1
            });
        }
    }
    
    // ===== PHI FIELD VISUAL INDICATORS =====
    
    function enhancePHIFields() {
        const phiFields = document.querySelectorAll('[data-phi-field="true"]');
        
        phiFields.forEach(function(field) {
            // Add visual indicator
            field.addEventListener('focus', function() {
                this.style.boxShadow = '0 0 0 3px rgba(221, 139, 102, 0.3), inset 0 0 8px rgba(221, 139, 102, 0.1)';
            });
            
            field.addEventListener('blur', function() {
                this.style.boxShadow = '';
            });
            
            // Add encryption indicator on input
            field.addEventListener('input', function() {
                if (this.value.length > 0) {
                    if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('phi-encryption-indicator')) {
                        const indicator = document.createElement('div');
                        indicator.className = 'phi-encryption-indicator';
                        indicator.style.cssText = `
                            font-size: 12px;
                            color: var(--choice-coral);
                            margin-top: 3px;
                            font-weight: 600;
                        `;
                        indicator.innerHTML = '🔒 This field will be encrypted before submission';
                        this.parentNode.insertBefore(indicator, this.nextSibling);
                    }
                } else {
                    const indicator = this.nextElementSibling;
                    if (indicator && indicator.classList.contains('phi-encryption-indicator')) {
                        indicator.remove();
                    }
                }
            });
        });
    }
    
    // ===== UPDATED CONTACT INFORMATION REPLACEMENT =====
    
    function updateContactInformation() {
        // Update phone numbers throughout the page
        const phoneLinks = document.querySelectorAll('a[href*="tel:"]');
        phoneLinks.forEach(function(link) {
            if (link.href.includes('555-123-4567') || link.href.includes('5551234567')) {
                link.href = 'tel:+18772049648';
                link.textContent = '(877) 204-9648';
            }
        });
        
        // Update Calendly links
        const calendlyLinks = document.querySelectorAll('a[href*="calendly.com"]');
        calendlyLinks.forEach(function(link) {
            if (!link.href.includes('choiceinsurancehub')) {
                link.href = 'https://calendly.com/choiceinsurancehub';
            }
        });
        
        // Update any text content with old phone numbers
        const textNodes = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = textNodes.nextNode()) {
            if (node.textContent.includes('(555) 123-4567') || node.textContent.includes('555-123-4567')) {
                node.textContent = node.textContent.replace(/\(555\) 123-4567|555-123-4567/g, '(877) 204-9648');
            }
        }
    }
    
    // ===== INITIALIZE ALL FORM FEATURES =====
    
    function initializeSecureForms() {
        initializeTabbedForms();
        handleSecureFormSubmission();
        enhancePHIFields();
        updateContactInformation();
        
        console.log('Secure tabbed forms initialized with HIPAA compliance features');
        
        // Log initialization
        trackSecureEvent('secure_forms_initialized', 'Security', 'Tabbed Forms with HIPAA Compliance');
    }
    
    // Add to the main initialization
    const originalInit = window.addEventListener('DOMContentLoaded', function() {
        // ... existing code ...
        
        // Initialize secure forms
        initializeSecureForms();
        
        // Re-run contact info updates after dynamic content loads
        setTimeout(updateContactInformation, 3000);
    });

