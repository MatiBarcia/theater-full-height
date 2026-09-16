(() => {
  const DEFAULTS = { enabled: true, hideMasthead: false };
  const root = document.documentElement;
  let settings = { ...DEFAULTS };
  let observedFlexy = null;
  let resizeTimer = null;

  // El reproductor de YouTube recalcula el tamaño del <video> al recibir "resize".
  // Se dispara varias veces porque el layout de YouTube se asienta en diferido.
  function refreshPlayerSize() {
    clearTimeout(resizeTimer);
    const fire = () => window.dispatchEvent(new Event("resize"));
    requestAnimationFrame(fire);
    setTimeout(fire, 150);
    resizeTimer = setTimeout(fire, 500);
  }

  function isTheater(flexy) {
    return (
      !!flexy &&
      flexy.isConnected &&
      !flexy.hasAttribute("hidden") &&
      location.pathname === "/watch" &&
      (flexy.hasAttribute("theater") || flexy.hasAttribute("full-bleed-player")) &&
      !flexy.hasAttribute("fullscreen")
    );
  }

  // Refleja el estado en clases de <html> para que el CSS pueda actuar
  // también sobre elementos fuera del reproductor (la barra superior).
  function updateState() {
    const wasTheater = root.classList.contains("ytfh-theater");
    const theater = isTheater(observedFlexy);
    root.classList.toggle("ytfh-enabled", settings.enabled);
    root.classList.toggle("ytfh-hide-masthead", settings.enabled && settings.hideMasthead);
    root.classList.toggle("ytfh-theater", theater);
    if (!theater || !settings.hideMasthead) root.classList.remove("ytfh-masthead-peek");

    // Al entrar en modo teatro, alinear el video con la parte superior.
    if (settings.enabled && theater && !wasTheater && window.scrollY > 0 && window.scrollY < 200) {
      window.scrollTo({ top: 0 });
    }
    refreshPlayerSize();
  }

  // --- Mostrar la barra superior al llevar el mouse al borde superior ---
  const PEEK_HOTZONE_PX = 6; // distancia al borde que la hace aparecer
  const PEEK_HIDE_DELAY_MS = 80;
  let peekHideTimer = null;

  function peekActive() {
    return (
      root.classList.contains("ytfh-hide-masthead") && root.classList.contains("ytfh-theater")
    );
  }

  function masthead() {
    return document.getElementById("masthead-container");
  }

  function showMasthead() {
    clearTimeout(peekHideTimer);
    root.classList.add("ytfh-masthead-peek");
  }

  function scheduleHideMasthead() {
    if (!root.classList.contains("ytfh-masthead-peek")) return;
    clearTimeout(peekHideTimer);
    peekHideTimer = setTimeout(() => {
      // No ocultarla mientras se está escribiendo en el buscador.
      if (masthead()?.contains(document.activeElement)) return;
      root.classList.remove("ytfh-masthead-peek");
    }, PEEK_HIDE_DELAY_MS);
  }

  document.addEventListener(
    "mousemove",
    (e) => {
      if (!peekActive()) return;
      const bar = masthead();
      if (e.clientY <= PEEK_HOTZONE_PX) {
        showMasthead();
      } else if (root.classList.contains("ytfh-masthead-peek")) {
        // Seguir mostrándola mientras el mouse esté sobre la barra o sus menús
        // (por ejemplo, las sugerencias del buscador).
        const barBottom = bar ? bar.getBoundingClientRect().bottom : 56;
        const overBar = e.clientY <= barBottom || bar?.contains(e.target);
        if (overBar) clearTimeout(peekHideTimer);
        else scheduleHideMasthead();
      }
    },
    { passive: true }
  );

  // Si el mouse sale de la ventana por arriba muy rápido, puede no haber un
  // mousemove dentro de la zona; se detecta al salir del documento.
  document.addEventListener("mouseout", (e) => {
    if (peekActive() && !e.relatedTarget && e.clientY <= PEEK_HOTZONE_PX) showMasthead();
  });

  // Al terminar de usar el buscador (pierde el foco), ocultarla de nuevo.
  document.addEventListener("focusout", () => {
    if (peekActive()) setTimeout(scheduleHideMasthead, 0);
  });

  const attrObserver = new MutationObserver(updateState);

  function watchFlexy() {
    if (observedFlexy && observedFlexy.isConnected) return;
    const flexy = document.querySelector("ytd-watch-flexy");
    if (!flexy || flexy === observedFlexy) return;
    attrObserver.disconnect();
    observedFlexy = flexy;
    attrObserver.observe(flexy, {
      attributes: true,
      attributeFilter: ["theater", "full-bleed-player", "fullscreen", "hidden"],
    });
    updateState();
  }

  // YouTube es una SPA: ytd-watch-flexy puede aparecer después de navegar.
  document.addEventListener("yt-navigate-finish", () => {
    watchFlexy();
    updateState();
  });
  document.addEventListener("yt-page-data-updated", watchFlexy);
  new MutationObserver(watchFlexy).observe(root, { childList: true, subtree: true });

  updateState();
  chrome.storage.sync.get(DEFAULTS, (data) => {
    settings = data;
    updateState();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    for (const key of Object.keys(DEFAULTS)) {
      if (changes[key]) settings[key] = changes[key].newValue;
    }
    updateState();
  });
})();
