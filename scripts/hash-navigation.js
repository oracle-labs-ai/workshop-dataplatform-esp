const normalizeFragment = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const getActiveIndex = (headingTops, activationLine) => headingTops.reduce(
    (activeIndex, top, index) => (top <= activationLine ? index : activeIndex),
    0,
);

if (typeof module !== "undefined") module.exports = { getActiveIndex, normalizeFragment };

if (typeof document !== "undefined") {
    (() => {
        const content = document.getElementById("module-content");
        const toc = document.getElementById("toc");
        let activeFrame = 0;

        const findTarget = (fragment) => {
            const normalized = normalizeFragment(fragment);
            return Array.from(content.querySelectorAll("[id]")).find(
                (element) => normalizeFragment(element.id) === normalized,
            );
        };

        const scrollToFragment = (fragment) => {
            if (!fragment) return false;

            const target = findTarget(fragment);
            if (!target) return false;

            target.scrollIntoView({ block: "start" });
            return target;
        };

        const scrollCurrentHash = () => {
            const fragment = decodeURIComponent(window.location.hash.slice(1));
            const target = scrollToFragment(fragment);
            if (!target) return false;

            if (fragment !== target.id) history.replaceState(null, "", `#${target.id}`);
            scheduleActiveItem();
            return true;
        };

        const updateActiveItem = () => {
            const items = Array.from(toc.querySelectorAll(".toc-item"));
            const sections = items
                .map((item) => ({ item, target: findTarget(item.textContent) }))
                .filter(({ target }) => target);
            if (!sections.length) return;

            const header = document.querySelector(".hol-Header");
            const activationLine = (header?.getBoundingClientRect().height ?? 0) + 16;
            const active = sections[getActiveIndex(
                sections.map(({ target }) => target.getBoundingClientRect().top),
                activationLine,
            )];

            items.forEach((item) => item.classList.remove("active"));
            active.item.classList.add("active");
        };

        const scheduleActiveItem = () => {
            if (activeFrame) return;

            activeFrame = requestAnimationFrame(() => {
                activeFrame = 0;
                updateActiveItem();
            });
        };

        document.addEventListener("click", (event) => {
            if (!(event.target instanceof Element)) return;

            const item = event.target.closest("#toc .toc-item");
            if (!item) return;

            requestAnimationFrame(() => {
                const target = findTarget(item.textContent);
                if (!target) return;

                history.replaceState(null, "", `#${target.id}`);
                target.scrollIntoView({ block: "start" });
                scheduleActiveItem();
            });
        }, true);

        window.addEventListener("hashchange", scrollCurrentHash);
        window.addEventListener("scroll", scheduleActiveItem, { passive: true });

        const sectionObserver = new MutationObserver(scheduleActiveItem);
        sectionObserver.observe(content, { childList: true, subtree: true });
        sectionObserver.observe(toc, { childList: true, subtree: true });
        scheduleActiveItem();

        if (window.location.hash && !scrollCurrentHash()) {
            const observer = new MutationObserver(() => {
                if (scrollCurrentHash()) observer.disconnect();
            });
            observer.observe(content, { childList: true, subtree: true });
        }
    })();
}
