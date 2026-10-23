
/* =========================================================
   STACKLY SPORTS CLUB - OTHERS DASHBOARD
   Trainer Profile | Mobile Navigation | Logout | AOS
   Athlete Search | Custom Status Dropdown | Card Features
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =====================================================
       1. ELEMENT REFERENCES
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
       2. SAFE LOCAL STORAGE HELPERS
    ===================================================== */

    function getStoredValue(keys) {
        for (const key of keys) {
            try {
                const value = localStorage.getItem(key);

                if (value && value.trim()) {
                    return value.trim();
                }
            } catch (error) {
                console.warn("Unable to access saved dashboard information.");
                return "";
            }
        }

        return "";
    }

    function getTrainerProfile() {
        try {
            const savedProfile = localStorage.getItem(
                "stacklyTrainerProfile"
            );

            if (savedProfile) {
                const profile = JSON.parse(savedProfile);

                if (profile && typeof profile === "object") {
                    return profile;
                }
            }
        } catch (error) {
            console.warn("Unable to read saved trainer profile.");
        }

        return {};
    }

    function getProfessionalName(email) {
        if (!email) return "";

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

    /* =====================================================
       3. TRAINER PROFILE, NAME AND EMAIL
    ===================================================== */

    function displayTrainerInformation() {
        const profile = getTrainerProfile();

        const email = String(
            profile.email ||
            profile.Email ||
            getStoredValue([
                "loginEmail",
                "trainerEmail",
                "stacklySportLoginEmail",
                "memberEmail",
                "stacklySportEmail"
            ]) ||
            ""
        ).trim();

        const savedName = String(
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
            ""
        ).trim();

        const name = savedName ||
            getProfessionalName(email) ||
            "Trainer";

        if (topName) {
            topName.textContent = name;
            topName.title = name;
        }

        if (topEmail) {
            const emailIcon = topEmail.querySelector("i");

            if (emailIcon) {
                topEmail.textContent = "";
                topEmail.appendChild(emailIcon);
                topEmail.appendChild(
                    document.createTextNode(
                        " " + (email || "Email not available")
                    )
                );
            } else {
                topEmail.textContent = email || "Email not available";
            }

            topEmail.title = email || "Email not available";
            topEmail.setAttribute(
                "aria-label",
                "Trainer email: " + (email || "Email not available")
            );
        }

        /* Update other name and email placeholders */

        document.querySelectorAll("[data-user-name]").forEach(function (element) {
            element.textContent = name;
            element.title = name;
        });

        document.querySelectorAll("[data-user-email]").forEach(function (element) {
            const icon = element.querySelector("i");

            if (icon) {
                element.textContent = "";
                element.appendChild(icon);
                element.appendChild(
                    document.createTextNode(
                        " " + (email || "Email not available")
                    )
                );
            } else {
                element.textContent = email || "Email not available";
            }

            element.title = email || "Email not available";
        });

        /* Profile hero name */

        document.querySelectorAll(
            ".stackly-profile-hero-card h3"
        ).forEach(function (element) {
            element.textContent = name;
        });

        /* Profile hero email */

        document.querySelectorAll(
            ".stackly-profile-hero-meta span"
        ).forEach(function (element) {
            const icon = element.querySelector(".fa-envelope");

            if (icon) {
                element.textContent = "";
                element.appendChild(icon);
                element.appendChild(
                    document.createTextNode(
                        " " + (email || "Email not available")
                    )
                );
            }
        });

        /* Profile information cards */

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

    displayTrainerInformation();

    /* Make the function available for dynamically loaded sections. */
    window.updateTrainerInformation = displayTrainerInformation;

    /* =====================================================
       4. MOBILE SIDEBAR NAVIGATION
    ===================================================== */

    function openSidebar() {
        if (!body || !sidebar) return;

        body.classList.add("stackly-others-menu-active");

        if (hamburger) {
            hamburger.setAttribute("aria-expanded", "true");
            hamburger.setAttribute(
                "aria-label",
                "Close navigation menu"
            );
        }

        sidebar.setAttribute("aria-hidden", "false");

        if (overlay) {
            overlay.setAttribute("aria-hidden", "false");
        }

        if (mobileExit) {
            mobileExit.focus();
        }
    }

    function closeSidebar(returnFocus) {
        if (body) {
            body.classList.remove("stackly-others-menu-active");
        }

        if (hamburger) {
            hamburger.setAttribute("aria-expanded", "false");
            hamburger.setAttribute(
                "aria-label",
                "Open navigation menu"
            );
        }

        if (sidebar) {
            sidebar.setAttribute("aria-hidden", "true");
        }

        if (overlay) {
            overlay.setAttribute("aria-hidden", "true");
        }

        if (returnFocus && hamburger) {
            hamburger.focus();
        }
    }

    if (hamburger) {
        hamburger.addEventListener("click", function () {
            const isOpen = body &&
                body.classList.contains("stackly-others-menu-active");

            if (isOpen) {
                closeSidebar(false);
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

    document.querySelectorAll(
        ".stackly-others-nav-link"
    ).forEach(function (link) {
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
       5. ESCAPE KEY
    ===================================================== */

    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") return;

        const sidebarIsOpen = body &&
            body.classList.contains("stackly-others-menu-active");

        if (sidebarIsOpen) {
            closeSidebar(true);
        }

        /* Also close the athlete status dropdown if open. */
        if (typeof closeAthletesStatusDropdown === "function") {
            closeAthletesStatusDropdown(false);
        }

        /* Close athlete option notices. */
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
       6. ACTIVE SIDEBAR NAVIGATION
    ===================================================== */

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    document.querySelectorAll(
        ".stackly-others-nav-link"
    ).forEach(function (link) {
        const href = link.getAttribute("href");

        if (!href) return;

        const linkPage = href.split("/").pop().toLowerCase();

        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });

    /* =====================================================
       7. LOGOUT
    ===================================================== */

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            const confirmed = window.confirm(
                "Are you sure you want to log out?"
            );

            if (!confirmed) return;

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
                try {
                    localStorage.removeItem(key);
                } catch (error) {
                    console.warn("Unable to clear a session value.");
                }
            });

            /* Keep the saved trainer profile intact. */
            window.location.href = "index.html";
        });
    }

    /* =====================================================
       8. FOOTER YEAR
    ===================================================== */

    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    /* =====================================================
       9. ATHLETE DIRECTORY ELEMENTS
    ===================================================== */

    const athleteSearch = document.getElementById(
        "stacklyAthletesSearch"
    );

    const athleteStatusInput = document.getElementById(
        "stacklyAthletesFilter"
    );

    const athleteGrid = document.getElementById(
        "stacklyAthletesGrid"
    );

    const athleteNoResults = document.getElementById(
        "stacklyAthletesNoResults"
    );

    const athleteCards = athleteGrid
        ? Array.from(
            athleteGrid.querySelectorAll(".stackly-athlete-card")
        )
        : [];

    /* =====================================================
       10. ATHLETE STATUS CUSTOM DROPDOWN
    ===================================================== */

    const athletesFilterWrap = document.querySelector(
        ".stackly-athletes-filter-wrap"
    );

    let athleteFilterButton = null;
    let athleteFilterText = null;
    let athleteFilterDropdown = null;
    let athleteFilterOptions = [];

    function closeAthletesStatusDropdown(returnFocus) {
        if (!athletesFilterWrap) return;

        if (athleteFilterDropdown) {
            athleteFilterDropdown.hidden = true;
        }

        if (athleteFilterButton) {
            athleteFilterButton.setAttribute(
                "aria-expanded",
                "false"
            );

            if (returnFocus) {
                athleteFilterButton.focus();
            }
        }

        athletesFilterWrap.classList.remove("is-open");
    }

    /* Make the close function accessible to the Escape handler. */
    window.closeAthletesStatusDropdown = closeAthletesStatusDropdown;

    if (athletesFilterWrap) {
        athleteFilterButton = athletesFilterWrap.querySelector(
            "#stacklyAthletesFilterBtn"
        );

        athleteFilterText = athletesFilterWrap.querySelector(
            "#stacklyAthletesFilterText"
        );

        athleteFilterDropdown = athletesFilterWrap.querySelector(
            "#stacklyAthletesFilterDropdown"
        );

        athleteFilterOptions = Array.from(
            athletesFilterWrap.querySelectorAll(
                ".stackly-athletes-filter-option"
            )
        );

        if (
            athleteFilterButton &&
            athleteFilterText &&
            athleteFilterDropdown &&
            athleteStatusInput
        ) {
            function openAthletesStatusDropdown() {
                athleteFilterDropdown.hidden = false;

                athleteFilterButton.setAttribute(
                    "aria-expanded",
                    "true"
                );

                athletesFilterWrap.classList.add("is-open");
            }

            athleteFilterButton.addEventListener("click", function () {
                if (athleteFilterDropdown.hidden) {
                    openAthletesStatusDropdown();
                } else {
                    closeAthletesStatusDropdown(false);
                }
            });

            athleteFilterOptions.forEach(function (option) {
                option.addEventListener("click", function () {
                    const selectedValue = this.dataset.value;
                    const labelElement = this.querySelector("span");

                    if (!selectedValue || !labelElement) return;

                    athleteStatusInput.value = selectedValue;
                    athleteFilterText.textContent =
                        labelElement.textContent.trim();

                    athleteFilterOptions.forEach(function (item) {
                        const isSelected = item === option;

                        item.classList.toggle("active", isSelected);

                        item.setAttribute(
                            "aria-selected",
                            String(isSelected)
                        );
                    });

                    closeAthletesStatusDropdown(false);

                    /* Trigger the shared filtering handler. */
                    athleteStatusInput.dispatchEvent(
                        new Event("change", { bubbles: true })
                    );
                });
            });

            /* Restore selected label when HTML starts with a saved value. */
            const initialOption = athleteFilterOptions.find(function (option) {
                return option.dataset.value === athleteStatusInput.value;
            });

            if (initialOption) {
                const initialLabel = initialOption.querySelector("span");

                if (initialLabel) {
                    athleteFilterText.textContent =
                        initialLabel.textContent.trim();
                }

                athleteFilterOptions.forEach(function (option) {
                    const selected = option === initialOption;

                    option.classList.toggle("active", selected);
                    option.setAttribute(
                        "aria-selected",
                        String(selected)
                    );
                });
            }

            document.addEventListener("click", function (event) {
                if (!athletesFilterWrap.contains(event.target)) {
                    closeAthletesStatusDropdown(false);
                }
            });
        }
    }

    /* =====================================================
       11. ATHLETE SEARCH AND STATUS FILTERING
    ===================================================== */

    function filterAthletes() {
        if (!athleteGrid || !athleteNoResults) return;

        const searchTerm = athleteSearch
            ? athleteSearch.value.trim().toLowerCase()
            : "";

        const selectedStatus = athleteStatusInput
            ? athleteStatusInput.value
            : "all";

        let visibleCount = 0;

        athleteCards.forEach(function (card) {
            const athleteName = (
                card.querySelector("h3")?.textContent || ""
            ).toLowerCase();

            const athleteProgram = (
                card.querySelector(".stackly-athlete-category")?.textContent || ""
            ).toLowerCase();

            const fullCardText = card.textContent.toLowerCase();

            const athleteStatus = (
                card.dataset.status || ""
            ).toLowerCase();

            /* Search athlete name, program and other card text. */
            const matchesSearch =
                !searchTerm ||
                athleteName.includes(searchTerm) ||
                athleteProgram.includes(searchTerm) ||
                fullCardText.includes(searchTerm);

            const matchesStatus =
                selectedStatus === "all" ||
                athleteStatus === selectedStatus;

            const shouldShow = matchesSearch && matchesStatus;

            card.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount++;
            }
        });

        athleteNoResults.hidden = visibleCount > 0;

        /* Optional result count badges. */
        document.querySelectorAll(
            ".stackly-athletes-total-badge"
        ).forEach(function (badge) {
            badge.textContent = String(visibleCount);
        });

        if (window.AOS && typeof window.AOS.refresh === "function") {
            window.AOS.refresh();
        }
    }

    if (athleteSearch) {
        athleteSearch.addEventListener("input", filterAthletes);
    }

    if (athleteStatusInput) {
        athleteStatusInput.addEventListener("change", filterAthletes);
    }

    /* =====================================================
       12. ATHLETE PROGRESS BARS
    ===================================================== */

    athleteCards.forEach(function (card) {
        const progressBar = card.querySelector(
            ".stackly-athlete-progress-track span"
        );

        if (!progressBar) return;

        /* Store the original CSS width only once. */
        if (!progressBar.dataset.originalProgress) {
            const computedWidth = progressBar.style.width ||
                window.getComputedStyle(progressBar).width;

            progressBar.dataset.originalProgress = computedWidth;
        }

        const targetWidth = progressBar.dataset.originalProgress;

        progressBar.style.width = "0%";

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                progressBar.style.width = targetWidth;
            });
        });
    });

    /* =====================================================
       13. ATHLETE CARD HOVER EFFECTS
    ===================================================== */

    athleteCards.forEach(function (card) {
        card.addEventListener("mouseenter", function () {
            card.classList.add("stackly-athlete-card-hover");
        });

        card.addEventListener("mouseleave", function () {
            card.classList.remove("stackly-athlete-card-hover");
        });
    });

    /* =====================================================
       14. ATHLETE MORE OPTIONS
    ===================================================== */

    if (athleteGrid) {
        athleteGrid.querySelectorAll(
            ".stackly-athlete-more"
        ).forEach(function (button) {
            button.setAttribute("aria-haspopup", "true");
            button.setAttribute("aria-expanded", "false");
        });

        athleteGrid.addEventListener("click", function (event) {
            const optionsButton = event.target.closest(
                ".stackly-athlete-more"
            );

            if (
                !optionsButton ||
                !athleteGrid.contains(optionsButton)
            ) {
                return;
            }

            const card = optionsButton.closest(".stackly-athlete-card");

            if (!card) return;

            const existingNotice = card.querySelector(
                ".stackly-athlete-options-notice"
            );

            /* Toggle the clicked card's notice. */
            if (existingNotice) {
                existingNotice.remove();

                optionsButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                return;
            }

            /* Close other notices first. */
            athleteGrid.querySelectorAll(
                ".stackly-athlete-options-notice"
            ).forEach(function (notice) {
                notice.remove();
            });

            athleteGrid.querySelectorAll(
                ".stackly-athlete-more"
            ).forEach(function (button) {
                button.setAttribute("aria-expanded", "false");
            });

            const athleteName = (
                card.querySelector("h3")?.textContent || "Athlete"
            ).trim();

            const notice = document.createElement("div");

            notice.className = "stackly-athlete-options-notice";
            notice.setAttribute("role", "status");
            notice.textContent = athleteName + " — athlete options";

            card.appendChild(notice);

            optionsButton.setAttribute("aria-expanded", "true");
        });
    }

    /* =====================================================
       15. INITIAL ATHLETE DIRECTORY STATE
    ===================================================== */

    filterAthletes();

    /* =====================================================
       16. AOS ANIMATIONS
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

        window.addEventListener("load", function () {
            if (typeof AOS.refresh === "function") {
                AOS.refresh();
            }
        });
    }
});
