
/* ==========================================
   STACKLY TRAINER DASHBOARD - MOBILE MENU
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const body = document.querySelector(".stackly-coach-body");
    const sidebar = document.getElementById("stacklyCoachSidebar");
    const overlay = document.getElementById("stacklyCoachOverlay");
    const hamburger = document.getElementById("stacklyCoachHamburger");
    const exitButton = document.getElementById("stacklyCoachMobileExit");

    if (!body || !sidebar || !overlay || !hamburger || !exitButton) {
        return;
    }

    function openMenu() {
        body.classList.add("stackly-coach-menu-active");
        hamburger.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
        body.classList.remove("stackly-coach-menu-active");
        hamburger.setAttribute("aria-expanded", "false");
    }

    hamburger.addEventListener("click", openMenu);
    exitButton.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    sidebar.querySelectorAll(".stackly-coach-nav-link").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    /* Display email saved during login */
    const email =
        localStorage.getItem("loginEmail") ||
        localStorage.getItem("stacklySportLoginEmail") ||
        localStorage.getItem("memberEmail") ||
        localStorage.getItem("stacklySportEmail") ||
        "";

    const emailElement = document.getElementById("stacklyCoachTopEmail");
    const nameElement = document.getElementById("stacklyCoachTopName");

    if (email && emailElement) {
        emailElement.textContent = email;
    }

    if (email && nameElement) {
        const name = email.split("@")[0]
            .replace(/[._-]+/g, " ")
            .trim()
            .replace(/\b\w/g, function (letter) {
                return letter.toUpperCase();
            });

        nameElement.textContent = name || "Trainer";
    }

    /* AOS initialization */
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 850,
            once: true,
            offset: 70,
            easing: "ease-out-cubic"
        });
    }
});



