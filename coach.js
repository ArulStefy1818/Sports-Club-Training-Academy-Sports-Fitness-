
/* =========================================================
   STACKLY SPORTS CLUB - COACH DASHBOARD
   Complete JavaScript
   Sidebar + Dropdowns + Filters + Training + Sessions
   Profile + Logout + AOS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =====================================================
       1. COMMON HELPERS
    ===================================================== */

    const $ = (selector, root = document) =>
        root.querySelector(selector);

    const $$ = (selector, root = document) =>
        Array.from(root.querySelectorAll(selector));

    const body = $(".stackly-coach-body");

    const MOBILE_BREAKPOINT = 900;

    function isMobileView() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    function getSavedEmail() {
        try {
            return (
                localStorage.getItem("loginEmail") ||
                localStorage.getItem("stacklySportLoginEmail") ||
                localStorage.getItem("memberEmail") ||
                localStorage.getItem("stacklySportEmail") ||
                ""
            );
        } catch (error) {
            return "";
        }
    }

    function formatName(email) {
        const username = (email || "").split("@")[0];

        return username
            .replace(/[._-]+/g, " ")
            .trim()
            .replace(/\b\w/g, letter => letter.toUpperCase());
    }

    /* =====================================================
       2. YEAR AND ACCOUNT DETAILS
    ===================================================== */

    const year = $("#stacklyCoachYear");
    const topName = $("#stacklyCoachTopName");
    const topEmail = $("#stacklyCoachTopEmail");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    const email = getSavedEmail();
    const displayName = formatName(email);

    if (email && topEmail) {
        topEmail.textContent = email;
    }

    if (email && topName) {
        topName.textContent =
            displayName.split(" ")[0] || "Coach";
    }

    const profileName = $("#stacklyProfileName");
    const profileFullName = $("#stacklyProfileFullName");
    const profileEmail = $("#stacklyProfileEmail");

    if (email) {
        if (profileName) {
            profileName.textContent = displayName;
        }

        if (profileFullName) {
            profileFullName.textContent = displayName;
        }

        if (profileEmail) {
            profileEmail.textContent = email;
        }
    }

    /* =====================================================
       3. MOBILE SIDEBAR AND OVERLAY
    ===================================================== */

    const sidebar = $("#stacklyCoachSidebar");
    const hamburger = $("#stacklyCoachHamburger");
    const exitButton = $("#stacklyCoachMobileExit");
    const overlay = $("#stacklyCoachOverlay");

    function isMenuOpen() {
        return !!(
            body &&
            body.classList.contains("stackly-coach-menu-active")
        );
    }

    function openMenu() {
        if (!body || !sidebar || !isMobileView()) return;

        body.classList.add("stackly-coach-menu-active");
        sidebar.classList.add("stackly-coach-sidebar-open");

        if (overlay) {
            overlay.classList.add("stackly-coach-overlay-active");
            overlay.setAttribute("aria-hidden", "false");
        }

        if (hamburger) {
            hamburger.setAttribute("aria-expanded", "true");
            hamburger.setAttribute(
                "aria-label",
                "Close navigation menu"
            );
        }

        if (exitButton) {
            exitButton.setAttribute("aria-hidden", "false");
            requestAnimationFrame(() => exitButton.focus());
        }

        body.style.overflow = "hidden";
    }

    function closeMenu(returnFocus = false) {
        if (!body) return;

        body.classList.remove("stackly-coach-menu-active");

        if (sidebar) {
            sidebar.classList.remove(
                "stackly-coach-sidebar-open",
                "active",
                "show"
            );
        }

        if (overlay) {
            overlay.classList.remove(
                "stackly-coach-overlay-active",
                "active"
            );

            overlay.setAttribute("aria-hidden", "true");
        }

        body.style.removeProperty("overflow");

        if (hamburger) {
            hamburger.setAttribute("aria-expanded", "false");
            hamburger.setAttribute(
                "aria-label",
                "Open navigation menu"
            );
        }

        if (exitButton) {
            exitButton.setAttribute("aria-hidden", "true");
        }

        if (returnFocus && hamburger && isMobileView()) {
            requestAnimationFrame(() => hamburger.focus());
        }
    }

    if (hamburger) {
        hamburger.addEventListener("click", event => {
            event.preventDefault();

            if (isMenuOpen()) {
                closeMenu(false);
            } else {
                openMenu();
            }
        });
    }

    if (exitButton) {
        exitButton.addEventListener("click", event => {
            event.preventDefault();
            closeMenu(true);
        });
    }

    if (overlay) {
        overlay.addEventListener("click", () => closeMenu(true));
    }

    if (sidebar) {
        $$("a", sidebar).forEach(link => {
            link.addEventListener("click", () => {
                if (isMobileView()) closeMenu(false);
            });
        });
    }

    /* =====================================================
       4. ACTIVE SIDEBAR NAVIGATION
    ===================================================== */

    const navLinks = $$(
        ".stackly-coach-navigation .stackly-coach-nav-link"
    );

    const currentPage =
        window.location.pathname.split("/").pop().toLowerCase() ||
        "coach.html";

    navLinks.forEach(link => {
        const href = link.getAttribute("href") || "";
        const linkPage = href.split("/").pop().toLowerCase();

        if (linkPage === currentPage) {
            link.classList.add("stackly-coach-nav-active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("stackly-coach-nav-active");
            link.removeAttribute("aria-current");
        }
    });

    /* =====================================================
       5. CUSTOM DROPDOWNS
       Status + Training Program

       Menus are moved to document.body while initialized.
       This avoids most ancestor overflow clipping issues.
    ===================================================== */

    function setupCustomDropdown(config) {
        const wrap = $(config.wrap);
        if (!wrap) return null;

        const trigger = $(config.trigger, wrap);
        const menu = $(config.menu, wrap);
        const label = $(config.label, wrap);
        const hiddenInput = $(config.input, wrap);

        if (!trigger || !menu || !label || !hiddenInput) {
            console.warn(
                "Custom dropdown elements missing:",
                config.input
            );
            return null;
        }

        const options = $$(
            config.option,
            menu
        );

        if (!options.length) return null;

        // Keep the original parent so the menu can be restored.
        const originalParent = menu.parentNode;
        const originalNextSibling = menu.nextSibling;

        // Move menu outside clipping and stacking contexts.
        document.body.appendChild(menu);

        menu.classList.remove("is-visible");
        menu.hidden = true;

        menu.style.position = "fixed";
        menu.style.zIndex = "2147483647";

        let isOpen = false;
        let positionFrame = null;

        function positionMenu() {
            if (!isOpen) return;

            const rect = trigger.getBoundingClientRect();
            const viewportWidth = document.documentElement.clientWidth;
            const viewportHeight = window.innerHeight;
            const gap = 8;
            const edge = 12;

            const menuWidth = Math.min(
                Math.max(rect.width, menu.offsetWidth),
                viewportWidth - edge * 2
            );

            menu.style.width = menuWidth + "px";
            menu.style.maxWidth =
                (viewportWidth - edge * 2) + "px";

            // Measure after menu becomes visible.
            const menuHeight = menu.getBoundingClientRect().height;

            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

            const openAbove =
                spaceBelow < menuHeight + gap &&
                spaceAbove > spaceBelow;

            const left = Math.max(
                edge,
                Math.min(
                    rect.left,
                    viewportWidth - menuWidth - edge
                )
            );

            let top = openAbove
                ? rect.top - menuHeight - gap
                : rect.bottom + gap;

            top = Math.max(
                edge,
                Math.min(
                    top,
                    viewportHeight - menuHeight - edge
                )
            );

            menu.style.left = left + "px";
            menu.style.top = top + "px";
        }

        function schedulePosition() {
            if (!isOpen) return;

            if (positionFrame !== null) {
                cancelAnimationFrame(positionFrame);
            }

            positionFrame = requestAnimationFrame(() => {
                positionFrame = null;
                positionMenu();
            });
        }

        function openDropdown() {
            if (isOpen) return;

            isOpen = true;

            // Make visible first so dimensions can be measured.
            menu.hidden = false;
            menu.classList.add("is-visible");
            wrap.classList.add("is-open");

            trigger.setAttribute("aria-expanded", "true");

            positionMenu();
        }

        function closeDropdown(returnFocus = false) {
            if (!isOpen && menu.hidden) return;

            isOpen = false;

            menu.classList.remove("is-visible");
            menu.hidden = true;

            wrap.classList.remove("is-open");
            trigger.setAttribute("aria-expanded", "false");

            if (positionFrame !== null) {
                cancelAnimationFrame(positionFrame);
                positionFrame = null;
            }

            if (returnFocus) trigger.focus();
        }

        function selectOption(option) {
            const value = option.dataset.value;
            const optionLabel = $("span", option);

            if (value === undefined || !optionLabel) return;

            label.textContent = optionLabel.textContent.trim();

            const changed = hiddenInput.value !== value;
            hiddenInput.value = value;

            options.forEach(item => {
                const selected = item === option;

                item.classList.toggle("active", selected);
                item.setAttribute(
                    "aria-selected",
                    String(selected)
                );
            });

            closeDropdown();

            // Always notify filtering logic.
            // This also handles reselecting the same option.
            hiddenInput.dispatchEvent(
                new Event("change", { bubbles: true })
            );

            if (changed) {
                hiddenInput.dispatchEvent(
                    new CustomEvent("filterselection", {
                        bubbles: true,
                        detail: { value: value }
                    })
                );
            }
        }

        trigger.setAttribute("aria-expanded", "false");

        trigger.addEventListener("click", event => {
            event.preventDefault();

            if (isOpen) {
                closeDropdown();
            } else {
                // Close the other custom dropdown, if any.
                document.dispatchEvent(
                    new CustomEvent("stackly-close-custom-dropdowns", {
                        detail: { except: menu }
                    })
                );

                openDropdown();
            }
        });

        options.forEach(option => {
            option.addEventListener("click", event => {
                event.preventDefault();
                selectOption(option);
            });
        });

        document.addEventListener(
            "stackly-close-custom-dropdowns",
            event => {
                if (event.detail?.except !== menu) {
                    closeDropdown();
                }
            }
        );

        // Close only for genuine outside clicks.
        document.addEventListener("pointerdown", event => {
            if (
                isOpen &&
                !wrap.contains(event.target) &&
                !menu.contains(event.target)
            ) {
                closeDropdown();
            }
        });

        document.addEventListener("keydown", event => {
            if (!isOpen) return;

            if (event.key === "Escape") {
                event.preventDefault();
                closeDropdown(true);
                return;
            }

            // Basic arrow-key option navigation.
            const currentIndex = options.indexOf(
                document.activeElement
            );

            if (event.key === "ArrowDown") {
                event.preventDefault();
                options[
                    Math.min(currentIndex + 1, options.length - 1)
                ].focus();
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                options[
                    currentIndex < 0
                        ? 0
                        : Math.max(currentIndex - 1, 0)
                ].focus();
            }
        });

        window.addEventListener("resize", schedulePosition);
        window.addEventListener("scroll", schedulePosition, true);

        // Reposition if the viewport changes size or zoom.
        if (window.visualViewport) {
            window.visualViewport.addEventListener(
                "resize",
                schedulePosition
            );

            window.visualViewport.addEventListener(
                "scroll",
                schedulePosition
            );
        }

        // Restore selected text from the hidden input on startup.
        const initialOption = options.find(
            option => option.dataset.value === hiddenInput.value
        );

        if (initialOption) {
            const initialLabel = $("span", initialOption);

            if (initialLabel) {
                label.textContent = initialLabel.textContent.trim();
            }

            options.forEach(option => {
                const selected = option === initialOption;

                option.classList.toggle("active", selected);
                option.setAttribute(
                    "aria-selected",
                    String(selected)
                );
            });
        }

        // Return cleanup and control methods.
        return {
            close: closeDropdown,
            open: openDropdown,
            reposition: schedulePosition,
            destroy: function () {
                closeDropdown();

                window.removeEventListener(
                    "resize",
                    schedulePosition
                );

                window.removeEventListener(
                    "scroll",
                    schedulePosition,
                    true
                );

                if (window.visualViewport) {
                    window.visualViewport.removeEventListener(
                        "resize",
                        schedulePosition
                    );

                    window.visualViewport.removeEventListener(
                        "scroll",
                        schedulePosition
                    );
                }

                // Restore menu to original location if needed.
                if (originalParent) {
                    if (
                        originalNextSibling &&
                        originalNextSibling.parentNode === originalParent
                    ) {
                        originalParent.insertBefore(
                            menu,
                            originalNextSibling
                        );
                    } else {
                        originalParent.appendChild(menu);
                    }
                }
            }
        };
    }

    const statusDropdown = setupCustomDropdown({
        wrap: ".stackly-athletes-filter-wrap",
        trigger: "#stacklyAthletesFilterBtn",
        menu: "#stacklyAthletesDropdown",
        label: "#stacklyAthletesSelectedText",
        input: "#stacklyAthleteStatus",
        option: ".stackly-athletes-option"
    });

    const programDropdown = setupCustomDropdown({
        wrap: ".stackly-program-filter-wrap",
        trigger: "#stacklyProgramFilterBtn",
        menu: "#stacklyProgramDropdown",
        label: "#stacklyProgramSelectedText",
        input: "#stacklyAthleteProgram",
        option: ".stackly-program-option"
    });

    /* =====================================================
       6. ATHLETE SEARCH AND FILTERS
    ===================================================== */

    const searchInput = $("#stacklyAthleteSearch");
    const statusInput = $("#stacklyAthleteStatus");
    const programInput = $("#stacklyAthleteProgram");

    const athleteCards = $$(".stackly-athlete-card");
    const emptyState = $("#stacklyAthletesEmpty");

    const totalBadge = $(".stackly-athletes-total-badge");

    function filterAthletes() {
        if (!statusInput || !programInput) return;

        const searchTerm = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        const selectedStatus = statusInput.value || "all";
        const selectedProgram = programInput.value || "all";

        let visibleCount = 0;

        athleteCards.forEach(card => {
            const name = (card.dataset.name || "").toLowerCase();
            const status = card.dataset.status || "";
            const program = card.dataset.program || "";

            const matchesName = name.includes(searchTerm);

            const matchesStatus =
                selectedStatus === "all" ||
                status === selectedStatus;

            const matchesProgram =
                selectedProgram === "all" ||
                program === selectedProgram;

            const visible =
                matchesName && matchesStatus && matchesProgram;

            card.hidden = !visible;

            if (visible) visibleCount++;
        });

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }

        if (totalBadge) {
            totalBadge.textContent =
                visibleCount +
                (visibleCount === 1 ? " Athlete" : " Athletes");
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterAthletes);
    }

    if (statusInput) {
        statusInput.addEventListener("change", filterAthletes);
    }

    if (programInput) {
        programInput.addEventListener("change", filterAthletes);
    }

    filterAthletes();

    /* =====================================================
       7. TRAINING PLAN CATEGORY FILTERS
    ===================================================== */

    const trainingFilters = $$(".stackly-coach-training-filter");

    const trainingCards = $$(".stackly-coach-training-plan-card");

    const libraryBottom = $(
        ".stackly-coach-training-library-bottom"
    );

    function updateTrainingFilter(category) {
        let visibleCount = 0;

        trainingFilters.forEach(filter => {
            const active =
                filter.dataset.trainingFilter === category;

            filter.classList.toggle("active", active);
            filter.setAttribute("aria-pressed", String(active));
        });

        trainingCards.forEach(card => {
            const visible =
                category === "all" ||
                card.dataset.trainingCategory === category;

            card.hidden = !visible;

            card.classList.toggle(
                "stackly-coach-plan-hidden",
                !visible
            );

            if (visible) {
                visibleCount++;

                card.classList.remove(
                    "stackly-coach-plan-enter"
                );

                void card.offsetWidth;

                card.classList.add(
                    "stackly-coach-plan-enter"
                );
            }
        });

        if (libraryBottom) {
            const summary = $("span", libraryBottom);

            if (summary) {
                summary.textContent =
                    "Showing " + visibleCount +
                    (visibleCount === 1
                        ? " program in your library."
                        : " programs in your library.");
            }
        }

        if (typeof AOS !== "undefined") {
            AOS.refreshHard();
        }
    }

    trainingFilters.forEach(filter => {
        filter.setAttribute(
            "aria-pressed",
            String(filter.classList.contains("active"))
        );

        filter.addEventListener("click", () => {
            const category = filter.dataset.trainingFilter;

            if (category) updateTrainingFilter(category);
        });
    });

    /* =====================================================
       8. TRAINING PLAN BOOKMARKS
    ===================================================== */

    $$(".stackly-coach-training-bookmark").forEach(button => {
        const icon = $("i", button);

        button.setAttribute("aria-pressed", "false");
        button.setAttribute("aria-label", "Bookmark training plan");

        button.addEventListener("click", () => {
            const wasBookmarked =
                button.getAttribute("aria-pressed") === "true";

            const bookmarked = !wasBookmarked;

            button.setAttribute(
                "aria-pressed",
                String(bookmarked)
            );

            button.classList.toggle(
                "is-bookmarked",
                bookmarked
            );

            if (icon) {
                icon.classList.toggle("fa-solid", bookmarked);
                icon.classList.toggle("fa-regular", !bookmarked);
            }

            button.setAttribute(
                "aria-label",
                bookmarked
                    ? "Remove bookmark from training plan"
                    : "Bookmark training plan"
            );

            button.classList.remove("bookmark-pop");
            void button.offsetWidth;
            button.classList.add("bookmark-pop");
        });
    });

    /* =====================================================
       9. TRAINING PROGRESS BARS
    ===================================================== */

    const progressBars = $$(
        ".stackly-coach-training-intensity > span, " +
        ".stackly-coach-training-progress-track > span"
    );

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    progressBars.forEach(bar => {
        const targetWidth =
            bar.dataset.targetWidth || bar.style.width;

        if (!targetWidth) return;

        bar.dataset.targetWidth = targetWidth;

        if (reduceMotion) return;

        bar.style.width = "0%";

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(
                (entries, instance) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) return;

                        bar.style.width = bar.dataset.targetWidth;
                        instance.unobserve(bar);
                    });
                },
                { threshold: 0.25 }
            );

            observer.observe(bar);
        } else {
            bar.style.width = targetWidth;
        }
    });

    /* =====================================================
       10. TRAINING PLAN INTERNAL LINKS AND CARDS
    ===================================================== */

    $$('.stackly-coach-training-page a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = $(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });

    trainingCards.forEach(card => {
        card.setAttribute("tabindex", "0");

        card.addEventListener("keydown", event => {
            if (
                event.target.closest(
                    "a, button, input, select, textarea"
                )
            ) {
                return;
            }

            if (event.key === "Enter" || event.key === " ") {
                const viewLink = $(
                    ".stackly-coach-training-view-btn",
                    card
                );

                if (viewLink) {
                    event.preventDefault();
                    viewLink.click();
                }
            }
        });
    });

    /* =====================================================
       11. COACH SESSIONS FILTER AND SEARCH
    ===================================================== */

    const sessionsPage = $(
        ".stackly-coach-sessions-page"
    );

    if (sessionsPage) {
        const filterButtons = $$(
            "[data-session-filter]",
            sessionsPage
        );

        const sessionItems = $$(
            ".stackly-coach-sessions-item",
            sessionsPage
        );

        const sessionSearch = $(
            "#stacklyCoachSessionSearch",
            sessionsPage
        );

        const sessionEmpty = $(
            "#stacklyCoachSessionsEmpty",
            sessionsPage
        );

        const sessionCount = $(
            "#stacklyCoachSessionsCount",
            sessionsPage
        );

        const resetButton = $(
            "#stacklyCoachSessionsReset",
            sessionsPage
        );

        let activeSessionFilter = "all";

        function filterSessions() {
            const term = sessionSearch
                ? sessionSearch.value.trim().toLowerCase()
                : "";

            let visibleCount = 0;

            sessionItems.forEach(session => {
                const category =
                    session.dataset.sessionCategory || "";

                const searchText =
                    (
                        session.dataset.sessionSearch ||
                        session.textContent
                    ).toLowerCase();

                const visible =
                    (
                        activeSessionFilter === "all" ||
                        category === activeSessionFilter
                    ) &&
                    searchText.includes(term);

                session.hidden = !visible;

                if (visible) visibleCount++;
            });

            if (sessionEmpty) {
                sessionEmpty.hidden = visibleCount !== 0;
            }

            if (sessionCount) {
                sessionCount.textContent =
                    "Showing " + visibleCount +
                    (visibleCount === 1 ? " session" : " sessions");
            }
        }

        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                activeSessionFilter =
                    button.dataset.sessionFilter || "all";

                filterButtons.forEach(item => {
                    const active = item === button;

                    item.classList.toggle("active", active);
                    item.setAttribute(
                        "aria-pressed",
                        String(active)
                    );
                });

                filterSessions();
            });
        });

        if (sessionSearch) {
            sessionSearch.addEventListener(
                "input",
                filterSessions
            );
        }

        if (resetButton) {
            resetButton.addEventListener("click", () => {
                activeSessionFilter = "all";

                if (sessionSearch) {
                    sessionSearch.value = "";
                }

                filterButtons.forEach(button => {
                    const active =
                        button.dataset.sessionFilter === "all";

                    button.classList.toggle("active", active);
                    button.setAttribute(
                        "aria-pressed",
                        String(active)
                    );
                });

                filterSessions();
            });
        }

        /* Session preparation checklist */

        const checklist = $$(
            '.stackly-coach-sessions-check-item input[type="checkbox"]',
            sessionsPage
        );

        const checklistFooter = $(
            ".stackly-coach-sessions-checklist-footer",
            sessionsPage
        );

        function updateChecklist() {
            if (!checklistFooter || checklist.length === 0) return;

            const completed = checklist.filter(
                checkbox => checkbox.checked
            ).length;

            const message = completed === checklist.length
                ? "All set! Your session preparation checklist is complete."
                : completed + " of " + checklist.length +
                  " preparation tasks completed.";

            checklistFooter.replaceChildren();

            const icon = document.createElement("i");
            icon.className = "fa-solid fa-circle-info";
            icon.setAttribute("aria-hidden", "true");

            const span = document.createElement("span");
            span.textContent = message;

            checklistFooter.append(icon, span);
        }

        checklist.forEach(checkbox => {
            checkbox.addEventListener("change", updateChecklist);
        });

        $$('a[href^="#"]', sessionsPage).forEach(link => {
            link.addEventListener("click", event => {
                const targetId = link.getAttribute("href");

                if (!targetId || targetId === "#") return;

                const target = $(targetId);

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: reduceMotion ? "auto" : "smooth",
                    block: "start"
                });
            });
        });

        filterSessions();
        updateChecklist();
    }

    /* =====================================================
       12. LOGOUT
    ===================================================== */

    const logoutButton = $("#stacklyCoachLogout");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            try {
                [
                    "loginEmail",
                    "stacklySportLoginEmail",
                    "memberEmail",
                    "stacklySportEmail",
                    "loginName",
                    "userName",
                    "stacklySportUserName",
                    "loginRole",
                    "stacklySportLoggedIn",
                    "stacklySportRemember"
                ].forEach(key => localStorage.removeItem(key));
            } catch (error) {
                console.warn("Unable to clear saved login details.");
            }

            window.location.href = "index.html";
        });
    }

    /* =====================================================
       13. BUTTON DEFAULT TYPES
    ===================================================== */

    $$(".stackly-coach-training-page button").forEach(button => {
        if (!button.hasAttribute("type")) {
            button.setAttribute("type", "button");
        }
    });

    /* =====================================================
       14. RESPONSIVE RESIZE
    ===================================================== */

    let resizeTimer;

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
            if (!isMobileView()) {
                closeMenu(false);
            }

            if (statusDropdown) {
                statusDropdown.reposition();
            }

            if (programDropdown) {
                programDropdown.reposition();
            }
        }, 100);
    });

    /* =====================================================
       15. KEYBOARD CLOSE AND INITIAL SIDEBAR STATE
    ===================================================== */

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && isMenuOpen()) {
            closeMenu(true);
        }
    });

    closeMenu(false);

    /* =====================================================
       16. AOS INITIALIZATION
    ===================================================== */

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 850,
            once: true,
            offset: 65,
            easing: "ease-out-cubic",
            anchorPlacement: "top-bottom",
            disable: reduceMotion
        });

        window.addEventListener("load", () => {
            AOS.refresh();
        });
    }
});
