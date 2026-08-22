// Destructure Firebase functions exposed on window by the inline script
const {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} = window;

// DOM Elements for Theme and Layout
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const theme_toggle = document.querySelector(".theme-toggle");
const theme_options = document.querySelectorAll(".theme-option");
const left_image = document.querySelector(".left-panel .image");
const right_image = document.querySelector(".right-panel .image");

// DOM Elements for Firebase Forms
const signin_form = document.querySelector("#signin-form");
const signup_form = document.querySelector("#signup-form");
const signin_email = document.querySelector("#signin-email");
const signin_password = document.querySelector("#signin-password");
const signup_username = document.querySelector("#signup-username");
const signup_email = document.querySelector("#signup-email");
const signup_password = document.querySelector("#signup-password");

// Toast Notification Helper (Only used for Sign In Success now)
const showToast = (message, type = "success") => {
    let toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.className = "toast-container";
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");
    toast.className = `toast-notification ${type}`;
    
    // Add appropriate icon based on type
    const icon = document.createElement("i");
    if (type === "success") {
        icon.className = "fas fa-check-circle";
    } else {
        icon.className = "fas fa-exclamation-circle";
    }
    toast.appendChild(icon);

    const text = document.createElement("span");
    text.textContent = message;
    toast.appendChild(text);

    toastContainer.appendChild(toast);

    // Trigger opening animation
    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove("show");
        toast.addEventListener("transitionend", () => {
            toast.remove();
            if (toastContainer.children.length === 0) {
                toastContainer.remove();
            }
        });
    }, 4000);
};

// Inline Form Message Helper (Used for Sign Up Success/Error and Sign In Error)
const showFormMessage = (formType, message, type = "success") => {
    const messageDiv = document.querySelector(`#${formType}-message`);
    if (!messageDiv) return;

    messageDiv.className = `form-message ${type} show`;
    messageDiv.innerHTML = "";

    const icon = document.createElement("i");
    if (type === "success") {
        icon.className = "fas fa-check-circle";
    } else {
        icon.className = "fas fa-exclamation-circle";
    }
    messageDiv.appendChild(icon);

    const text = document.createElement("span");
    text.textContent = message;
    messageDiv.appendChild(text);

    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.classList.remove("show");
    }, 5000);
};

// Helper to hide form messages
const clearFormMessages = (formType) => {
    const messageDiv = document.querySelector(`#${formType}-message`);
    if (messageDiv) {
        messageDiv.classList.remove("show");
    }
};

// Clear messages on input interaction
signin_form.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => clearFormMessages("signin"));
});
signup_form.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => clearFormMessages("signup"));
});

// Form Switcher Logic
const themes = ["theme-red-black", "theme-wine-cream", "theme-navy-cream"];
const theme_switcher_delay = 3000;
let theme_switcher_timeout;
const theme_images = {
    "theme-red-black": {
        left: "./img/logN.svg",
        right: "./img/registerN.svg",
    },
    "theme-wine-cream": {
        left: "./img/logN-wine-cream.svg",
        right: "./img/registerN-wine-cream.svg",
    },
    "theme-navy-cream": {
        left: "./img/logN-navy-cream.svg",
        right: "./img/registerN-navy-cream.svg",
    },
};

const get_saved_theme = () => {
    try {
        return localStorage.getItem("login-page-theme");
    } catch (error) {
        return null;
    }
};

const save_theme = (theme) => {
    try {
        localStorage.setItem("login-page-theme", theme);
    } catch (error) {
        return;
    }
};

const close_theme_menu = () => {
    container.classList.remove("theme-menu-open");
    theme_toggle.setAttribute("aria-expanded", "false");
};

const apply_theme = (theme) => {
    if (!themes.includes(theme)) return;

    container.classList.remove(...themes);
    container.classList.add(theme);

    theme_options.forEach((option) => {
        option.classList.toggle("active", option.dataset.theme === theme);
    });

    left_image.src = theme_images[theme].left;
    right_image.src = theme_images[theme].right;
    save_theme(theme);
};

