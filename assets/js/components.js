/**
 * Chinmayaranyam - Dynamic Component Loader
 * Loads shared navbar and footer into every page
 */
(function () {
    'use strict';

    // Detect base path reliably from the script's own src attribute
    // Root pages load: "assets/js/components.js" → basePath = "."
    // Subfolder pages load: "../assets/js/components.js" → basePath = ".."
    var scripts = document.getElementsByTagName('script');
    var basePath = '.';
    for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].getAttribute('src') || '';
        if (src.indexOf('components.js') !== -1) {
            basePath = src.indexOf('../') === 0 ? '..' : '.';
            break;
        }
    }

    // Get current filename for active nav detection
    var pathParts = window.location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
    var fileName = pathParts[pathParts.length - 1] || 'index.html';

    /**
     * Resolve all data-link attributes to correct relative paths
     */
    function resolveLinks(container) {
        container.querySelectorAll('[data-link]').forEach(function (el) {
            el.href = basePath + '/' + el.getAttribute('data-link');
        });
    }

    /**
     * Set active nav item based on current page URL
     */
    function setActiveNavItem() {
        var currentFile = fileName.replace('.html', '');

        if (currentFile === '' || currentFile === 'index') {
            currentFile = 'index';
        }

        document.querySelectorAll('.navbar-chinmaya [data-page]').forEach(function (el) {
            var page = el.getAttribute('data-page');

            if (page === currentFile) {
                el.classList.add('active');

                // If it's a dropdown item, also highlight parent dropdown toggle
                var parentDropdown = el.closest('.dropdown');
                if (parentDropdown) {
                    var toggle = parentDropdown.querySelector('.dropdown-toggle');
                    if (toggle) {
                        toggle.classList.add('active');
                    }
                }
            }
        });
    }

    /**
     * Initialize Bootstrap components in dynamically loaded content
     * Note: Bootstrap 5 uses document-level event delegation for dropdowns
     * and offcanvas, so most components work automatically with dynamic content.
     * We only need to explicitly initialize dropdowns as a safety measure.
     */
    function initBootstrapComponents(container) {
        // Initialize all dropdowns explicitly for dynamically loaded content
        var dropdownEls = container.querySelectorAll('[data-bs-toggle="dropdown"]');
        dropdownEls.forEach(function (el) {
            new bootstrap.Dropdown(el);
        });
    }

    /**
     * Load an HTML fragment into a placeholder element
     */
    function loadComponent(placeholderId, filePath, callback) {
        var placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;

        fetch(basePath + '/' + filePath)
            .then(function (response) {
                if (!response.ok) throw new Error('Failed to load ' + filePath);
                return response.text();
            })
            .then(function (html) {
                placeholder.innerHTML = html;
                resolveLinks(placeholder);
                if (callback) callback(placeholder);
            })
            .catch(function (error) {
                console.warn('Component load error:', error.message);
                console.info('Tip: Use a local server (e.g. VS Code Live Server) for component loading.');
            });
    }

    // Load navbar and footer when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        loadComponent('navbar-placeholder', 'assets/includes/navbar.html', function (container) {
            setActiveNavItem();
            initBootstrapComponents(container);
        });

        loadComponent('footer-placeholder', 'assets/includes/footer.html');
    });
})();
