/**
 * Chinmayaranyam - Dynamic Component Loader
 * Loads shared navbar and footer into every page
 */
(function () {
    'use strict';

    // Determine base path based on page depth
    const pathParts = window.location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
    const fileName = pathParts[pathParts.length - 1] || 'index.html';

    // Check if we're in a subfolder (what-we-do/ or about/)
    const isSubfolder = pathParts.length >= 2 &&
        (pathParts[pathParts.length - 2] === 'what-we-do' || pathParts[pathParts.length - 2] === 'about');
    const basePath = isSubfolder ? '..' : '.';

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
        // Get current page identifier from filename
        var currentFile = fileName.replace('.html', '');

        // Handle index
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
                if (callback) callback();
            })
            .catch(function (error) {
                console.warn('Component load error:', error.message);
                console.info('Tip: Use a local server (e.g. VS Code Live Server) for component loading.');
            });
    }

    // Load navbar and footer when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        loadComponent('navbar-placeholder', 'assets/includes/navbar.html', function () {
            setActiveNavItem();
            // Re-initialize Bootstrap components in dynamically loaded content
            var offcanvasEl = document.getElementById('navbarOffcanvas');
            if (offcanvasEl) {
                new bootstrap.Offcanvas(offcanvasEl);
            }
        });

        loadComponent('footer-placeholder', 'assets/includes/footer.html');
    });
})();
