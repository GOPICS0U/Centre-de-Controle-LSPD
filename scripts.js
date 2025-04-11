/**
 * LSPD Control Center - Main JavaScript
 * Enhanced functionality for LSPD GTA RP website
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initCounters();
    initMobileMenu();
    addLSPDBadge();
    
    // Set current date in forms if date input exists
    const dateInputs = document.querySelectorAll('input[type="datetime-local"]');
    if (dateInputs.length > 0) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
        dateInputs.forEach(input => {
            input.value = formattedDate;
        });
    }
});

/**
 * Initialize dropdown navigation
 */
function initNavigation() {
    const dropdowns = document.querySelectorAll('.dropdown > a');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Toggle active class with animation
            const parentDropdown = this.parentElement;
            parentDropdown.classList.toggle('active');
            
            // Add accessibility attributes
            const expanded = parentDropdown.classList.contains('active');
            this.setAttribute('aria-expanded', expanded);
            
            // Close other open dropdowns
            const otherDropdowns = document.querySelectorAll('.dropdown.active');
            otherDropdowns.forEach(otherDropdown => {
                if (otherDropdown !== parentDropdown) {
                    otherDropdown.classList.remove('active');
                    otherDropdown.querySelector('a').setAttribute('aria-expanded', 'false');
                }
            });
        });
        
        // Set initial accessibility attributes
        dropdown.setAttribute('aria-haspopup', 'true');
        dropdown.setAttribute('aria-expanded', 'false');
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown')) {
            const activeDropdowns = document.querySelectorAll('.dropdown.active');
            activeDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                dropdown.querySelector('a').setAttribute('aria-expanded', 'false');
            });
        }
    });
    
    // Add active class to current page link
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active-page');
            
            // If it's in a dropdown, open the dropdown
            const parentDropdown = link.closest('.dropdown-content');
            if (parentDropdown) {
                parentDropdown.parentElement.classList.add('current-section');
            }
        }
    });
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    // Add fade-up class to sections if not already present
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (!section.classList.contains('fade-up')) {
            section.classList.add('fade-up');
        }
    });
    
    // Handle scroll animations
    const handleScroll = () => {
        const elements = document.querySelectorAll(".fade-up");
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const offset = window.innerHeight * 0.8;
            
            if (rect.top < offset) {
                el.classList.add("active");
            }
        });
    };
    
    // Initial check and add scroll listener
    handleScroll();
    document.addEventListener("scroll", handleScroll);
}

/**
 * Initialize counter animations
 */
function initCounters() {
    const counters = document.querySelectorAll('.count');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = +counter.getAttribute('data-duration') || 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCount = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    // Check if mobile menu toggle exists
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!menuToggle) {
        // Create mobile menu toggle if it doesn't exist
        const nav = document.querySelector('nav .container');
        
        if (nav) {
            const toggle = document.createElement('button');
            toggle.className = 'mobile-menu-toggle';
            toggle.innerHTML = '<span></span><span></span><span></span>';
            toggle.setAttribute('aria-label', 'Toggle menu');
            
            // Insert at the beginning of nav
            nav.insertBefore(toggle, nav.firstChild);
            
            // Add event listener
            toggle.addEventListener('click', function() {
                document.body.classList.toggle('mobile-menu-open');
                this.classList.toggle('active');
                
                const isOpen = this.classList.contains('active');
                this.setAttribute('aria-expanded', isOpen);
            });
        }
    }
}

/**
 * Add LSPD badge to the page
 */
function addLSPDBadge() {
    // Check if we're on the homepage
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        const header = document.querySelector('header');
        
        if (header) {
            const badge = document.createElement('div');
            badge.className = 'lspd-badge';
            badge.innerHTML = `
                <div class="badge-inner">
                    <div class="badge-star">★</div>
                    <div class="badge-text">LSPD</div>
                </div>
            `;
            
            header.appendChild(badge);
            
            // Add badge styles if not already in CSS
            const style = document.createElement('style');
            style.textContent = `
                .lspd-badge {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 80px;
                    height: 80px;
                    background: var(--lspd-blue, #1a56a7);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
                    border: 3px solid var(--lspd-accent, #ffcc00);
                    z-index: 2;
                    animation: badgePulse 2s infinite alternate;
                }
                
                .badge-inner {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                
                .badge-star {
                    font-size: 30px;
                    color: var(--lspd-accent, #ffcc00);
                    margin-bottom: -5px;
                }
                
                .badge-text {
                    font-weight: bold;
                    color: white;
                    font-size: 16px;
                    letter-spacing: 1px;
                }
                
                @keyframes badgePulse {
                    0% {
                        transform: scale(1);
                    }
                    100% {
                        transform: scale(1.05);
                    }
                }
                
                @media (max-width: 768px) {
                    .lspd-badge {
                        width: 60px;
                        height: 60px;
                        top: 10px;
                        right: 10px;
                    }
                    
                    .badge-star {
                        font-size: 24px;
                    }
                    
                    .badge-text {
                        font-size: 12px;
                    }
                }
            `;
            
            document.head.appendChild(style);
        }
    }
}

/**
 * Copy text to clipboard with improved feedback
 * @param {string} elementId - ID of element containing text to copy
 */
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    
    if (!element) return;
    
    // Create temporary textarea to handle the copy
    const textarea = document.createElement('textarea');
    textarea.value = element.value || element.textContent;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        const successful = document.execCommand('copy');
        
        if (successful) {
            // Create and show toast notification
            showToast('Copié avec succès !');
        } else {
            showToast('Échec de la copie', 'error');
        }
    } catch (err) {
        console.error('Erreur lors de la copie:', err);
        showToast('Erreur lors de la copie', 'error');
    }
    
    document.body.removeChild(textarea);
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error)
 */
function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
        
        // Add toast styles
        const style = document.createElement('style');
        style.textContent = `
            .toast-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
            }
            
            .toast {
                padding: 12px 20px;
                margin-bottom: 10px;
                border-radius: 4px;
                color: white;
                font-weight: 500;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards;
                max-width: 300px;
            }
            
            .toast.success {
                background-color: #10b981;
            }
            
            .toast.error {
                background-color: #ef4444;
            }
            
            .toast::before {
                content: '';
                margin-right: 10px;
                width: 20px;
                height: 20px;
                background-size: contain;
                background-repeat: no-repeat;
            }
            
            .toast.success::before {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E");
            }
            
            .toast.error::before {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z'/%3E%3C/svg%3E");
            }
            
            @keyframes toastIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes toastOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Remove after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}