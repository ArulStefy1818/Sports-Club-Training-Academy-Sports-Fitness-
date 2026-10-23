
/* =====================================================
   STACKLY SPORTS CLUB TRAINING ACADEMY
   MEMBER DASHBOARD - JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // ================================================
    // ELEMENTS
    // ================================================

    const sidebar = document.getElementById("memberSidebar");
    const overlay = document.getElementById("memberOverlay");
    const hamburger = document.getElementById("memberHamburger");
    const closeButton = document.getElementById("memberClose");
    const logoutButton = document.getElementById("memberLogout");
    const notificationButton = document.getElementById("memberNotification");

    const emailElement = document.getElementById("memberEmail");
    const nameElement = document.getElementById("memberName");
    const dateElement = document.getElementById("memberCurrentDate");
    const yearElement = document.getElementById("memberYear");

    const navLinks = document.querySelectorAll(
        ".stackly-member-nav-link"
    );

    // ================================================
    // GET LOGIN DETAILS
    // ================================================

    function getStoredValue(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function getRegisteredUser(email) {
        if (!email) return null;

        try {
            const users = JSON.parse(
                localStorage.getItem("stacklySportUsers") || "[]"
            );

            if (!Array.isArray(users)) return null;

            return users.find(function (user) {
                return (
                    user &&
                    typeof user.email === "string" &&
                    user.email.toLowerCase() === email.toLowerCase()
                );
            }) || null;

        } catch (error) {
            console.error("Unable to read registered user details.", error);
            return null;
        }
    }

    // Use the email stored during login.
    // These fallback keys support older versions of the project.
    const storedEmail = (
        getStoredValue("loginEmail") ||
        getStoredValue("stacklySportLoginEmail") ||
        getStoredValue("memberEmail") ||
        getStoredValue("stacklySportEmail") ||
        ""
    ).trim().toLowerCase();

    // Retrieve the registered account, if available.
    const registeredUser = getRegisteredUser(storedEmail);

    // ================================================
    // DISPLAY EMAIL AT TOP-RIGHT
    // ================================================

    if (emailElement) {
        emailElement.textContent =
            storedEmail || "No email available";

        emailElement.title = storedEmail || "No email available";
    }

    // ================================================
    // GET FIRST NAME FROM EMAIL
    // ================================================
    // Example:
    // arul.stefy@gmail.com -> Arul
    // john123@gmail.com    -> John123
    // fitness_member@gmail.com -> Fitness
    // ================================================

    function getFirstNameFromEmail(email) {
        if (!email || !email.includes("@")) {
            return "Champion";
        }

        const username = email.split("@")[0].trim();

        if (!username) {
            return "Champion";
        }

        // Take the first word before a dot, underscore,
        // hyphen, or space.
        const firstWord = username
            .split(/[._\-\s]+/)
            .filter(Boolean)[0];

        if (!firstWord) {
            return "Champion";
        }

        return firstWord.charAt(0).toUpperCase() +
            firstWord.slice(1).toLowerCase();
    }

    const firstName = getFirstNameFromEmail(storedEmail);

    if (nameElement) {
        nameElement.textContent = firstName + "!";
    }

    // ================================================
    // CURRENT DATE AND FOOTER YEAR
    // ================================================

    function updateDate() {
        const now = new Date();

        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
        }

        if (yearElement) {
            yearElement.textContent = now.getFullYear();
        }
    }

    updateDate();

    // ================================================
    // ACTIVE SIDEBAR LINK
    // ================================================

    function setActiveLink(activeLink) {
        navLinks.forEach(function (link) {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        });

        if (activeLink) {
            activeLink.classList.add("active");
            activeLink.setAttribute("aria-current", "page");
        }
    }

    function highlightCurrentPage() {
        const currentPage = (
            window.location.pathname.split("/").pop() || "member.html"
        ).toLowerCase();

        let matchingLink = null;

        navLinks.forEach(function (link) {
            const href = link.getAttribute("href");

            if (!href) return;

            const linkPage = href
                .split("/")
                .pop()
                .split("?")[0]
                .split("#")[0]
                .toLowerCase();

            if (linkPage === currentPage) {
                matchingLink = link;
            }
        });

        if (!matchingLink) {
            matchingLink = document.querySelector(
                '.stackly-member-nav-link[href="member.html"]'
            );
        }

        setActiveLink(matchingLink);
    }

    highlightCurrentPage();

    // ================================================
    // MOBILE SIDEBAR OPEN / CLOSE
    // ================================================

    function openSidebar() {
        if (!sidebar || !overlay) return;

        sidebar.classList.add("stackly-member-sidebar-open");
        overlay.classList.add("stackly-member-overlay-visible");

        document.body.classList.add("stackly-member-menu-active");

        if (hamburger) {
            hamburger.setAttribute("aria-expanded", "true");
            hamburger.setAttribute(
                "aria-label",
                "Close navigation menu"
            );
        }

        if (closeButton) {
            closeButton.focus();
        }
    }

    function closeSidebar() {
        if (sidebar) {
            sidebar.classList.remove("stackly-member-sidebar-open");
        }

        if (overlay) {
            overlay.classList.remove("stackly-member-overlay-visible");
        }

        document.body.classList.remove("stackly-member-menu-active");

        if (hamburger) {
            hamburger.setAttribute("aria-expanded", "false");
            hamburger.setAttribute(
                "aria-label",
                "Open navigation menu"
            );
        }
    }

    if (hamburger) {
        hamburger.addEventListener("click", function () {
            const isOpen = sidebar &&
                sidebar.classList.contains("stackly-member-sidebar-open");

            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeSidebar);
    }

    if (overlay) {
        overlay.addEventListener("click", closeSidebar);
    }

    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            setActiveLink(link);
            closeSidebar();
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

    // ================================================
    // LOG OUT
    // ================================================

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            const confirmed = window.confirm(
                "Are you sure you want to log out of your member account?"
            );

            if (!confirmed) return;

            try {
                [
                    "loginEmail",
                    "stacklySportLoginEmail",
                    "stacklySportLoggedIn",
                    "stacklySportRemember",
                    "stacklySportEmail",
                    "memberEmail",
                    "loginRole"
                ].forEach(function (key) {
                    localStorage.removeItem(key);
                });

            } catch (error) {
                console.error(
                    "Unable to clear login information.",
                    error
                );
            }

            window.location.href = "index.html";
        });
    }

    // ================================================
    // NOTIFICATIONS
    // ================================================

    if (notificationButton) {
        notificationButton.addEventListener("click", function () {
            window.location.href = "404-member.html";
        });
    }

    // ================================================
    // SMOOTH INTERNAL NAVIGATION
    // ================================================

    document.querySelectorAll(
        '.stackly-member-dashboard a[href^="#"]'
    ).forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            if (window.location.hash !== targetId) {
                window.history.pushState(null, "", targetId);
            }

            target.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });
        });
    });

    // ================================================
    // RESPONSIVE SIDEBAR
    // ================================================

    window.addEventListener("resize", function () {
        if (window.innerWidth > 1050) {
            closeSidebar();
        }
    });

    console.log("Stackly Member Dashboard initialized.");
});



/* ==========================================
   STACKLY SPORTS CLUB
   MEMBER SETTINGS PAGE
   Email-Based Name + Profile + Preferences
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       STORAGE KEYS
    ========================================== */

    const USERS_KEY = "stacklySportUsers";
    const SETTINGS_KEY = "stacklyMemberSettings";

    const EMAIL_KEYS = [
        "loginEmail",
        "stacklySportLoginEmail",
        "memberEmail",
        "stacklySportEmail"
    ];

    /* ==========================================
       GET HTML ELEMENTS
    ========================================== */

    const elements = {
        name: document.getElementById("stacklySettingsName"),
        email: document.getElementById("stacklySettingsEmail"),
        fullName: document.getElementById("stacklySettingsFullName"),
        emailDetail: document.getElementById("stacklySettingsEmailDetail"),
        phone: document.getElementById("stacklySettingsPhone"),
        role: document.getElementById("stacklySettingsRole"),

        language: document.getElementById("stacklySettingsLanguage"),
        theme: document.getElementById("stacklySettingsTheme"),

        training: document.getElementById("stacklySettingsTraining"),
        workout: document.getElementById("stacklySettingsWorkout"),
        membership: document.getElementById("stacklySettingsMembership"),
        promotions: document.getElementById("stacklySettingsPromotions"),

        saveButton: document.getElementById("stacklySettingsSave"),
        status: document.getElementById("stacklySettingsStatus")
    };

    /* ==========================================
       SAFE LOCAL STORAGE HELPERS
    ========================================== */

    function readStorage(key, fallback = "") {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : value;
        } catch (error) {
            console.error("Unable to read storage:", error);
            return fallback;
        }
    }

    function readJSON(key, fallback) {
        try {
            const value = localStorage.getItem(key);

            if (!value) {
                return fallback;
            }

            return JSON.parse(value);
        } catch (error) {
            console.error("Unable to read stored JSON:", error);
            return fallback;
        }
    }

    function writeJSON(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error("Unable to save data:", error);
            return false;
        }
    }

    /* ==========================================
       GET LOGGED-IN EMAIL
    ========================================== */

    function getLoggedInEmail() {
        for (const key of EMAIL_KEYS) {
            const storedEmail = readStorage(key, "");

            if (
                typeof storedEmail === "string" &&
                storedEmail.trim() !== "" &&
                storedEmail.includes("@")
            ) {
                return storedEmail.trim();
            }
        }

        return "";
    }

    /* ==========================================
       GET FIRST NAME FROM EMAIL
       
       arul.stefy@gmail.com -> Arul
       johnsmith@gmail.com -> Johnsmith
       sports_member@gmail.com -> Sports
       alex-king@gmail.com -> Alex
    ========================================== */

    function getNameFromEmail(email) {
        if (!email || typeof email !== "string") {
            return "Member";
        }

        // Take only the part before @.
        const username = email.split("@")[0];

        if (!username) {
            return "Member";
        }

        // Take the first word before ., _, -, or whitespace.
        const firstWord = username
            .split(/[._\-\s]+/)
            .filter(Boolean)[0];

        if (!firstWord) {
            return "Member";
        }

        // Capitalize the first character.
        return firstWord.charAt(0).toUpperCase() +
            firstWord.slice(1);
    }

    /* ==========================================
       GET REGISTERED USER DETAILS
    ========================================== */

    function getRegisteredUser(email) {
        if (!email) {
            return null;
        }

        const users = readJSON(USERS_KEY, []);

        if (!Array.isArray(users)) {
            return null;
        }

        return users.find(function (user) {
            return (
                user &&
                typeof user.email === "string" &&
                user.email.trim().toLowerCase() ===
                    email.trim().toLowerCase()
            );
        }) || null;
    }

    /* ==========================================
       DISPLAY PROFILE INFORMATION
       
       Name is ALWAYS derived from the email ID.
       Other profile details come from registration.
    ========================================== */

    function displayProfile() {
        const email = getLoggedInEmail();
        const user = getRegisteredUser(email);

        // IMPORTANT: Derive the name from the email,
        // not from user.fullName.
        const displayName = getNameFromEmail(email);

        const phone =
            user && typeof user.phone === "string"
                ? user.phone.trim()
                : "";

        const role =
            user && typeof user.role === "string"
                ? user.role.trim()
                : "Member";

        if (elements.name) {
            elements.name.textContent = displayName;
        }

        if (elements.email) {
            elements.email.textContent =
                email || "No email available";
        }

        if (elements.fullName) {
            elements.fullName.textContent = displayName;
        }

        if (elements.emailDetail) {
            elements.emailDetail.textContent =
                email || "Not provided";
        }

        if (elements.phone) {
            elements.phone.textContent =
                phone || "Not provided";
        }

        if (elements.role) {
            elements.role.textContent = role;
        }

        document.title = "Account Settings | Stackly Sports Club";

        if (!email) {
            console.warn(
                "No logged-in email found. Check your login page storage key."
            );
        }
    }

    /* ==========================================
       DEFAULT SETTINGS
    ========================================== */

    const defaultSettings = {
        language: "en",
        theme: "light",

        notifications: {
            training: true,
            workout: true,
            membership: true,
            promotions: false
        }
    };

    /* ==========================================
       LOAD SAVED SETTINGS
    ========================================== */

    function getSavedSettings() {
        const saved = readJSON(SETTINGS_KEY, {});

        if (
            !saved ||
            typeof saved !== "object" ||
            Array.isArray(saved)
        ) {
            return {
                ...defaultSettings,
                notifications: {
                    ...defaultSettings.notifications
                }
            };
        }

        const notifications =
            saved.notifications &&
            typeof saved.notifications === "object" &&
            !Array.isArray(saved.notifications)
                ? saved.notifications
                : {};

        return {
            language: ["en", "ta", "hi"].includes(saved.language)
                ? saved.language
                : defaultSettings.language,

            theme: ["light", "dark", "system"].includes(saved.theme)
                ? saved.theme
                : defaultSettings.theme,

            notifications: {
                training:
                    typeof notifications.training === "boolean"
                        ? notifications.training
                        : defaultSettings.notifications.training,

                workout:
                    typeof notifications.workout === "boolean"
                        ? notifications.workout
                        : defaultSettings.notifications.workout,

                membership:
                    typeof notifications.membership === "boolean"
                        ? notifications.membership
                        : defaultSettings.notifications.membership,

                promotions:
                    typeof notifications.promotions === "boolean"
                        ? notifications.promotions
                        : defaultSettings.notifications.promotions
            }
        };
    }

    /* ==========================================
       APPLY THEME
    ========================================== */

    function applyTheme(theme) {
        const page = document.querySelector(
            ".stackly-settings-page"
        );

        if (!page) {
            return;
        }

        const prefersDark =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

        const useDark =
            theme === "dark" ||
            (theme === "system" && prefersDark);

        page.classList.toggle(
            "stackly-settings-dark",
            useDark
        );

        page.dataset.theme = useDark ? "dark" : "light";
    }

    /* ==========================================
       APPLY SAVED SETTINGS TO THE FORM
    ========================================== */

    function loadSettings() {
        const settings = getSavedSettings();

        if (elements.language) {
            elements.language.value = settings.language;
        }

        if (elements.theme) {
            elements.theme.value = settings.theme;
        }

        if (elements.training) {
            elements.training.checked =
                settings.notifications.training;
        }

        if (elements.workout) {
            elements.workout.checked =
                settings.notifications.workout;
        }

        if (elements.membership) {
            elements.membership.checked =
                settings.notifications.membership;
        }

        if (elements.promotions) {
            elements.promotions.checked =
                settings.notifications.promotions;
        }

        applyTheme(settings.theme);
    }

    /* ==========================================
       COLLECT CURRENT SETTINGS
    ========================================== */

    function collectSettings() {
        return {
            language: elements.language
                ? elements.language.value
                : defaultSettings.language,

            theme: elements.theme
                ? elements.theme.value
                : defaultSettings.theme,

            notifications: {
                training: elements.training
                    ? elements.training.checked
                    : defaultSettings.notifications.training,

                workout: elements.workout
                    ? elements.workout.checked
                    : defaultSettings.notifications.workout,

                membership: elements.membership
                    ? elements.membership.checked
                    : defaultSettings.notifications.membership,

                promotions: elements.promotions
                    ? elements.promotions.checked
                    : defaultSettings.notifications.promotions
            },

            updatedAt: new Date().toISOString()
        };
    }

    /* ==========================================
       STATUS MESSAGE
    ========================================== */

    let statusTimer;

    function showStatus(message, type = "success") {
        if (!elements.status) {
            return;
        }

        window.clearTimeout(statusTimer);

        elements.status.textContent = message;

        elements.status.classList.remove(
            "stackly-settings-status-success",
            "stackly-settings-status-error"
        );

        elements.status.classList.add(
            type === "error"
                ? "stackly-settings-status-error"
                : "stackly-settings-status-success"
        );

        statusTimer = window.setTimeout(function () {
            elements.status.textContent = "";

            elements.status.classList.remove(
                "stackly-settings-status-success",
                "stackly-settings-status-error"
            );
        }, 5000);
    }

    /* ==========================================
       SAVE SETTINGS BUTTON
    ========================================== */

    function saveSettings() {
        const settings = collectSettings();

        if (!["en", "ta", "hi"].includes(settings.language)) {
            showStatus(
                "Please select a valid language.",
                "error"
            );
            return;
        }

        if (!["light", "dark", "system"].includes(settings.theme)) {
            showStatus(
                "Please select a valid appearance.",
                "error"
            );
            return;
        }

        const savedSuccessfully = writeJSON(
            SETTINGS_KEY,
            settings
        );

        if (!savedSuccessfully) {
            showStatus(
                "Unable to save settings. Please check browser storage.",
                "error"
            );
            return;
        }

        applyTheme(settings.theme);

        showStatus(
            "Your settings have been saved successfully.",
            "success"
        );

        if (elements.saveButton) {
            const button = elements.saveButton;
            const originalContent = button.innerHTML;

            button.innerHTML =
                '<i class="fa-solid fa-circle-check"></i> Saved!';

            button.disabled = true;

            window.setTimeout(function () {
                button.innerHTML = originalContent;
                button.disabled = false;
            }, 1600);
        }
    }

    /* ==========================================
       LIVE THEME PREVIEW
    ========================================== */

    if (elements.theme) {
        elements.theme.addEventListener("change", function () {
            applyTheme(elements.theme.value);
        });
    }

    /* ==========================================
       SAVE BUTTON EVENT
    ========================================== */

    if (elements.saveButton) {
        elements.saveButton.addEventListener(
            "click",
            saveSettings
        );
    }

    /* ==========================================
       SYSTEM THEME CHANGE
    ========================================== */

    if (window.matchMedia) {
        const systemTheme = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

        function handleSystemThemeChange() {
            const selectedTheme = elements.theme
                ? elements.theme.value
                : getSavedSettings().theme;

            if (selectedTheme === "system") {
                applyTheme("system");
            }
        }

        if (systemTheme.addEventListener) {
            systemTheme.addEventListener(
                "change",
                handleSystemThemeChange
            );
        } else if (systemTheme.addListener) {
            systemTheme.addListener(
                handleSystemThemeChange
            );
        }
    }

    /* ==========================================
       INITIALIZE SETTINGS PAGE
    ========================================== */

    displayProfile();
    loadSettings();

    // Initialize or refresh AOS if available.
    if (window.AOS) {
        if (typeof window.AOS.refresh === "function") {
            window.AOS.refresh();
        } else if (typeof window.AOS.init === "function") {
            window.AOS.init({
                duration: 850,
                once: true,
                offset: 70,
                easing: "ease-out-cubic"
            });
        }
    }

});
