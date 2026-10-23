    /* ========================================
       STACKLY SPORT MOBILE MENU
    ======================================== */

    (() => {
        const menu = document.getElementById(
            "stacklySportMobileMenu"
        );

        const overlay = document.getElementById(
            "stacklySportMobileOverlay"
        );

        const openButton = document.getElementById(
            "stacklySportMenuToggle"
        );

        const closeButton = document.getElementById(
            "stacklySportMenuClose"
        );

        const body = document.body;

        if (!menu || !overlay || !openButton || !closeButton) {
            return;
        }

        function openMenu() {
            menu.classList.add("is-open");
            overlay.classList.add("is-visible");

            menu.removeAttribute("inert");
            menu.setAttribute("aria-hidden", "false");

            openButton.setAttribute("aria-expanded", "true");
            openButton.setAttribute(
                "aria-label",
                "Close navigation menu"
            );

            openButton.innerHTML =
                '<i class="fa-solid fa-xmark"></i>';

            body.classList.add("stackly-sport-menu-active");
        }

        function closeMenu() {
            menu.classList.remove("is-open");
            overlay.classList.remove("is-visible");

            menu.setAttribute("inert", "");
            menu.setAttribute("aria-hidden", "true");

            openButton.setAttribute("aria-expanded", "false");
            openButton.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

            openButton.innerHTML =
                '<i class="fa-solid fa-bars"></i>';

            body.classList.remove("stackly-sport-menu-active");
        }

        openButton.addEventListener("click", () => {
            if (menu.classList.contains("is-open")) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        closeButton.addEventListener("click", closeMenu);
        overlay.addEventListener("click", closeMenu);

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                closeMenu();
            }
        });
    })();


    /* ========================================
       AOS ANIMATION INITIALIZATION
    ======================================== */

    function initializeAOS() {
        if (typeof AOS === "undefined") {
            console.error(
                "AOS library not loaded. Check the AOS script URL."
            );
            return;
        }

        AOS.init({
            duration: 900,
            once: true,
            offset: 70,
            easing: "ease-out-cubic",
            startEvent: "DOMContentLoaded"
        });

        // Refresh AOS positions after images and page assets load.
        window.addEventListener("load", () => {
            AOS.refreshHard();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeAOS,
            { once: true }
        );
    } else {
        initializeAOS();
    }



    document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("newsletterForm");
    const emailInput = document.getElementById("newsletter-email");
    const message = document.getElementById("newsletterMessage");

    let messageTimer;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Clear any previous message timer
        clearTimeout(messageTimer);

        // Reset previous message
        message.textContent = "";
        message.className = "newsletter-message";

        const email = emailInput.value.trim();

        // Check for an empty email
        if (email === "") {
            showMessage("Please enter your email address.", "error");
            emailInput.focus();
            return;
        }

        // Validate email format
        const emailPattern =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(email)) {
            showMessage(
                "Please enter a valid email address.",
                "error"
            );
            emailInput.focus();
            return;
        }

        // Successful front-end validation
        showMessage(
            "Thank you! You have subscribed successfully.",
            "success"
        );

        // Clear the form
        form.reset();
    });

    function showMessage(text, type) {
        message.textContent = text;
        message.className = "newsletter-message " + type;

        // Hide the message after 4 seconds
        messageTimer = setTimeout(function () {
            message.textContent = "";
            message.className = "newsletter-message";
        }, 4000);
    }
});


