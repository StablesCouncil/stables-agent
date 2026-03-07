// Simple scroll-based navigation
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    let isScrolling = false;

    function updateCurrentSlide() {
        const scrollPos = window.scrollY + window.innerHeight / 2;
        slides.forEach((slide, index) => {
            const top = slide.offsetTop;
            const bottom = top + slide.offsetHeight;
            if (scrollPos >= top && scrollPos < bottom) {
                currentSlide = index;
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            updateCurrentSlide();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isScrolling) return;
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentSlide < slides.length - 1) {
                isScrolling = true;
                slides[currentSlide + 1].scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => { isScrolling = false; }, 1000);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentSlide > 0) {
                isScrolling = true;
                slides[currentSlide - 1].scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => { isScrolling = false; }, 1000);
            }
        }
    });

    updateCurrentSlide();
});

