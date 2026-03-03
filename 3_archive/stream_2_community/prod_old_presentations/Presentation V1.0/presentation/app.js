// Stables Presentation v2 – basic dot navigation

document.addEventListener("DOMContentLoaded", () => {
    const dots = Array.from(document.querySelectorAll(".dot"));
    const sections = ["hero", "wallet", "business", "growth", "cta"].map((id) => ({
        id,
        el: document.getElementById(id),
    }));

    function scrollToSection(id) {
        const section = document.getElementById(id);
        if (!section) return;

        section.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function setActiveDot(id) {
        dots.forEach((dot) => {
            dot.classList.toggle("is-active", dot.getAttribute("data-target") === id);
        });
    }

    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            const target = dot.getAttribute("data-target");
            if (!target) return;

            scrollToSection(target);
        });
    });

    // Update active dot based on scroll position
    document.addEventListener("scroll", () => {
        const viewportMiddle = window.innerHeight / 2;
        let bestId = "hero";
        let bestDistance = Infinity;

        sections.forEach(({ id, el }) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const sectionMiddle = rect.top + rect.height / 2;
            const distance = Math.abs(sectionMiddle - viewportMiddle);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestId = id;
            }
        });

        setActiveDot(bestId);
    });
});


