/**
 * Smart Agriculture AI System - JavaScript
 * Handles interactive features, animations, and navigation
 */

// ============================================================================
// Model Details Data
// ============================================================================

const modelDetails = {
    irrigation: {
        icon: '💧',
        title: 'Irrigation Prediction Model',
        description: 'Ridge regression model predicts optimal water requirements (0-100 L/m²) based on soil moisture, temperature, humidity, and rainfall patterns.',
        features: [
            'Real-time water optimization',
            'Weather-adaptive recommendations',
            'Urgency-based alerts (Critical/Moderate/Low)',
            'Historical trend analysis'
        ],
        badge: 'Regression Model'
    },
    health: {
        icon: '🌱',
        title: 'Crop Health Classification Model',
        description: 'Random Forest classifier categorizes crops into three health states with 95%+ accuracy using multi-parameter analysis.',
        features: [
            '3-class health assessment (Healthy/Moderate/High Stress)',
            'Probability distribution insights',
            'Factor-based diagnostics',
            'Actionable recommendations'
        ],
        badge: 'Classification'
    },
    yield: {
        icon: '📈',
        title: 'Yield Prediction Model',
        description: 'Time-series forecasting estimates crop yield and optimal harvest timing using seasonal environmental data patterns.',
        features: [
            'Harvest date optimization',
            'Yield estimation (kg/hectare)',
            'Growth trajectory visualization',
            'Confidence metrics'
        ],
        badge: 'Time-Series'
    },
    anomaly: {
        icon: '⚠️',
        title: 'Anomaly Detection Model',
        description: 'Rule-based and statistical anomaly detection identifies abnormal conditions before they become critical problems.',
        features: [
            'Sudden moisture loss detection',
            'Temperature extremes monitoring',
            'Statistical outlier analysis (Z-score)',
            'Multi-severity alerts'
        ],
        badge: 'Hybrid Detection'
    }
};

// ============================================================================
// Modal Functionality
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modelModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.modal-close');
    const modelButtons = document.querySelectorAll('.model-button');

    // Open modal when button is clicked
    modelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modelType = this.getAttribute('data-model');
            const details = modelDetails[modelType];

            if (details) {
                // Populate modal content
                modalBody.innerHTML = `
                    <div class="modal-icon">${details.icon}</div>
                    <h3>${details.title}</h3>
                    <p>${details.description}</p>
                    <h4 style="color: var(--text-primary); margin-top: 2rem; margin-bottom: 1rem;">Key Features:</h4>
                    <ul>
                        ${details.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <div class="modal-badge">${details.badge}</div>
                `;

                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal when X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// ============================================================================
// Smooth Scrolling for Navigation Links
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
});

// ============================================================================
// Active Navigation Link Based on Scroll Position
// ============================================================================

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============================================================================
// Navbar Scroll Effect
// ============================================================================

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ============================================================================
// Intersection Observer for Fade-In Animations
// ============================================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .step, .tech-category');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ============================================================================
// Counter Animation for Stats
// ============================================================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Handle percentage values
        if (element.textContent.includes('%')) {
            element.textContent = Math.round(current) + '%';
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// Animate counters when they come into view
const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            
            const targetText = entry.target.textContent;
            const targetValue = parseInt(targetText.replace(/[^0-9]/g, ''));
            
            if (!isNaN(targetValue)) {
                animateCounter(entry.target, targetValue);
            }
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    const statValues = document.querySelectorAll('.stat-value, .about-stat strong');
    statValues.forEach(stat => {
        counterObserver.observe(stat);
    });
});

// ============================================================================
// Mobile Menu Toggle (for future implementation)
// ============================================================================

function initMobileMenu() {
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-toggle';
    menuButton.innerHTML = '☰';
    menuButton.style.display = 'none';
    
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
        navContainer.appendChild(menuButton);
    }
    
    // Show/hide based on screen size
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            menuButton.style.display = 'block';
        } else {
            menuButton.style.display = 'none';
        }
    }
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
    
    // Toggle menu
    menuButton.addEventListener('click', function() {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.toggle('active');
    });
}

document.addEventListener('DOMContentLoaded', initMobileMenu);

// ============================================================================
// Form Validation (if contact form is added)
// ============================================================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            
            if (emailInput && !validateEmail(emailInput.value)) {
                alert('Please enter a valid email address');
                emailInput.focus();
                return false;
            }
            
            // If validation passes, you can submit the form
            console.log('Form validated successfully');
            // form.submit(); // Uncomment when ready to actually submit
        });
    });
}

document.addEventListener('DOMContentLoaded', initFormValidation);

// ============================================================================
// Loading Animation
// ============================================================================

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// ============================================================================
// Copy to Clipboard Functionality
// ============================================================================

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            showNotification('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
        
        document.body.removeChild(textarea);
    }
}

// ============================================================================
// Notification System
// ============================================================================

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        border-left: 4px solid #667eea;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, duration);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================================================
// Utility Functions
// ============================================================================

// Debounce function for performance
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

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================================================
// External Link Handling
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    
    externalLinks.forEach(link => {
        // Skip if it's a link to the same domain
        if (link.hostname === window.location.hostname) return;
        
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
});

// ============================================================================
// Print Functionality
// ============================================================================

function printPage() {
    window.print();
}

// Add print button to dashboard if present
document.addEventListener('DOMContentLoaded', function() {
    const dashboard = document.querySelector('.dashboard-grid');
    
    if (dashboard) {
        const printButton = document.createElement('button');
        printButton.className = 'action-button';
        printButton.textContent = '🖨️ Print Dashboard';
        printButton.onclick = printPage;
        
        const header = document.querySelector('header');
        if (header) {
            header.appendChild(printButton);
        }
    }
});

// ============================================================================
// Keyboard Shortcuts
// ============================================================================

document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search (if implemented)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close modals (if implemented)
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// ============================================================================
// Local Storage for User Preferences
// ============================================================================

const preferences = {
    get: function(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            return null;
        }
    },
    
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Failed to save preference:', e);
            return false;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    }
};

// ============================================================================
// Performance Monitoring
// ============================================================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            console.log(`Page load time: ${pageLoadTime}ms`);
        }, 0);
    });
}

// ============================================================================
// Console Easter Egg
// ============================================================================

console.log('%c🌾 Smart Agriculture AI System', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ for sustainable farming', 'color: #764ba2; font-size: 14px;');

// ============================================================================
// Export functions for use in other scripts
// ============================================================================

window.smartAgri = {
    showNotification,
    copyToClipboard,
    preferences,
    debounce,
    throttle
};