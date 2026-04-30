(function () {
    var animated = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
        animated.forEach(function (el) {
            el.classList.add("is-visible");
        });
        return;
    }

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.14,
            rootMargin: "0px 0px -20px 0px",
        },
    );

    animated.forEach(function (el) {
        observer.observe(el);
    });
})();

(function () {
    var snippets = document.querySelectorAll(".prompt-snippet");

    if (!snippets.length) {
        return;
    }

    function setButtonState(button, state) {
        var labels = {
            idle: "Copiază",
            success: "Copiat",
            error: "Încearcă din nou",
        };

        button.dataset.copyState = state;
        button.textContent = labels[state] || labels.idle;
    }

    function copyText(value) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(value);
        }

        return new Promise(function (resolve, reject) {
            var textarea = document.createElement("textarea");
            textarea.value = value;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "fixed";
            textarea.style.top = "-9999px";

            document.body.appendChild(textarea);
            textarea.select();

            try {
                var copied = document.execCommand("copy");
                document.body.removeChild(textarea);

                if (!copied) {
                    reject(new Error("Copy command failed"));
                    return;
                }

                resolve();
            } catch (error) {
                document.body.removeChild(textarea);
                reject(error);
            }
        });
    }

    snippets.forEach(function (snippet) {
        var promptCard = snippet.closest(".prompt-card");

        if (!promptCard) {
            return;
        }

        if (promptCard.querySelector(".copy-snippet__btn")) {
            return;
        }

        var button = document.createElement("button");
        button.type = "button";
        button.className = "copy-snippet__btn";
        button.setAttribute("aria-label", "Copiază prompt-ul");
        button.dataset.copyState = "idle";
        button.textContent = "Copiază";

        promptCard.appendChild(button);

        button.addEventListener("click", function () {
            var content = snippet.innerText.trim();

            if (!content) {
                setButtonState(button, "error");
            } else {
                copyText(content)
                    .then(function () {
                        setButtonState(button, "success");
                    })
                    .catch(function () {
                        setButtonState(button, "error");
                    });
            }

            window.clearTimeout(button._copyResetTimer);
            button._copyResetTimer = window.setTimeout(function () {
                setButtonState(button, "idle");
            }, 1700);
        });
    });
})();
