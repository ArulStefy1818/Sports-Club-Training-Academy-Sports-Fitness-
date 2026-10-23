
/* ==========================================
   STACKLY SPORTS CLUB
   LOGIN JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // ==========================================
    // ELEMENTS
    // ==========================================

    const loginForm = document.getElementById("stacklyLoginForm");
    const emailInput = document.getElementById("stacklyLoginEmail");
    const passwordInput = document.getElementById("stacklyLoginPassword");
    const passwordToggle = document.getElementById("stacklyPasswordToggle");
    const loginMessage = document.getElementById("stacklyLoginMessage");
    const roleOptions = document.querySelectorAll(
        'input[name="role"]'
    );
    const roleCards = document.querySelectorAll(
        ".stackly-role-option"
    );
    const rememberCheckbox = document.querySelector(
        'input[name="remember"]'
    );
    const socialButtons = document.querySelectorAll(
        ".stackly-social-button"
    );

    if (!loginForm) {
        console.error("Stackly login form was not found.");
        return;
    }

    // ==========================================
    // STORAGE KEYS
    // ==========================================

    const STORAGE_KEYS = {
        email: "stacklySportLoginEmail",
        role: "stacklySportLoginRole",
        loggedIn: "stacklySportLoggedIn",
        remember: "stacklySportRemember",
        rememberedEmail: "stacklySportRememberedEmail"
    };

    // ==========================================
    // ROLE DASHBOARD ROUTES
    // ==========================================

    const roleRoutes = {
        member: "member.html",
        coach: "coach.html",
        trainer: "trainer.html",
        other: "other.html"
    };

    // ==========================================
    // VALIDATION PATTERNS
    // ==========================================

    // Standard email format validation.
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    // Allows international numbers, spaces, +, hyphens
    // and parentheses. Requires 7 to 15 digits.
    const mobilePattern =
        /^\+?[\d\s()-]{7,20}$/;

    // ==========================================
    // MESSAGE HELPERS
    // ==========================================

    function showMessage(message, type) {
        if (!loginMessage) return;

        loginMessage.textContent = message;
        loginMessage.className =
            "stackly-login-message " + type;
        loginMessage.style.display = "block";
        loginMessage.setAttribute("role", "alert");
    }

    function clearMessage() {
        if (!loginMessage) return;

        loginMessage.textContent = "";
        loginMessage.className = "stackly-login-message";
        loginMessage.style.display = "";
        loginMessage.removeAttribute("role");
    }

    function clearFieldErrors() {
        [emailInput, passwordInput].forEach(function (field) {
            if (field) {
                field.removeAttribute("aria-invalid");
            }
        });

        roleCards.forEach(function (card) {
            card.classList.remove("stackly-role-error");
        });
    }

    function markInvalid(field) {
        if (field) {
            field.setAttribute("aria-invalid", "true");
            field.focus();
        }
    }

    // ==========================================
    // RESTORE REMEMBERED EMAIL
    // ==========================================

    try {
        const remembered = localStorage.getItem(
            STORAGE_KEYS.remember
        );

        const rememberedEmail = localStorage.getItem(
            STORAGE_KEYS.rememberedEmail
        );

        if (
            remembered === "true" &&
            rememberedEmail &&
            emailInput
        ) {
            emailInput.value = rememberedEmail;

            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        }
    } catch (error) {
        console.warn("Browser storage is unavailable.", error);
    }

    // ==========================================
    // SHOW / HIDE PASSWORD
    // ==========================================

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener("click", function () {
            const showing =
                passwordInput.type === "password";

            passwordInput.type = showing
                ? "text"
                : "password";

            const icon = passwordToggle.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-eye", !showing);
                icon.classList.toggle("fa-eye-slash", showing);
            }

            passwordToggle.setAttribute(
                "aria-label",
                showing ? "Hide password" : "Show password"
            );
        });
    }

    // ==========================================
    // ROLE CARD SELECTION
    // ==========================================

    function updateRoleCards() {
        roleCards.forEach(function (card) {
            const radio = card.querySelector(
                'input[name="role"]'
            );

            const isSelected = Boolean(
                radio && radio.checked
            );

            card.classList.toggle("active", isSelected);
            card.classList.remove("stackly-role-error");
        });
    }

    roleOptions.forEach(function (radio) {
        radio.addEventListener("change", function () {
            updateRoleCards();
            clearMessage();
        });
    });

    updateRoleCards();

    // ==========================================
    // CLEAR MESSAGES WHEN USER EDITS FIELDS
    // ==========================================

    [emailInput, passwordInput].forEach(function (field) {
        if (!field) return;

        field.addEventListener("input", function () {
            field.removeAttribute("aria-invalid");
            clearMessage();
        });
    });

    // ==========================================
    // EMAIL OR MOBILE VALIDATION
    // ==========================================

    function validateEmailOrMobile(value) {
        const input = value.trim();

        if (input.includes("@")) {
            return emailPattern.test(input);
        }

        if (!mobilePattern.test(input)) {
            return false;
        }

        const digits = input.replace(/\D/g, "");

        return digits.length >= 7 && digits.length <= 15;
    }

    // ==========================================
    // GET SELECTED ROLE
    // ==========================================

    function getSelectedRole() {
        const selected = document.querySelector(
            'input[name="role"]:checked'
        );

        return selected ? selected.value : "";
    }

    // ==========================================
    // LOGIN FORM SUBMISSION
    // ==========================================

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        clearMessage();
        clearFieldErrors();

        // Read the current values.
        const emailOrMobile = emailInput
            ? emailInput.value.trim()
            : "";

        const password = passwordInput
            ? passwordInput.value
            : "";

        const selectedRole = getSelectedRole();

        // ------------------------------------------
        // 1. REQUIRED FIELD VALIDATION
        // ------------------------------------------

        if (!emailOrMobile && !password) {
            showMessage(
                "Please enter your email address or mobile number and password.",
                "error"
            );

            markInvalid(emailInput);
            if (passwordInput) {
                passwordInput.setAttribute("aria-invalid", "true");
            }
            return;
        }

        if (!emailOrMobile) {
            showMessage(
                "Please enter your email address or mobile number.",
                "error"
            );

            markInvalid(emailInput);
            return;
        }

        // ------------------------------------------
        // 2. EMAIL / MOBILE FORMAT VALIDATION
        // ------------------------------------------

        if (!validateEmailOrMobile(emailOrMobile)) {
            showMessage(
                "Enter a valid email address or mobile number.",
                "error"
            );

            markInvalid(emailInput);
            return;
        }

        if (!password.trim()) {
            showMessage(
                "Please enter your password.",
                "error"
            );

            markInvalid(passwordInput);
            return;
        }

        // ------------------------------------------
        // 3. PASSWORD LENGTH VALIDATION
        // ------------------------------------------

        if (password.length < 6) {
            showMessage(
                "Password must contain at least 6 characters.",
                "error"
            );

            markInvalid(passwordInput);
            return;
        }

        // ------------------------------------------
        // 4. ROLE VALIDATION
        // ------------------------------------------

        if (!selectedRole || !roleRoutes[selectedRole]) {
            showMessage(
                "Please select a role before signing in.",
                "error"
            );

            roleCards.forEach(function (card) {
                card.classList.add("stackly-role-error");
            });

            const roleFieldset = document.querySelector(
                ".stackly-role-fieldset"
            );

            if (roleFieldset) {
                roleFieldset.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }

            return;
        }

        // ------------------------------------------
        // 5. SAVE LOGIN INFORMATION
        // ------------------------------------------

        try {
            // Store the current session information.
            localStorage.setItem(
                STORAGE_KEYS.email,
                emailOrMobile
            );

            localStorage.setItem(
                STORAGE_KEYS.role,
                selectedRole
            );

            localStorage.setItem(
                STORAGE_KEYS.loggedIn,
                "true"
            );

            // Save or clear the remembered email.
            if (rememberCheckbox && rememberCheckbox.checked) {
                localStorage.setItem(
                    STORAGE_KEYS.remember,
                    "true"
                );

                localStorage.setItem(
                    STORAGE_KEYS.rememberedEmail,
                    emailOrMobile
                );
            } else {
                localStorage.setItem(
                    STORAGE_KEYS.remember,
                    "false"
                );

                localStorage.removeItem(
                    STORAGE_KEYS.rememberedEmail
                );
            }
        } catch (error) {
            showMessage(
                "Your browser could not save login information. Please enable site storage and try again.",
                "error"
            );

            console.error("Could not save login information:", error);
            return;
        }

        // ------------------------------------------
        // 6. REDIRECT BASED ON SELECTED ROLE
        // ------------------------------------------

        showMessage(
            "Login details accepted. Opening your dashboard...",
            "success"
        );

        const destination = roleRoutes[selectedRole];

        // A short delay lets the success message appear.
        window.setTimeout(function () {
            window.location.href = destination;
        }, 400);
    });

    // ==========================================
    // SOCIAL LOGIN PLACEHOLDER
    // ==========================================

    socialButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const provider =
                button.getAttribute("data-provider") || "Social";

            showMessage(
                provider +
                " sign-in is not connected yet. Please use the login form.",
                "error"
            );
        });
    });
});