/* ==========================================
   TRAINER SIDEBAR - ACTIVE LINK HIGHLIGHT
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(
        ".stackly-coach-navigation .stackly-coach-nav-link"
    );

    // Get the current page filename
    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    navLinks.forEach(function (link) {
        const linkPage = link.getAttribute("href")
            .split("/")
            .pop()
            .toLowerCase();

        // Highlight the current page link
        const isActive = linkPage === currentPage;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });
});



/* ==========================================
   STACKLY COACH - MY ATHLETES
   Professional Search, Filter & Animations
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ==========================================
       ELEMENTS
    ========================================== */

    const directory = document.getElementById(
        "stacklyCoachAthleteDirectory"
    );

    if (!directory) return;

    const searchInput = document.getElementById(
        "stacklyCoachAthleteSearch"
    );

    const statusFilter = document.getElementById(
        "stacklyCoachAthleteFilter"
    );

    const athleteGrid = document.getElementById(
        "stacklyCoachAthleteGrid"
    );

    const noResults = document.getElementById(
        "stacklyCoachAthleteNoResults"
    );

    const athleteCards = Array.from(
        athleteGrid.querySelectorAll(".stackly-coach-athlete-card")
    );

    if (!searchInput || !statusFilter || !athleteGrid || !noResults) {
        console.warn("Stackly Athletes: Required page elements are missing.");
        return;
    }

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let searchTimer;

    /* ==========================================
       SEARCH + STATUS FILTER
    ========================================== */

    function filterAthletes() {
        const searchTerm = searchInput.value
            .trim()
            .toLowerCase();

        const selectedStatus = statusFilter.value;

        let visibleCount = 0;

        athleteCards.forEach((card) => {
            const athleteName = (
                card.dataset.athleteName || ""
            ).toLowerCase();

            const athleteSpecialty = (
                card.dataset.athleteSpecialty || ""
            ).toLowerCase();

            const athleteStatus = (
                card.dataset.athleteStatus || ""
            ).toLowerCase();

            const matchesSearch =
                athleteName.includes(searchTerm) ||
                athleteSpecialty.includes(searchTerm);

            const matchesStatus =
                selectedStatus === "all" ||
                athleteStatus === selectedStatus;

            const shouldShow = matchesSearch && matchesStatus;

            card.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount++;

                // Refresh the entrance animation when filtering.
                if (!reducedMotion) {
                    card.classList.remove(
                        "stackly-athlete-filter-enter"
                    );

                    void card.offsetWidth;

                    card.classList.add(
                        "stackly-athlete-filter-enter"
                    );
                }
            }
        });

        // Toggle the empty-state message.
        noResults.hidden = visibleCount !== 0;

        // Update the live directory count, if present.
        const directoryCount = directory.querySelector(
            ".stackly-coach-athlete-directory-count span"
        );

        if (directoryCount) {
            directoryCount.textContent =
                `${visibleCount} ${visibleCount === 1 ? "Athlete" : "Athletes"}`;
        }

        // Let screen readers know how many results were found.
        athleteGrid.setAttribute(
            "aria-label",
            `${visibleCount} athletes displayed`
        );

        // Refresh AOS positions after cards have been hidden or shown.
        if (window.AOS && typeof window.AOS.refreshHard === "function") {
            window.AOS.refreshHard();
        }
    }

    /* ==========================================
       SEARCH INPUT
       Small delay improves typing performance.
    ========================================== */

    searchInput.addEventListener("input", () => {
        window.clearTimeout(searchTimer);

        searchTimer = window.setTimeout(() => {
            filterAthletes();
        }, 120);
    });

    /* ==========================================
       STATUS FILTER
    ========================================== */

    statusFilter.addEventListener("change", filterAthletes);

    /* ==========================================
       PROGRESS BAR ANIMATION
    ========================================== */

    function animateProgressBars() {
        const progressTracks = athleteGrid.querySelectorAll(
            ".stackly-coach-athlete-progress-track"
        );

        progressTracks.forEach((track) => {
            const progressBar = track.querySelector("span");

            if (!progressBar) return;

            const inlineWidth = progressBar.style.width;
            const widthMatch = inlineWidth.match(/(\d+(?:\.\d+)?)%/);

            if (!widthMatch) return;

            const progressValue = Math.min(
                100,
                Math.max(0, Number(widthMatch[1]))
            );

            track.setAttribute("role", "progressbar");
            track.setAttribute("aria-valuemin", "0");
            track.setAttribute("aria-valuemax", "100");
            track.setAttribute("aria-valuenow", String(progressValue));
            track.setAttribute(
                "aria-label",
                `Training progress ${progressValue}%`
            );

            if (reducedMotion) {
                progressBar.style.width = `${progressValue}%`;
                return;
            }

            progressBar.style.width = "0%";

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    progressBar.style.width = `${progressValue}%`;
                });
            });
        });
    }

    /* ==========================================
       CARD HOVER INTERACTIONS
    ========================================== */

    athleteCards.forEach((card) => {
        const profileLink = card.querySelector(
            ".stackly-coach-athlete-card-footer a"
        );

        if (profileLink) {
            profileLink.setAttribute(
                "title",
                `View ${card.dataset.athleteName || "athlete"} progress`
            );
        }

        card.addEventListener("mouseenter", () => {
            card.classList.add("stackly-athlete-card-hover");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("stackly-athlete-card-hover");
        });
    });

    /* ==========================================
       KEYBOARD SHORTCUT
       Press Escape to clear the search.
    ========================================== */

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            searchInput.value = "";
            statusFilter.value = "all";
            filterAthletes();
            searchInput.blur();
        }
    });

    /* ==========================================
       INITIALIZE PAGE
    ========================================== */

    // Set an accessible label on the athlete grid.
    athleteGrid.setAttribute("role", "region");
    athleteGrid.setAttribute("aria-label", "Athlete directory");

    // Prepare progress bars and initial filter state.
    animateProgressBars();
    filterAthletes();

    // Initialize AOS only if it has not already been initialized.
    if (window.AOS && !document.documentElement.classList.contains("aos-initialized")) {
        window.AOS.init({
            duration: 850,
            once: true,
            offset: 70,
            easing: "ease-out-cubic"
        });
    }

    console.info("Stackly Coach: My Athletes initialized successfully.");
});



