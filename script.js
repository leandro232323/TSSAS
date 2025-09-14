class ImageSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.nav-btn.prev');
        this.nextBtn = document.querySelector('.nav-btn.next');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoSlideInterval = null;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.init();
    }

    init() {
        // Verificar que existan los elementos necesarios
        if (!this.slides.length || !this.indicators.length) {
            console.warn('Slider: No se encontraron slides o indicadores');
            return;
        }

        // Event listeners para botones
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
        }

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevSlide();
            });
        }

        // Indicadores clickeables
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToSlide(index);
            });

            // Soporte para teclado en indicadores
            indicator.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToSlide(index);
                }
            });

            // Hacer indicadores accesibles
            indicator.setAttribute('tabindex', '0');
            indicator.setAttribute('role', 'button');
        });

        // Soporte para touch/swipe en dispositivos móviles
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            });

            sliderContainer.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            });

            // Auto-slide con pausa en hover
            sliderContainer.addEventListener('mouseenter', () => this.stopAutoSlide());
            sliderContainer.addEventListener('mouseleave', () => this.startAutoSlide());

            // Pausa cuando el usuario interactúa
            sliderContainer.addEventListener('touchstart', () => this.stopAutoSlide());
            sliderContainer.addEventListener('touchend', () => {
                // Reanudar después de 3 segundos de inactividad
                setTimeout(() => {
                    if (!this.autoSlideInterval) {
                        this.startAutoSlide();
                    }
                }, 3000);
            });
        }

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        });

        // Pausar cuando la pestaña no está visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoSlide();
            } else {
                this.startAutoSlide();
            }
        });

        // Auto-slide inicial
        this.startAutoSlide();

        // Inicializar estado
        this.updateSlideStates();
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchEndX - this.touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
        }
    }

    nextSlide() {
        if (this.isTransitioning) return;
        this.goToSlide((this.currentSlide + 1) % this.totalSlides);
    }

    prevSlide() {
        if (this.isTransitioning) return;
        this.goToSlide((this.currentSlide - 1 + this.totalSlides) % this.totalSlides);
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;

        this.isTransitioning = true;

        // Remover clases activas
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.remove('active');
        }
        if (this.indicators[this.currentSlide]) {
            this.indicators[this.currentSlide].classList.remove('active');
        }

        // Añadir clase prev al slide anterior
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('prev');
        }

        // Actualizar slide actual
        const previousSlide = this.currentSlide;
        this.currentSlide = index;

        // Activar nuevo slide
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('active');
        }
        if (this.indicators[this.currentSlide]) {
            this.indicators[this.currentSlide].classList.add('active');
        }

        // Remover clase prev después de la transición
        setTimeout(() => {
            if (this.slides[previousSlide]) {
                this.slides[previousSlide].classList.remove('prev');
            }
            this.isTransitioning = false;
        }, 1000);

        // Actualizar estados para lectores de pantalla
        this.updateSlideStates();
    }

    updateSlideStates() {
        this.slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index !== this.currentSlide);
        });

        this.indicators.forEach((indicator, index) => {
            indicator.setAttribute('aria-pressed', index === this.currentSlide);
        });
    }

    startAutoSlide() {
        // No iniciar auto-slide si el usuario prefiere movimiento reducido
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        this.stopAutoSlide(); // Limpiar cualquier intervalo existente
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

    // Método para destruir el slider si es necesario
    destroy() {
        this.stopAutoSlide();
        // Remover event listeners si fuera necesario
    }
}

// Función para smooth scroll mejorada
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Calcular offset para navegación fija
                const navHeight = document.querySelector('nav')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Actualizar URL sin hacer scroll
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
}

// Función para manejar carga de imágenes
function handleImageLoading() {
    const slides = document.querySelectorAll('.slide');
    
    slides.forEach(slide => {
        const bgImage = window.getComputedStyle(slide).backgroundImage;
        if (bgImage && bgImage !== 'none') {
            const imageUrl = bgImage.slice(5, -2); // Remover 'url("' y '")'
            const img = new Image();
            
            img.onload = function() {
                slide.classList.add('image-loaded');
            };
            
            img.onerror = function() {
                slide.classList.add('image-error');
                console.warn(`Error al cargar imagen: ${imageUrl}`);
            };
            
            if (imageUrl && imageUrl !== 'none') {
                img.src = imageUrl;
            }
        }
    });
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    // Verificar compatibilidad básica
    if (!document.querySelector || !document.addEventListener) {
        console.warn('Browser no soportado completamente');
        return;
    }

    // Inicializar componentes
    try {
        new ImageSlider();
        initSmoothScroll();
        handleImageLoading();
    } catch (error) {
        console.error('Error al inicializar componentes:', error);
    }
});

// Manejar redimensionamiento de ventana
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalcular dimensiones si es necesario
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            // Forzar repaint para evitar problemas de layout
            sliderContainer.style.display = 'none';
            sliderContainer.offsetHeight; // Trigger reflow
            sliderContainer.style.display = '';
        }
    }, 250);
});

// Manejar errores globales relacionados con el slider
window.addEventListener('error', (e) => {
    if (e.filename && e.filename.includes('script.js')) {
        console.error('Error en slider:', e.message);
    }
});