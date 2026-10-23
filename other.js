
/* =========================================================
   STACKLY SPORTS CLUB - OTHERS DASHBOARD
   Profile | Mobile Navigation | Logout | AOS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const body = document.querySelector(".stackly-others-body");

    const sidebar = document.getElementById("stacklyOthersSidebar");
    const overlay = document.getElementById("stacklyOthersOverlay");
    const hamburger = document.getElementById("stacklyOthersHamburger");
    const mobileExit = document.getElementById("stacklyOthersMobileExit");
    const logoutButton = document.getElementById("stacklyOthersLogout");

    const topName = document.getElementById("stacklyOthersTopName");
    const topEmail = document.getElementById("stacklyOthersTopEmail");
    const footerYear = document.getElementById("stacklyOthersYear");

    /* =====================================================
       TRAINER PROFILE AND EMAIL
    ===================================================== */

    function getStoredValue(keys) {
        for (const key of keys) {
            const value = localStorage.getItem(key);

            if (value && value.trim()) {
                return value.trim();
            }
        }

        return "";
    }

    function getTrainerProfile() {
        const possibleProfileKeys = [
            "stacklyTrainerProfile"
        ];

        for (const key of possibleProfileKeys) {
            try {
                const savedProfile = localStorage.getItem(key);

                if (savedProfile) {
                    const profile = JSON.parse(savedProfile);

                    if (profile && typeof profile === "object") {
                        return profile;
                    }
                }
            } catch (error) {
                console.warn("Unable to read saved trainer profile.");
            }
        }

        return {};
    }

    function displayTrainerInformation() {
        const profile = getTrainerProfile();

        const storedEmail = getStoredValue([
            "loginEmail",
            "trainerEmail",
            "stacklySportLoginEmail",
            "memberEmail",
            "stacklySportEmail"
        ]);

        const email =
            profile.email ||
            profile.Email ||
            storedEmail ||
            "trainer@stacklysports.com";

        const name =
            profile.fullName ||
            profile.name ||
            profile.fullname ||
            profile.full_name ||
            profile.Name ||
            getStoredValue([
                "trainerName",
                "loginName",
                "stacklyTrainerName"
            ]) ||
            "Trainer";

        if (topName) {
            topName.textContent = name;
            topName.title = name;
        }

        if (topEmail) {
            topEmail.textContent = email;
            topEmail.title = email;
            topEmail.setAttribute("aria-label", "Trainer email: " + email);
        }
    }

    displayTrainerInformation();

    /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

    function openSidebar() {
        if (!body || !sidebar) return;

        body.classList.add("stackly-others-menu-active");

        if (hamburger) {
            hamburger.setAttribute("aria-expanded", "true");
            hamburger.setAttribute("aria-label", "Close navigation menu");
        }

        if (sidebar) {
            sidebar.setAttribute("aria-hidden", "false");
        }

        if (mobileExit) {
            mobileExit.focus();
        }
    }

    function closeSidebar(returnFocus = false) {
        if (!body) return;

        body.classList.remove("stackly-others-menu-active");

        if (hamburger) {
            hamburger.setAttribute("aria-expanded", "false");
            hamburger.setAttribute("aria-label", "Open navigation menu");
        }

        if (sidebar) {
            sidebar.setAttribute("aria-hidden", "true");
        }

        if (returnFocus && hamburger) {
            hamburger.focus();
        }
    }

    if (hamburger) {
        hamburger.addEventListener("click", function () {
            const isOpen =
                body &&
                body.classList.contains("stackly-others-menu-active");

            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (mobileExit) {
        mobileExit.addEventListener("click", function () {
            closeSidebar(true);
        });
    }

    if (overlay) {
        overlay.addEventListener("click", function () {
            closeSidebar(true);
        });
    }

    /* Close with Escape key */
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeSidebar(true);
        }
    });

    /* Close mobile navigation after selecting a page */
    document.querySelectorAll(".stackly-others-nav-link").forEach(function (link) {
        link.addEventListener("click", function () {
            closeSidebar();
        });
    });

    /* Close mobile sidebar when returning to desktop width */
    window.addEventListener("resize", function () {
        if (window.innerWidth > 900) {
            closeSidebar();
        }
    });

    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    document.querySelectorAll(".stackly-others-nav-link").forEach(function (link) {
        const linkPage = link.getAttribute("href")
            ?.split("/")
            .pop()
            .toLowerCase();

        if (linkPage && linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });

    /* =====================================================
       LOGOUT
    ===================================================== */

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            const confirmed = window.confirm(
                "Are you sure you want to log out?"
            );

            if (!confirmed) return;

            /*
             * Remove login/session values only.
             * The trainer profile itself is preserved.
             */
            const sessionKeys = [
                "loginEmail",
                "loginRole",
                "stacklySportLoggedIn",
                "stacklySportRemember",
                "trainerEmail",
                "stacklySportLoginEmail",
                "stacklySportEmail",
                "trainerName",
                "loginName",
                "stacklyTrainerName"
            ];

            sessionKeys.forEach(function (key) {
                localStorage.removeItem(key);
            });

            /*
             * Redirect to the homepage.
             * Change this filename if your homepage
             * uses a different HTML file.
             */
            window.location.href = "index.html";
        });
    }

    /* =====================================================
       FOOTER YEAR
    ===================================================== */

    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    /* =====================================================
       AOS ANIMATIONS
    ===================================================== */

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 900,
            once: true,
            offset: 70,
            easing: "ease-out-cubic",
            delay: 0,
            anchorPlacement: "top-bottom",
            disable: function () {
                return window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;
            }
        });

        /* Refresh positions after page layout settles */
        window.addEventListener("load", function () {
            AOS.refresh();
        });
    }

});



