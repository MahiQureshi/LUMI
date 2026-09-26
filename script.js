/* =========================================================
   NOVAFLOW — PREMIUM INTERACTION SYSTEM
========================================================= */

"use strict";


/* =========================================================
   1. DOM HELPERS
========================================================= */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* =========================================================
   2. PAGE LOADER
========================================================= */

window.addEventListener("load", () => {

    const loader = $("#pageLoader");

    if (!loader) return;

    setTimeout(() => {
        loader.classList.add("loaded");
    }, 500);

});


/* =========================================================
   3. MOBILE NAVIGATION
========================================================= */

const mobileMenuButton = $("#mobileMenuButton");
const mobileNav = $("#mobileNav");

if (mobileMenuButton && mobileNav) {

    mobileMenuButton.addEventListener("click", () => {

        mobileNav.classList.toggle("open");

        const icon = $("i", mobileMenuButton);

        if (mobileNav.classList.contains("open")) {

            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });


    $$(".mobile-nav-link").forEach(link => {

        link.addEventListener("click", () => {

            mobileNav.classList.remove("open");

            const icon = $("i", mobileMenuButton);

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        });

    });

}


/* =========================================================
   4. ACTIVE NAVIGATION
========================================================= */

const sections = $$("main section[id]");
const desktopNavLinks = $$(".nav-link");
const mobileNavLinks = $$(".mobile-nav-link");

const updateActiveNavigation = () => {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop =
            section.getBoundingClientRect().top;

        if (sectionTop <= 180) {
            currentSection = section.id;
        }

    });


    [...desktopNavLinks, ...mobileNavLinks].forEach(link => {

        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (href === `#${currentSection}`) {
            link.classList.add("active");
        }

    });

};


window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
);

updateActiveNavigation();


/* =========================================================
   5. SMOOTH SCROLLING
========================================================= */

$$('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const targetId =
            link.getAttribute("href");

        if (
            !targetId ||
            targetId === "#"
        ) {
            return;
        }

        const target =
            document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* =========================================================
   6. SCROLL REVEAL
========================================================= */

const revealElements = $$(".reveal");

if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );


    revealElements.forEach(element => {

        revealObserver.observe(element);

    });

} else {

    revealElements.forEach(element => {
        element.classList.add("visible");
    });

}


/* =========================================================
   7. ANIMATED COUNTERS
========================================================= */

const counters = $$(".counter");

const animateCounter = counter => {

    const target =
        Number(counter.dataset.target);

    const duration = 1600;

    const startTime = performance.now();

    const update = currentTime => {

        const elapsed =
            currentTime - startTime;

        const progress =
            Math.min(elapsed / duration, 1);

        const easedProgress =
            1 - Math.pow(1 - progress, 3);

        const value =
            Math.floor(target * easedProgress);

        counter.textContent =
            value.toLocaleString();

        if (progress < 1) {

            requestAnimationFrame(update);

        } else {

            counter.textContent =
                target.toLocaleString();

        }

    };

    requestAnimationFrame(update);

};


if ("IntersectionObserver" in window) {

    const counterObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    animateCounter(entry.target);

                    counterObserver.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.5
            }
        );


    counters.forEach(counter => {

        counterObserver.observe(counter);

    });

} else {

    counters.forEach(counter => {

        counter.textContent =
            Number(counter.dataset.target)
                .toLocaleString();

    });

}


/* =========================================================
   8. THEME SWITCH
========================================================= */

const themeButton = $("#themeButton");

const savedTheme =
    localStorage.getItem("novaflow-theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

}


const updateThemeIcon = () => {

    if (!themeButton) return;

    const icon = $("i", themeButton);

    if (!icon) return;

    if (document.body.classList.contains("dark")) {

        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");

    } else {

        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");

    }

};


updateThemeIcon();


if (themeButton) {

    themeButton.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        const isDark =
            document.body.classList.contains("dark");

        localStorage.setItem(
            "novaflow-theme",
            isDark ? "dark" : "light"
        );

        updateThemeIcon();

        showToast(
            isDark
                ? "Dark mode enabled"
                : "Light mode enabled",
            "success"
        );

    });

}


/* =========================================================
   9. NOTIFICATION PANEL
========================================================= */

