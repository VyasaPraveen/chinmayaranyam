/**
 * Chinmayaranyam - Main JavaScript
 */
(function () {
    'use strict';

    // --- Enhanced AOS Initialization ---
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 900,
                easing: 'ease-out-cubic',
                once: true,
                offset: 80,
                delay: 0,
                anchorPlacement: 'top-bottom'
            });
        }
    });

    // --- Preloader ---
    window.addEventListener('load', function () {
        var preloader = document.querySelector('.preloader');
        if (preloader) {
            setTimeout(function () {
                preloader.classList.add('fade-out');
                document.body.classList.add('page-loaded');
                setTimeout(function () {
                    if (preloader.parentNode) {
                        preloader.parentNode.removeChild(preloader);
                    }
                }, 800);
            }, 600);
        } else {
            document.body.classList.add('page-loaded');
        }
    });

    // --- Navbar scroll behavior ---
    window.addEventListener('scroll', function () {
        var navbar = document.querySelector('.navbar-chinmaya');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }

        // Back to top button visibility
        var backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }
    });

    // --- Back to top click handler ---
    document.addEventListener('click', function (e) {
        if (e.target.closest('#back-to-top')) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // --- Enhanced Smooth scroll for anchor links ---
    document.addEventListener('click', function (e) {
        var anchor = e.target.closest('a[href^="#"]');
        if (anchor && anchor.getAttribute('href') !== '#') {
            var targetId = anchor.getAttribute('href');
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var navbarHeight = document.querySelector('.navbar-chinmaya')
                    ? document.querySelector('.navbar-chinmaya').offsetHeight
                    : 0;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        }
    });

    // --- Button Ripple Effect ---
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.btn-saffron, .btn-gold, .btn-outline-gold, .btn-outline-cream, .btn-contribute-nav');
        if (!btn) return;

        var existingRipple = btn.querySelector('.btn-ripple');
        if (existingRipple) existingRipple.remove();

        var ripple = document.createElement('span');
        ripple.classList.add('btn-ripple');

        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

        btn.appendChild(ripple);
        setTimeout(function () {
            if (ripple.parentNode) ripple.remove();
        }, 600);
    });

    // --- Gallery Lightbox ---
    (function initLightbox() {
        var overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML =
            '<button class="lightbox-close" aria-label="Close lightbox"><i class="bi bi-x-lg"></i></button>' +
            '<button class="lightbox-nav lightbox-prev" aria-label="Previous image"><i class="bi bi-chevron-left"></i></button>' +
            '<img src="" alt="">' +
            '<button class="lightbox-nav lightbox-next" aria-label="Next image"><i class="bi bi-chevron-right"></i></button>' +
            '<div class="lightbox-caption"></div>';
        document.body.appendChild(overlay);

        var lightboxImg = overlay.querySelector('img');
        var lightboxCaption = overlay.querySelector('.lightbox-caption');
        var currentGallery = [];
        var currentIndex = 0;

        function openLightbox(gallery, index) {
            currentGallery = gallery;
            currentIndex = index;
            showImage();
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        function showImage() {
            var item = currentGallery[currentIndex];
            if (!item) return;
            lightboxImg.src = item.src;
            lightboxImg.alt = item.alt;
            lightboxCaption.textContent = item.alt;
        }

        function nextImage() {
            currentIndex = (currentIndex + 1) % currentGallery.length;
            showImage();
        }

        function prevImage() {
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            showImage();
        }

        // Bind gallery item clicks
        document.addEventListener('click', function (e) {
            var galleryItem = e.target.closest('.gallery-item');
            if (!galleryItem) return;

            e.preventDefault();
            var grid = galleryItem.closest('.gallery-grid');
            if (!grid) return;

            var items = grid.querySelectorAll('.gallery-item');
            var gallery = [];
            var clickedIndex = 0;

            items.forEach(function (item, i) {
                var img = item.querySelector('img');
                if (img) {
                    gallery.push({ src: img.src, alt: img.alt || '' });
                    if (item === galleryItem) clickedIndex = i;
                }
            });

            openLightbox(gallery, clickedIndex);
        });

        overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

        overlay.querySelector('.lightbox-prev').addEventListener('click', function (e) {
            e.stopPropagation();
            prevImage();
        });
        overlay.querySelector('.lightbox-next').addEventListener('click', function (e) {
            e.stopPropagation();
            nextImage();
        });

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeLightbox();
        });

        document.addEventListener('keydown', function (e) {
            if (!overlay.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });
    })();

    // --- Heading Decorated Line Animation ---
    (function initHeadingLines() {
        if (!('IntersectionObserver' in window)) return;

        var headings = document.querySelectorAll('.heading-decorated');

        var headingObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-line');
                    headingObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        headings.forEach(function (h) {
            headingObserver.observe(h);
        });
    })();

    // --- Counter Animation ---
    (function initCounters() {
        if (!('IntersectionObserver' in window)) return;

        function animateCounter(el) {
            var text = el.textContent.trim();
            var match = text.match(/^(\d+)/);
            if (!match) return;

            var target = parseInt(match[1]);
            var suffix = text.replace(match[1], '');
            var duration = 2000;
            var startTime = null;

            el.classList.add('counter-value');

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target) + suffix;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target + suffix;
                }
            }

            requestAnimationFrame(step);
        }

        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.count-up').forEach(function (el) {
            counterObserver.observe(el);
        });
    })();

    // --- Floating Golden Particles (hero section only) ---
    (function initParticles() {
        var container = document.querySelector('.particles-container');
        if (!container) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var particleCount = 15;

        for (var i = 0; i < particleCount; i++) {
            var particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.bottom = '-5px';
            particle.style.width = (2 + Math.random() * 4) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDuration = (8 + Math.random() * 12) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            container.appendChild(particle);
        }
    })();

    // --- Falling Flower Petals ---
    (function initFallingPetals() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Create petals container
        var petalsContainer = document.createElement('div');
        petalsContainer.className = 'petals-container';
        petalsContainer.setAttribute('aria-hidden', 'true');
        document.body.appendChild(petalsContainer);

        // Petal color palettes (spiritual flowers: marigold, rose, lotus tones)
        var petalColors = [
            { c1: '#f4a261', c2: '#e76f51' },   // Marigold orange
            { c1: '#e9c46a', c2: '#f4a261' },   // Golden yellow
            { c1: '#f2a2b5', c2: '#e07a9a' },   // Rose pink
            { c1: '#ffb347', c2: '#ff6f3c' },   // Deep marigold
            { c1: '#f7c59f', c2: '#e8a87c' },   // Soft peach
            { c1: '#c9a227', c2: '#e6a800' },   // Temple gold
        ];

        var maxPetals = 20;
        var petalInterval = 2500;

        function createPetal() {
            if (petalsContainer.children.length >= maxPetals) {
                var oldest = petalsContainer.querySelector('.petal');
                if (oldest) oldest.remove();
            }

            var petal = document.createElement('div');
            petal.className = 'petal';

            var shape = document.createElement('div');
            shape.className = 'petal-shape';

            // Random properties
            var colorSet = petalColors[Math.floor(Math.random() * petalColors.length)];
            var size = 8 + Math.random() * 14;
            var leftPos = Math.random() * 100;
            var duration = 8 + Math.random() * 7;
            var drift = -60 + Math.random() * 120;
            var rotation = 360 + Math.random() * 720;
            var swaySpeed = 2 + Math.random() * 3;

            petal.style.left = leftPos + '%';
            petal.style.width = size + 'px';
            petal.style.height = size * 0.7 + 'px';
            petal.style.setProperty('--petal-duration', duration + 's');
            petal.style.setProperty('--petal-drift', drift + 'px');
            petal.style.setProperty('--petal-rotate', rotation + 'deg');
            petal.style.setProperty('--petal-sway', swaySpeed + 's');

            shape.style.setProperty('--petal-color-1', colorSet.c1);
            shape.style.setProperty('--petal-color-2', colorSet.c2);

            petal.appendChild(shape);
            petalsContainer.appendChild(petal);

            // Trigger animation
            requestAnimationFrame(function () {
                petal.classList.add('falling');
            });

            // Remove after animation
            setTimeout(function () {
                if (petal.parentNode) petal.remove();
            }, duration * 1000 + 500);
        }

        // Start with a few petals
        setTimeout(function () {
            for (var i = 0; i < 5; i++) {
                setTimeout(createPetal, i * 600);
            }
        }, 1500);

        // Continue generating petals
        setInterval(createPetal, petalInterval);

        // Pause petals when page is not visible
        document.addEventListener('visibilitychange', function () {
            petalsContainer.style.display = document.hidden ? 'none' : '';
        });
    })();

    // --- Copy to clipboard (for contribute page bank details) ---
    window.copyToClipboard = function (text, btn) {
        navigator.clipboard.writeText(text).then(function () {
            btn.classList.add('copied');
            var originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check-lg"></i> Copied';
            setTimeout(function () {
                btn.innerHTML = originalHTML;
                btn.classList.remove('copied');
            }, 2000);
        }).catch(function () {
            var textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            btn.classList.add('copied');
            var originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check-lg"></i> Copied';
            setTimeout(function () {
                btn.innerHTML = originalHTML;
                btn.classList.remove('copied');
            }, 2000);
        });
    };
})();