document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("stacklyAthletesSearch");
    const filterSelect = document.getElementById("stacklyAthletesFilter");
    const athleteCards = document.querySelectorAll(".stackly-athlete-card");
    const noResults = document.getElementById("stacklyAthletesNoResults");

    if (!searchInput || !filterSelect || !noResults) return;

    function filterAthletes() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const selectedStatus = filterSelect.value;
        let visibleCount = 0;

        athleteCards.forEach(function (card) {
            const searchableText = card.textContent.toLowerCase();
            const athleteStatus = card.dataset.status;

            const matchesSearch = searchableText.includes(searchTerm);
            const matchesStatus =
                selectedStatus === "all" || athleteStatus === selectedStatus;

            const isVisible = matchesSearch && matchesStatus;

            card.hidden = !isVisible;

            if (isVisible) visibleCount++;
        });

        noResults.hidden = visibleCount !== 0;

        if (window.AOS) {
            AOS.refresh();
        }
    }

    searchInput.addEventListener("input", filterAthletes);
    filterSelect.addEventListener("change", filterAthletes);
});


/* =========================================================
   STACKLY SPORTS CLUB - ATHLETE DIRECTORY
   Professional Search, Filter & Interactive Features
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* ==========================================
       ELEMENT REFERENCES
    ========================================== */

    const searchInput = document.getElementById("stacklyAthletesSearch");
    const statusFilter = document.getElementById("stacklyAthletesFilter");
    const athleteGrid = document.getElementById("stacklyAthletesGrid");
    const noResults = document.getElementById("stacklyAthletesNoResults");

    if (!searchInput || !statusFilter || !athleteGrid || !noResults) {
        return;
    }

    const athleteCards = Array.from(
        athleteGrid.querySelectorAll(".stackly-athlete-card")
    );

    /* ==========================================
       SEARCH & FILTER ATHLETES
    ========================================== */

    function filterAthletes() {
        const searchTerm = searchInput.value
            .trim()
            .toLowerCase();

        const selectedStatus = statusFilter.value;
        let visibleCount = 0;

        athleteCards.forEach(function (card) {
            const athleteName =
                card.querySelector("h3")?.textContent.toLowerCase() || "";

            const athleteProgram =
                card.querySelector(".stackly-athlete-category")
                    ?.textContent.toLowerCase() || "";

            const athleteStatus =
                card.dataset.status || "";

            const matchesSearch =
                athleteName.includes(searchTerm) ||
                athleteProgram.includes(searchTerm);

            const matchesStatus =
                selectedStatus === "all" ||
                athleteStatus === selectedStatus;

            const shouldShow = matchesSearch && matchesStatus;

            card.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount++;
            }
        });

        /* Show or hide the empty state */
        noResults.hidden = visibleCount !== 0;

        /* Refresh AOS positions when available */
        if (window.AOS && typeof window.AOS.refresh === "function") {
            window.AOS.refresh();
        }
    }

    searchInput.addEventListener("input", filterAthletes);
    statusFilter.addEventListener("change", filterAthletes);

    /* ==========================================
       ANIMATE TRAINING PROGRESS BARS
    ========================================== */

    function animateProgressBars() {
        athleteCards.forEach(function (card) {
            const progressBar = card.querySelector(
                ".stackly-athlete-progress-track span"
            );

            if (!progressBar) return;

            const targetWidth = progressBar.style.width || "0%";

            progressBar.dataset.progress = targetWidth;
            progressBar.style.width = "0%";

            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    progressBar.style.width = targetWidth;
                });
            });
        });
    }

    /* ==========================================
       ATHLETE CARD HOVER INTERACTIONS
    ========================================== */

    athleteCards.forEach(function (card) {
        card.addEventListener("mouseenter", function () {
            card.classList.add("stackly-athlete-card-hover");
        });

        card.addEventListener("mouseleave", function () {
            card.classList.remove("stackly-athlete-card-hover");
        });
    });

    /* ==========================================
       ATHLETE OPTIONS BUTTONS
    ========================================== */

    athleteGrid.addEventListener("click", function (event) {
        const optionsButton = event.target.closest(
            ".stackly-athlete-more"
        );

        if (!optionsButton || !athleteGrid.contains(optionsButton)) {
            return;
        }

        const card = optionsButton.closest(".stackly-athlete-card");
        const athleteName =
            card?.querySelector("h3")?.textContent.trim() || "Athlete";

        /*
         * Replace this message with a custom dropdown menu
         * or modal when your athlete actions are ready.
         */
        const existingMenu = card.querySelector(
            ".stackly-athlete-options-notice"
        );

        if (existingMenu) {
            existingMenu.remove();
            optionsButton.setAttribute("aria-expanded", "false");
            return;
        }

        /* Close any other open notices */
        athleteGrid.querySelectorAll(
            ".stackly-athlete-options-notice"
        ).forEach(function (notice) {
            notice.remove();
        });

        athleteGrid.querySelectorAll(".stackly-athlete-more")
            .forEach(function (button) {
                button.setAttribute("aria-expanded", "false");
            });

        const notice = document.createElement("div");
        notice.className = "stackly-athlete-options-notice";
        notice.setAttribute("role", "status");
        notice.textContent = athleteName + " — athlete options";

        card.appendChild(notice);
        optionsButton.setAttribute("aria-expanded", "true");
    });

    /* ==========================================
       KEYBOARD ACCESSIBILITY
    ========================================== */

    athleteGrid.querySelectorAll(".stackly-athlete-more")
        .forEach(function (button) {
            button.setAttribute("aria-haspopup", "true");
            button.setAttribute("aria-expanded", "false");
        });

    /* ==========================================
       INITIALIZE DIRECTORY
    ========================================== */

    animateProgressBars();
    filterAthletes();
});


