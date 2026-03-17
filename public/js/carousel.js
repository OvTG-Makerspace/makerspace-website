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

if (slides.length > 0) {
    renderSlide(position);
}

const moveRight = () => {
    if (slides.length === 0) return;
    if (position >= slides.length - 1) {
        position = 0
        renderSlide(position);
        return;
    }
    position++;
    renderSlide(position);
}

const moveLeft = () => {
    if (slides.length === 0) return;
    if (position < 1) {
        position = slides.length - 1;
        renderSlide(position);
        return;
    }
    position--;
    renderSlide(position);
}

rightBtn.addEventListener("click", moveRight);
leftBtn.addEventListener("click", moveLeft);
