(() => {
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.getElementById("site-nav-list");

  if (!navToggle || !navList) return;

  function setOpen(open) {
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navList.classList.toggle("is-open", open);
  }

  function isOpen() {
    return navToggle.getAttribute("aria-expanded") === "true";
  }

  function toggleOpen() {
    setOpen(!isOpen());
  }

  navToggle.addEventListener("click", toggleOpen);
  navToggle.addEventListener(
    "touchend",
    (e) => {
      // iOS Safari sometimes delays click; ensure toggle works reliably.
      e.preventDefault();
      toggleOpen();
    },
    { passive: false },
  );

  document.addEventListener("click", (e) => {
    if (!isOpen()) return;
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (navToggle.contains(target) || navList.contains(target)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!isOpen()) return;
    setOpen(false);
    navToggle.focus();
  });

  navList.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.closest("a")) setOpen(false);
  });

  // When moving from mobile -> desktop, ensure the list is visible again.
  const mediaQuery = window.matchMedia("(min-width: 769px)");
  mediaQuery.addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
})();
