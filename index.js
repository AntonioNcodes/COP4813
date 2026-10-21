"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("#site-navigation");

    // Do nothing on pages that do not contain the mobile menu.
    if (!menuButton || !navigation) {
        return;
    }

    function setMenuOpen(isOpen) {
        menuButton.setAttribute("aria-expanded", String(isOpen));
        navigation.classList.toggle("is-open", isOpen);
    }

    // Open or close the menu when clicked or tapped.
    menuButton.addEventListener("click", function () {
        const isExpanded =
            menuButton.getAttribute("aria-expanded") === "true";

        setMenuOpen(!isExpanded);
    });

    // Close the menu after a navigation link is selected.
    navigation.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            setMenuOpen(false);
        });
    });

    // Close the menu with Escape when it is open.
    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            menuButton.getAttribute("aria-expanded") === "true"
        ) {
            setMenuOpen(false);
            menuButton.focus();
        }
    });

    // Restore the desktop navigation when the viewport becomes wider.
    const desktopViewport = window.matchMedia("(min-width: 769px)");

    desktopViewport.addEventListener("change", function (event) {
        if (event.matches) {
            setMenuOpen(false);
        }
    });
});