const notificationButton =
    $("#notificationButton");

const notificationPanel =
    $("#notificationPanel");

const closeNotification =
    $("#closeNotification");


if (
    notificationButton &&
    notificationPanel
) {

    notificationButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            notificationPanel.classList.toggle(
                "open"
            );

            if (profileDropdown) {
                profileDropdown.classList.remove(
                    "open"
                );
            }

        }
    );

}


if (closeNotification) {

    closeNotification.addEventListener(
        "click",
        () => {

            notificationPanel.classList.remove(
                "open"
            );

        }
    );

}


/* =========================================================
   10. PROFILE DROPDOWN
========================================================= */

const profileButton =
    $("#profileButton");

const profileDropdown =
    $("#profileDropdown");


if (
    profileButton &&
    profileDropdown
) {

    profileButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            profileDropdown.classList.toggle(
                "open"
            );

            if (notificationPanel) {

                notificationPanel.classList.remove(
                    "open"
                );

            }

        }
    );

}


/* =========================================================
   11. CLOSE FLOATING PANELS
========================================================= */

document.addEventListener("click", event => {

    if (
        notificationPanel &&
        !notificationPanel.contains(event.target) &&
        notificationButton &&
        !notificationButton.contains(event.target)
    ) {

        notificationPanel.classList.remove(
            "open"
        );

    }


    if (
        profileDropdown &&
        !profileDropdown.contains(event.target) &&
        profileButton &&
        !profileButton.contains(event.target)
    ) {

        profileDropdown.classList.remove(
            "open"
        );

    }

});


/* =========================================================
   12. MODAL SYSTEM
========================================================= */

const modalOverlay =
    $("#modalOverlay");

const modalTitle =
    $("#modalTitle");

const closeModal =
    $("#closeModal");

const cancelModal =
    $("#cancelModal");

const quickActionForm =
    $("#quickActionForm");


const openModal = title => {

    if (!modalOverlay) return;

    if (modalTitle) {
        modalTitle.textContent = title;
    }

    modalOverlay.classList.add("open");

    document.body.style.overflow = "hidden";

};


const hideModal = () => {

    if (!modalOverlay) return;

    modalOverlay.classList.remove("open");

    document.body.style.overflow = "";

};


if (closeModal) {

    closeModal.addEventListener(
        "click",
        hideModal
    );

}


if (cancelModal) {

    cancelModal.addEventListener(
        "click",
        hideModal
    );

}


if (modalOverlay) {

    modalOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target === modalOverlay
            ) {

                hideModal();

            }

        }
    );

}


/* =========================================================
   13. ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        hideModal();

        if (notificationPanel) {

            notificationPanel.classList.remove(
                "open"
            );

        }

        if (profileDropdown) {

            profileDropdown.classList.remove(
                "open"
            );

        }

    }
);


/* =========================================================
   14. GET STARTED BUTTONS
========================================================= */

const getStartedButton =
    $("#getStartedButton");

const ctaStartButton =
    $("#ctaStartButton");


const startExperience = () => {

    openModal("Create something new");

};


if (getStartedButton) {

    getStartedButton.addEventListener(
        "click",
        startExperience
    );

}


if (ctaStartButton) {

    ctaStartButton.addEventListener(
        "click",
        startExperience
    );

}


/* =========================================================
   15. EXPLORE BUTTON
========================================================= */

const exploreButton =
    $("#exploreButton");

if (exploreButton) {

    exploreButton.addEventListener(
        "click",
        () => {

            const dashboard =
                $("#dashboard");

            if (dashboard) {

                dashboard.scrollIntoView({
                    behavior: "smooth"
                });

            }

            showToast(
                "Welcome to the dashboard",
                "success"
            );

        }
    );

}


/* =========================================================
   16. QUICK ACTIONS
========================================================= */

const quickActions =
    $$(".quick-action-card");


const actionTitles = {

    create:
        "Create something new",

    report:
        "Generate your report",

    share:
        "Share your workspace",

    settings:
        "Customize preferences"

};


