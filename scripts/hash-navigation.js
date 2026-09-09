const normalizeFragment = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

if (typeof module !== "undefined") module.exports = { normalizeFragment };

if (typeof document !== "undefined") {
    (() => {
        const content = document.getElementById("module-content");

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
            return true;
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
            });
        }, true);

        window.addEventListener("hashchange", scrollCurrentHash);

        if (window.location.hash && !scrollCurrentHash()) {
            const observer = new MutationObserver(() => {
                if (scrollCurrentHash()) observer.disconnect();
            });
            observer.observe(content, { childList: true, subtree: true });
        }
    })();
}
