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
