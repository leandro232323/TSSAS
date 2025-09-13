class ImageSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.nav-btn.prev');
        this.nextBtn = document.querySelector('.nav-btn.next');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoSlideInterval = null;

        this.init();
    }

    init() {
        // Event listeners
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.prevBtn.addEventListener('click', () => this.prevSlide());

        // Indicadores clickeables
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Auto-slide cada 6 segundos
        this.startAutoSlide();

        // Pausar auto-slide al hover
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.addEventListener('mouseenter', () => this.stopAutoSlide());
        sliderContainer.addEventListener('mouseleave', () => this.startAutoSlide());

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    nextSlide() {
        this.goToSlide((this.currentSlide + 1) % this.totalSlides);
    }

    prevSlide() {
        this.goToSlide((this.currentSlide - 1 + this.totalSlides) % this.totalSlides);
    }

    goToSlide(index) {
        // Remover clases activas
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');

        // Añadir clase prev al slide anterior
        this.slides[this.currentSlide].classList.add('prev');

        // Remover clase prev después de la transición
        setTimeout(() => {
            this.slides.forEach(slide => slide.classList.remove('prev'));
        }, 1000);

        // Actualizar slide actual
        this.currentSlide = index;

        // Activar nuevo slide
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');
    }

    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 6000);
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    new ImageSlider();
});