const switch_form_mode = (show_sign_up) => {
    container.classList.toggle("sign-up-mode", show_sign_up);
    container.classList.add("theme-switcher-delayed");
    close_theme_menu();

    window.clearTimeout(theme_switcher_timeout);
    theme_switcher_timeout = window.setTimeout(() => {
        container.classList.remove("theme-switcher-delayed");
    }, theme_switcher_delay);
};

sign_up_btn.addEventListener("click", () => {
    switch_form_mode(true);
});

sign_in_btn.addEventListener("click", () => {
    switch_form_mode(false);
});

theme_toggle.addEventListener("click", () => {
    const is_open = container.classList.toggle("theme-menu-open");
    theme_toggle.setAttribute("aria-expanded", is_open.toString());
});

theme_options.forEach((option) => {
    option.addEventListener("click", () => {
        apply_theme(option.dataset.theme);
        close_theme_menu();
    });
});

document.addEventListener("click", (event) => {
    if (!event.target.closest(".theme-switcher")) {
        close_theme_menu();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        close_theme_menu();
    }
});

// Apply initial/saved theme
apply_theme(get_saved_theme() || "theme-red-black");


// --- Firebase Authentication Event Listeners ---

// 1. Sign Up Submit Event Listener
signup_form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = signup_username.value.trim();
    const email = signup_email.value.trim();
    const password = signup_password.value;

    if (!auth || !createUserWithEmailAndPassword || !updateProfile) {
        showFormMessage("signup", "Firebase Auth wurde nicht richtig initialisiert.", "error");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // Update displayName with user-provided username
            return updateProfile(user, {
                displayName: username
            }).then(() => {
                showFormMessage("signup", "Registrierung erfolgreich! Bitte logge dich jetzt ein.", "success");
                signup_form.reset();
                
                // Delay switching back to Login mode slightly so the user sees the inline success message
                setTimeout(() => {
                    switch_form_mode(false); // Switch to Login mode
                }, 2000);
            });
        })
        .catch((error) => {
            console.error("Sign Up Error:", error);
            let errorMessage = "Registrierung fehlgeschlagen.";
            
            switch (error.code) {
                case "auth/email-already-in-use":
                    errorMessage = "Diese E-Mail-Adresse wird bereits verwendet.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Die E-Mail-Adresse ist ungültig.";
                    break;
                case "auth/weak-password":
                    errorMessage = "Das Passwort ist zu schwach (mindestens 6 Zeichen).";
                    break;
                case "auth/operation-not-allowed":
                    errorMessage = "E-Mail/Passwort-Registrierung ist in Firebase nicht aktiviert.";
                    break;
                default:
                    errorMessage = error.message;
            }
            showFormMessage("signup", errorMessage, "error");
        });
});

// 2. Sign In Submit Event Listener
signin_form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = signin_email.value.trim();
    const password = signin_password.value;

    if (!auth || !signInWithEmailAndPassword) {
        showFormMessage("signin", "Firebase Auth wurde nicht richtig initialisiert.", "error");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            showToast("Erfolgreich angemeldet! Weiterleitung...", "success");
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1200);
        })
        .catch((error) => {
            console.error("Sign In Error:", error);
            let errorMessage = "Login fehlgeschlagen.";

            switch (error.code) {
                case "auth/user-not-found":
                case "auth/wrong-password":
                case "auth/invalid-credential":
                    errorMessage = "E-Mail oder Passwort ist falsch.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Die E-Mail-Adresse ist ungültig.";
                    break;
                case "auth/user-disabled":
                    errorMessage = "Dieser Benutzer wurde deaktiviert.";
                    break;
                default:
                    errorMessage = error.message;
            }
            showFormMessage("signin", errorMessage, "error");
        });
});