/* =========================================================
   STACKLY SPORTS CLUB - TRAINER NAME & EMAIL
   Dynamic Profile Details Across Dashboard Pages
========================================================= */

(function () {
    "use strict";

    function getStoredValue(keys) {
        for (const key of keys) {
            const value = localStorage.getItem(key);

            if (value && value.trim()) {
                return value.trim();
            }
        }

        return "";
    }

    function getTrainerProfile() {
        try {
            const savedProfile = localStorage.getItem("stacklyTrainerProfile");

            if (savedProfile) {
                const profile = JSON.parse(savedProfile);

                if (profile && typeof profile === "object") {
                    return profile;
                }
            }
        } catch (error) {
            console.warn("Unable to read trainer profile.");
        }

        return {};
    }

    function getProfessionalName(email) {
        const username = email.split("@")[0] || "";

        return username
            .replace(/[._-]+/g, " ")
            .replace(/\d+/g, " ")
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map(function (word) {
                return word.charAt(0).toUpperCase() +
                    word.slice(1).toLowerCase();
            })
            .join(" ");
    }

    function updateTrainerInformation() {
        const profile = getTrainerProfile();

        const email =
            profile.email ||
            profile.Email ||
            getStoredValue([
                "loginEmail",
                "trainerEmail",
                "stacklySportLoginEmail",
                "memberEmail",
                "stacklySportEmail"
            ]);

        const savedName =
            profile.fullName ||
            profile.name ||
            profile.fullname ||
            profile.full_name ||
            profile.Name ||
            getStoredValue([
                "trainerName",
                "loginName",
                "stacklyTrainerName"
            ]);

        const name = savedName.trim() ||
            getProfessionalName(email) ||
            "Trainer";

        // Update dashboard header
        document.querySelectorAll(
            "#stacklyOthersTopName, [data-user-name]"
        ).forEach(function (element) {
            element.textContent = name;
            element.title = name;
        });

        document.querySelectorAll(
            "#stacklyOthersTopEmail, [data-user-email]"
        ).forEach(function (element) {
            const icon = element.querySelector("i");

            if (icon) {
                element.textContent = "";
                element.appendChild(icon);
                element.appendChild(
                    document.createTextNode(" " + (email || "Email not available"))
                );
            } else {
                element.textContent = email || "Email not available";
            }

            element.title = email || "Email not available";
        });

        // Update profile hero name
        document.querySelectorAll(
            ".stackly-profile-hero-card h3"
        ).forEach(function (element) {
            element.textContent = name;
        });

        // Update profile hero email while preserving its icon
        document.querySelectorAll(
            ".stackly-profile-hero-meta span"
        ).forEach(function (element) {
            const icon = element.querySelector(".fa-envelope");

            if (icon) {
                element.textContent = "";
                element.appendChild(icon);
                element.appendChild(
                    document.createTextNode(" " + (email || "Email not available"))
                );
            }
        });

        // Update the profile information cards
        document.querySelectorAll(
            ".stackly-profile-info-card"
        ).forEach(function (card) {
            const label = card.querySelector("small");
            const value = card.querySelector("h3");

            if (!label || !value) return;

            const labelText = label.textContent.trim().toLowerCase();

            if (labelText === "full name") {
                value.textContent = name;
            }

            if (labelText === "email address") {
                value.textContent = email || "Email not available";
            }
        });
    }

    // Works whether this script runs before or after DOMContentLoaded
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            updateTrainerInformation
        );
    } else {
        updateTrainerInformation();
    }

    // Allow dynamically loaded dashboard sections to refresh their details
    window.updateTrainerInformation = updateTrainerInformation;

})();