/* ==========================================
   STACKLY SPORT - ACTIVE NAVIGATION
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // Get the current page filename
    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase() || "index.html";

    // Desktop navigation
    const desktopLinks = document.querySelectorAll(
        ".stackly-sport-desktop-nav .stackly-sport-nav-link"
    );

    // Mobile navigation
    const mobileLinks = document.querySelectorAll(
        ".stackly-sport-mobile-nav a"
    );

    // Update active link in both menus
    function updateActiveLinks(links) {
        links.forEach(function (link) {

            const linkPage = link.getAttribute("href")
                .split("/")
                .pop()
                .toLowerCase();

            const isActive = linkPage === currentPage;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    updateActiveLinks(desktopLinks);
    updateActiveLinks(mobileLinks);

});



/* ==========================================
   STACKLY SPORT CLUB - CONTACT FORM
   Validation + Success Message + Auto Clear
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector(".stackly-contact-form");

    if (!form) return;

    const nameInput = form.querySelector('[name="name"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const emailInput = form.querySelector('[name="email"]');
    const messageInput = form.querySelector('[name="message"]');

    const dropdown = form.querySelector(".stackly-custom-dropdown");
    const dropdownToggle = form.querySelector("#stacklyDropdownToggle");
    const dropdownMenu = form.querySelector("#stacklyDropdownMenu");
    const dropdownSelected = form.querySelector("#stacklyDropdownSelected");
    const subjectInput = form.querySelector("#stacklyDropdownValue");
    const dropdownOptions = dropdown
        ? Array.from(dropdown.querySelectorAll('[role="option"]'))
        : [];

    // Create feedback message element
    const feedback = document.createElement("div");

    feedback.className = "stackly-form-feedback";
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    feedback.hidden = true;

    form.prepend(feedback);

    let feedbackTimer;

    // Show error or success message
    function showFeedback(message, type) {
        clearTimeout(feedbackTimer);

        feedback.textContent = message;
        feedback.className = "stackly-form-feedback " + type;
        feedback.hidden = false;

        feedback.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

        if (type === "success") {
            feedbackTimer = setTimeout(function () {
                feedback.hidden = true;
                feedback.textContent = "";
            }, 4000);
        }
    }

    // Remove previous error styling
    function clearErrors() {
        form.querySelectorAll(".is-invalid").forEach(function (field) {
            field.classList.remove("is-invalid");
            field.removeAttribute("aria-invalid");
        });

        if (dropdown) {
            dropdown.classList.remove("is-invalid");
        }
    }

    // Validate a field and display the first error
    function showError(field, message) {
        field.classList.add("is-invalid");
        field.setAttribute("aria-invalid", "true");

        showFeedback(message, "error");

        field.focus({ preventScroll: true });

        field.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    // Name: letters and spaces, including common accented letters
    function isValidName(value) {
        return /^[\p{L}]+(?:[ '\u2019-][\p{L}]+)*$/u.test(value.trim());
    }

    // Email validation
    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }

    // Phone: exactly 10 digits
    function isValidPhone(value) {
        return /^\d{10}$/.test(value.trim());
    }

    // Keep phone input numeric and limit it to 10 digits
    phoneInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 10);
        this.classList.remove("is-invalid");
        this.removeAttribute("aria-invalid");
    });

    // Name input validation feedback
    nameInput.addEventListener("input", function () {
        this.classList.remove("is-invalid");
        this.removeAttribute("aria-invalid");
    });

    // Email input validation feedback
    emailInput.addEventListener("input", function () {
        this.classList.remove("is-invalid");
        this.removeAttribute("aria-invalid");
    });

    messageInput.addEventListener("input", function () {
        this.classList.remove("is-invalid");
        this.removeAttribute("aria-invalid");
    });

    // Custom subject dropdown
    if (dropdown && dropdownToggle && dropdownMenu && subjectInput) {

        function closeDropdown() {
            dropdownMenu.hidden = true;
            dropdown.classList.remove("is-open");
            dropdownToggle.setAttribute("aria-expanded", "false");
        }

        function openDropdown() {
            dropdownMenu.hidden = false;
            dropdown.classList.add("is-open");
            dropdownToggle.setAttribute("aria-expanded", "true");
        }

        function selectSubject(option) {
            dropdownSelected.textContent = option.textContent.trim();
            subjectInput.value = option.dataset.value;

            dropdownToggle.classList.add("has-value");
            dropdown.classList.remove("is-invalid");

            dropdownOptions.forEach(function (item) {
                item.setAttribute("aria-selected", "false");
            });

            option.setAttribute("aria-selected", "true");

            closeDropdown();
            dropdownToggle.focus();
        }

        dropdownToggle.addEventListener("click", function () {
            if (dropdownMenu.hidden) {
                openDropdown();
            } else {
                closeDropdown();
            }
        });

        dropdownOptions.forEach(function (option, index) {

            option.addEventListener("click", function () {
                selectSubject(option);
            });

            option.addEventListener("keydown", function (event) {

                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectSubject(option);
                }

                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    dropdownOptions[
                        (index + 1) % dropdownOptions.length
                    ].focus();
                }

                if (event.key === "ArrowUp") {
                    event.preventDefault();
                    dropdownOptions[
                        (index - 1 + dropdownOptions.length) %
                        dropdownOptions.length
                    ].focus();
                }

                if (event.key === "Escape") {
                    closeDropdown();
                    dropdownToggle.focus();
                }
            });
        });

        document.addEventListener("click", function (event) {
            if (!dropdown.contains(event.target)) {
                closeDropdown();
            }
        });

        dropdownToggle.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeDropdown();
            }

            if (event.key === "ArrowDown" && dropdownMenu.hidden) {
                event.preventDefault();
                openDropdown();

                if (dropdownOptions.length) {
                    dropdownOptions[0].focus();
                }
            }
        });
    }

    // Validate and submit form
    form.addEventListener("submit", function (event) {

        event.preventDefault();
        clearErrors();

        // 1. Name required
        if (!nameInput.value.trim()) {
            showError(nameInput, "Please enter your name.");
            return;
        }

        // 2. Name should contain alphabetic characters
        if (!isValidName(nameInput.value)) {
            showError(
                nameInput,
                "Please enter a valid name using letters only."
            );
            return;
        }

        // 3. Phone required
        if (!phoneInput.value.trim()) {
            showError(phoneInput, "Please enter your phone number.");
            return;
        }

        // 4. Exactly 10 digits
        if (!isValidPhone(phoneInput.value)) {
            showError(
                phoneInput,
                "Phone number must contain exactly 10 digits."
            );
            return;
        }

        // 5. Email required
        if (!emailInput.value.trim()) {
            showError(emailInput, "Please enter your email address.");
            return;
        }

        // 6. Email format
        if (!isValidEmail(emailInput.value)) {
            showError(
                emailInput,
                "Please enter a valid email address."
            );
            return;
        }

        // 7. Subject required
        if (!subjectInput || !subjectInput.value) {
            if (dropdown) {
                dropdown.classList.add("is-invalid");
                showFeedback("Please select a subject.", "error");
                dropdownToggle.focus();
            }
            return;
        }

        // 8. Message required
        if (!messageInput.value.trim()) {
            showError(messageInput, "Please enter your message.");
            return;
        }

        // All validations passed.
        // This is a frontend demo; connect a backend to actually send.
        clearTimeout(feedbackTimer);

        form.reset();

        // Reset custom dropdown display and selection
        if (dropdown && dropdownSelected && subjectInput) {
            dropdownSelected.textContent = "Select Subject";
            subjectInput.value = "";

            dropdownToggle.classList.remove("has-value");
            dropdown.classList.remove("is-invalid");

            dropdownOptions.forEach(function (option) {
                option.setAttribute("aria-selected", "false");
            });

            dropdownMenu.hidden = true;
            dropdown.classList.remove("is-open");
            dropdownToggle.setAttribute("aria-expanded", "false");
        }

        showFeedback(
            "Your message has been submitted successfully!",
            "success"
        );
    });

});

/* ==========================================
   STACKLY SPORTS CLUB - LOADING SCREEN JS
   Loading Duration: 2 Seconds
========================================== */

