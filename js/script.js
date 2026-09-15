/* =========================================================
   NOIRÉ — SCRIPT PRINCIPAL
   Version complète et corrigée
========================================================= */

(() => {
    'use strict';

    /* =====================================================
       OUTILS
    ===================================================== */

    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

    const on = (target, event, handler, options) => {
        if (target) target.addEventListener(event, handler, options);
    };

    const rafThrottle = (callback) => {
        let ticking = false;
        return (...args) => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                ticking = false;
                callback(...args);
            });
        };
    };

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reducedMotion = () => motionQuery.matches;

    const pad2 = (value) => String(value).padStart(2, '0');

    const todayISO = () => {
        const d = new Date();
        return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    };

    /* =====================================================
       I18N
    ===================================================== */

    const _t = (key, fallback) => {
        let value;
        try {
            value = window.NOIRE_I18N?.t?.(key);
        } catch {
            value = null;
        }
        if (typeof value === 'string' && value.trim() && value !== key) return value;
        return fallback ?? key;
    };

    /* =====================================================
       ENDPOINTS PHP
    ===================================================== */

    const ORDER_URL = 'enregistrer_commande.php';
    const RESERVATION_URL = 'enregistrer_reservation.php';

    /* =====================================================
       PROTECTION HTML
    ===================================================== */

    const escapeHTML = (value) =>
        String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

    /* =====================================================
       LOADER
    ===================================================== */

    const initLoader = () => {
        const loader = $('#loader');
        if (!loader) return;

        let hidden = false;

        const hide = () => {
            if (hidden) return;
            hidden = true;

            loader.classList.add('hidden', 'is-hidden', 'loaded');
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            loader.style.pointerEvents = 'none';

            setTimeout(() => loader.remove(), 700);
        };

        if (document.readyState === 'complete') {
            setTimeout(hide, 300);
        } else {
            on(window, 'load', () => setTimeout(hide, 300), { once: true });
        }

        setTimeout(hide, 2500);
    };

    /* =====================================================
       TOAST
    ===================================================== */

    const getToastContainer = () => {
        let container = $('#toast-container');
        if (container) return container;

        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        container.setAttribute('role', 'status');
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);

        return container;
    };

    const showToast = ({ type = 'success', title = '', message = '' } = {}) => {
        const container = getToastContainer();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon" aria-hidden="true">${type === 'error' ? '✕' : '✓'}</span>
            <div class="toast-content">
                <strong>${escapeHTML(title)}</strong>
                <p>${escapeHTML(message)}</p>
            </div>
        `;

        container.appendChild(toast);

        let removed = false;
        const remove = () => {
            if (removed) return;
            removed = true;
            toast.remove();
        };

        setTimeout(() => {
            toast.classList.add('is-leaving');
            toast.addEventListener('animationend', remove, { once: true });
            setTimeout(remove, 800);
        }, 3500);
    };

    /* =====================================================
       PANIER
    ===================================================== */

    const CART_STORAGE_KEY = 'noire_cart';
    const MAX_QUANTITY = 99;

    let cart = [];

    const clampQuantity = (value) => {
        const qty = Math.floor(Number(value));
        if (!Number.isFinite(qty) || qty < 1) return 1;
        return Math.min(qty, MAX_QUANTITY);
    };

    const loadCart = () => {
        cart = [];

        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            if (!saved) return;

            const parsed = JSON.parse(saved);
            if (!Array.isArray(parsed)) return;

            const byId = new Map();

            parsed.forEach((item) => {
                if (!item || item.id === undefined || item.id === null) return;

                const id = String(item.id);
                const name = String(item.name ?? '').trim();
                const price = Number(item.price);

                if (!name || !Number.isFinite(price) || price <= 0) return;

                const existing = byId.get(id);
                if (existing) {
                    existing.quantity = clampQuantity(existing.quantity + clampQuantity(item.quantity));
                    return;
                }

                byId.set(id, {
                    id,
                    name,
                    nameKey: item.nameKey ? String(item.nameKey) : '',
                    price,
                    image: item.image ? String(item.image) : '',
                    quantity: clampQuantity(item.quantity)
                });
            });

            cart = [...byId.values()];
        } catch (error) {
            console.error('Erreur chargement panier :', error);
            cart = [];
        }
    };

    const saveCart = () => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
            console.error('Erreur sauvegarde panier :', error);
        }
    };

    const getCartTotal = () =>
        cart.reduce(
            (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
            0
        );

    const getCartCount = () =>
        cart.reduce((count, item) => count + (Number(item.quantity) || 0), 0);

    const formatPrice = (price) =>
        `${new Intl.NumberFormat('fr-FR').format(Number(price) || 0)} FCFA`;

    const itemLabel = (item) => (item.nameKey ? _t(item.nameKey, item.name) : item.name);

    const findItem = (id) => cart.find((item) => item.id === String(id));

    const removeItem = (id) => {
        cart = cart.filter((item) => item.id !== String(id));
    };

    /* =====================================================
       RENDU PANIER
    ===================================================== */

    const renderCart = () => {
        const cartItems = $('#cart-items');
        const cartTotal = $('#cart-total');
        const count = getCartCount();

        $$('.cart-count').forEach((element) => {
            element.textContent = String(count);
        });

        if (cartTotal) cartTotal.textContent = formatPrice(getCartTotal());

        if (!cartItems) return;

        if (!cart.length) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <span aria-hidden="true">🛒</span>
                    <p>${escapeHTML(_t('order.empty', 'Votre panier est vide.'))}</p>
                </div>
            `;
            return;
        }

        cartItems.innerHTML = cart
            .map((item) => {
                const price = Number(item.price) || 0;
                const quantity = Number(item.quantity) || 1;
                const name = itemLabel(item);
                const safeId = escapeHTML(item.id);
                const safeName = escapeHTML(name);

                const decreaseLabel = _t('a11y.decreaseQty', 'Diminuer');
                const increaseLabel = _t('a11y.increaseQty', 'Augmenter');
                const removeLabel = _t('a11y.removeItem', 'Supprimer');

                return `
                <div class="cart-item" data-id="${safeId}">
                    ${item.image
                        ? `<img src="${escapeHTML(item.image)}" alt="${safeName}" loading="lazy">`
                        : ''
                    }
                    <div class="cart-item-info">
                        <h4>${safeName}</h4>
                        <p>${formatPrice(price)}</p>
                        <div class="quantity-control">
                            <button type="button" class="quantity-btn decrease" data-id="${safeId}" aria-label="${decreaseLabel} ${safeName}">−</button>
                            <span class="cart-quantity">${quantity}</span>
                            <button type="button" class="quantity-btn increase" data-id="${safeId}" aria-label="${increaseLabel} ${safeName}">+</button>
                        </div>
                    </div>
                    <div class="cart-item-end">
                        <strong class="cart-item-total">${formatPrice(price * quantity)}</strong>
                        <button type="button" class="remove-cart-item" data-id="${safeId}" aria-label="${removeLabel} ${safeName}">×</button>
                    </div>
                </div>
            `;
            })
            .join('');
    };

    /* =====================================================
       ACTIONS PANIER
    ===================================================== */

    const initCartActions = () => {
        const cartItems = $('#cart-items');
        if (!cartItems) return;

        on(cartItems, 'click', (event) => {
            const target = event.target instanceof Element ? event.target : null;
            if (!target) return;

            const button = target.closest('.increase, .decrease, .remove-cart-item');
            if (!button || !cartItems.contains(button)) return;

            const id = button.dataset.id;
            if (!id) return;

            const item = findItem(id);
            if (!item) return;

            const name = itemLabel(item);
            const isIncrease = button.classList.contains('increase');
            const isDecrease = button.classList.contains('decrease');
            const isRemove = button.classList.contains('remove-cart-item');

            let deleted = false;

            if (isIncrease) {
                if (item.quantity >= MAX_QUANTITY) {
                    showToast({
                        type: 'error',
                        title: _t('toast.error.title', 'Erreur'),
                        message: `Quantité maximale : ${MAX_QUANTITY}.`
                    });
                    return;
                }
                item.quantity = clampQuantity(item.quantity + 1);
            } else if (isDecrease) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    removeItem(id);
                    deleted = true;
                }
            } else if (isRemove) {
                removeItem(id);
                deleted = true;
            }

            saveCart();
            renderCart();

            if (deleted) {
                showToast({
                    type: 'success',
                    title: _t('toast.removed.title', 'Article retiré'),
                    message: name
                });
            }
        });
    };

    /* =====================================================
       AJOUT AU PANIER
    ===================================================== */

    const addToCart = (id) => {
        const card = $(`.menu-card[data-id="${CSS.escape(String(id))}"]`);
        if (!card) return;

        const name = String(card.dataset.name || '').trim();
        const price = Number(card.dataset.price);
        const image = $('img', card)?.getAttribute('src') || '';
        const nameKey = $('h3[data-i18n]', card)?.dataset.i18n || '';

        if (!name || !Number.isFinite(price) || price <= 0) {
            showToast({
                type: 'error',
                title: _t('toast.error.title', 'Erreur'),
                message: 'Impossible d\'ajouter ce produit.'
            });
            return;
        }

        const existing = findItem(id);

        if (existing) {
            if (existing.quantity >= MAX_QUANTITY) {
                showToast({
                    type: 'error',
                    title: _t('toast.error.title', 'Erreur'),
                    message: `Quantité maximale : ${MAX_QUANTITY}.`
                });
                return;
            }
            existing.quantity = clampQuantity(existing.quantity + 1);
        } else {
            cart.push({
                id: String(id),
                name,
                nameKey,
                price,
                image,
                quantity: 1
            });
        }

        saveCart();
        renderCart();

        $$('.cart-button').forEach(btn => {
            btn.classList.remove('bump');
            void btn.offsetWidth;
            btn.classList.add('bump');
            setTimeout(() => btn.classList.remove('bump'), 600);
        });

        showToast({
            type: 'success',
            title: _t('toast.added.title', 'Ajouté au panier'),
            message: nameKey ? _t(nameKey, name) : name
        });
    };

    /* =====================================================
       BOUTONS AJOUT PANIER
    ===================================================== */

    const initAddToCartButtons = () => {
        on(document, 'click', (event) => {
            const target = event.target instanceof Element ? event.target : null;
            if (!target) return;

            const button = target.closest('.add-to-cart');
            if (!button) return;

            const id = button.dataset.id || button.closest('.menu-card')?.dataset.id;
            if (id) {
                event.preventDefault();
                addToCart(id);
            }
        });
    };

    /* =====================================================
       FILTRE MENU
    ===================================================== */

    const initMenuFilter = () => {
        const categories = $$('.category');
        const menuCards = $$('.menu-card');

        if (!categories.length || !menuCards.length) return;

        const applyFilter = (filter) => {
            menuCards.forEach((card) => {
                const match = filter === 'all' || (card.dataset.category || '') === filter;
                card.classList.toggle('hidden', !match);
                card.hidden = !match;
            });
        };

        categories.forEach((category) => {
            const isActive = category.classList.contains('active');
            category.setAttribute('aria-pressed', String(isActive));

            on(category, 'click', () => {
                const filter = category.dataset.filter || 'all';

                categories.forEach((button) => {
                    const active = button === category;
                    button.classList.toggle('active', active);
                    button.setAttribute('aria-pressed', String(active));
                });

                applyFilter(filter);
            });
        });

        const initial = $('.category.active')?.dataset.filter || 'all';
        applyFilter(initial);
    };

    /* =====================================================
       ÉTAT DES BOUTONS D'ENVOI
    ===================================================== */

    const setSubmitting = (button, isSubmitting) => {
        if (!button) return;

        if (isSubmitting) {
            if (!button.dataset.originalLabel) {
                button.dataset.originalLabel = button.textContent.trim();
            }
            button.disabled = true;
            button.textContent = _t('toast.sending', 'Envoi en cours…');
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalLabel || _t('form.submit', 'Confirmer');
        }
    };

    const parseJSONResponse = async (response) => {
        const text = await response.text();

        let result = null;
        try {
            result = JSON.parse(text);
        } catch {
            console.error('Réponse serveur non JSON :', text);
            throw new Error('Le serveur a renvoyé une réponse invalide.');
        }

        if (!response.ok || !result || result.success !== true) {
            throw new Error(result?.message || 'Erreur lors de l\'enregistrement.');
        }

        return result;
    };

    const isValidPhone = (value) => (value.match(/\d/g) || []).length >= 8;

    /* =====================================================
       COMMANDE
    ===================================================== */

    const initOrderForm = () => {
        const form = $('#order-form');
        if (!form) return;

        const submitBtn = $('#submit-order') || form.querySelector('button[type="submit"]');
        const nameField = $('#customer-name');
        const phoneField = $('#customer-phone');
        const addressField = $('#customer-address');
        const noteField = $('#order-note');
        const orderTypeInputs = $$('input[name="order_type"]', form);
        const addressGroup = addressField?.closest('.form-group');

        let submitting = false;

        const updateAddressVisibility = () => {
            const selected = form.querySelector('input[name="order_type"]:checked');
            const isDelivery = selected?.value === 'livraison';

            if (addressGroup) addressGroup.style.display = isDelivery ? '' : 'none';

            if (addressField) {
                addressField.required = isDelivery;
                if (!isDelivery) addressField.value = '';
            }
        };

        orderTypeInputs.forEach((input) => on(input, 'change', updateAddressVisibility));
        updateAddressVisibility();

        on(form, 'submit', async (event) => {
            event.preventDefault();
            if (submitting) return;

            if (!cart.length) {
                showToast({
                    type: 'error',
                    title: _t('toast.emptyCart.title', 'Panier vide'),
                    message: _t('toast.emptyCart.desc', 'Ajoutez au moins un produit avant de commander.')
                });
                return;
            }

            const nom = nameField?.value.trim() || '';
            if (!nom) {
                showToast({
                    type: 'error',
                    title: _t('toast.required.title', 'Champ requis'),
                    message: _t('toast.required.name', 'Veuillez indiquer votre nom.')
                });
                nameField?.focus();
                return;
            }

            const telephone = phoneField?.value.trim() || '';
            if (!telephone || !isValidPhone(telephone)) {
                showToast({
                    type: 'error',
                    title: _t('toast.required.title', 'Champ requis'),
                    message: _t('toast.required.phone', 'Veuillez indiquer un numéro de téléphone valide.')
                });
                phoneField?.focus();
                return;
            }

            const typeCommande =
                form.querySelector('input[name="order_type"]:checked')?.value || 'retrait';

            if (!['livraison', 'retrait'].includes(typeCommande)) {
                showToast({
                    type: 'error',
                    title: _t('toast.error.title', 'Erreur'),
                    message: 'Type de commande invalide.'
                });
                return;
            }

            const adresse = typeCommande === 'livraison' ? addressField?.value.trim() || '' : '';

            if (typeCommande === 'livraison' && !adresse) {
                showToast({
                    type: 'error',
                    title: _t('toast.address.title', 'Adresse requise'),
                    message: _t('toast.required.address', 'Veuillez indiquer votre adresse de livraison.')
                });
                addressField?.focus();
                return;
            }

            const total = getCartTotal();
            if (!Number.isFinite(total) || total <= 0) {
                showToast({
                    type: 'error',
                    title: _t('toast.error.title', 'Erreur'),
                    message: 'Montant invalide.'
                });
                return;
            }

            submitting = true;
            setSubmitting(submitBtn, true);

            try {
                const produits = cart.map((item) => ({
                    id: item.id,
                    name: itemLabel(item),
                    price: Number(item.price),
                    quantity: Number(item.quantity)
                }));

                const formData = new FormData();
                formData.append('nom', nom);
                formData.append('telephone', telephone);
                formData.append('type_commande', typeCommande);
                formData.append('adresse', adresse);
                formData.append('note', noteField?.value.trim() || '');
                formData.append('total', String(total));
                formData.append('produits', JSON.stringify(produits));

                const response = await fetch(ORDER_URL, {
                    method: 'POST',
                    body: formData,
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                });

                await parseJSONResponse(response);

                showToast({
                    type: 'success',
                    title: _t('toast.order.success.title', 'Commande enregistrée'),
                    message: _t(
                        'toast.order.success.desc',
                        'Merci {name}, nous vous contactons très vite.'
                    ).replace('{name}', nom)
                });

                cart = [];
                saveCart();
                renderCart();

                form.reset();
                updateAddressVisibility();
            } catch (error) {
                console.error('Erreur commande :', error);

                showToast({
                    type: 'error',
                    title: _t('toast.error.title', 'Erreur'),
                    message: error.message || _t('toast.error.desc', 'Une erreur est survenue.')
                });
            } finally {
                submitting = false;
                setSubmitting(submitBtn, false);
            }
        });
    };

    /* =====================================================
       RÉSERVATION
    ===================================================== */

    const initReservationForm = () => {
        const form = $('#reservation-form');
        if (!form) return;

        const dateField = $('#reservation-date');
        const timeField = $('#reservation-time');
        const guestsField = $('#reservation-guests');
        const submitBtn = form.querySelector('button[type="submit"]');

        let submitting = false;

        const applyMinDate = () => {
            if (dateField) dateField.min = todayISO();
        };

        applyMinDate();

        const maxGuests = Number(guestsField?.max) > 0 ? Number(guestsField.max) : 8;

        on(form, 'submit', async (event) => {
            event.preventDefault();
            if (submitting) return;

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const nom = String($('#reservation-name')?.value || '').trim();
            const telephone = String($('#reservation-phone')?.value || '').trim();
            const date = String(dateField?.value || '');
            const heure = String(timeField?.value || '');
            const personnes = String(guestsField?.value || '');
            const message = String($('#reservation-message')?.value || '').trim();

            if (!nom) {
                showToast({
                    type: 'error',
                    title: _t('toast.required.title', 'Champ requis'),
                    message: _t('toast.required.name', 'Veuillez indiquer votre nom.')
                });
                return;
            }

            if (!telephone || !isValidPhone(telephone)) {
                showToast({
                    type: 'error',
                    title: _t('toast.required.title', 'Champ requis'),
                    message: _t('toast.required.phone', 'Veuillez indiquer un numéro de téléphone valide.')
                });
                return;
            }

            if (!date || !heure || !personnes) {
                showToast({
                    type: 'error',
                    title: _t('toast.required.title', 'Champ requis'),
                    message: 'Veuillez compléter les informations de réservation.'
                });
                return;
            }

            const guests = Number(personnes);
            if (!Number.isInteger(guests) || guests < 1 || guests > maxGuests) {
                showToast({
                    type: 'error',
                    title: _t('toast.error.title', 'Erreur'),
                    message: `Nombre de personnes invalide (1 à ${maxGuests}).`
                });
                return;
            }

            applyMinDate();

            if (dateField?.min && date < dateField.min) {
                showToast({
                    type: 'error',
                    title: _t('toast.error.title', 'Erreur'),
                    message: 'La date sélectionnée est déjà passée.'
                });
                return;
            }

            submitting = true;
            setSubmitting(submitBtn, true);

            try {
                const formData = new FormData();
                formData.append('nom', nom);
                formData.append('telephone', telephone);
                formData.append('date', date);
                formData.append('heure', heure);
                formData.append('nombre_personnes', String(guests));
                formData.append('message', message);

                const response = await fetch(RESERVATION_URL, {
                    method: 'POST',
                    body: formData,
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                });

                await parseJSONResponse(response);

                showToast({
                    type: 'success',
                    title: _t('toast.reservation.success.title', 'Réservation enregistrée'),
                    message: _t(
                        'toast.reservation.success.desc',
                        'Merci {name}, votre table est demandée.'
                    ).replace('{name}', nom)
                });

                form.reset();
                applyMinDate();
            } catch (error) {
                console.error('Erreur réservation :', error);

                showToast({
                    type: 'error',
                    title: _t('toast.error.title', 'Erreur'),
                    message: error.message || _t('toast.error.desc', 'Une erreur est survenue.')
                });
            } finally {
                submitting = false;
                setSubmitting(submitBtn, false);
            }
        });
    };

    /* =====================================================
       HEADER
    ===================================================== */

    const getHeader = () => $('#header') || $('.header');

    const initHeader = () => {
        const header = getHeader();
        if (!header) return;

        const updateHeader = () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        };

        updateHeader();
        on(window, 'scroll', rafThrottle(updateHeader), { passive: true });
    };

    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    const initSmoothScroll = () => {
        on(document, 'click', (event) => {
            const target = event.target instanceof Element ? event.target : null;
            const link = target?.closest('a[href^="#"]');
            if (!link) return;

            const hash = link.getAttribute('href');
            if (!hash || hash === '#') return;

            let destination;
            try {
                destination = document.querySelector(hash);
            } catch {
                return;
            }

            if (!destination) return;

            event.preventDefault();

            const headerHeight = getHeader()?.offsetHeight || 0;
            const top = destination.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: Math.max(0, top),
                behavior: reducedMotion() ? 'auto' : 'smooth'
            });
        });
    };

    /* =====================================================
       MENU MOBILE
    ===================================================== */

    const initMobileMenu = () => {
        const toggle = $('#mobile-menu-toggle');
        const nav = $('#main-nav');

        if (!toggle || !nav) return;

        const previousOverflow = document.body.style.overflow;

        const setState = (isOpen) => {
            nav.classList.toggle('active', isOpen);
            toggle.classList.toggle('active', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : previousOverflow;
        };

        setState(false);

        on(toggle, 'click', (event) => {
            event.stopPropagation();
            setState(!nav.classList.contains('active'));
        });

        $$('a', nav).forEach((link) => on(link, 'click', () => setState(false)));

        on(document, 'keydown', (event) => {
            if (event.key === 'Escape' && nav.classList.contains('active')) setState(false);
        });

        on(document, 'click', (event) => {
            const target = event.target instanceof Node ? event.target : null;
            if (!target) return;

            if (
                nav.classList.contains('active') &&
                !nav.contains(target) &&
                !toggle.contains(target)
            ) {
                setState(false);
            }
        });
    };

    /* =====================================================
       ANIMATIONS REVEAL
    ===================================================== */

    const initRevealAnimations = () => {
        const elements = $$('.reveal');
        if (!elements.length) return;

        if (!('IntersectionObserver' in window) || reducedMotion()) {
            elements.forEach((el) => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                });
            },
            { threshold: 0.12 }
        );

        elements.forEach((el) => observer.observe(el));
    };

    /* =====================================================
       NAVIGATION ACTIVE
    ===================================================== */

    const initActiveNav = () => {
        const sections = $$('section[id]');
        const navLinks = $$('#main-nav a[href^="#"]');

        if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const id = entry.target.id;

                    navLinks.forEach((link) => {
                        const active = link.getAttribute('href') === `#${id}`;
                        link.classList.toggle('active', active);
                        if (active) {
                            link.setAttribute('aria-current', 'true');
                        } else {
                            link.removeAttribute('aria-current');
                        }
                    });
                });
            },
            { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
        );

        sections.forEach((section) => observer.observe(section));
    };

    /* =====================================================
       ANNÉE
    ===================================================== */

    const initFooterYear = () => {
        const element = $('#current-year') || $('#footer-year');
        if (element) element.textContent = String(new Date().getFullYear());
    };

    /* =====================================================
       SYNCHRONISATION LANGUE
    ===================================================== */

    const initLanguageSync = () => {
        on(window, 'langchange', () => renderCart());
    };

    /* =====================================================
       THÈME SOMBRE / CLAIR
    ===================================================== */

    const THEME_STORAGE_KEY = 'noire_theme';
    const THEME_TRANSITION_MS = 400;

    const withThemeTransition = (change) => {
        if (reducedMotion()) {
            change();
            return;
        }

        const rootEl = document.documentElement;
        rootEl.classList.add('theme-transition');
        change();
        setTimeout(() => rootEl.classList.remove('theme-transition'), THEME_TRANSITION_MS);
    };

    const initThemeToggle = () => {
        const toggle = $('#theme-toggle');
        const root = document.documentElement;

        const apply = (theme) => {
            root.setAttribute('data-theme', theme);

            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', theme === 'light' ? '#faf7f0' : '#0a0a0a');

            if (!toggle) return;

            const isLight = theme === 'light';
            toggle.setAttribute('aria-pressed', String(isLight));
            toggle.setAttribute('aria-label', isLight ? 'Passer en mode sombre' : 'Passer en mode clair');

            const icon = toggle.querySelector('span');
            if (icon) icon.textContent = isLight ? '🌙' : '☀️';
        };

        apply(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

        on(toggle, 'click', () => {
            const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            try {
                localStorage.setItem(THEME_STORAGE_KEY, next);
            } catch (error) {
                console.error('Erreur sauvegarde thème :', error);
            }
            withThemeTransition(() => apply(next));
        });
    };

    /* =====================================================
       INITIALISATION
    ===================================================== */

    const init = () => {
        loadCart();

        const safeInit = (fn, name) => {
            try {
                fn();
            } catch (error) {
                console.error(`❌ Erreur dans ${name} :`, error);
            }
        };

        safeInit(initLoader, 'initLoader');
        safeInit(initHeader, 'initHeader');
        safeInit(initMobileMenu, 'initMobileMenu');
        safeInit(initRevealAnimations, 'initRevealAnimations');
        safeInit(initMenuFilter, 'initMenuFilter');
        safeInit(initAddToCartButtons, 'initAddToCartButtons');
        safeInit(initCartActions, 'initCartActions');
        safeInit(renderCart, 'renderCart');
        safeInit(initOrderForm, 'initOrderForm');
        safeInit(initReservationForm, 'initReservationForm');
        safeInit(initSmoothScroll, 'initSmoothScroll');
        safeInit(initActiveNav, 'initActiveNav');
        safeInit(initFooterYear, 'initFooterYear');
        safeInit(initLanguageSync, 'initLanguageSync');
        safeInit(initThemeToggle, 'initThemeToggle');

        console.log('✅ NOIRÉ — JavaScript chargé avec succès.');
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }

})();
