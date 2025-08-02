// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved user preference, if any, on load and set the theme
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateDarkModeButton(true);
    }

    // Dark mode toggle functionality
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                updateDarkModeButton(false);
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                updateDarkModeButton(true);
            }
        });
    }

    // Update dark mode button icon and text
    function updateDarkModeButton(isDark) {
        if (!darkModeToggle) return;
        const icon = darkModeToggle.querySelector('i');
        const text = darkModeToggle.querySelector('span');
        
        if (isDark) {
            icon.className = 'fas fa-sun';
            if (text) text.textContent = 'Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            if (text) text.textContent = 'Dark Mode';
        }
    }

    // Only add event listener if elements exist
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (hamburger) {
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    // Download Resume button functionality
    const downloadResumeBtn = document.getElementById('downloadResume');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Replace this with your actual resume file path
            const resumeUrl = '#'; // Add your resume file path here
            if (resumeUrl !== '#') {
                const link = document.createElement('a');
                link.href = resumeUrl;
                link.download = 'Your-Name-Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                // If no resume is uploaded, show an alert
                alert('Resume file not found. Please check back later or contact me directly.');
            }
        });
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll-based animations
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.section, .project-card, .certificate-card, .skill-tag');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('show');
            }
        });
    };

    // Initial check for elements in viewport
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Project Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state of buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filter projects
            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    // Trigger reflow for animation
                    void item.offsetWidth;
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                    // Remove from display after animation
                    setTimeout(() => {
                        if (item.classList.contains('hidden')) {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });

    // Initialize Isotope for filtering with smooth animations
    initIsotope();
});

// Initialize Isotope for advanced filtering with smooth animations
function initIsotope() {
    // Check if Isotope is loaded
    if (typeof Isotope === 'undefined') {
        // If not, load it dynamically
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js';
        script.onload = function() {
            setupIsotope();
        };
        document.body.appendChild(script);
    } else {
        setupIsotope();
    }
}

function setupIsotope() {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;
    
    // Initialize Isotope
    const iso = new Isotope(grid, {
        itemSelector: '.project-item',
        layoutMode: 'fitRows',
        transitionDuration: '0.7s',
        hiddenStyle: {
            opacity: 0,
            transform: 'translateY(20px)'
        },
        visibleStyle: {
            opacity: 1,
            transform: 'translateY(0)'
        }
    });
    
    // Filter button click handler
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            iso.arrange({
                filter: filterValue === 'all' ? '*' : `[data-category="${filterValue}"]`
            });
        });
    });
}
