/* =========================================================
   NOIRÉ — Internationalisation (FR / EN)
   Version corrigée — Fonctionne parfaitement
========================================================= */

(() => {
    'use strict';

    const STORAGE_KEY = 'noire_lang';
    const DEFAULT_LANG = 'fr';
    const SUPPORTED_LANGS = ['fr', 'en'];

    /* =========================================================
       TRADUCTIONS
    ========================================================= */

    const translations = {
        fr: {
            'nav.home': 'Accueil',
            'nav.experience': 'L\'expérience',
            'nav.menu': 'La carte',
            'nav.order': 'Commander',
            'nav.reservation': 'Réserver',
            'nav.gallery': 'Galerie',
            'nav.contact': 'Contact',

            'hero.eyebrow': 'Restaurant gastronomique',
            'hero.title1': 'L\'élégance',
            'hero.title2': 'dans votre assiette.',
            'hero.description': 'Une cuisine d\'exception inspirée par les saveurs du monde et sublimée par notre terroir.',
            'hero.cta.menu': 'Découvrir la carte',
            'hero.cta.book': 'Réserver une table',
            'hero.stat.experience': 'Expérience',
            'hero.stat.creations': 'Créations',
            'hero.stat.passion': 'Passion',

            'experience.label': 'L\'expérience NOIRÉ',
            'experience.title1': 'Plus qu\'un repas,',
            'experience.title2': 'une expérience.',
            'experience.p1': 'Chez NOIRÉ, chaque détail compte. Notre cuisine associe créativité, précision et produits soigneusement sélectionnés.',
            'experience.p2': 'Dans une atmosphère élégante et chaleureuse, nous vous invitons à découvrir une nouvelle manière de vivre la gastronomie.',
            'experience.link': 'Découvrir notre univers',

            'menu.label': 'La carte',
            'menu.title': 'Nos créations',
            'menu.subtitle': 'Une sélection de plats imaginés avec passion et servis avec élégance.',
            'menu.cat.all': 'Tout',
            'menu.cat.starters': 'Entrées',
            'menu.cat.main': 'Plats',
            'menu.cat.desserts': 'Desserts',
            'menu.cat.drinks': 'Boissons',
            'menu.category.starter': 'Entrée',
            'menu.category.main': 'Plat',
            'menu.category.dessert': 'Dessert',
            'menu.category.drink': 'Boisson',
            'menu.addToCart': 'Ajouter au panier',

            'dish.1.name': 'Carpaccio de bœuf',
            'dish.1.desc': 'Fines tranches de bœuf, huile d\'olive, parmesan et jeunes pousses.',
            'dish.2.name': 'Velouté de potimarron',
            'dish.2.desc': 'Potimarron rôti, crème légère, noisettes torréfiées et huile de truffe.',
            'dish.3.name': 'Poisson aux agrumes',
            'dish.3.desc': 'Filet de poisson frais, agrumes, légumes de saison et sauce vierge.',
            'dish.4.name': 'Filet de bœuf',
            'dish.4.desc': 'Filet de bœuf grillé, purée maison, légumes rôtis et jus réduit.',
            'dish.5.name': 'Tarte fine aux pommes',
            'dish.5.desc': 'Pommes caramélisées, pâte croustillante, glace vanille.',
            'dish.6.name': 'Cocktail signature',
            'dish.6.desc': 'Création maison aux notes fruitées et fraîches.',

            'order.label': 'Commande en ligne',
            'order.title': 'Commandez votre repas',
            'order.subtitle': 'Choisissez vos plats, renseignez vos informations et confirmez votre commande.',
            'order.cart.title': 'Votre panier',
            'order.empty': 'Votre panier est vide.',
            'order.total': 'Total',

            'form.name': 'Nom complet',
            'form.name.placeholder': 'Votre nom',
            'form.phone': 'Téléphone',
            'form.phone.placeholder': '+229 XX XX XX XX',
            'form.type': 'Type de commande',
            'form.type.delivery': '🚚 Livraison',
            'form.type.pickup': '🏪 Retrait sur place',
            'form.address': 'Adresse de livraison',
            'form.address.placeholder': 'Quartier, rue, repère...',
            'form.note': 'Note pour le restaurant',
            'form.note.placeholder': 'Une précision concernant votre commande ?',
            'form.submit': 'Confirmer ma commande',
            'form.date': 'Date',
            'form.time': 'Heure',
            'form.guests': 'Nombre de personnes',
            'form.guests.select': 'Sélectionner',
            'form.guests.1': '1 personne',
            'form.guests.2': '2 personnes',
            'form.guests.3': '3 personnes',
            'form.guests.4': '4 personnes',
            'form.guests.5': '5 personnes',
            'form.guests.6': '6 personnes',
            'form.guests.7': '7 personnes',
            'form.guests.8': '8 personnes ou plus',
            'form.message': 'Demande particulière',
            'form.message.placeholder': 'Anniversaire, dîner spécial...',
            'form.reserve': 'Réserver ma table',

            'gallery.label': 'L\'univers NOIRÉ',
            'gallery.title': 'Notre galerie',

            'reservation.label': 'Votre table vous attend',
            'reservation.title': 'Réservez votre expérience',
            'reservation.subtitle': 'Pour une soirée exceptionnelle, une célébration ou simplement le plaisir d\'un bon repas.',

            'contact.label': 'Nous trouver',
            'contact.title': 'Venez nous rencontrer',
            'contact.address.title': 'Adresse',
            'contact.address.city': 'Porto-Novo',
            'contact.address.country': 'République du Bénin',
            'contact.hours.title': 'Horaires',
            'contact.hours.days': 'Mardi — Dimanche',
            'contact.contact.title': 'Contact',
            'contact.order.title': 'Commandes',
            'contact.order.delivery': 'Livraison',
            'contact.order.pickup': 'Retrait sur place',

            'footer.tagline': 'L\'art de la gastronomie.',
            'footer.copyright': 'NOIRÉ. Tous droits réservés.',
            'footer.demo': 'Projet de démonstration — Portfolio',
            'footer.creator.label': 'Conçu & développé par',
            'footer.creator.name': 'B.Venance',
            'footer.creator.role': 'Développeur Web Full-Stack',
            'footer.creator.formation': 'Formation — à compléter',
            'footer.creator.contact': 'Me contacter',

            'toast.added.title': 'Ajouté au panier',
            'toast.removed.title': 'Article retiré',
            'toast.error.title': 'Erreur',
            'toast.error.desc': 'Une erreur est survenue.',
            'toast.emptyCart.title': 'Panier vide',
            'toast.emptyCart.desc': 'Ajoutez au moins un plat avant de commander.',
            'toast.required.title': 'Champ requis',
            'toast.required.name': 'Veuillez entrer votre nom.',
            'toast.required.phone': 'Veuillez entrer votre téléphone.',
            'toast.required.address': 'Veuillez renseigner votre adresse.',
            'toast.address.title': 'Adresse requise',
            'toast.order.success.title': 'Commande confirmée',
            'toast.order.success.desc': 'Merci {name}, votre commande a bien été enregistrée.',
            'toast.reservation.success.title': 'Réservation envoyée',
            'toast.reservation.success.desc': 'Merci {name}, nous vous confirmons votre table très vite.',
            'toast.sending': 'Envoi en cours…',

            'a11y.cart': 'Voir le panier',
            'a11y.menu': 'Ouvrir le menu',
            'a11y.skip': 'Aller au contenu principal',
            'a11y.decreaseQty': 'Diminuer la quantité de',
            'a11y.increaseQty': 'Augmenter la quantité de',
            'a11y.removeItem': 'Supprimer'
        },

        en: {
            'nav.home': 'Home',
            'nav.experience': 'Experience',
            'nav.menu': 'Menu',
            'nav.order': 'Order',
            'nav.reservation': 'Book',
            'nav.gallery': 'Gallery',
            'nav.contact': 'Contact',

            'hero.eyebrow': 'Fine dining restaurant',
            'hero.title1': 'Elegance',
            'hero.title2': 'on your plate.',
            'hero.description': 'Exceptional cuisine inspired by flavors from around the world and enhanced by our terroir.',
            'hero.cta.menu': 'Discover the menu',
            'hero.cta.book': 'Book a table',
            'hero.stat.experience': 'Experience',
            'hero.stat.creations': 'Creations',
            'hero.stat.passion': 'Passion',

            'experience.label': 'The NOIRÉ experience',
            'experience.title1': 'More than a meal,',
            'experience.title2': 'an experience.',
            'experience.p1': 'At NOIRÉ, every detail matters. Our cuisine combines creativity, precision and carefully selected products.',
            'experience.p2': 'In an elegant and warm atmosphere, we invite you to discover a new way to experience gastronomy.',
            'experience.link': 'Discover our world',

            'menu.label': 'The menu',
            'menu.title': 'Our creations',
            'menu.subtitle': 'A selection of dishes created with passion and served with elegance.',
            'menu.cat.all': 'All',
            'menu.cat.starters': 'Starters',
            'menu.cat.main': 'Main courses',
            'menu.cat.desserts': 'Desserts',
            'menu.cat.drinks': 'Drinks',
            'menu.category.starter': 'Starter',
            'menu.category.main': 'Main',
            'menu.category.dessert': 'Dessert',
            'menu.category.drink': 'Drink',
            'menu.addToCart': 'Add to cart',

            'dish.1.name': 'Beef carpaccio',
            'dish.1.desc': 'Thin slices of beef, olive oil, parmesan and young sprouts.',
            'dish.2.name': 'Pumpkin velouté',
            'dish.2.desc': 'Roasted pumpkin, light cream, toasted hazelnuts and truffle oil.',
            'dish.3.name': 'Citrus fish',
            'dish.3.desc': 'Fresh fish fillet, citrus, seasonal vegetables and vierge sauce.',
            'dish.4.name': 'Beef fillet',
            'dish.4.desc': 'Grilled beef fillet, house purée, roasted vegetables and reduced jus.',
            'dish.5.name': 'Thin apple tart',
            'dish.5.desc': 'Caramelized apples, crispy pastry, vanilla ice cream.',
            'dish.6.name': 'Signature cocktail',
            'dish.6.desc': 'House creation with fruity and fresh notes.',

            'order.label': 'Online order',
            'order.title': 'Order your meal',
            'order.subtitle': 'Choose your dishes, enter your information and confirm your order.',
            'order.cart.title': 'Your cart',
            'order.empty': 'Your cart is empty.',
            'order.total': 'Total',

            'form.name': 'Full name',
            'form.name.placeholder': 'Your name',
            'form.phone': 'Phone',
            'form.phone.placeholder': '+229 XX XX XX XX',
            'form.type': 'Order type',
            'form.type.delivery': '🚚 Delivery',
            'form.type.pickup': '🏪 Pickup',
            'form.address': 'Delivery address',
            'form.address.placeholder': 'District, street, landmark...',
            'form.note': 'Note for the restaurant',
            'form.note.placeholder': 'Any precision about your order?',
            'form.submit': 'Confirm my order',
            'form.date': 'Date',
            'form.time': 'Time',
            'form.guests': 'Number of guests',
            'form.guests.select': 'Select',
            'form.guests.1': '1 person',
            'form.guests.2': '2 people',
            'form.guests.3': '3 people',
            'form.guests.4': '4 people',
            'form.guests.5': '5 people',
            'form.guests.6': '6 people',
            'form.guests.7': '7 people',
            'form.guests.8': '8 people or more',
            'form.message': 'Special request',
            'form.message.placeholder': 'Birthday, special dinner...',
            'form.reserve': 'Book my table',

            'gallery.label': 'The NOIRÉ universe',
            'gallery.title': 'Our gallery',

            'reservation.label': 'Your table awaits',
            'reservation.title': 'Book your experience',
            'reservation.subtitle': 'For an exceptional evening, a celebration or simply the pleasure of a good meal.',

            'contact.label': 'Find us',
            'contact.title': 'Come meet us',
            'contact.address.title': 'Address',
            'contact.address.city': 'Porto-Novo',
            'contact.address.country': 'Republic of Benin',
            'contact.hours.title': 'Opening hours',
            'contact.hours.days': 'Tuesday — Sunday',
            'contact.contact.title': 'Contact',
            'contact.order.title': 'Orders',
            'contact.order.delivery': 'Delivery',
            'contact.order.pickup': 'Pickup on site',

            'footer.tagline': 'The art of gastronomy.',
            'footer.copyright': 'NOIRÉ. All rights reserved.',
            'footer.demo': 'Demo project — Portfolio',
            'footer.creator.label': 'Designed & developed by',
            'footer.creator.name': 'B.Venance',
            'footer.creator.role': 'Full-Stack Web Developer',
            'footer.creator.formation': 'Education — to be completed',
            'footer.creator.contact': 'Contact me',

            'toast.added.title': 'Added to cart',
            'toast.removed.title': 'Item removed',
            'toast.error.title': 'Error',
            'toast.error.desc': 'An error occurred.',
            'toast.emptyCart.title': 'Empty cart',
            'toast.emptyCart.desc': 'Add at least one dish before ordering.',
            'toast.required.title': 'Required field',
            'toast.required.name': 'Please enter your name.',
            'toast.required.phone': 'Please enter your phone number.',
            'toast.required.address': 'Please enter your address.',
            'toast.address.title': 'Address required',
            'toast.order.success.title': 'Order confirmed',
            'toast.order.success.desc': 'Thank you {name}, your order has been recorded.',
            'toast.reservation.success.title': 'Reservation sent',
            'toast.reservation.success.desc': 'Thank you {name}, we will confirm your table shortly.',
            'toast.sending': 'Sending…',

            'a11y.cart': 'View cart',
            'a11y.menu': 'Open menu',
            'a11y.skip': 'Skip to main content',
            'a11y.decreaseQty': 'Decrease quantity of',
            'a11y.increaseQty': 'Increase quantity of',
            'a11y.removeItem': 'Remove'
        }
    };

    /* =========================================================
       UTILITAIRES
    ========================================================= */

    const getSavedLang = () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
        } catch (err) {
            console.warn('i18n: localStorage indisponible', err);
        }
        return DEFAULT_LANG;
    };

    const saveLang = (lang) => {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (err) {
            console.warn('i18n: impossible de sauvegarder la langue', err);
        }
    };

    /* CORRECTION CRITIQUE : t utilise le paramètre lang obligatoirement */
    const t = (key, lang) => {
        const targetLang = (lang && SUPPORTED_LANGS.includes(lang)) ? lang : getSavedLang();
        const dict = translations[targetLang] || translations[DEFAULT_LANG];
        const value = dict[key];
        if (typeof value === 'string' && value.trim()) return value;
        const fallback = translations[DEFAULT_LANG][key];
        return typeof fallback === 'string' ? fallback : key;
    };

    /* =========================================================
       APPLIQUER LA LANGUE
    ========================================================= */

    const applyLanguage = (lang) => {
        if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;

        document.documentElement.lang = lang;
        saveLang(lang);

        /* Textes (exclut INPUT, TEXTAREA, SELECT) */
        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (!key) return;

            const tag = el.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

            const value = t(key, lang);
            if (value !== key || el.textContent !== value) {
                el.textContent = value;
            }
        });

        /* Placeholders */
        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (!key) return;
            el.setAttribute('placeholder', t(key, lang));
        });

        /* Aria-labels */
        document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
            const key = el.getAttribute('data-i18n-aria');
            if (!key) return;
            el.setAttribute('aria-label', t(key, lang));
        });

        /* Boutons FR/EN actifs */
        document.querySelectorAll('[data-lang]').forEach((btn) => {
            const isActive = btn.dataset.lang === lang;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
        });

        /* Options du select guests — rebuild pour traduction */
        const guestsSelect = document.getElementById('reservation-guests');
        if (guestsSelect) {
            const currentValue = guestsSelect.value;
            guestsSelect.querySelectorAll('option[data-i18n]').forEach((opt) => {
                const key = opt.getAttribute('data-i18n');
                if (key) opt.textContent = t(key, lang);
            });
            guestsSelect.value = currentValue;
        }

        /* Order type labels */
        document.querySelectorAll('.order-type input').forEach((input) => {
            const span = input.nextElementSibling;
            if (span && span.hasAttribute('data-i18n')) {
                const key = span.getAttribute('data-i18n');
                span.textContent = t(key, lang);
            }
        });

        window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    };

    /* =========================================================
       INITIALISATION
    ========================================================= */

    const init = () => {
        const savedLang = getSavedLang();
        applyLanguage(savedLang);

        document.querySelectorAll('[data-lang]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const newLang = btn.dataset.lang;
                const current = getSavedLang();
                if (newLang !== current && SUPPORTED_LANGS.includes(newLang)) {
                    applyLanguage(newLang);
                }
            });
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* =========================================================
       API PUBLIQUE
    ========================================================= */

    window.NOIRE_I18N = {
        t: (key) => t(key, getSavedLang()),
        getLang: getSavedLang,
        setLang: (lang) => applyLanguage(lang),
        translations,
        supported: SUPPORTED_LANGS
    };

})();