quickActions.forEach(action => {

    action.addEventListener(
        "click",
        () => {

            const actionType =
                action.dataset.action;

            const title =
                actionTitles[actionType] ||
                "Quick action";

            if (actionType === "create") {

                openModal(title);

                return;

            }


            if (actionType === "report") {

                showToast(
                    "Generating your latest report...",
                    "loading"
                );

                setTimeout(() => {

                    showToast(
                        "Your report is ready!",
                        "success"
                    );

                }, 1300);

                return;

            }


            if (actionType === "share") {

                copyShareLink();

                return;

            }


            if (actionType === "settings") {

                showToast(
                    "Preferences opened",
                    "success"
                );

                return;

            }

        }
    );

});


/* =========================================================
   17. FORM VALIDATION
========================================================= */

if (quickActionForm) {

    quickActionForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const nameInput =
                $("#itemName");

            const typeInput =
                $("#itemType");

            const descriptionInput =
                $("#itemDescription");

            const nameError =
                $("#nameError");


            const name =
                nameInput
                    ? nameInput.value.trim()
                    : "";

            const type =
                typeInput
                    ? typeInput.value
                    : "";


            if (!name) {

                if (nameError) {

                    nameError.textContent =
                        "Please enter a name.";

                }

                if (nameInput) {
                    nameInput.focus();
                }

                return;

            }


            if (name.length < 3) {

                if (nameError) {

                    nameError.textContent =
                        "Name must contain at least 3 characters.";

                }

                if (nameInput) {
                    nameInput.focus();
                }

                return;

            }


            if (nameError) {

                nameError.textContent = "";

            }


            if (!type) {

                showToast(
                    "Please select a category.",
                    "error"
                );

                if (typeInput) {
                    typeInput.focus();
                }

                return;

            }


            const submitButton =
                $('button[type="submit"]', quickActionForm);


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Creating...
                `;

            }


            setTimeout(() => {

                hideModal();

                quickActionForm.reset();

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.innerHTML = `
                        Create
                        <i class="fa-solid fa-arrow-right"></i>
                    `;

                }


                showToast(
                    `"${name}" created successfully!`,
                    "success"
                );

            }, 1000);

        }
    );

}


/* =========================================================
   18. INPUT LIVE VALIDATION
========================================================= */

const itemName =
    $("#itemName");

const itemNameError =
    $("#nameError");


if (itemName) {

    itemName.addEventListener(
        "input",
        () => {

            const value =
                itemName.value.trim();

            if (!itemNameError) return;

            if (!value) {

                itemNameError.textContent =
                    "Name is required.";

            } else if (value.length < 3) {

                itemNameError.textContent =
                    "Use at least 3 characters.";

            } else {

                itemNameError.textContent = "";

            }

        }
    );

}


/* =========================================================
   19. DASHBOARD FILTERS
========================================================= */

const filterButtons =
    $$(".filter-button");


filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(btn => {

                btn.classList.remove("active");

            });

            button.classList.add("active");

            const selectedPeriod =
                button.dataset.filter;

            updateDashboard(selectedPeriod);

        }
    );

});


const dashboardData = {

    week: {
        value: "86.4%",
        growth: "14.8%"
    },

    month: {
        value: "89.7%",
        growth: "18.2%"
    },

    year: {
        value: "94.1%",
        growth: "27.6%"
    }

};


const updateDashboard = period => {

    const data =
        dashboardData[period];

    if (!data) return;

    const value =
        $(".analytics-value strong");

    const growth =
        $(".analytics-value .positive");

    if (value) {

        value.textContent =
            data.value;

    }

    if (growth) {

        growth.innerHTML = `
            <i class="fa-solid fa-arrow-up"></i>
            ${data.growth}
        `;

    }

    showToast(
        `Dashboard updated for ${period}.`,
        "success"
    );

};


/* =========================================================
   20. COPY SHARE LINK
========================================================= */

const copyShareLink = async () => {

    const shareURL =
        window.location.href;

    try {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(
                shareURL
            );

        } else {

            const textarea =
                document.createElement("textarea");

            textarea.value = shareURL;

            textarea.style.position = "fixed";
            textarea.style.opacity = "0";

            document.body.appendChild(textarea);

            textarea.select();

            document.execCommand("copy");

            textarea.remove();

        }

        showToast(
            "Workspace link copied!",
            "success"
        );

    } catch (error) {

        showToast(
            "Unable to copy the link.",
            "error"
        );

    }

};


/* =========================================================
   21. TOAST SYSTEM
========================================================= */

const toastContainer =
    $("#toastContainer");


const showToast = (
    message,
    type = "success"
) => {

    if (!toastContainer) return;


    const toast =
        document.createElement("div");

    toast.className =
        "toast";


    let icon = "fa-circle-check";

    let iconClass = "green";


    if (type === "error") {

        icon = "fa-circle-exclamation";
        iconClass = "red";

    }


    if (type === "loading") {

        icon = "fa-spinner fa-spin";
        iconClass = "blue";

    }


    if (type === "warning") {

        icon = "fa-triangle-exclamation";
        iconClass = "yellow";

    }


    toast.innerHTML = `

        <div class="toast-icon ${iconClass}">
            <i class="fa-solid ${icon}"></i>
        </div>

        <div class="toast-content">

            <strong>
                ${type === "error"
                    ? "Something went wrong"
                    : type === "loading"
                        ? "Please wait"
                        : "Success"}
            </strong>

            <span>
                ${message}
            </span>

        </div>

        <button
            class="close-button toast-close"
            aria-label="Close notification"
        >
            <i class="fa-solid fa-xmark"></i>
        </button>

    `;


    toastContainer.appendChild(toast);


    const closeButton =
        $(".toast-close", toast);


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                removeToast(toast);

            }
        );

    }


    if (type !== "loading") {

        setTimeout(() => {

            removeToast(toast);

        }, 4000);

    }


    return toast;

};


const removeToast = toast => {

    if (!toast) return;

    toast.classList.add("removing");

    setTimeout(() => {

        toast.remove();

    }, 300);

};


/* =========================================================
   22. NOTIFICATION ITEMS
========================================================= */

$$(".notification-item").forEach(item => {

    item.addEventListener(
        "click",
        () => {

            item.classList.remove("unread");

            showToast(
                "Notification marked as read.",
                "success"
            );

        }
    );

});


/* =========================================================
   23. PROFILE LOGOUT
========================================================= */

const logoutButton =
    $("#logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            if (profileDropdown) {

                profileDropdown.classList.remove(
                    "open"
                );

            }

            showToast(
                "You have been signed out.",
                "success"
            );

        }
    );

}


/* =========================================================
   24. VIEW ALL FEATURES
========================================================= */

const viewAllFeatures =
    $("#viewAllFeatures");


if (viewAllFeatures) {

    viewAllFeatures.addEventListener(
        "click",
        () => {

            const features =
                $("#features");

            if (!features) return;

            features.scrollIntoView({
                behavior: "smooth"
            });

            showToast(
                "You're viewing all available features.",
                "success"
            );

        }
    );

}


/* =========================================================
   25. SCROLL TO TOP
========================================================= */

const scrollTopButton =
    $("#scrollTopButton");


const updateScrollButton = () => {

    if (!scrollTopButton) return;

    if (window.scrollY > 500) {

        scrollTopButton.classList.add(
            "visible"
        );

    } else {

        scrollTopButton.classList.remove(
            "visible"
        );

    }

};


window.addEventListener(
    "scroll",
    updateScrollButton,
    { passive: true }
);


if (scrollTopButton) {

    scrollTopButton.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =========================================================
   26. NAVBAR SHADOW ON SCROLL
========================================================= */

const navbar =
    $(".navbar");


window.addEventListener(
    "scroll",
    () => {

        if (!navbar) return;

        if (window.scrollY > 40) {

            navbar.style.boxShadow =
                "0 18px 50px rgba(15,23,42,0.12)";

        } else {

            navbar.style.boxShadow =
                "0 15px 45px rgba(15,23,42,0.07)";

        }

    },
    { passive: true }
);


/* =========================================================
   27. BUTTON RIPPLE EFFECT
========================================================= */

const rippleButtons =
    $$(
        ".primary-button, " +
        ".secondary-button, " +
        ".outline-button, " +
        ".quick-action-card"
    );


rippleButtons.forEach(button => {

    button.addEventListener(
        "click",
        event => {

            const rect =
                button.getBoundingClientRect();

            const ripple =
                document.createElement("span");

            ripple.style.position =
                "absolute";

            ripple.style.width =
                "10px";

            ripple.style.height =
                "10px";

            ripple.style.borderRadius =
                "50%";

            ripple.style.background =
                "rgba(255,255,255,0.35)";

            ripple.style.pointerEvents =
                "none";

            ripple.style.left =
                `${event.clientX - rect.left}px`;

            ripple.style.top =
                `${event.clientY - rect.top}px`;

            ripple.style.transform =
                "translate(-50%, -50%) scale(0)";

            ripple.style.animation =
                "buttonRipple 0.6s ease-out";

            if (
                getComputedStyle(button)
                    .position === "static"
            ) {

                button.style.position =
                    "relative";

            }

            button.style.overflow =
                "hidden";

            button.appendChild(ripple);

            setTimeout(() => {

                ripple.remove();

            }, 650);

        }
    );

});


/* =========================================================
   28. ADD RIPPLE KEYFRAME
========================================================= */

const rippleStyle =
    document.createElement("style");

rippleStyle.textContent = `

    @keyframes buttonRipple {

        from {
            transform:
                translate(-50%, -50%)
                scale(0);

            opacity: 1;
        }

        to {
            transform:
                translate(-50%, -50%)
                scale(25);

            opacity: 0;
        }

    }

`;

document.head.appendChild(rippleStyle);


/* =========================================================
   29. FEATURE CARD TILT
========================================================= */

const tiltCards =
    $$(".feature-card");


tiltCards.forEach(card => {

    card.addEventListener(
        "mousemove",
        event => {

            if (window.innerWidth < 900) {
                return;
            }

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;

            const rotateX =
                ((y - centerY) / centerY) * -2;

            const rotateY =
                ((x - centerX) / centerX) * 2;

            card.style.transform =
                `perspective(800px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-6px)`;

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform = "";

        }
    );

});


/* =========================================================
   30. MAGNETIC HERO BUTTON
========================================================= */

const magneticButton =
    $("#getStartedButton");


if (magneticButton) {

    magneticButton.addEventListener(
        "mousemove",
        event => {

            if (window.innerWidth < 900) {
                return;
            }

            const rect =
                magneticButton.getBoundingClientRect();

            const x =
                event.clientX -
                rect.left -
                rect.width / 2;

            const y =
                event.clientY -
                rect.top -
                rect.height / 2;

            magneticButton.style.transform =
                `translate(
                    ${x * 0.12}px,
                    ${y * 0.12}px
                )`;

        }
    );


    magneticButton.addEventListener(
        "mouseleave",
        () => {

            magneticButton.style.transform = "";

        }
    );

}


/* =========================================================
   31. KEYBOARD ACCESSIBILITY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            document.activeElement &&
            document.activeElement.classList
        ) {

            const element =
                document.activeElement;

            if (
                element.classList.contains(
                    "quick-action-card"
                )
            ) {

                element.click();

            }

        }

    }
);


/* =========================================================
   32. ONLINE / OFFLINE STATUS
========================================================= */

const updateConnectionStatus = () => {

    if (navigator.onLine) {

        showToast(
            "Connection restored.",
            "success"
        );

    } else {

        showToast(
            "You are currently offline.",
            "warning"
        );

    }

};


window.addEventListener(
    "online",
    updateConnectionStatus
);


window.addEventListener(
    "offline",
    updateConnectionStatus
);


/* =========================================================
   33. DOUBLE CLICK PROTECTION
========================================================= */

const protectedButtons =
    $$(
        ".primary-button, " +
        ".secondary-button"
    );


protectedButtons.forEach(button => {

    button.addEventListener(
        "dblclick",
        event => {

            event.preventDefault();

        }
    );

});


/* =========================================================
   34. PREVENT EMPTY DEMO LINKS
========================================================= */

$$('a[href="#"]').forEach(link => {

    link.addEventListener(
        "click",
        event => {

            event.preventDefault();

            showToast(
                "This section is ready to connect to your backend.",
                "loading"
            );

        }
    );

});


/* =========================================================
   35. INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateActiveNavigation();

        updateScrollButton();

        updateThemeIcon();

        console.log(
            "%cNovaFlow initialized successfully.",
            "font-weight:bold;color:#0284c7;"
        );

    }
);
