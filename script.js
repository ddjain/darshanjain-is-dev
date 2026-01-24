// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Dynamic Typing Effect for Multiple Roles
const roles = [
    "Senior Lead Engineer",
    "Backend Architect", 
    "Cloud Solutions Engineer",
    "DevOps Specialist"
];

let currentRoleIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeWriter() {
    const typingElement = document.getElementById('typing-text');
    const currentRole = roles[currentRoleIndex];
    
    if (isDeleting) {
        // Deleting effect
        typingElement.textContent = currentRole.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingSpeed = 50;
    } else {
        // Typing effect
        typingElement.textContent = currentRole.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingSpeed = 100;
    }
    
    // Handle typing completion
    if (!isDeleting && currentCharIndex === currentRole.length) {
        // Pause at the end of typing
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
        // Move to next role
        isDeleting = false;
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before starting next role
    }
    
    setTimeout(typeWriter, typingSpeed);
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Start typing effect after a delay
    setTimeout(() => {
        typeWriter();
    }, 1000);
});

// Scroll-triggered animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Create observers for different animation types
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

const slideLeftObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

const slideRightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        entry.target.classList.add('visible');
    });
}, observerOptions);

// Apply animation classes to elements
document.addEventListener('DOMContentLoaded', () => {
    // Fade in animations
    const fadeElements = document.querySelectorAll('.about-content, .skills-grid, .timeline, .projects-grid, .contact-content');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        fadeObserver.observe(el);
    });

    // Slide in animations for skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        if (index % 2 === 0) {
            category.classList.add('slide-in-left');
            slideLeftObserver.observe(category);
        } else {
            category.classList.add('slide-in-right');
            slideRightObserver.observe(category);
        }
    });

    // Slide in animations for summary cards
    const summaryCards = document.querySelectorAll('.summary-card');
    summaryCards.forEach((card, index) => {
        if (index % 2 === 0) {
            card.classList.add('slide-in-left');
            slideLeftObserver.observe(card);
        } else {
            card.classList.add('slide-in-right');
            slideRightObserver.observe(card);
        }
    });

    // Slide in animations for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        if (index % 2 === 0) {
            card.classList.add('slide-in-left');
            slideLeftObserver.observe(card);
        } else {
            card.classList.add('slide-in-right');
            slideRightObserver.observe(card);
        }
    });

    // Slide in animations for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        if (index % 2 === 0) {
            item.classList.add('slide-in-left');
            slideLeftObserver.observe(item);
        } else {
            item.classList.add('slide-in-right');
            slideRightObserver.observe(item);
        }
    });
});

// Parallax effect for background elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-shapes, .network-pattern');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Enhanced tech stack hover effects
document.querySelectorAll('.tech-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-15px) rotateY(15deg) scale(1.1)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) rotateY(0) scale(1)';
    });
});

// Smooth reveal animation for sections
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll');
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
});

// Apply reveal animations
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.about, .skills, .experience, .projects, .contact');
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});

// Enhanced navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const text = statNumber.textContent;
            const target = parseInt(text.replace(/[^\d]/g, ''));
            
            if (text.includes('+')) {
                animateCounter(statNumber, target, 2000);
            } else if (text.includes('%')) {
                animateCounter(statNumber, target, 2000);
            } else if (text.includes('$')) {
                animateCounter(statNumber, target, 2000);
            }
            
            statsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

// Observe stat items
document.addEventListener('DOMContentLoaded', () => {
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        statsObserver.observe(item);
    });
});

// Enhanced project card interactions
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth loading animation for the entire page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-title, .hero-description, .hero-buttons, .tech-stack');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Initialize page with loading state
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loading');
    
    // Set initial states for hero elements
    const heroElements = document.querySelectorAll('.hero-title, .hero-description, .hero-buttons, .tech-stack');
    heroElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
    });
});

// Enhanced contact form interactions (if form is added later)
function enhanceContactForm() {
    const contactSection = document.querySelector('.contact');
    if (contactSection) {
        // Add form enhancement logic here when needed
        console.log('Contact section enhanced');
    }
}

// Call enhancement function
enhanceContactForm();

// Performance optimization: Throttle scroll events
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
    }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Scroll-based animations
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-shapes, .network-pattern');
    
    parallaxElements.forEach(element => {
        const speed = 0.3;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}, 16);

window.addEventListener('scroll', throttledScrollHandler);

// Enhanced accessibility
document.addEventListener('keydown', (e) => {
    // Escape key to close mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Tab navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// Remove keyboard navigation class on mouse use
document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Add focus styles for keyboard navigation
document.addEventListener('DOMContentLoaded', () => {
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.classList.add('focused');
        });
        
        element.addEventListener('blur', () => {
            element.classList.remove('focused');
        });
    });
});

// Dynamic duration calculation for Red Hat experience
function updateRedHatDuration() {
    const durationElement = document.getElementById('redhat-duration');
    if (!durationElement) return;

    const startDate = new Date(durationElement.getAttribute('data-start-date'));
    const currentDate = new Date();

    // Calculate the difference in months
    let years = currentDate.getFullYear() - startDate.getFullYear();
    let months = currentDate.getMonth() - startDate.getMonth();

    // Adjust if current month/day is before start month/day
    if (months < 0) {
        years--;
        months += 12;
    }

    // Format the duration string
    let durationText = 'January 2026 - Present';

    if (years > 0 && months > 0) {
        durationText += ` · ${years} yr${years > 1 ? 's' : ''} ${months} mo${months > 1 ? 's' : ''}`;
    } else if (years > 0) {
        durationText += ` · ${years} yr${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
        durationText += ` · ${months} mo${months > 1 ? 's' : ''}`;
    } else {
        // Less than a month
        durationText += ' · 1 mo';
    }

    durationElement.textContent = durationText;
}

// Update duration on page load and every day
document.addEventListener('DOMContentLoaded', () => {
    updateRedHatDuration();
    // Update once per day (86400000 milliseconds)
    setInterval(updateRedHatDuration, 86400000);
});

// Console welcome message
console.log('%c🚀 Welcome to Darshan Jain\'s Portfolio!', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ using modern web technologies', 'color: #ccc; font-size: 14px;');
