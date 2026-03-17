const img = document.getElementById('carousel');
const rightBtn = document.getElementById('right-btn');
const leftBtn = document.getElementById('left-btn');
const link = document.getElementById('carousel-link');
const title = document.getElementById('carousel-title');
const subtitle = document.getElementById('carousel-subtitle');

const slides = (window.carouselSlides || []).map((slide) => ({
    src: slide.image,
    title: slide.title,
    subtitle: slide.subtitle,
    href: slide.route
}));

let position = 0;

const renderSlide = (index) => {
    const slide = slides[index];
    img.src = slide.src;
    img.alt = slide.title;
    title.textContent = slide.title;
    subtitle.textContent = slide.subtitle;
    link.href = slide.href;
};

let isTransitioning = false;

const transitionTo = (index, direction) => {
    if (isTransitioning) return;
    isTransitioning = true;

    const exitClass = direction === 'right' ? 'slide-out-left' : 'slide-out-right';
    const enterClass = direction === 'right' ? 'slide-in-right' : 'slide-in-left';

    img.classList.remove('slide-in-left', 'slide-in-right', 'slide-out-left', 'slide-out-right', 'slide-active');
    img.classList.add(exitClass);

    setTimeout(() => {
        renderSlide(index);
        img.classList.remove(exitClass);
        img.classList.add(enterClass);
        void img.offsetWidth;
        img.classList.add('slide-active');

        setTimeout(() => {
            img.classList.remove(enterClass);
            isTransitioning = false;
        }, 220);
    }, 180);
};

if (slides.length > 0) {
    renderSlide(position);
    img.classList.add('slide-active');
}

const moveRight = () => {
    if (slides.length === 0) return;
    if (position >= slides.length - 1) {
        position = 0;
        transitionTo(position, 'right');
        return;
    }
    position++;
    transitionTo(position, 'right');
}

const moveLeft = () => {
    if (slides.length === 0) return;
    if (position < 1) {
        position = slides.length - 1;
        transitionTo(position, 'left');
        return;
    }
    position--;
    transitionTo(position, 'left');
}

rightBtn.addEventListener("click", moveRight);
leftBtn.addEventListener("click", moveLeft);
