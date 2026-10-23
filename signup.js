
/* ==========================================
   STACKLY SPORTS CLUB
   SIGNUP JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    // ==========================================
    // ELEMENTS
    // ==========================================

    const signupForm = document.getElementById("stacklySignupForm");
    const signupStatus = document.getElementById("stacklySignupStatus");

    if (!signupForm) {
        console.error("Signup form was not found.");
        return;
    }

    const nameInput = document.getElementById("stacklyFullName");
    const emailInput = document.getElementById("stacklyEmail");
    const phoneInput = document.getElementById("stacklyPhone");
    const passwordInput = document.getElementById("stacklyPassword");
    const confirmPasswordInput = document.getElementById("stacklyConfirmPassword");
    const termsInput = document.getElementById("stacklyTerms");

    const roleInputs = document.querySelectorAll('input[name="role"]');
    const roleOptions = document.querySelectorAll(".stackly-signup-role-option");

    const USERS_KEY = "stacklySportUsers";

    const errors = {
        name: document.getElementById("stacklyNameError"),
        email: document.getElementById("stacklyEmailError"),
        phone: document.getElementById("stacklyPhoneError"),
        password: document.getElementById("stacklyPasswordError"),
        confirm: document.getElementById("stacklyConfirmError"),
        terms: document.getElementById("stacklyTermsError")
    };

    // ==========================================
    // MESSAGE HELPERS
    // ==========================================

    function setError(element, message) {
        if (element) {
            element.textContent = message;
        }
    }

    function showStatus(message, type) {
        if (!signupStatus) return;

        signupStatus.textContent = message;
        signupStatus.className =
            "stackly-signup-status" +
            (type ? " stackly-signup-status-" + type : "");
    }

    function clearErrors() {
        Object.values(errors).forEach(function (element) {
            setError(element, "");
        });

        [
            nameInput,
            emailInput,
            phoneInput,
            passwordInput,
            confirmPasswordInput,
            termsInput
        ].forEach(function (input) {
            if (input) {
                input.removeAttribute("aria-invalid");
            }
        });

        roleOptions.forEach(function (option) {
            option.classList.remove("stackly-signup-role-invalid");
        });
    }

    function markInvalid(input) {
        if (input) {
            input.setAttribute("aria-invalid", "true");
        }
    }

    // ==========================================
    // SHOW / HIDE PASSWORD
    // ==========================================

    document.querySelectorAll(".stackly-signup-password-toggle")
        .forEach(function (button) {
            button.addEventListener("click", function () {
                const input = document.getElementById(
                    button.dataset.passwordTarget
                );

                if (!input) return;

                const icon = button.querySelector("i");
                const showPassword = input.type === "password";

                input.type = showPassword ? "text" : "password";

                if (icon) {
                    icon.classList.toggle("fa-eye", !showPassword);
                    icon.classList.toggle("fa-eye-slash", showPassword);
                }

                button.setAttribute("aria-pressed", String(showPassword));
                button.setAttribute(
                    "aria-label",
                    showPassword ? "Hide password" : "Show password"
                );
            });
        });

    // ==========================================
    // ROLE SELECTION
    // ==========================================

    function updateRoleStyles() {
        roleOptions.forEach(function (option) {
            const radio = option.querySelector('input[name="role"]');

            option.classList.toggle(
                "active",
                Boolean(radio && radio.checked)
            );

            option.classList.remove("stackly-signup-role-invalid");
        });
    }

    roleInputs.forEach(function (radio) {
        radio.addEventListener("change", function () {
            updateRoleStyles();
            showStatus("", "");
        });
    });

    updateRoleStyles();

    // ==========================================
    // CLEAR ERRORS WHILE TYPING
    // ==========================================

    [
        [nameInput, errors.name],
        [emailInput, errors.email],
        [phoneInput, errors.phone],
        [passwordInput, errors.password],
        [confirmPasswordInput, errors.confirm]
    ].forEach(function (item) {
        const input = item[0];
        const error = item[1];

        if (!input) return;

        input.addEventListener("input", function () {
            setError(error, "");
            input.removeAttribute("aria-invalid");
            showStatus("", "");
        });
    });

    if (termsInput) {
        termsInput.addEventListener("change", function () {
            setError(errors.terms, "");
            termsInput.removeAttribute("aria-invalid");
        });
    }

    // ==========================================
    // VALIDATION PATTERNS
    // ==========================================

    const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
    const phonePattern = /^\d{10}$/;

    // ==========================================
    // FORM SUBMISSION
    // ==========================================

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        clearErrors();
        showStatus("", "");

        // Check that required elements exist.
        if (
            !nameInput ||
            !emailInput ||
            !phoneInput ||
            !passwordInput ||
            !confirmPasswordInput ||
            !termsInput
        ) {
            showStatus("Some signup form fields are missing.", "error");
            return;
        }

        const fullName = nameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const phone = phoneInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const termsAccepted = termsInput.checked;

        const selectedRoleInput = document.querySelector(
            'input[name="role"]:checked'
        );

        const selectedRole = selectedRoleInput
            ? selectedRoleInput.value
            : "";

        let valid = true;

        // ==========================================
        // 1. REQUIRED FIELD VALIDATION
        // ==========================================

        if (!fullName) {
            setError(errors.name, "Please enter your full name.");
            markInvalid(nameInput);
            valid = false;
        }

        if (!email) {
            setError(errors.email, "Please enter your email address.");
            markInvalid(emailInput);
            valid = false;
        }

        if (!phone) {
            setError(errors.phone, "Please enter your phone number.");
            markInvalid(phoneInput);
            valid = false;
        }

        if (!password) {
            setError(errors.password, "Please enter a password.");
            markInvalid(passwordInput);
            valid = false;
        }

        if (!confirmPassword) {
            setError(errors.confirm, "Please confirm your password.");
            markInvalid(confirmPasswordInput);
            valid = false;
        }

        if (!selectedRole) {
            roleOptions.forEach(function (option) {
                option.classList.add("stackly-signup-role-invalid");
            });
            valid = false;
        }

        if (!termsAccepted) {
            setError(
                errors.terms,
                "Please accept the Terms & Conditions and Privacy Policy."
            );
            markInvalid(termsInput);
            valid = false;
        }

        if (!valid) {
            showStatus("Please complete all required fields.", "error");

            const firstInvalid = signupForm.querySelector(
                '[aria-invalid="true"]'
            );

            if (firstInvalid) {
                firstInvalid.focus();
            }

            return;
        }

        // ==========================================
        // 2. NAME VALIDATION
        // ==========================================

        if (
            fullName.length < 2 ||
            !namePattern.test(fullName) ||
            !/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(fullName)
        ) {
            setError(
                errors.name,
                "Name must contain letters and spaces only."
            );
            markInvalid(nameInput);
            nameInput.focus();
            showStatus("Please enter a valid name.", "error");
            return;
        }

        // ==========================================
        // 3. EMAIL VALIDATION
        // ==========================================

        if (!emailPattern.test(email)) {
            setError(errors.email, "Please enter a valid email address.");
            markInvalid(emailInput);
            emailInput.focus();
            showStatus("Please correct your email address.", "error");
            return;
        }

        // ==========================================
        // 4. PHONE VALIDATION
        // Exactly 10 digits
        // ==========================================

        if (!phonePattern.test(phone)) {
            setError(
                errors.phone,
                "Phone number must contain exactly 10 digits."
            );
            markInvalid(phoneInput);
            phoneInput.focus();
            showStatus("Enter a valid 10-digit phone number.", "error");
            return;
        }

        // ==========================================
        // 5. PASSWORD VALIDATION
        // Minimum 6 characters
        // ==========================================

        if (password.length < 6) {
            setError(
                errors.password,
                "Password must contain at least 6 characters."
            );
            markInvalid(passwordInput);
            passwordInput.focus();
            showStatus("Your password must be at least 6 characters.", "error");
            return;
        }

        // ==========================================
        // 6. CONFIRM PASSWORD
        // ==========================================

        if (password !== confirmPassword) {
            setError(errors.confirm, "Passwords do not match.");
            markInvalid(confirmPasswordInput);
            confirmPasswordInput.focus();
            showStatus("Please make sure both passwords match.", "error");
            return;
        }

        // ==========================================
        // 7. ROLE VALIDATION
        // ==========================================

        const allowedRoles = ["Member", "Coach", "Trainer", "Other"];

        if (!allowedRoles.includes(selectedRole)) {
            showStatus("Please select a valid role.", "error");
            return;
        }

        // ==========================================
        // 8. READ EXISTING ACCOUNTS
        // ==========================================

        let users = [];

        try {
            const savedUsers = localStorage.getItem(USERS_KEY);
            users = savedUsers ? JSON.parse(savedUsers) : [];

            if (!Array.isArray(users)) {
                showStatus("Saved account data is invalid.", "error");
                return;
            }
        } catch (error) {
            console.error("Could not read saved accounts:", error);
            showStatus(
                "Unable to access saved accounts in this browser.",
                "error"
            );
            return;
        }

        // ==========================================
        // 9. PREVENT DUPLICATE EMAIL
        // ==========================================

        const emailExists = users.some(function (user) {
            return (
                user &&
                typeof user.email === "string" &&
                user.email.toLowerCase() === email
            );
        });

        if (emailExists) {
            setError(
                errors.email,
                "This email is already registered. Please sign in."
            );
            markInvalid(emailInput);
            emailInput.focus();
            showStatus("An account with this email already exists.", "error");
            return;
        }

        // ==========================================
        // 10. CREATE ACCOUNT
        // ==========================================

        const newUser = {
            fullName: fullName,
            email: email,
            phone: phone,
            password: password,
            role: selectedRole,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);

        try {
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        } catch (error) {
            console.error("Could not save new account:", error);
            showStatus(
                "Unable to save your account. Please try again.",
                "error"
            );
            return;
        }

        // ==========================================
        // 11. CLEAR THE FORM
        // ==========================================

        signupForm.reset();
        clearErrors();
        updateRoleStyles();

        // Reset password visibility to hidden.
        document.querySelectorAll(".stackly-signup-password-toggle")
            .forEach(function (button) {
                const input = document.getElementById(
                    button.dataset.passwordTarget
                );

                if (input) {
                    input.type = "password";
                }

                const icon = button.querySelector("i");

                if (icon) {
                    icon.classList.add("fa-eye");
                    icon.classList.remove("fa-eye-slash");
                }

                button.setAttribute("aria-pressed", "false");
                button.setAttribute("aria-label", "Show password");
            });

        // ==========================================
        // 12. SUCCESS MESSAGE
        // ==========================================

        showStatus(
            "Account created successfully! Redirecting to login...",
            "success"
        );

        const submitButton = signupForm.querySelector(
            ".stackly-signup-submit"
        );

        if (submitButton) {
            submitButton.disabled = true;

            const buttonText = submitButton.querySelector("span");

            if (buttonText) {
                buttonText.textContent = "Account Created";
            }
        }

        // ==========================================
        // 13. REDIRECT TO LOGIN PAGE
        // ==========================================

        window.setTimeout(function () {
            window.location.href = "login.html";
        }, 1000);
    });
});
