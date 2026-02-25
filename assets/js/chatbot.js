/**
 * Chinmayaranyam - Guided Chatbot Widget
 * Decision-tree chatbot that guides visitors to relevant pages
 */
(function () {
    'use strict';

    // --- Detect basePath (same logic as components.js) ---
    var scripts = document.getElementsByTagName('script');
    var basePath = '.';
    for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].getAttribute('src') || '';
        if (src.indexOf('chatbot.js') !== -1) {
            basePath = src.indexOf('../') === 0 ? '..' : '.';
            break;
        }
    }

    function pageUrl(path) {
        return basePath + '/' + path;
    }

    // --- Decision Tree ---
    var FLOW = {
        welcome: {
            message: 'Hari Om! Welcome to Chinmayaranyam. How can I guide you today?',
            options: [
                { label: 'Learn about us', icon: 'bi-info-circle', next: 'about_interest' },
                { label: 'Explore activities', icon: 'bi-flower1', next: 'activities_interest' },
                { label: 'Plan a visit', icon: 'bi-geo-alt', next: 'visit_interest' },
                { label: 'I want to contribute', icon: 'bi-heart', next: 'contribute_direct' }
            ]
        },
        about_interest: {
            message: "We'd love to share our story! What interests you most?",
            options: [
                { label: 'Ashramam history', icon: 'bi-clock-history', next: 'result', page: 'about/ashramam-history.html', desc: 'Discover the inspiring journey of Chinmayaranyam from its early beginnings to a thriving spiritual centre.' },
                { label: 'About Mataji', icon: 'bi-person-heart', next: 'result', page: 'about/about-amma.html', desc: 'Learn about Pujya Shri Mataji Sarada Priyananda, the visionary behind Chinmayaranyam.' },
                { label: "Gurudev's visits", icon: 'bi-star', next: 'result', page: 'about/gurudev-visits.html', desc: 'See the blessed occasions when Pujya Gurudev Swami Swaroopanandaji graced our ashram.' },
                { label: 'General overview', icon: 'bi-journal-text', next: 'result', page: 'about.html', desc: 'Get an overview of our ashram, its legacy, and our mission of selfless service.' }
            ]
        },
        activities_interest: {
            message: 'Chinmayaranyam is vibrant with seva and sadhana! What draws you?',
            options: [
                { label: 'Spiritual activities', icon: 'bi-flower1', next: 'result', page: 'what-we-do/ashramam.html', desc: 'Explore our daily poojas, bhajans, festivals, Jnana Yagnas, and spiritual programs.' },
                { label: 'Harihara Vidyalaya', icon: 'bi-book', next: 'result', page: 'what-we-do/vidyalaya.html', desc: 'Learn about Harihara Vidyalaya, where value-based education nurtures young minds.' },
                { label: 'All activities', icon: 'bi-grid', next: 'result', page: 'what-we-do.html', desc: 'See all the spiritual, educational, and seva activities at Chinmayaranyam.' }
            ]
        },
        visit_interest: {
            message: 'Wonderful! What would help you plan your visit?',
            options: [
                { label: 'Directions & contact', icon: 'bi-map', next: 'result', page: 'where-we-are.html', desc: 'Find our address near Tirupati, directions, contact details, and an interactive map.' },
                { label: 'Our branch centres', icon: 'bi-building', next: 'result', page: 'branches.html', desc: 'Discover our branch centres and their activities across the region.' },
                { label: 'See the gallery', icon: 'bi-images', next: 'result', page: 'gallery.html', desc: 'Browse photos of our ashram, festivals, campus, and community celebrations.' }
            ]
        },
        contribute_direct: {
            message: 'Your generosity supports Annadanam, education, and spiritual programs. Every contribution is a step towards divine service.',
            options: [
                { label: 'Go to Contribute page', icon: 'bi-heart-fill', next: 'navigate', page: 'contribute.html' },
                { label: 'Tell me more first', icon: 'bi-arrow-counterclockwise', next: 'welcome' }
            ]
        }
    };

    var isOpen = false;

    // --- Create DOM ---
    function createChatbotDOM() {
        var widget = document.createElement('div');
        widget.id = 'chatbot-widget';
        widget.setAttribute('aria-label', 'Chat assistant');

        widget.innerHTML =
            '<button id="chatbot-toggle" class="chatbot-toggle" aria-label="Open chat assistant" aria-expanded="false">' +
                '<i class="bi bi-chat-dots-fill chatbot-icon-open"></i>' +
                '<i class="bi bi-x-lg chatbot-icon-close"></i>' +
            '</button>' +
            '<span class="chatbot-badge" id="chatbot-badge">1</span>' +
            '<div id="chatbot-panel" class="chatbot-panel" role="dialog" aria-label="Chat assistant" aria-hidden="true">' +
                '<div class="chatbot-header">' +
                    '<div class="chatbot-header-info">' +
                        '<span class="chatbot-header-om">&#x0950;</span>' +
                        '<div>' +
                            '<strong class="chatbot-header-title">Chinmayaranyam</strong>' +
                            '<span class="chatbot-header-subtitle">How can we guide you?</span>' +
                        '</div>' +
                    '</div>' +
                    '<button class="chatbot-close" aria-label="Close chat"><i class="bi bi-x-lg"></i></button>' +
                '</div>' +
                '<div class="chatbot-messages" id="chatbot-messages"></div>' +
                '<div class="chatbot-footer">' +
                    '<button class="chatbot-restart" id="chatbot-restart">' +
                        '<i class="bi bi-arrow-counterclockwise me-1"></i> Start Over' +
                    '</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(widget);
        bindEvents();
    }

    // --- Event Binding ---
    function bindEvents() {
        document.getElementById('chatbot-toggle').addEventListener('click', togglePanel);
        document.querySelector('.chatbot-close').addEventListener('click', closePanel);
        document.getElementById('chatbot-restart').addEventListener('click', restartChat);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) closePanel();
        });

        document.addEventListener('click', function (e) {
            if (!isOpen) return;
            var widget = document.getElementById('chatbot-widget');
            if (!widget.contains(e.target)) {
                closePanel();
            }
        });
    }

    // --- Panel Controls ---
    function togglePanel() {
        isOpen ? closePanel() : openPanel();
    }

    function openPanel() {
        isOpen = true;
        var panel = document.getElementById('chatbot-panel');
        var toggle = document.getElementById('chatbot-toggle');

        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');

        var badge = document.getElementById('chatbot-badge');
        if (badge) badge.classList.add('hidden');

        sessionStorage.setItem('chatbot_opened', '1');
    }

    function closePanel() {
        isOpen = false;
        var panel = document.getElementById('chatbot-panel');
        var toggle = document.getElementById('chatbot-toggle');

        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
    }

    // --- Conversation Engine ---
    function showNode(nodeId) {
        var node = FLOW[nodeId];
        if (!node) return;

        addBotMessage(node.message);

        setTimeout(function () {
            addOptions(node.options);
            scrollToBottom();
        }, 350);
    }

    function showResult(option) {
        addBotMessage(option.desc);

        setTimeout(function () {
            addOptions([
                { label: 'Take me there', icon: 'bi-arrow-right-circle', next: 'navigate', page: option.page },
                { label: 'Support the mission', icon: 'bi-heart-fill', next: 'navigate', page: 'contribute.html' },
                { label: 'Ask something else', icon: 'bi-arrow-counterclockwise', next: 'welcome' }
            ]);
            scrollToBottom();
        }, 350);
    }

    function handleOptionClick(option) {
        addUserMessage(option.label);

        if (option.next === 'navigate') {
            addBotMessage('Taking you there...');
            setTimeout(function () {
                window.location.href = pageUrl(option.page);
            }, 600);
        } else if (option.next === 'result') {
            setTimeout(function () {
                showResult(option);
            }, 300);
        } else {
            setTimeout(function () {
                showNode(option.next);
            }, 300);
        }
    }

    function addBotMessage(text) {
        var messagesEl = document.getElementById('chatbot-messages');
        var msgDiv = document.createElement('div');
        msgDiv.className = 'chatbot-msg-bot';
        msgDiv.textContent = text;
        messagesEl.appendChild(msgDiv);
        scrollToBottom();
    }

    function addUserMessage(text) {
        var messagesEl = document.getElementById('chatbot-messages');

        // Remove the current options (user has answered)
        var opts = messagesEl.querySelectorAll('.chatbot-options');
        var lastOpts = opts[opts.length - 1];
        if (lastOpts) lastOpts.remove();

        var msgDiv = document.createElement('div');
        msgDiv.className = 'chatbot-msg-user';
        msgDiv.textContent = text;
        messagesEl.appendChild(msgDiv);
        scrollToBottom();
    }

    function addOptions(options) {
        var messagesEl = document.getElementById('chatbot-messages');
        var optionsDiv = document.createElement('div');
        optionsDiv.className = 'chatbot-options';

        options.forEach(function (opt) {
            var btn = document.createElement('button');
            btn.className = 'chatbot-option-btn';
            btn.type = 'button';
            btn.innerHTML = '<i class="bi ' + opt.icon + ' me-2"></i>' + opt.label;
            btn.addEventListener('click', function () {
                handleOptionClick(opt);
            });
            optionsDiv.appendChild(btn);
        });

        messagesEl.appendChild(optionsDiv);
    }

    function scrollToBottom() {
        var messagesEl = document.getElementById('chatbot-messages');
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function restartChat() {
        var messagesEl = document.getElementById('chatbot-messages');
        messagesEl.innerHTML = '';
        showNode('welcome');
    }

    // --- Initialization ---
    document.addEventListener('DOMContentLoaded', function () {
        createChatbotDOM();
        showNode('welcome');

        // Auto-open after 3s on first visit in this session
        if (!sessionStorage.getItem('chatbot_opened')) {
            setTimeout(function () {
                openPanel();
            }, 3000);
        } else {
            // Already opened before, hide badge
            var badge = document.getElementById('chatbot-badge');
            if (badge) badge.classList.add('hidden');
        }
    });
})();