/* ==========================================
   STACKLY SPORTS CLUB TRAINING ACADEMY
   TRAINER PROFILE PAGE - JAVASCRIPT
   Profile Management + Auto-Dismiss Messages
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* ==========================================
       CONFIGURATION
    ========================================== */

    const PROFILE_STORAGE_KEY = "stacklyTrainerProfile";
    const MESSAGE_DURATION = 4000;
    let messageTimer = null;

    const DEFAULT_PROFILE = {
        name: "Trainer",
        email: "",
        phone: "",
        location: "Chennai, Tamil Nadu",
        title: "Strength & Conditioning Coach",
        experience: "5+ Years",
        bio: "Dedicated fitness professional committed to helping athletes improve strength, endurance, mobility, and overall performance through structured training and personalized coaching."
    };

    /* ==========================================
       HELPER FUNCTIONS
    ========================================== */

    function getElement(id) {
        return document.getElementById(id);
    }

    function getStoredValue(key) {
        try {
            return localStorage.getItem(key) || "";
        } catch (error) {
            console.warn("Unable to read browser storage:", error);
            return "";
        }
    }

    function setStoredValue(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.error("Unable to save trainer profile:", error);
            return false;
        }
    }

    function getLoggedInEmail() {
        return (
            getStoredValue("loginEmail") ||
            getStoredValue("trainerEmail") ||
            getStoredValue("stacklySportLoginEmail") ||
            getStoredValue("memberEmail") ||
            getStoredValue("stacklySportEmail") ||
            ""
        ).trim();
    }

    function getNameFromEmail(email) {
        if (!email || !email.includes("@")) {
            return "Trainer";
        }

        const username = email
            .split("@")[0]
            .replace(/[._-]+/g, " ")
            .trim();

        return username
            .split(/\s+/)
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ") || "Trainer";
    }

    function setText(id, value) {
        const element = getElement(id);

        if (element) {
            element.textContent = value || "";
        }
    }

    function setInputValue(id, value) {
        const element = getElement(id);

        if (element) {
            element.value = value || "";
        }
    }

    function getInputValue(id, fallback) {
        const element = getElement(id);

        return element ? element.value.trim() : (fallback || "");
    }

    function normalizeProfile(profile) {
        return {
            name: profile.name || DEFAULT_PROFILE.name,
            email: profile.email || "",
            phone: profile.phone || "",
            location: profile.location || DEFAULT_PROFILE.location,
            title: profile.title || DEFAULT_PROFILE.title,
            experience: profile.experience || DEFAULT_PROFILE.experience,
            bio: profile.bio || DEFAULT_PROFILE.bio
        };
    }

    /* ==========================================
       LOAD SAVED PROFILE
    ========================================== */

    function loadSavedProfile() {
        let savedProfile = {};

        try {
            const storedProfile = getStoredValue(PROFILE_STORAGE_KEY);

            if (storedProfile) {
                savedProfile = JSON.parse(storedProfile) || {};
            }
        } catch (error) {
            console.warn("Saved profile could not be parsed:", error);
        }

        const loggedInEmail = getLoggedInEmail();

        const profile = {
            ...DEFAULT_PROFILE,
            ...savedProfile
        };

        profile.email = loggedInEmail || profile.email || "";

        if (!savedProfile.name || savedProfile.name === "Trainer") {
            profile.name = getNameFromEmail(profile.email);
        }

        return normalizeProfile(profile);
    }

    let currentProfile = loadSavedProfile();

    /* ==========================================
       UPDATE PROFILE DISPLAY
    ========================================== */

    function updateProfileDisplay(profile) {
        const safeProfile = normalizeProfile(profile);

        setText("stacklyProfileName", safeProfile.name);
        setText("stacklyProfileFullName", safeProfile.name);
        setText("stacklyProfileEmail", safeProfile.email);
        setText("stacklyProfilePhone", safeProfile.phone);
        setText("stacklyProfileLocation", safeProfile.location);
        setText("stacklyProfileTitle", safeProfile.title);
        setText("stacklyProfileExperience", safeProfile.experience);
        setText("stacklyProfileBio", safeProfile.bio);

        // Dashboard header.
        setText("stacklyCoachTopName", safeProfile.name);
        setText("stacklyCoachTopEmail", safeProfile.email);

        // Optional profile elements.
        document.querySelectorAll("[data-trainer-name]").forEach(function (element) {
            element.textContent = safeProfile.name;
        });

        document.querySelectorAll("[data-trainer-email]").forEach(function (element) {
            element.textContent = safeProfile.email;
        });

        document.querySelectorAll("[data-trainer-phone]").forEach(function (element) {
            element.textContent = safeProfile.phone;
        });

        document.querySelectorAll("[data-trainer-location]").forEach(function (element) {
            element.textContent = safeProfile.location;
        });

        document.querySelectorAll("[data-trainer-title]").forEach(function (element) {
            element.textContent = safeProfile.title;
        });
    }

    /* ==========================================
       POPULATE EDIT FORM
    ========================================== */

    function populateProfileForm(profile) {
        setInputValue("stacklyProfileInputName", profile.name);
        setInputValue("stacklyProfileInputEmail", profile.email);
        setInputValue("stacklyProfileInputPhone", profile.phone);
        setInputValue("stacklyProfileInputLocation", profile.location);
        setInputValue("stacklyProfileInputTitle", profile.title);
        setInputValue("stacklyProfileInputExperience", profile.experience);
        setInputValue("stacklyProfileInputBio", profile.bio);
    }

    /* ==========================================
       FORM STATUS MESSAGES
       Auto-dismiss after 4 seconds
    ========================================== */

    function showFormMessage(message, type) {
        const messageElement = getElement("stacklyProfileFormMessage");

        if (!messageElement) {
            console.warn(
                'Missing HTML element: id="stacklyProfileFormMessage".'
            );
            return;
        }

        // Cancel the previous message timer.
        if (messageTimer !== null) {
            window.clearTimeout(messageTimer);
            messageTimer = null;
        }

        messageElement.classList.remove(
            "success",
            "error",
            "reset",
            "stackly-profile-message-success",
            "stackly-profile-message-error",
            "stackly-profile-message-reset",
            "stackly-profile-message-visible"
        );

        // Empty message: hide immediately.
        if (!message) {
            messageElement.textContent = "";
            messageElement.hidden = true;
            return;
        }

        messageElement.textContent = message;
        messageElement.hidden = false;

        if (type === "success") {
            messageElement.classList.add(
                "success",
                "stackly-profile-message-success"
            );
        } else if (type === "error") {
            messageElement.classList.add(
                "error",
                "stackly-profile-message-error"
            );
        } else if (type === "reset") {
            messageElement.classList.add(
                "reset",
                "stackly-profile-message-reset"
            );
        }

        messageElement.setAttribute("role", "status");
        messageElement.setAttribute("aria-live", "polite");

        // Allow CSS transitions to run if configured.
        messageElement.classList.add("stackly-profile-message-visible");

        // Automatically hide the message after 4 seconds.
        messageTimer = window.setTimeout(function () {
            messageElement.classList.remove(
                "stackly-profile-message-visible"
            );

            messageElement.hidden = true;
            messageElement.textContent = "";
            messageTimer = null;
        }, MESSAGE_DURATION);
    }

    /* ==========================================
       SAVE PROFILE
    ========================================== */

    const profileForm = getElement("stacklyProfileForm");

    if (profileForm) {
        profileForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = getInputValue("stacklyProfileInputName");
            const email = getInputValue(
                "stacklyProfileInputEmail",
                currentProfile.email
            );

            const phone = getInputValue("stacklyProfileInputPhone");
            const location = getInputValue("stacklyProfileInputLocation");
            const title = getInputValue("stacklyProfileInputTitle");
            const experience = getInputValue("stacklyProfileInputExperience");
            const bio = getInputValue("stacklyProfileInputBio");

            if (!name) {
                showFormMessage("Please enter your full name.", "error");
                getElement("stacklyProfileInputName")?.focus();
                return;
            }

            if (!email) {
                showFormMessage("Please enter your email address.", "error");
                getElement("stacklyProfileInputEmail")?.focus();
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                showFormMessage("Please enter a valid email address.", "error");
                getElement("stacklyProfileInputEmail")?.focus();
                return;
            }

            const updatedProfile = normalizeProfile({
                name: name,
                email: email,
                phone: phone,
                location: location,
                title: title,
                experience: experience,
                bio: bio
            });

            const saved = setStoredValue(
                PROFILE_STORAGE_KEY,
                JSON.stringify(updatedProfile)
            );

            if (!saved) {
                showFormMessage(
                    "Unable to save your changes. Please check your browser storage settings.",
                    "error"
                );
                return;
            }

            currentProfile = updatedProfile;

            updateProfileDisplay(currentProfile);
            populateProfileForm(currentProfile);

            showFormMessage(
                "Profile updated successfully! Your changes have been saved.",
                "success"
            );
        });
    }

    /* ==========================================
       RESET BUTTON
       Restore saved profile and show message
    ========================================== */

    function resetProfileForm(event) {
        if (event) {
            event.preventDefault();
        }

        currentProfile = loadSavedProfile();

        populateProfileForm(currentProfile);
        updateProfileDisplay(currentProfile);

        showFormMessage(
            "Form reset successfully! Your saved profile details have been restored.",
            "reset"
        );
    }

    const resetButton = getElement("stacklyProfileReset");

    if (resetButton) {
        resetButton.addEventListener("click", resetProfileForm);
    }

    if (profileForm) {
        profileForm.addEventListener("reset", function (event) {
            event.preventDefault();
            resetProfileForm(event);
        });
    }

    /* ==========================================
       EDIT PROFILE BUTTON
       Scroll to the form
    ========================================== */

    const editProfileButton = getElement("stacklyProfileEditButton");
    const editProfileSection = getElement("stacklyProfileForm");

    if (editProfileButton && editProfileSection) {
        editProfileButton.addEventListener("click", function (event) {
            event.preventDefault();

            editProfileSection.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });

            const firstInput = getElement("stacklyProfileInputName");

            if (firstInput) {
                window.setTimeout(function () {
                    firstInput.focus({ preventScroll: true });
                }, 350);
            }
        });
    }

    /* ==========================================
       MOBILE SIDEBAR MENU
    ========================================== */

    const body = document.querySelector(".stackly-coach-body");
    const sidebar = getElement("stacklyCoachSidebar");
    const overlay = getElement("stacklyCoachOverlay");
    const hamburger = getElement("stacklyCoachHamburger");
    const exitButton = getElement("stacklyCoachMobileExit");

    function closeMenu() {
        if (!body) return;

        body.classList.remove("stackly-coach-menu-active");

        if (hamburger) {
            hamburger.setAttribute("aria-expanded", "false");
        }
    }

    function openMenu() {
        if (!body) return;

        body.classList.add("stackly-coach-menu-active");

        if (hamburger) {
            hamburger.setAttribute("aria-expanded", "true");
        }
    }

    if (body && sidebar && overlay && hamburger && exitButton) {
        hamburger.addEventListener("click", openMenu);
        exitButton.addEventListener("click", closeMenu);
        overlay.addEventListener("click", closeMenu);

        sidebar.querySelectorAll(".stackly-coach-nav-link").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
            }
        });
    }

    /* ==========================================
       ACTIVE SIDEBAR LINK
    ========================================== */

    const navLinks = document.querySelectorAll(
        ".stackly-coach-navigation .stackly-coach-nav-link"
    );

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    navLinks.forEach(function (link) {
        const href = link.getAttribute("href");

        if (!href) return;

        const linkPage = href.split("/").pop().toLowerCase();
        const isActive = linkPage === currentPage;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    /* ==========================================
       AOS ANIMATIONS
    ========================================== */

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 850,
            once: true,
            offset: 70,
            easing: "ease-out-cubic",
            disable: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        });
    }

    /* ==========================================
       INITIALIZE PROFILE PAGE
    ========================================== */

    updateProfileDisplay(currentProfile);
    populateProfileForm(currentProfile);

    console.info("Stackly Trainer Profile initialized successfully.");
});



document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("stacklyCoachLogout");

    if (!logoutButton) return;

    logoutButton.addEventListener("click", function () {
        const confirmLogout = confirm("Are you sure you want to log out?");

        if (!confirmLogout) return;

        // Clear trainer login session
        localStorage.removeItem("loginEmail");
        localStorage.removeItem("loginRole");
        localStorage.removeItem("stacklySportLoggedIn");
        localStorage.removeItem("stacklySportRemember");
        localStorage.removeItem("trainerEmail");
        localStorage.removeItem("stacklySportLoginEmail");
        localStorage.removeItem("stacklySportEmail");

        // Redirect to the home page
        window.location.href = "index.html";
    });
});
 
