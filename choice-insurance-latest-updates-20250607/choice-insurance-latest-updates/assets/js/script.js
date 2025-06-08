// Google Tag Manager Event Tracking
function gtmTrackEvent(action, category, label, value) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
    
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            event: 'custom_event',
            event_action: action,
            event_category: category,
            event_label: label,
            event_value: value
        });
    }
}

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Track mobile menu interaction
            gtmTrackEvent('click', 'navigation', 'mobile_menu_toggle', 'header');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
});

// Dropdown Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.querySelector('.dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (dropdown && dropdownToggle && dropdownMenu) {
        let dropdownTimeout;
        
        // Show dropdown on hover
        dropdown.addEventListener('mouseenter', function() {
            clearTimeout(dropdownTimeout);
            dropdownMenu.style.opacity = '1';
            dropdownMenu.style.visibility = 'visible';
            dropdownMenu.style.marginTop = '0.5rem';
            
            // Track dropdown interaction
            gtmTrackEvent('hover', 'navigation', 'services_dropdown_open', 'header');
        });
        
        // Hide dropdown on mouse leave with delay
        dropdown.addEventListener('mouseleave', function() {
            dropdownTimeout = setTimeout(function() {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
                dropdownMenu.style.marginTop = '1rem';
            }, 200);
        });
        
        // Click functionality for mobile
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isVisible = dropdownMenu.style.visibility === 'visible';
            
            if (isVisible) {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
                dropdownMenu.style.marginTop = '1rem';
            } else {
                dropdownMenu.style.opacity = '1';
                dropdownMenu.style.visibility = 'visible';
                dropdownMenu.style.marginTop = '0.5rem';
            }
            
            // Track dropdown click
            gtmTrackEvent('click', 'navigation', 'services_dropdown_toggle', 'header');
        });
        
        // Track dropdown link clicks
        const dropdownLinks = document.querySelectorAll('.dropdown-link');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function() {
                const linkText = this.textContent.trim();
                gtmTrackEvent('click', 'navigation', 'dropdown_link_click', linkText);
                
                // Hide dropdown after click
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
                dropdownMenu.style.marginTop = '1rem';
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
                dropdownMenu.style.marginTop = '1rem';
            }
        });
    }
});

// Smooth Scrolling for Anchor Links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Track anchor link clicks
                gtmTrackEvent('click', 'navigation', 'anchor_link', href);
            }
        });
    });
});

// Header Scroll Effect
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
});

// Click Tracking for All Buttons and Links
document.addEventListener('DOMContentLoaded', function() {
    // Track all button clicks
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            const buttonClass = this.className;
            gtmTrackEvent('click', 'button', 'button_click', buttonText);
        });
    });
    
    // Track service card clicks
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('h3').textContent;
            gtmTrackEvent('click', 'service', 'service_card_click', serviceName);
        });
    });
    
    // Track feature item clicks
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('click', function() {
            const featureName = this.querySelector('h3').textContent;
            gtmTrackEvent('click', 'feature', 'feature_click', featureName);
        });
    });
});

// Intersection Observer for Animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Track section views
                const sectionId = entry.target.id || entry.target.className;
                gtmTrackEvent('view', 'section', 'section_view', sectionId);
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    const sections = document.querySelectorAll('section, .service-card, .feature-item');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Contact Information Click Tracking
document.addEventListener('DOMContentLoaded', function() {
    // Track phone number clicks
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            const phoneNumber = this.href.replace('tel:', '');
            gtmTrackEvent('contact', 'phone', 'phone_click', phoneNumber);
        });
    });
    
    // Track email clicks
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            const email = this.href.replace('mailto:', '');
            gtmTrackEvent('contact', 'email', 'email_click', email);
        });
    });
});

// Click Tracking for External Links
document.addEventListener('DOMContentLoaded', function() {
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            const url = this.href;
            gtmTrackEvent('click', 'external_link', 'outbound_click', url);
        });
    });
});

// Scroll Depth Tracking
document.addEventListener('DOMContentLoaded', function() {
    let scrollDepths = [25, 50, 75, 100];
    let scrollDepthsReached = [];
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !scrollDepthsReached.includes(depth)) {
                scrollDepthsReached.push(depth);
                gtmTrackEvent('scroll', 'engagement', 'scroll_depth', depth + '%');
            }
        });
    });
});

