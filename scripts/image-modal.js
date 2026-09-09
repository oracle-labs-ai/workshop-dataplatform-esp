const getAdjacentIndex = (index, count, offset) => {
    const nextIndex = index + offset;
    return nextIndex >= 0 && nextIndex < count ? nextIndex : -1;
};

const getStepDescription = (alt) => alt.startsWith("Paso: ") ? alt.slice(6).trim() : "";

if (typeof module !== "undefined") module.exports = { getAdjacentIndex, getStepDescription };

if (typeof document !== "undefined") {
    (() => {
        const content = document.getElementById("module-content");
        let activeImage = null;
        let captionWidthObserver = null;

        const getImages = () => Array.from(content.querySelectorAll("img:not(#modalImg)"));

        const addStepDescriptions = () => {
            getImages().forEach((image) => {
                const description = getStepDescription(image.alt);
                if (!description || image.dataset.workshopStepDescription) return;

                const descriptionElement = document.createElement("p");
                descriptionElement.className = "workshop-image-description";
                descriptionElement.textContent = description;
                (image.closest("figure") ?? image).before(descriptionElement);
                image.dataset.workshopStepDescription = "true";
            });
        };

        const getDescription = (image) => {
            const figure = image.closest("figure");
            const figureCaption = figure?.querySelector("figcaption")?.textContent.trim();
            const textBlock = figure?.parentElement?.matches("p, li")
                ? figure.parentElement
                : image.parentElement?.matches("p, li") ? image.parentElement : null;
            const imageBlock = textBlock ?? figure ?? image.closest("p, li");
            const anchor = figure ?? image;
            let inlineText = "";

            if (textBlock) {
                const range = document.createRange();
                range.selectNodeContents(textBlock);
                range.setEndBefore(anchor);
                inlineText = range.toString().trim();
            }
            let previous = imageBlock?.previousElementSibling;

            while (previous && !previous.matches("p, li, blockquote, ol, ul")) {
                previous = previous.previousElementSibling;
            }

            const previousText = previous?.matches("ol, ul")
                ? previous.lastElementChild?.textContent.trim()
                : previous?.textContent.trim();

            return inlineText || figureCaption || previousText || image.alt || "Imagen del laboratorio";
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
            frame.append(caption);
            const media = document.createElement("div");
            media.id = "workshopModalMedia";
            media.append(modalImage);
            frame.append(media);
            return frame;
        };

        const syncCaptionWidth = (modalImage) => {
            const frame = modalImage.closest("#workshopModalFrame");
            const { width } = modalImage.getBoundingClientRect();
            if (!frame) return;

            if (width) frame.querySelector("#modalCaption")?.style.setProperty("--modal-image-width", `${width}px`);
        };

        const observeCaptionWidth = (modalImage) => {
            if (captionWidthObserver) return;

            const sync = () => syncCaptionWidth(modalImage);
            captionWidthObserver = new ResizeObserver(sync);
            captionWidthObserver.observe(modalImage);
            modalImage.addEventListener("load", sync);
        };

        const showImage = (image) => {
            const modal = document.getElementById("modalWindow");
            const modalImage = document.getElementById("modalImg");
            const caption = document.getElementById("modalCaption");
            if (!modal || !modalImage || !caption) return;

            preserveModalUntilClosed();
            activeImage = image;
            ensureFrame(modal, caption, modalImage);
            ensureNavigation(modal);
            const description = getDescription(image);
            modalImage.src = image.src;
            modalImage.alt = description;
            modalImage.setAttribute("aria-describedby", "modalCaption");
            caption.textContent = description;
            modal.classList.add("show");
            observeCaptionWidth(modalImage);
            syncCaptionWidth(modalImage);
            updateNavigation(modal);
        };

        const returnToActiveImage = () => {
            setTimeout(() => activeImage?.scrollIntoView({ behavior: "smooth", block: "center" }));
        };

        const preserveModalUntilClosed = () => {
            const modal = document.getElementById("modalWindow");
            if (!modal || modal.dataset.workshopDismissalBehavior) return;

            modal.dataset.workshopDismissalBehavior = "true";
            modal.addEventListener("click", (event) => {
                if (!(event.target instanceof Element)
                    || !event.target.closest("#modalClose, .workshop-modal-navigation")) {
                    event.stopImmediatePropagation();
                }
            }, true);
        };

        document.addEventListener("click", (event) => {
            if (event.target instanceof Element && event.target.closest("#modalClose")) {
                returnToActiveImage();
            }
        }, true);

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
            (modal.querySelector("#workshopModalMedia") ?? modal).append(button);
            return button;
        };

        const ensureNavigation = (modal) => {
            addNavigationButton(modal, "modalPrevious", "Imagen anterior", -1);
            addNavigationButton(modal, "modalNext", "Imagen siguiente", 1);
        };

        content.addEventListener("click", (event) => {
            if (!(event.target instanceof Element)) return;

            const image = event.target.closest("img");
            if (!image || image.id === "modalImg" || !content.contains(image)) return;

            event.preventDefault();
            event.stopImmediatePropagation();
            showImage(image);
        }, true);

        new MutationObserver(addStepDescriptions).observe(content, { childList: true, subtree: true });
        addStepDescriptions();

        document.addEventListener("keydown", (event) => {
            const modal = document.getElementById("modalWindow");
            if (!modal?.classList.contains("show")) return;

            if (event.key === "Escape") {
                modal.classList.remove("show");
                returnToActiveImage();
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
