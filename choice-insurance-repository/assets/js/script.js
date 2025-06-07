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

