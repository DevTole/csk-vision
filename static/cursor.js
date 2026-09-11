(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    if (reducedMotion || touchDevice) {
        return;
    }

    // CursorlyJS is loaded first; support its common constructor shape when available.
    if (window.Cursorly) {
        try {
            const Cursorly = window.Cursorly.default || window.Cursorly;
            if (typeof Cursorly === "function") {
                new Cursorly({
                    color: "#3f7f50",
                    size: 8,
                    outline: true,
                    outlineColor: "#8bcf9b",
                    outlineSize: 34,
                    smoothness: 0.18
                });
                return;
            }
        } catch (error) {
            console.warn("CursorlyJS could not be initialised; using the local cursor effect.", error);
        }
    }

    const cursor = document.createElement("div");
    const ring = document.createElement("div");
    cursor.className = "cursorly-dot";
    ring.className = "cursorly-ring";
    document.body.append(cursor, ring);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;

    window.addEventListener("pointermove", (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
        cursor.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    }, { passive: true });

    const animate = () => {
        ringX += (targetX - ringX) * 0.16;
        ringY += (targetY - ringY) * 0.16;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        requestAnimationFrame(animate);
    };

    document.querySelectorAll("a, button, .gesture, .process-step, .landing-signal").forEach((element) => {
        element.addEventListener("mouseenter", () => document.body.classList.add("cursorly-hover"));
        element.addEventListener("mouseleave", () => document.body.classList.remove("cursorly-hover"));
    });

    animate();
})();
