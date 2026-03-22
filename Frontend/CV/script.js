document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const progress = document.querySelector("#progress");
  const toast = document.querySelector("#toast");
  const themeToggle = document.querySelector("#themeToggle");
  const nav = document.querySelector(".main-nav");
  const navWrap = document.querySelector(".nav-wrap");
  const hero = document.querySelector(".hero");
  const year = document.querySelector("#year");

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function setYear() {
    if (year) year.textContent = new Date().getFullYear();
  }

  // Theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") body.classList.add("light");

  function updateThemeButton() {
    if (!themeToggle) return;
    const isLight = body.classList.contains("light");
    themeToggle.textContent = isLight ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("light");
      localStorage.setItem("theme", body.classList.contains("light") ? "light" : "dark");
      updateThemeButton();
      showToast(body.classList.contains("light") ? "Light theme enabled" : "Dark theme enabled");
    });
  }

  updateThemeButton();
  setYear();

  // Progress bar
  function updateProgress() {
    if (!progress) return;
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    progress.style.width = `${scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0}%`;
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Smooth local anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });

  // Reveal on scroll
  const revealTargets = document.querySelectorAll(
    ".hero, .section, .project, .entry, .stat, .hero-card, .contact-card, .skill, .badge"
  );

  revealTargets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(i * 45, 420)}ms`;
  });

  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("visible"));
  }

  // Animated counters
  document.querySelectorAll(".stat .num").forEach((el) => {
    const raw = el.textContent.trim();
    const value = parseInt(raw, 10);
    if (Number.isNaN(value) || reduceMotion) return;

    const suffix = raw.replace(/[0-9]/g, "");
    const duration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = `${Math.round(value * eased)}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });

  // Mobile menu button injection
  if (nav && navWrap) {
    const toggle = document.createElement("button");
    toggle.className = "nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Open menu");
    toggle.innerHTML = '<span></span><span></span><span></span>';

    navWrap.prepend(toggle);

    toggle.addEventListener("click", () => {
      navWrap.classList.toggle("nav-open");
      const open = navWrap.classList.contains("nav-open");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navWrap.classList.remove("nav-open");
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) navWrap.classList.remove("nav-open");
    });
  }

  // Active nav item by URL
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === currentPath) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  // Button ripple
  document.querySelectorAll(".btn, .filter-btn, .theme-toggle, .nav-toggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (reduceMotion) return;
      const ripple = document.createElement("span");
      ripple.className = "ripple";

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // Tilt effect
  document.querySelectorAll(".project, .entry, .stat, .section, .hero-card").forEach((card) => {
    if (reduceMotion || !finePointer) return;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      const rotateX = (0.5 - py) * 8;
      const rotateY = (px - 0.5) * 10;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // Hero parallax
  if (hero && !reduceMotion) {
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      hero.style.setProperty("--mx", x.toFixed(3));
      hero.style.setProperty("--my", y.toFixed(3));
    });

    hero.addEventListener("mouseleave", () => {
      hero.style.setProperty("--mx", "0");
      hero.style.setProperty("--my", "0");
    });
  }

  // Project filter
  const filterButtons = document.querySelectorAll("[data-filter]");
  const projects = document.querySelectorAll("[data-tags]");

  if (filterButtons.length && projects.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        projects.forEach((project) => {
          const tags = project.dataset.tags.split(",").map((t) => t.trim());
          const show = filter === "all" || tags.includes(filter);
          project.classList.toggle("hidden", !show);
        });

        showToast(`Filter: ${btn.textContent}`);
      });
    });
  }

  // Project modal
  const modal = document.createElement("div");
  modal.className = "project-modal hidden";
  modal.innerHTML = `
    <div class="project-modal-backdrop"></div>
    <div class="project-modal-card" role="dialog" aria-modal="true" aria-label="Project details">
      <button class="modal-close" type="button" aria-label="Close">×</button>
      <img class="modal-image" alt="">
      <div class="modal-body">
        <div class="project-meta modal-tags"></div>
        <h3 class="modal-title"></h3>
        <p class="modal-text"></p>
        <a class="btn modal-link" href="#" target="_blank" rel="noreferrer">Open project</a>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector(".modal-image");
  const modalTitle = modal.querySelector(".modal-title");
  const modalText = modal.querySelector(".modal-text");
  const modalTags = modal.querySelector(".modal-tags");
  const modalLink = modal.querySelector(".modal-link");

  function openModal(data) {
    modalImg.src = data.image || "";
    modalImg.alt = data.alt || data.title || "Project image";
    modalTitle.textContent = data.title || "Project";
    modalText.textContent = data.text || "";
    modalTags.innerHTML = "";
    (data.tags || []).forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = "meta-chip";
      chip.textContent = tag;
      modalTags.appendChild(chip);
    });
    if (data.link) {
      modalLink.href = data.link;
      modalLink.classList.remove("hidden");
    } else {
      modalLink.classList.add("hidden");
    }
    modal.classList.remove("hidden");
    requestAnimationFrame(() => modal.classList.add("open"));
    body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.remove("open");
    body.classList.remove("modal-open");
    setTimeout(() => modal.classList.add("hidden"), 180);
  }

  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("project-modal-backdrop") || e.target.classList.contains("modal-close")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });

  document.querySelectorAll(".project").forEach((project) => {
    project.style.cursor = "pointer";

    project.addEventListener("click", (e) => {
      const clickedInteractive = e.target.closest("a, button");
      if (clickedInteractive) return;

      const image = project.querySelector("img");
      const titleEl = project.querySelector("h3, h4");
      const textEl = project.querySelector("p");
      const anchor = project.querySelector("a[href]");
      const tags = [...project.querySelectorAll(".meta-chip")].map((n) => n.textContent.trim());

      openModal({
        image: image?.src,
        alt: image?.alt,
        title: titleEl?.textContent.trim(),
        text: textEl?.textContent.trim(),
        link: anchor?.href,
        tags
      });
    });
  });

  // Particles background canvas
  if (!document.querySelector(".particle-canvas")) {
    const canvas = document.createElement("canvas");
    canvas.className = "particle-canvas";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const particles = [];
    const count = reduceMotion ? 0 : Math.min(70, Math.floor(window.innerWidth / 18));
    let w = 0;
    let h = 0;
    let mouseX = 0;
    let mouseY = 0;

    function resize() {
      w = canvas.width = window.innerWidth * devicePixelRatio;
      h = canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    for (let i = 0; i < count; i++) {
      particles.push({
        x: rand(0, window.innerWidth),
        y: rand(0, window.innerHeight),
        r: rand(1.1, 2.8),
        vx: rand(-0.22, 0.22),
        vy: rand(-0.16, 0.16),
        a: rand(0.18, 0.42)
      });
    }

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    window.addEventListener("resize", resize, { passive: true });
    resize();

    function draw() {
      if (reduceMotion) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((p, i) => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pull = Math.max(0, 1 - dist / 240);

        p.x += p.vx + dx * pull * 0.0008;
        p.y += p.vy + dy * pull * 0.0008;

        if (p.x < -20) p.x = window.innerWidth + 20;
        if (p.x > window.innerWidth + 20) p.x = -20;
        if (p.y < -20) p.y = window.innerHeight + 20;
        if (p.y > window.innerHeight + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const ddx = p.x - q.x;
          const ddy = p.y - q.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);

          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(124,156,255,${(1 - d / 130) * 0.08})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(draw);
    }

    draw();
  }

  // Fancy hover highlight on nav and buttons
  document.querySelectorAll(".main-nav a, .btn, .filter-btn").forEach((el) => {
    el.addEventListener("mouseenter", () => showToast(el.textContent.trim().slice(0, 24)));
  });
});