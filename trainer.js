
/* =========================================================
   STACKLY SPORTS CLUB - COACH DASHBOARD
   Consolidated JavaScript
   Profile | Navigation | Logout | Athletes | Dropdowns | AOS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =====================================================
       1. SHARED HELPERS
    ===================================================== */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function byId(id) {
        return document.getElementById(id);
    }

    function readStorage(key) {
        try {
            return localStorage.getItem(key) || "";
        } catch (error) {
            return "";
        }
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.error("Stackly: Unable to save data.", error);
            return false;
        }
    }

    function getFirstStoredValue(keys) {
        for (const key of keys) {
            const value = readStorage(key).trim();
            if (value) return value;
        }

        return "";
    }

    function getProfile() {
        try {
            const raw = readStorage("stacklyTrainerProfile");
            const parsed = raw ? JSON.parse(raw) : {};

            return parsed && typeof parsed === "object" ? parsed : {};
        } catch (error) {
            console.warn("Stackly: Saved trainer profile could not be read.");
            return {};
        }
    }

    function nameFromEmail(email) {
        if (!email) return "";

        return email.split("@")[0]
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

    function setText(id, value) {
        const element = byId(id);

        if (element) {
            element.textContent = value == null ? "" : String(value);
        }
    }

    function refreshAOS() {
        if (window.AOS && typeof window.AOS.refreshHard === "function") {
            window.AOS.refreshHard();
        } else if (window.AOS && typeof window.AOS.refresh === "function") {
            window.AOS.refresh();
        }
    }

    /* =====================================================
       2. TRAINER PROFILE AND EMAIL
    ===================================================== */

    function getTrainerDetails() {
        const profile = getProfile();

        const email = String(
            profile.email ||
            profile.Email ||
            getFirstStoredValue([
                "loginEmail",
                "trainerEmail",
                "stacklySportLoginEmail",
                "memberEmail",
                "stacklySportEmail"
            ])
        ).trim();

        const savedName = String(
            profile.fullName ||
            profile.name ||
            profile.fullname ||
            profile.full_name ||
            profile.Name ||
            getFirstStoredValue([
                "trainerName",
                "loginName",
                "stacklyTrainerName"
            ])
        ).trim();

        return {
            name: savedName || nameFromEmail(email) || "Trainer",
            email: email
        };
    }

    function updateTrainerInformation() {
        const details = getTrainerDetails();
        const name = details.name;
        const email = details.email || "Email not available";

        setText("stacklyCoachTopName", name);

        const emailElement = byId("stacklyCoachTopEmail");

        if (emailElement) {
            const icon = emailElement.querySelector("i");

            if (icon) {
                emailElement.textContent = "";
                emailElement.appendChild(icon);
                emailElement.appendChild(
                    document.createTextNode(" " + email)
                );
            } else {
                emailElement.textContent = email;
            }

            emailElement.title = email;
            emailElement.setAttribute("aria-label", "Trainer email: " + email);
        }

        document.querySelectorAll("[data-trainer-name], [data-user-name]")
            .forEach(function (element) {
                element.textContent = name;
                element.title = name;
            });

        document.querySelectorAll("[data-trainer-email], [data-user-email]")
            .forEach(function (element) {
                element.textContent = email;
                element.title = email;
            });

        document.querySelectorAll(".stackly-profile-hero-card h3")
            .forEach(function (element) {
                element.textContent = name;
            });

        document.querySelectorAll(".stackly-profile-hero-meta span")
            .forEach(function (element) {
                if (!element.querySelector(".fa-envelope")) return;

                const icon = element.querySelector(".fa-envelope");
                element.textContent = "";
                element.appendChild(icon);
                element.appendChild(document.createTextNode(" " + email));
            });

        document.querySelectorAll(".stackly-profile-info-card")
            .forEach(function (card) {
                const label = card.querySelector("small");
                const value = card.querySelector("h3");

                if (!label || !value) return;

                const text = label.textContent.trim().toLowerCase();

                if (text === "full name") value.textContent = name;
                if (text === "email address") value.textContent = email;
            });
    }

    updateTrainerInformation();

    window.updateTrainerInformation = updateTrainerInformation;

    /* =====================================================
       3. MOBILE SIDEBAR
    ===================================================== */

    const body = document.querySelector(".stackly-coach-body");
    const sidebar = byId("stacklyCoachSidebar");
    const overlay = byId("stacklyCoachOverlay");
    const hamburger = byId("stacklyCoachHamburger");
    const mobileExit = byId("stacklyCoachMobileExit");

    function openSidebar() {
        if (!body || !sidebar) return;

        body.classList.add("stackly-coach-menu-active");
        hamburger?.setAttribute("aria-expanded", "true");
        hamburger?.setAttribute("aria-label", "Close navigation menu");
        sidebar.setAttribute("aria-hidden", "false");

        if (overlay) {
            overlay.setAttribute("aria-hidden", "false");
        }

        mobileExit?.focus();
    }

    function closeSidebar(returnFocus) {
        body?.classList.remove("stackly-coach-menu-active");

        hamburger?.setAttribute("aria-expanded", "false");
        hamburger?.setAttribute("aria-label", "Open navigation menu");
        sidebar?.setAttribute("aria-hidden", "true");
        overlay?.setAttribute("aria-hidden", "true");

        if (returnFocus && hamburger) {
            hamburger.focus();
        }
    }

    if (hamburger) {
        hamburger.addEventListener("click", function () {
            if (
                body?.classList.contains("stackly-coach-menu-active")
            ) {
                closeSidebar(false);
            } else {
                openSidebar();
            }
        });
    }

    mobileExit?.addEventListener("click", function () {
        closeSidebar(true);
    });

    overlay?.addEventListener("click", function () {
        closeSidebar(true);
    });

    document.querySelectorAll(".stackly-coach-nav-link")
        .forEach(function (link) {
            link.addEventListener("click", function () {
                closeSidebar(false);
            });
        });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 900) {
            closeSidebar(false);
        }
    });

    /* =====================================================
       4. ACTIVE NAVIGATION
    ===================================================== */

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    document.querySelectorAll(
        ".stackly-coach-navigation .stackly-coach-nav-link"
    ).forEach(function (link) {
        const href = link.getAttribute("href");
        if (!href) return;

        const linkPage = href.split("/").pop().toLowerCase();
        const active = linkPage === currentPage;

        link.classList.toggle("active", active);

        if (active) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    /* =====================================================
       5. LOGOUT
    ===================================================== */

    const logoutButton = byId("stacklyCoachLogout");

    logoutButton?.addEventListener("click", function () {
        if (!window.confirm("Are you sure you want to log out?")) {
            return;
        }

        [
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
        ].forEach(function (key) {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.warn("Stackly: Unable to clear a session value.");
            }
        });

        /* Keep stacklyTrainerProfile intact. */
        window.location.href = "index.html";
    });

    /* =====================================================
       6. FOOTER YEAR
    ===================================================== */

    setText("stacklyCoachYear", new Date().getFullYear());

    /* =====================================================
       7. REUSABLE CUSTOM DROPDOWN
       Supports hidden input + option buttons.
    ===================================================== */

    function setupCustomDropdown(config) {
        const wrap = document.querySelector(config.wrap);
        if (!wrap) return null;

        const button = wrap.querySelector(config.button);
        const menu = wrap.querySelector(config.menu);
        const label = wrap.querySelector(config.label);
        const input = wrap.querySelector(config.input);
        const options = Array.from(wrap.querySelectorAll(config.option));

        if (!button || !menu || !label || !input || !options.length) {
            console.warn(
                "Stackly dropdown: Missing elements for " + config.wrap
            );
            return null;
        }

        function close(focusButton) {
            menu.hidden = true;
            button.setAttribute("aria-expanded", "false");
            wrap.classList.remove("is-open");

            if (focusButton) button.focus();
        }

        function open() {
            menu.hidden = false;
            button.setAttribute("aria-expanded", "true");
            wrap.classList.add("is-open");
        }

        function selectOption(option) {
            const value = option.dataset.value;
            const text = option.querySelector("span")?.textContent.trim();

            if (value == null || !text) return;

            input.value = value;
            label.textContent = text;

            options.forEach(function (item) {
                const selected = item === option;

                item.classList.toggle("active", selected);
                item.setAttribute("aria-selected", String(selected));
            });

            close(false);

            input.dispatchEvent(
                new Event("change", { bubbles: true })
            );
        }

        button.addEventListener("click", function () {
            if (menu.hidden) {
                open();
            } else {
                close(false);
            }
        });

        options.forEach(function (option, index) {
            option.addEventListener("click", function () {
                selectOption(option);
            });

            option.addEventListener("keydown", function (event) {
                let nextIndex = index;

                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    nextIndex = (index + 1) % options.length;
                    options[nextIndex].focus();
                }

                if (event.key === "ArrowUp") {
                    event.preventDefault();
                    nextIndex = (index - 1 + options.length) % options.length;
                    options[nextIndex].focus();
                }

                if (event.key === "Home") {
                    event.preventDefault();
                    options[0].focus();
                }

                if (event.key === "End") {
                    event.preventDefault();
                    options[options.length - 1].focus();
                }
            });
        });

        button.addEventListener("keydown", function (event) {
            if (
                event.key === "ArrowDown" ||
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();
                open();
                options[0].focus();
            }
        });

        document.addEventListener("click", function (event) {
            if (!wrap.contains(event.target)) {
                close(false);
            }
        });

        /* Sync the display with the initial input value. */
        const initialOption = options.find(function (option) {
            return option.dataset.value === input.value;
        });

        if (initialOption) {
            selectInitialOption(initialOption);
        }

        function selectInitialOption(option) {
            const text = option.querySelector("span")?.textContent.trim();

            if (text) label.textContent = text;

            options.forEach(function (item) {
                const selected = item === option;

                item.classList.toggle("active", selected);
                item.setAttribute("aria-selected", String(selected));
            });
        }

        return {
            close: close,
            open: open,
            input: input
        };
    }

    /* =====================================================
       8. COACH ATHLETE STATUS DROPDOWN
       Required wrap:
       .stackly-coach-athlete-filter-wrap
    ===================================================== */

    const coachAthleteDropdown = setupCustomDropdown({
        wrap: ".stackly-coach-athlete-filter-wrap",
        button: "#stacklyCoachAthleteFilterBtn",
        menu: "#stacklyCoachAthleteFilterDropdown",
        label: "#stacklyCoachAthleteFilterText",
        input: "#stacklyCoachAthleteFilter",
        option: ".stackly-coach-athlete-filter-option"
    });

    /* =====================================================
       9. PROFILE EXPERIENCE DROPDOWN
    ===================================================== */

    const experienceDropdown = setupCustomDropdown({
        wrap: ".stackly-profile-experience-wrap",
        button: "#stacklyProfileExperienceBtn",
        menu: "#stacklyProfileExperienceDropdown",
        label: "#stacklyProfileExperienceText",
        input: "#stacklyProfileInputExperience",
        option: ".stackly-profile-experience-option"
    });

    /* =====================================================
       10. ATHLETE DIRECTORY ELEMENTS
    ===================================================== */

    const directory = byId("stacklyCoachAthleteDirectory");
    const searchInput = byId("stacklyCoachAthleteSearch");
    const statusFilter = byId("stacklyCoachAthleteFilter");
    const athleteGrid = byId("stacklyCoachAthleteGrid");
    const noResults = byId("stacklyCoachAthleteNoResults");

    const athleteCards = athleteGrid
        ? Array.from(
            athleteGrid.querySelectorAll(".stackly-coach-athlete-card")
        )
        : [];

    /* =====================================================
       11. ATHLETE SEARCH AND FILTER
    ===================================================== */

    let searchTimer = null;

    function filterAthletes() {
        if (!directory || !athleteGrid || !noResults) return;

        const searchTerm = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        const selectedStatus = statusFilter
            ? statusFilter.value
            : "all";

        let visibleCount = 0;

        athleteCards.forEach(function (card) {
            const athleteName = (
                card.dataset.athleteName ||
                card.querySelector("h3")?.textContent ||
                ""
            ).toLowerCase();

            const athleteSpecialty = (
                card.dataset.athleteSpecialty ||
                card.querySelector(".stackly-coach-athlete-specialty")
                    ?.textContent ||
                ""
            ).toLowerCase();

            const cardText = card.textContent.toLowerCase();

            const athleteStatus = (
                card.dataset.athleteStatus ||
                card.dataset.status ||
                ""
            ).toLowerCase();

            const matchesSearch = !searchTerm ||
                athleteName.includes(searchTerm) ||
                athleteSpecialty.includes(searchTerm) ||
                cardText.includes(searchTerm);

            const matchesStatus = selectedStatus === "all" ||
                athleteStatus === selectedStatus;

            const visible = matchesSearch && matchesStatus;

            card.hidden = !visible;

            if (visible) {
                visibleCount++;

                if (!reducedMotion) {
                    card.classList.remove("stackly-athlete-filter-enter");
                    void card.offsetWidth;
                    card.classList.add("stackly-athlete-filter-enter");
                }
            }
        });

        noResults.hidden = visibleCount > 0;

        const countElement = directory.querySelector(
            ".stackly-coach-athlete-directory-count span"
        );

        if (countElement) {
            countElement.textContent =
                visibleCount + (visibleCount === 1 ? " Athlete" : " Athletes");
        }

        athleteGrid.setAttribute(
            "aria-label",
            visibleCount + " athletes displayed"
        );

        refreshAOS();
    }

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            window.clearTimeout(searchTimer);

            searchTimer = window.setTimeout(function () {
                filterAthletes();
            }, 120);
        });

        searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                searchInput.value = "";

                if (statusFilter) {
                    statusFilter.value = "all";

                    /* Reset the custom dropdown's visible label too. */
                    if (coachAthleteDropdown) {
                        const allOption = document.querySelector(
                            ".stackly-coach-athlete-filter-wrap " +
                            '.stackly-coach-athlete-filter-option[data-value="all"]'
                        );

                        if (allOption) {
                            allOption.click();
                        }
                    }
                }

                filterAthletes();
                searchInput.blur();
            }
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", filterAthletes);
    }

    /* =====================================================
       12. ATHLETE PROGRESS BARS
    ===================================================== */

    athleteCards.forEach(function (card) {
        const track = card.querySelector(
            ".stackly-coach-athlete-progress-track"
        );

        const bar = track?.querySelector("span");

        if (!track || !bar) return;

        const originalWidth = bar.style.width ||
            bar.getAttribute("data-progress") ||
            "0%";

        const parsed = parseFloat(originalWidth);
        const progress = Number.isFinite(parsed)
            ? Math.max(0, Math.min(100, parsed))
            : 0;

        track.setAttribute("role", "progressbar");
        track.setAttribute("aria-valuemin", "0");
        track.setAttribute("aria-valuemax", "100");
        track.setAttribute("aria-valuenow", String(progress));
        track.setAttribute("aria-label", "Training progress " + progress + "%");

        if (reducedMotion) {
            bar.style.width = progress + "%";
        } else {
            bar.style.width = "0%";

            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    bar.style.width = progress + "%";
                });
            });
        }
    });

    /* =====================================================
       13. ATHLETE CARD INTERACTIONS
    ===================================================== */

    athleteCards.forEach(function (card) {
        card.addEventListener("mouseenter", function () {
            card.classList.add("stackly-athlete-card-hover");
        });

        card.addEventListener("mouseleave", function () {
            card.classList.remove("stackly-athlete-card-hover");
        });

        const profileLink = card.querySelector(
            ".stackly-coach-athlete-card-footer a"
        );

        if (profileLink) {
            profileLink.title =
                "View " +
                (card.dataset.athleteName || "athlete") +
                " progress";
        }
    });

    /* =====================================================
       14. ATHLETE MORE OPTIONS NOTICE
    ===================================================== */

    if (athleteGrid) {
        athleteGrid.querySelectorAll(".stackly-athlete-more")
            .forEach(function (button) {
                button.setAttribute("aria-haspopup", "true");
                button.setAttribute("aria-expanded", "false");
            });

        athleteGrid.addEventListener("click", function (event) {
            const button = event.target.closest(".stackly-athlete-more");

            if (!button || !athleteGrid.contains(button)) return;

            const card = button.closest(".stackly-coach-athlete-card");
            if (!card) return;

            const existing = card.querySelector(
                ".stackly-athlete-options-notice"
            );

            if (existing) {
                existing.remove();
                button.setAttribute("aria-expanded", "false");
                return;
            }

            athleteGrid.querySelectorAll(
                ".stackly-athlete-options-notice"
            ).forEach(function (notice) {
                notice.remove();
            });

            athleteGrid.querySelectorAll(".stackly-athlete-more")
                .forEach(function (otherButton) {
                    otherButton.setAttribute("aria-expanded", "false");
                });

            const name = (
                card.dataset.athleteName ||
                card.querySelector("h3")?.textContent ||
                "Athlete"
            ).trim();

            const notice = document.createElement("div");
            notice.className = "stackly-athlete-options-notice";
            notice.setAttribute("role", "status");
            notice.textContent = name + " — athlete options";

            card.appendChild(notice);
            button.setAttribute("aria-expanded", "true");
        });
    }

    /* =====================================================
       15. PROFILE FORM
       Save | Reset | Edit | Auto-dismiss messages
    ===================================================== */

    const PROFILE_KEY = "stacklyTrainerProfile";
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

    function loadProfile() {
        const stored = getProfile();
        const loginEmail = getFirstStoredValue([
            "loginEmail",
            "trainerEmail",
            "stacklySportLoginEmail",
            "memberEmail",
            "stacklySportEmail"
        ]);

        const profile = normalizeProfile({
            ...DEFAULT_PROFILE,
            ...stored,
            email: loginEmail || stored.email || ""
        });

        if (!stored.name || stored.name === "Trainer") {
            profile.name = nameFromEmail(profile.email) || "Trainer";
        }

        return profile;
    }

    let currentProfile = loadProfile();

    function readInput(id, fallback) {
        const element = byId(id);
        return element ? element.value.trim() : (fallback || "");
    }

    function fillInput(id, value) {
        const element = byId(id);
        if (element) element.value = value || "";
    }

    function populateProfileForm(profile) {
        fillInput("stacklyProfileInputName", profile.name);
        fillInput("stacklyProfileInputEmail", profile.email);
        fillInput("stacklyProfileInputPhone", profile.phone);
        fillInput("stacklyProfileInputLocation", profile.location);
        fillInput("stacklyProfileInputTitle", profile.title);
        fillInput("stacklyProfileInputExperience", profile.experience);
        fillInput("stacklyProfileInputBio", profile.bio);

        /* Update the custom experience dropdown label. */
        const experienceText = byId("stacklyProfileExperienceText");
        const experienceWrap = document.querySelector(
            ".stackly-profile-experience-wrap"
        );

        if (experienceText && experienceWrap) {
            const option = Array.from(
                experienceWrap.querySelectorAll(
                    ".stackly-profile-experience-option"
                )
            ).find(function (item) {
                return item.dataset.value === profile.experience;
            });

            if (option) {
                experienceText.textContent =
                    option.querySelector("span")?.textContent.trim() ||
                    profile.experience;

                experienceWrap.querySelectorAll(
                    ".stackly-profile-experience-option"
                ).forEach(function (item) {
                    const selected = item === option;
                    item.classList.toggle("active", selected);
                    item.setAttribute("aria-selected", String(selected));
                });
            }
        }
    }

    function updateProfileDisplay(profile) {
        setText("stacklyProfileName", profile.name);
        setText("stacklyProfileFullName", profile.name);
        setText("stacklyProfileEmail", profile.email);
        setText("stacklyProfilePhone", profile.phone);
        setText("stacklyProfileLocation", profile.location);
        setText("stacklyProfileTitle", profile.title);
        setText("stacklyProfileExperience", profile.experience);
        setText("stacklyProfileBio", profile.bio);

        updateTrainerInformation();
    }

    function showProfileMessage(message, type) {
        const element = byId("stacklyProfileFormMessage");
        if (!element) return;

        window.clearTimeout(messageTimer);

        element.classList.remove(
            "success",
            "error",
            "reset",
            "stackly-profile-message-success",
            "stackly-profile-message-error",
            "stackly-profile-message-reset",
            "stackly-profile-message-visible"
        );

        if (!message) {
            element.textContent = "";
            element.hidden = true;
            return;
        }

        element.textContent = message;
        element.hidden = false;
        element.setAttribute("role", "status");
        element.setAttribute("aria-live", "polite");

        if (type === "success") {
            element.classList.add(
                "success",
                "stackly-profile-message-success"
            );
        } else if (type === "error") {
            element.classList.add(
                "error",
                "stackly-profile-message-error"
            );
        } else if (type === "reset") {
            element.classList.add(
                "reset",
                "stackly-profile-message-reset"
            );
        }

        element.classList.add("stackly-profile-message-visible");

        messageTimer = window.setTimeout(function () {
            element.classList.remove("stackly-profile-message-visible");
            element.hidden = true;
            element.textContent = "";
            messageTimer = null;
        }, MESSAGE_DURATION);
    }

    const profileForm = byId("stacklyProfileForm");

    if (profileForm) {
        profileForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = readInput(
                "stacklyProfileInputName",
                currentProfile.name
            );

            const email = readInput(
                "stacklyProfileInputEmail",
                currentProfile.email
            );

            if (!name) {
                showProfileMessage("Please enter your full name.", "error");
                byId("stacklyProfileInputName")?.focus();
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showProfileMessage(
                    "Please enter a valid email address.",
                    "error"
                );
                byId("stacklyProfileInputEmail")?.focus();
                return;
            }

            const updated = normalizeProfile({
                name: name,
                email: email,
                phone: readInput("stacklyProfileInputPhone"),
                location: readInput("stacklyProfileInputLocation"),
                title: readInput("stacklyProfileInputTitle"),
                experience: readInput(
                    "stacklyProfileInputExperience",
                    currentProfile.experience
                ),
                bio: readInput("stacklyProfileInputBio")
            });

            if (!writeStorage(PROFILE_KEY, JSON.stringify(updated))) {
                showProfileMessage(
                    "Unable to save your changes. Check browser storage settings.",
                    "error"
                );
                return;
            }

            currentProfile = updated;
            populateProfileForm(currentProfile);
            updateProfileDisplay(currentProfile);

            showProfileMessage(
                "Profile updated successfully!",
                "success"
            );
        });
    }

    function resetProfileForm(event) {
        event?.preventDefault();

        currentProfile = loadProfile();
        populateProfileForm(currentProfile);
        updateProfileDisplay(currentProfile);

        showProfileMessage(
            "Form reset. Your saved profile details have been restored.",
            "reset"
        );
    }

    byId("stacklyProfileReset")?.addEventListener(
        "click",
        resetProfileForm
    );

    if (profileForm) {
        profileForm.addEventListener("reset", function (event) {
            event.preventDefault();
            resetProfileForm(event);
        });
    }

    const editButton = byId("stacklyProfileEditButton");
    const profileFormSection = byId("stacklyProfileForm");

    if (editButton && profileFormSection) {
        editButton.addEventListener("click", function (event) {
            event.preventDefault();

            profileFormSection.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });

            byId("stacklyProfileInputName")?.focus({
                preventScroll: true
            });
        });
    }

    populateProfileForm(currentProfile);
    updateProfileDisplay(currentProfile);

    /* =====================================================
       16. GLOBAL ESCAPE HANDLING
    ===================================================== */

    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;

        if (body?.classList.contains("stackly-coach-menu-active")) {
            closeSidebar(true);
        }

        coachAthleteDropdown?.close(false);
        experienceDropdown?.close(false);

        document.querySelectorAll(
            ".stackly-athlete-options-notice"
        ).forEach(function (notice) {
            notice.remove();
        });

        document.querySelectorAll(
            ".stackly-athlete-more[aria-expanded='true']"
        ).forEach(function (button) {
            button.setAttribute("aria-expanded", "false");
        });
    });

    /* =====================================================
       17. INITIALIZE ATHLETE DIRECTORY
    ===================================================== */

    if (athleteGrid) {
        athleteGrid.setAttribute("role", "region");
        athleteGrid.setAttribute("aria-label", "Athlete directory");
    }

    filterAthletes();

    /* =====================================================
       18. AOS INITIALIZATION
    ===================================================== */

    if (window.AOS) {
        window.AOS.init({
            duration: 850,
            once: true,
            offset: 70,
            easing: "ease-out-cubic",
            delay: 0,
            disable: reducedMotion
        });

        window.addEventListener("load", refreshAOS);
    }

    console.info("Stackly Coach Dashboard initialized.");
});
