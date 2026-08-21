const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const theme_toggle = document.querySelector(".theme-toggle");
const theme_options = document.querySelectorAll(".theme-option");
const left_image = document.querySelector(".left-panel .image");
const right_image = document.querySelector(".right-panel .image");

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

apply_theme(get_saved_theme() || "theme-red-black");
