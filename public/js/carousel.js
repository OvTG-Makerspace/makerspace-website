const img = document.getElementById('carousel');
const rightBtn = document.getElementById('right-btn');
const leftBtn = document.getElementById('left-btn');
const link = document.getElementById('carousel-link');
const title = document.getElementById('carousel-title');
const subtitle = document.getElementById('carousel-subtitle');

// Images are from Unsplash
const slides = [
    {
        src: 'https://images.unsplash.com/photo-1537000092872-06bbf7b64f60?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=14d2fe1244b43a1841569da918066fc4&auto=format&fit=crop&w=1400&q=80',
        title: 'Prototyping Workshop',
        subtitle: 'Tools, mentorship, and space to build your next idea.',
        href: '/courses'
    },
    {
        src: 'https://images.unsplash.com/photo-1537005081207-04f90e3ba640?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ffb71f2a2843e802e238c5ff8e4bbb8c&auto=format&fit=crop&w=1400&q=80',
        title: 'Open Lab Nights',
        subtitle: 'Bring your project and get feedback from the community.',
        href: '/about'
    },
    {
        src: 'https://images.unsplash.com/photo-1536873602512-8e88cc8398b1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=60a351868d0839e686c8c5a286265f8d&auto=format&fit=crop&w=1400&q=80',
        title: 'Join the Makerspace',
        subtitle: 'Memberships, events, and equipment for all skill levels.',
        href: '/contact'
    }
];

let position = 0;

const renderSlide = (index) => {
    const slide = slides[index];
    img.src = slide.src;
    img.alt = slide.title;
    title.textContent = slide.title;
    subtitle.textContent = slide.subtitle;
    link.href = slide.href;
};

renderSlide(position);

const moveRight = () => {
    if (position >= slides.length - 1) {
        position = 0
        renderSlide(position);
        return;
    }
    position++;
    renderSlide(position);
}

const moveLeft = () => {
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
