/**
 * Chinmayaranyam - Main JavaScript
 */
(function () {
    'use strict';

    // --- AOS Initialization ---
    document.addEventListener('DOMContentLoaded', function () {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 80
            });
        }
    });

    // --- Navbar scroll behavior ---
    var lastScrollY = 0;
    window.addEventListener('scroll', function () {
        var navbar = document.querySelector('.navbar-chinmaya');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
        lastScrollY = window.scrollY;

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

    // --- Smooth scroll for anchor links ---
    document.addEventListener('click', function (e) {
        var anchor = e.target.closest('a[href^="#"]');
        if (anchor && anchor.getAttribute('href') !== '#') {
            var target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });

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
            // Fallback for older browsers
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
