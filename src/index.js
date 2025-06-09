import initScrollReveal from "./scripts/scrollReveal";
import initTiltEffect from "./scripts/tiltAnimation";
import { targetElements, defaultProps } from "./data/scrollRevealConfig";

initScrollReveal(targetElements, defaultProps);
initTiltEffect();

// Subtle parallax scrolling functionality
function initParallax() {
  const hero = document.getElementById('hero');
  
  if (!hero) return;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Only apply parallax to hero section when it's visible
    if (scrolled < windowHeight) {
      // Very subtle background movement
      const parallaxRate = scrolled * 0.3;
      hero.style.backgroundPosition = `center ${parallaxRate}px`;
    }
  }
  
  // Throttle scroll events for performance
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick);
  
  // Initial call
  updateParallax();
}

// Navbar functionality
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  // Mobile menu toggle
  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  
  // Close mobile menu when clicking on links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle?.classList.remove('active');
      navMenu?.classList.remove('active');
    });
  });
  
  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });
}

// Add smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
  // Initialize navbar
  initNavbar();
  // Initialize parallax
  initParallax();
  
  // Special handling for View My Work button
  const viewWorkBtn = document.getElementById('viewWorkBtn');
  if (viewWorkBtn) {
    viewWorkBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Multiple approaches to find projects section
      let projectsSection = document.getElementById('projects');
      if (!projectsSection) {
        projectsSection = document.querySelector('#projects');
      }
      if (!projectsSection) {
        projectsSection = document.querySelector('section[id="projects"]');
      }
      
      if (projectsSection) {
        // Calculate position manually
        const rect = projectsSection.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = rect.top + scrollTop - 80; // Offset for header
        
        // Smooth scroll using both methods
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Fallback for older browsers
        setTimeout(() => {
          projectsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 50);
      } else {
        console.error('Projects section not found!');
        // Fallback scroll to approximate position
        window.scrollTo({
          top: window.innerHeight * 2.5,
          behavior: 'smooth'
        });
      }
    });
  }
  
  // Handle other anchor links
  document.querySelectorAll('a[href^="#"]:not(#viewWorkBtn)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      const target = document.querySelector(href);
      
      if (target) {
        const rect = target.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = rect.top + scrollTop - 80;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
