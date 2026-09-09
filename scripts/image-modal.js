const getAdjacentIndex = (index, count, offset) => {
    const nextIndex = index + offset;
    return nextIndex >= 0 && nextIndex < count ? nextIndex : -1;
};

if (typeof module !== "undefined") module.exports = { getAdjacentIndex };

if (typeof document !== "undefined") {
    (() => {
        const content = document.getElementById("module-content");
        let activeImage = null;

        const getImages = () => Array.from(content.querySelectorAll("img:not(#modalImg)"));

        const getDescription = (image) => {
            const figure = image.closest("figure");
            const imageBlock = figure?.parentElement?.matches("p, li")
                ? figure.parentElement
                : figure ?? image.closest("p, li");
            let previous = imageBlock?.previousElementSibling;

            while (previous && !previous.matches("p, li, blockquote")) {
                previous = previous.previousElementSibling;
            }

            return previous?.textContent.trim() || image.alt || "Imagen del laboratorio";
        };

        const updateNavigation = (modal) => {
            const images = getImages();
            const index = images.indexOf(activeImage);
            const previous = modal.querySelector("#modalPrevious");
            const next = modal.querySelector("#modalNext");

            previous.disabled = getAdjacentIndex(index, images.length, -1) === -1;
            next.disabled = getAdjacentIndex(index, images.length, 1) === -1;
        };

        const ensureFrame = (modal, caption, modalImage) => {
            let frame = modal.querySelector("#workshopModalFrame");
            if (frame) return frame;

            frame = document.createElement("div");
            frame.id = "workshopModalFrame";
            modalImage.before(frame);
            frame.append(caption, modalImage);
            return frame;
        };

        const syncFrameWidth = (frame, modalImage) => {
            requestAnimationFrame(() => {
                const width = modalImage.getBoundingClientRect().width;
                if (width) frame.style.width = `${width}px`;
            });
        };

        const showImage = (image) => {
            const modal = document.getElementById("modalWindow");
            const modalImage = document.getElementById("modalImg");
            const caption = document.getElementById("modalCaption");
            if (!modal || !modalImage || !caption) return;

            activeImage = image;
            const frame = ensureFrame(modal, caption, modalImage);
            const description = getDescription(image);
            frame.style.removeProperty("width");
            modalImage.addEventListener("load", () => syncFrameWidth(frame, modalImage), { once: true });
            modalImage.src = image.src;
            modalImage.alt = description;
            modalImage.setAttribute("aria-describedby", "modalCaption");
            caption.textContent = description;
            modal.classList.add("show");
            updateNavigation(modal);
            syncFrameWidth(frame, modalImage);
        };

        const addNavigationButton = (modal, id, label, offset) => {
            let button = modal.querySelector(`#${id}`);
            if (button) return button;

            button = document.createElement("button");
            button.className = "workshop-modal-navigation";
            button.id = id;
            button.type = "button";
            button.setAttribute("aria-label", label);
            button.textContent = offset < 0 ? "‹" : "›";
            button.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();

                const images = getImages();
                const index = getAdjacentIndex(images.indexOf(activeImage), images.length, offset);
                if (index !== -1) showImage(images[index]);
            });
            modal.append(button);
            return button;
        };

        const ensureNavigation = () => {
            const modal = document.getElementById("modalWindow");
            if (!modal) return;

            addNavigationButton(modal, "modalPrevious", "Imagen anterior", -1);
            addNavigationButton(modal, "modalNext", "Imagen siguiente", 1);
        };

        content.addEventListener("click", (event) => {
            if (!(event.target instanceof Element)) return;

            const image = event.target.closest("img");
            if (!image || image.id === "modalImg" || !content.contains(image)) return;

            event.preventDefault();
            event.stopImmediatePropagation();
            ensureNavigation();
            showImage(image);
        }, true);

        document.addEventListener("keydown", (event) => {
            const modal = document.getElementById("modalWindow");
            if (!modal?.classList.contains("show")) return;

            if (event.key === "Escape") {
                modal.classList.remove("show");
                return;
            }

            const offset = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
            if (!offset) return;

            const images = getImages();
            const index = getAdjacentIndex(images.indexOf(activeImage), images.length, offset);
            if (index === -1) return;

            event.preventDefault();
            showImage(images[index]);
        });
    })();
}