(function () {
    "use strict";

    const loader = document.getElementById("stacklyLoader");

    if (!loader) return;

    const progressBar = document.getElementById("stacklyLoaderProgress");
    const percentage = document.getElementById("stacklyLoaderPercent");
    const message = document.getElementById("stacklyLoaderMessage");

    const messages = [
        "Preparing your experience",
        "Getting your training space ready",
        "Almost ready to perform"
    ];

    const LOADING_DURATION = 2000; // 2 seconds
    const FADE_DURATION = 750;

    let startTime = Date.now();
    let animationFrame = null;
    let finished = false;

    // Prevent scrolling while the loader is visible
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    function updateProgress(value) {
        const progress = Math.min(100, Math.max(0, value));

        if (progressBar) {
            progressBar.style.width = progress + "%";
        }

        if (percentage) {
            percentage.textContent = Math.floor(progress) + "%";
        }

        const messageIndex = Math.min(
            messages.length - 1,
            Math.floor(progress / 34)
        );

        if (message) {
            message.textContent = messages[messageIndex];
        }
    }

    function hideLoader() {
        if (finished) return;

        finished = true;

        if (animationFrame !== null) {
            window.cancelAnimationFrame(animationFrame);
        }

        updateProgress(100);

        // Start the fade-out animation
        loader.classList.add("stackly-loader-hidden");

        // Restore page scrolling
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";

        // Remove loader after the fade animation
        window.setTimeout(function () {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, FADE_DURATION);
    }

    function animateProgress() {
        if (finished) return;

        const elapsed = Date.now() - startTime;
        const progress = Math.min(
            95,
            (elapsed / LOADING_DURATION) * 100
        );

        updateProgress(progress);

        if (elapsed >= LOADING_DURATION) {
            hideLoader();
            return;
        }

        animationFrame = window.requestAnimationFrame(animateProgress);
    }

    // Start the 2-second loading animation
    animationFrame = window.requestAnimationFrame(animateProgress);

})();


/* ==========================================
   STACKLY SPORTS CLUB
   GLOBAL HEADER SEARCH
   ALL PAGES + RESET TO NORMAL
========================================== */

(function () {
    "use strict";

    const HOME_PAGE = "index.html";
    const NOT_FOUND_PAGE = "404.html";

    const SEARCH_FORM_SELECTOR =
        ".stackly-sport-search, .stackly-sport-mobile-search";

    const PROGRAM_SECTION_SELECTOR = ".programs-section";
    const PROGRAM_CARD_SELECTOR = ".program-card";
    const PROGRAM_GRID_SELECTOR = ".programs-grid";

    const SEARCH_MESSAGE_ID = "stacklyProgramSearchMessage";

    const searchForms = document.querySelectorAll(
        SEARCH_FORM_SELECTOR
    );

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    const isHomePage =
        currentPage === "" || currentPage === HOME_PAGE;

    /* ==========================================
       NORMALIZE SEARCH TEXT
    ========================================== */

    function normalizeText(text) {
        return String(text || "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, " ");
    }

    /* ==========================================
       CLEAR SEARCH FORM ERRORS
    ========================================== */

    function clearError(form, input) {
        const message = form.querySelector(
            ".stackly-global-search-error"
        );

        if (message) {
            message.hidden = true;
            message.textContent = "";
        }

        input.classList.remove("stackly-search-invalid");
        input.removeAttribute("aria-invalid");
    }

    function showError(form, input, text) {
        let message = form.querySelector(
            ".stackly-global-search-error"
        );

        if (!message) {
            message = document.createElement("span");
            message.className = "stackly-global-search-error";
            message.setAttribute("role", "alert");
            message.setAttribute("aria-live", "polite");
            form.appendChild(message);
        }

        message.textContent = text;
        message.hidden = false;

        input.classList.add("stackly-search-invalid");
        input.setAttribute("aria-invalid", "true");
        input.focus();
    }

    /* ==========================================
       REMOVE SEARCH PARAMETER FROM URL
    ========================================== */

    function removeSearchFromURL() {
        const url = new URL(window.location.href);

        if (url.searchParams.has("search")) {
            url.searchParams.delete("search");

            window.history.replaceState(
                window.history.state,
                "",
                url.pathname + url.search + url.hash
            );
        }
    }

    /* ==========================================
       RESET TO NORMAL PAGE CONTENT
    ========================================== */

    function resetSearchContent(options) {
        options = options || {};

        const clearInputs = options.clearInputs !== false;
        const cleanURL = options.cleanURL !== false;

        // Restore every program card.
        document.querySelectorAll(
            PROGRAM_CARD_SELECTOR
        ).forEach(function (card) {
            card.hidden = false;
            card.style.removeProperty("display");
        });

        // Remove the program search result message.
        const resultMessage = document.getElementById(
            SEARCH_MESSAGE_ID
        );

        if (resultMessage) {
            resultMessage.remove();
        }

        // Clear search fields and their validation messages.
        if (clearInputs) {
            searchForms.forEach(function (form) {
                const input = form.querySelector(
                    'input[type="search"]'
                );

                if (input) {
                    input.value = "";
                    clearError(form, input);
                }
            });
        }

        // Remove the search query from the current URL.
        if (cleanURL) {
            removeSearchFromURL();
        }

        // Recalculate AOS positions after restoring cards.
        if (
            window.AOS &&
            typeof window.AOS.refreshHard === "function"
        ) {
            window.AOS.refreshHard();
        }
    }

    /* ==========================================
       FIND MATCHING PROGRAMS
    ========================================== */

    function getMatchingPrograms(query) {
        const term = normalizeText(query);

        return Array.from(
            document.querySelectorAll(PROGRAM_CARD_SELECTOR)
        ).filter(function (card) {
            const title =
                card.querySelector("h3")?.textContent || "";

            const description =
                card.querySelector("p")?.textContent || "";

            return normalizeText(
                title + " " + description
            ).includes(term);
        });
    }

    /* ==========================================
       DISPLAY SEARCH RESULTS
    ========================================== */

    function displayProgramResults(query, shouldScroll) {
        const section = document.querySelector(
            PROGRAM_SECTION_SELECTOR
        );

        const cards = document.querySelectorAll(
            PROGRAM_CARD_SELECTOR
        );

        const grid = document.querySelector(
            PROGRAM_GRID_SELECTOR
        );

        if (!section || !cards.length || !grid) {
            return false;
        }

        let message = document.getElementById(
            SEARCH_MESSAGE_ID
        );

        if (!message) {
            message = document.createElement("p");
            message.id = SEARCH_MESSAGE_ID;
            message.className =
                "stackly-program-search-message";

            message.setAttribute("role", "status");
            message.setAttribute("aria-live", "polite");

            grid.parentNode.insertBefore(message, grid);
        }

        const term = normalizeText(query);
        let count = 0;

        cards.forEach(function (card) {
            const title =
                card.querySelector("h3")?.textContent || "";

            const description =
                card.querySelector("p")?.textContent || "";

            const matches = normalizeText(
                title + " " + description
            ).includes(term);

            card.hidden = !matches;

            if (matches) {
                count++;
            }
        });

        if (count === 0) {
            message.textContent =
                "No programs found. Please try another program name.";

            message.classList.add(
                "stackly-program-search-no-results"
            );

            message.hidden = false;
            return false;
        }

        message.textContent =
            count +
            (count === 1
                ? " program found."
                : " programs found.");

        message.classList.remove(
            "stackly-program-search-no-results"
        );

        message.hidden = false;

        if (shouldScroll) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        if (
            window.AOS &&
            typeof window.AOS.refreshHard === "function"
        ) {
            window.AOS.refreshHard();
        }

        return true;
    }

    /* ==========================================
       REDIRECT TO 404 PAGE
    ========================================== */

    function redirectToNotFound(query) {
        const target = new URL(
            NOT_FOUND_PAGE,
            window.location.href
        );

        target.searchParams.set("search", query);
        window.location.href = target.href;
    }

    /* ==========================================
       SUBMIT SEARCH
    ========================================== */

    function submitSearch(form, input) {
        const query = input.value.trim();

        if (!query) {
            showError(
                form,
                input,
                "Please enter a program name to search."
            );
            return;
        }

        clearError(form, input);

        // Search the program cards on the homepage.
        if (isHomePage) {
            const section = document.querySelector(
                PROGRAM_SECTION_SELECTOR
            );

            const cards = document.querySelectorAll(
                PROGRAM_CARD_SELECTOR
            );

            if (section && cards.length) {
                const matches = getMatchingPrograms(query);

                if (matches.length > 0) {
                    const url = new URL(
                        window.location.href
                    );

                    url.searchParams.set("search", query);

                    window.history.replaceState(
                        window.history.state,
                        "",
                        url.pathname + url.search + url.hash
                    );

                    displayProgramResults(query, true);
                    return;
                }

                redirectToNotFound(query);
                return;
            }
        }

        // Search from another page through the homepage.
        const target = new URL(
            HOME_PAGE,
            window.location.href
        );

        target.searchParams.set("search", query);
        window.location.href = target.href;
    }

    /* ==========================================
       CONNECT DESKTOP AND MOBILE SEARCH
    ========================================== */

    searchForms.forEach(function (form) {
        const input = form.querySelector(
            'input[type="search"]'
        );

        if (!input) {
            return;
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            submitSearch(form, input);
        });

        input.addEventListener("input", function () {
            clearError(form, input);

            // Keep all search fields synchronized.
            searchForms.forEach(function (otherForm) {
                const otherInput = otherForm.querySelector(
                    'input[type="search"]'
                );

                if (otherInput && otherInput !== input) {
                    otherInput.value = input.value;
                    clearError(otherForm, otherInput);
                }
            });
        });

        // Escape clears the active search and restores all cards.
        input.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                event.preventDefault();

                resetSearchContent({
                    clearInputs: true,
                    cleanURL: true
                });

                input.blur();
            }
        });
    });

    /* ==========================================
       CLEAR SEARCH WHEN LEAVING THE PAGE
       AND RETURNING TO IT
    ========================================== */

    // Detect a page restored using browser Back/Forward.
    window.addEventListener("pageshow", function () {
        // Do not preserve an old filtered search after navigation.
        if (isHomePage) {
            resetSearchContent({
                clearInputs: true,
                cleanURL: true
            });
        }
    });

    // Clear temporary search state when leaving the page.
    window.addEventListener("pagehide", function () {
        if (isHomePage) {
            resetSearchContent({
                clearInputs: true,
                cleanURL: false
            });
        }
    });

    /* ==========================================
       CLEAR SEARCH WHEN TAB IS HIDDEN
       AND RESTORE WHEN VISIBLE
    ========================================== */

    let pageWasHidden = false;

    document.addEventListener(
        "visibilitychange",
        function () {
            if (document.visibilityState === "hidden") {
                pageWasHidden = true;
                return;
            }

            if (
                document.visibilityState === "visible" &&
                pageWasHidden
            ) {
                pageWasHidden = false;

                if (isHomePage) {
                    resetSearchContent({
                        clearInputs: true,
                        cleanURL: true
                    });
                }
            }
        }
    );

    /* ==========================================
       INITIAL PAGE STATE
    ========================================== */

    // Start every fresh page load with normal content.
    // A search is applied only when a search URL parameter exists.
    if (isHomePage) {
        const params = new URLSearchParams(
            window.location.search
        );

        const initialQuery = params.get("search");

        if (initialQuery && initialQuery.trim()) {
            searchForms.forEach(function (form) {
                const input = form.querySelector(
                    'input[type="search"]'
                );

                if (input) {
                    input.value = initialQuery;
                }
            });

            const section = document.querySelector(
                PROGRAM_SECTION_SELECTOR
            );

            const cards = document.querySelectorAll(
                PROGRAM_CARD_SELECTOR
            );

            if (section && cards.length) {
                const matches =
                    getMatchingPrograms(initialQuery);

                if (matches.length > 0) {
                    displayProgramResults(
                        initialQuery,
                        false
                    );
                } else {
                    redirectToNotFound(initialQuery);
                }
            }
        } else {
            resetSearchContent({
                clearInputs: true,
                cleanURL: false
            });
        }
    }

})();
