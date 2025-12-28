document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Logic
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburgerBtn && closeMenuBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            mobileMenu.classList.add('open');
        });

        closeMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });

        const mobileLinks = document.querySelectorAll('.mobile-nav-item');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
            });
        });
    }

    // 2. Active Link Logic
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath) {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        }
    });

    // 3. Carousel Logic (Multi-instance support)
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        if (!track) return;

        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.carousel-button--right');
        const prevButton = carousel.querySelector('.carousel-button--left');
        const dotsNav = carousel.querySelector('.carousel-nav');
        const dots = Array.from(dotsNav.children);

        // Position slides next to each other
        // Wait for images or just calculate immediately. 
        // If hidden/resize issues occur, might need to re-calculate on load/resize more robustly.
        const setSlidePositions = () => {
            const slideWidth = slides[0].getBoundingClientRect().width || carousel.getBoundingClientRect().width;
            slides.forEach((slide, index) => {
                slide.style.left = slideWidth * index + 'px';
            });
        };

        setSlidePositions();

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('current-slide');
            targetDot.classList.add('current-slide');
        };

        // Initialize buttons
        prevButton.classList.remove('is-hidden');
        nextButton.classList.remove('is-hidden');

        // Click Left
        prevButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const prevSlide = currentSlide.previousElementSibling;
            const currentDot = dotsNav.querySelector('.current-slide');

            if (prevSlide) {
                const prevDot = currentDot.previousElementSibling;
                moveToSlide(track, currentSlide, prevSlide);
                updateDots(currentDot, prevDot);
            } else {
                // Loop to last slide
                const lastSlide = slides[slides.length - 1];
                const lastDot = dots[dots.length - 1];
                moveToSlide(track, currentSlide, lastSlide);
                updateDots(currentDot, lastDot);
            }
        });

        // Click Right
        nextButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling;
            const currentDot = dotsNav.querySelector('.current-slide');

            if (nextSlide) {
                const nextDot = currentDot.nextElementSibling;
                moveToSlide(track, currentSlide, nextSlide);
                updateDots(currentDot, nextDot);
            } else {
                // Loop to first slide
                const firstSlide = slides[0];
                const firstDot = dots[0];
                moveToSlide(track, currentSlide, firstSlide);
                updateDots(currentDot, firstDot);
            }
        });

        // Click Nav Indicators
        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button');
            if (!targetDot) return;

            const currentSlide = track.querySelector('.current-slide');
            const currentDot = dotsNav.querySelector('.current-slide');
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            const targetSlide = slides[targetIndex];

            moveToSlide(track, currentSlide, targetSlide);
            updateDots(currentDot, targetDot);
        });

        // Resize Fix
        window.addEventListener('resize', () => {
            setSlidePositions();
            const currentSlide = track.querySelector('.current-slide');
            track.style.transform = 'translateX(-' + currentSlide.style.left + ')';
        });
    });
});