// Performance Monitoring
document.addEventListener('DOMContentLoaded', function() {
    // Track page load time
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            gtmTrackEvent('timing', 'performance', 'page_load_time', Math.round(pageLoadTime));
        }, 0);
    });
});

// Error Tracking
window.addEventListener('error', function(e) {
    gtmTrackEvent('exception', 'javascript', 'js_error', e.message);
});

// Add CSS for animations
const animationCSS = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
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
    
    .header.scrolled {
        background-color: rgba(66, 97, 90, 0.95);
        backdrop-filter: blur(10px);
    }
`;

// Inject animation CSS
const style = document.createElement('style');
style.textContent = animationCSS;
document.head.appendChild(style);


// Simple Contact Integration (Calendly removed due to 404 errors)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact buttons to scroll to contact section
    const consultationButtons = document.querySelectorAll('a[href="#consultation"], a[href="#contact"]');
    
    consultationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Scroll to contact section
            const contactSection = document.getElementById('contact') || document.querySelector('.footer');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Track interaction
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'cta',
                    'event_label': 'consultation_request'
                });
            }
        });
    });
});

// Plan Enrollment Links
document.addEventListener('DOMContentLoaded', function() {
    // Create plan enrollment functionality
    const planEnrollmentLinks = document.querySelectorAll('.plan-enroll, .enroll-now');
    
    planEnrollmentLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const planType = this.getAttribute('data-plan') || 'general';
            
            // Track plan enrollment click
            gtmTrackEvent('click', 'enrollment', 'plan_enrollment_start', planType);
            
            // Open enrollment form or redirect to enrollment page
            openEnrollmentModal(planType);
        });
    });
});

// Enrollment Modal Function
function openEnrollmentModal(planType) {
    // Create modal HTML
    const modalHTML = `
        <div id="enrollment-modal" class="modal-overlay" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <div class="modal-content" style="
                background: white;
                border-radius: 12px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
            ">
                <button class="modal-close" style="
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                ">&times;</button>
                
                <h2 style="color: var(--primary-color); margin-bottom: 1rem;">
                    Start Your ${planType.charAt(0).toUpperCase() + planType.slice(1)} Enrollment
                </h2>
                
                <p style="margin-bottom: 1.5rem; color: #666;">
                    We're here to help you find the perfect insurance plan. Choose how you'd like to get started:
                </p>
                
                <div class="enrollment-options" style="display: flex; flex-direction: column; gap: 1rem;">
                    <button class="btn btn-primary" onclick="scheduleConsultation()" style="width: 100%; padding: 1rem;">
                        📅 Schedule a Free Consultation
                    </button>
                    
                    <button class="btn btn-secondary" onclick="callNow()" style="width: 100%; padding: 1rem;">
                        📞 Call Now: (877) 204-9648
                    </button>
                    
                    <button class="btn btn-outline" onclick="emailUs()" style="width: 100%; padding: 1rem;">
                        ✉️ Email Us Your Questions
                    </button>
                </div>
                
                <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #eee; text-align: center;">
                    <p style="font-size: 0.9rem; color: #666; margin-bottom: 0;">
                        Licensed in IL, AL, GA, OH, KY, MS, SC, TX
                    </p>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add close functionality
    const modal = document.getElementById('enrollment-modal');
    const closeBtn = modal.querySelector('.modal-close');
    
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Enrollment Modal Actions
function scheduleConsultation() {
    document.getElementById('enrollment-modal').remove();
    
    // Scroll to contact section instead of Calendly
    const contactSection = document.getElementById('contact') || document.querySelector('.footer');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Track interaction
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'enrollment',
            'event_label': 'schedule_consultation'
        });
    }
}

function callNow() {
    window.location.href = 'tel:+18772049648';
    gtmTrackEvent('click', 'enrollment', 'phone_call', 'modal');
    document.getElementById('enrollment-modal').remove();
}

function emailUs() {
    window.location.href = 'mailto:info@choiceinsurancehub.com?subject=Insurance Enrollment Inquiry';
    gtmTrackEvent('click', 'enrollment', 'email_contact', 'modal');
    document.getElementById('enrollment-modal').remove();
}

