  (() => {
    'use strict';
  
    const root = document.documentElement;
    const body = document.body;
  
    const state = {
      themeKey: 'task9-theme',
      menuOpen: false,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      currentTheme: 'system',
      scrollY: 0,
      ticking: false,
      toastTimer: null,
      observer: null,
      inputPersistKeyPrefix: 'task9-form-',
      loadedAt: Date.now()
    };
  
    const qs = (sel, parent = document) => parent.querySelector(sel);
    const qsa = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));
  
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const now = () => new Date();
    const raf = fn => requestAnimationFrame(fn);
  
    function setCssVar(name, value) {
      root.style.setProperty(name, value);
    }
  
    function createEl(tag, className, attrs = {}) {
      const el = document.createElement(tag);
      if (className) el.className = className;
      for (const [key, value] of Object.entries(attrs)) {
        if (key === 'text') el.textContent = value;
        else if (key === 'html') el.innerHTML = value;
        else if (value !== null && value !== undefined) el.setAttribute(key, value);
      }
      return el;
    }
  
    function injectStructuralUI() {
      if (!qs('.scroll-progress')) {
        const progress = createEl('div', 'scroll-progress', {
          'aria-hidden': 'true'
        });
        progress.appendChild(createEl('div', 'scroll-progress__bar'));
        body.prepend(progress);
      }
  
      if (!qs('.toast-stack')) {
        body.appendChild(createEl('div', 'toast-stack', { 'aria-live': 'polite', 'aria-atomic': 'true' }));
      }
  
      if (!qs('#siteLoader')) {
        const loader = createEl('div', 'loader', { id: 'siteLoader' });
        loader.innerHTML = `
          <div class="loader-card">
            <div class="loader-ring" aria-hidden="true"></div>
            <strong>Loading experience…</strong>
            <span class="text-muted">Preparing the interface</span>
          </div>
        `;
        body.prepend(loader);
        window.addEventListener('load', () => {
          loader.classList.add('hidden');
          setTimeout(() => loader.remove(), 600);
        });
      }
  
      if (!qs('.back-to-top')) {
        const btn = createEl('button', 'back-to-top btn--accent', {
          type: 'button',
          'aria-label': 'Back to top',
          text: '↑'
        });
        body.appendChild(btn);
      }
    }
  
    function toast(title, text, type = 'success', duration = 3200) {
      const stack = qs('.toast-stack');
      if (!stack) return;
  
      const node = createEl('div', 'toast', { 'data-type': type });
      node.innerHTML = `
        <div class="toast__icon" aria-hidden="true">${type === 'success' ? '✓' : type === 'warn' ? '!' : '×'}</div>
        <div class="toast__body">
          <p class="toast__title">${escapeHtml(title)}</p>
          <p class="toast__text">${escapeHtml(text)}</p>
        </div>
      `;
      stack.appendChild(node);
      window.setTimeout(() => {
        node.style.opacity = '0';
        node.style.transform = 'translateY(8px)';
        window.setTimeout(() => node.remove(), 260);
      }, duration);
    }
  
    function escapeHtml(str) {
      return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
    }
  
    function getSavedTheme() {
      try {
        return localStorage.getItem(state.themeKey) || 'system';
      } catch {
        return 'system';
      }
    }
  
    function saveTheme(theme) {
      try {
        localStorage.setItem(state.themeKey, theme);
      } catch {}
    }
  
    function resolveTheme(theme) {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return theme;
    }
  
    function applyTheme(theme) {
      state.currentTheme = theme;
      root.setAttribute('data-theme', resolveTheme(theme));
  
      const select = qs('#themeSelect, select[name="theme"]');
      if (select && select.value !== theme) {
        select.value = theme;
      }
  
      try {
        localStorage.setItem('task9-theme-applied', resolveTheme(theme));
      } catch {}
    }
  
    function initThemeSwitcher() {
      const select = qs('#themeSelect, select[name="theme"]');
      const saved = getSavedTheme();
      applyTheme(saved);
  
      if (!select) return;
  
      select.addEventListener('change', () => {
        const theme = select.value;
        saveTheme(theme);
        applyTheme(theme);
        toast('Theme updated', theme === 'system' ? 'System mode activated.' : `Switched to ${theme}.`, 'success', 1800);
      });
    }
  
    function initMobileMenu() {
      const button = qs('.menu-toggle');
      const navList = qs('#navList, .nav__list, .menu, .site-nav__list');
  
      if (!button || !navList) return;
  
      const openMenu = () => {
        navList.classList.add('open');
        button.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
        state.menuOpen = true;
      };
  
      const closeMenu = () => {
        navList.classList.remove('open');
        button.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
        state.menuOpen = false;
      };
  
      button.addEventListener('click', () => {
        state.menuOpen ? closeMenu() : openMenu();
      });
  
      qsa('a', navList).forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth < 901) closeMenu();
        });
      });
  
      document.addEventListener('click', evt => {
        if (window.innerWidth >= 901) return;
        if (!navList.contains(evt.target) && !button.contains(evt.target) && state.menuOpen) {
          closeMenu();
        }
      });
  
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 901) closeMenu();
      });
    }
  
    function initScrollProgress() {
      const bar = qs('.scroll-progress__bar');
      if (!bar) return;
  
      const update = () => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
        bar.style.width = `${clamp(progress, 0, 100)}%`;
      };
  
      window.addEventListener('scroll', () => {
        if (state.ticking) return;
        state.ticking = true;
        raf(() => {
          update();
          state.ticking = false;
        });
      }, { passive: true });
  
      update();
    }
  
    function initBackToTop() {
      const btn = qs('.back-to-top');
      if (!btn) return;
  
      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: state.reducedMotion ? 'auto' : 'smooth' });
      });
  
      const toggle = () => {
        btn.classList.toggle('visible', window.scrollY > 500);
      };
  
      window.addEventListener('scroll', toggle, { passive: true });
      toggle();
    }
  
    function initRevealAnimations() {
      const items = qsa(
        'main, .card, .product-card, .feature-card, .stat-card, .quote-card, .timeline-item, .pricing-card, .faq-item, .hero, .panel, .form-card, .content-card'
      );
  
      items.forEach((item, index) => {
        item.classList.add('fade-in');
        item.classList.add(`stagger-${(index % 5) + 1}`);
      });
  
      if (state.reducedMotion || !('IntersectionObserver' in window)) {
        items.forEach(item => item.classList.add('visible'));
        return;
      }
  
      state.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            state.observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14 });
  
      items.forEach(item => state.observer.observe(item));
    }
  
    function initParallaxTilt() {
      const cards = qsa('.card, .product-card, .feature-card, .pricing-card, .stat-card');
      if (!cards.length || state.reducedMotion) return;
  
      cards.forEach(card => {
        let rect = null;
  
        card.addEventListener('mousemove', e => {
          rect = rect || card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          const rotY = (x - 0.5) * 8;
          const rotX = (0.5 - y) * 8;
          card.style.transform = `perspective(900px) translateY(-4px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        });
  
        card.addEventListener('mouseenter', () => {
          rect = card.getBoundingClientRect();
        });
  
        card.addEventListener('mouseleave', () => {
          rect = null;
          card.style.transform = '';
        });
      });
    }
  
    function initRippleButtons() {
      const buttons = qsa('button, input[type="submit"], .btn, .primary-btn, .secondary-btn, .action-btn');
      buttons.forEach(btn => {
        btn.addEventListener('click', e => {
          const rect = btn.getBoundingClientRect();
          const ripple = createEl('span', 'ripple');
          const size = Math.max(rect.width, rect.height);
          ripple.style.width = ripple.style.height = `${size}px`;
          ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
          ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
          btn.appendChild(ripple);
          window.setTimeout(() => ripple.remove(), 720);
        });
      });
    }
  
    function initSmoothAnchors() {
      qsa('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
          const target = qs(anchor.getAttribute('href'));
          if (!target) return;
          e.preventDefault();
          target.scrollIntoView({ behavior: state.reducedMotion ? 'auto' : 'smooth', block: 'start' });
        });
      });
    }
  
    function inputKey(input) {
      return `${state.inputPersistKeyPrefix}${input.name || input.id || input.type}`;
    }
  
    function setInputValue(input, value) {
      if (input.type === 'checkbox') {
        input.checked = value === 'true';
        return;
      }
      if (input.type === 'radio') {
        input.checked = input.value === value;
        return;
      }
      input.value = value;
    }
  
    function initFormPersistence() {
      const form = qs('form');
      if (!form) return;
  
      const fields = qsa('input, textarea, select', form)
        .filter(el => el.name || el.id);
  
      fields.forEach(field => {
        try {
          const stored = localStorage.getItem(inputKey(field));
          if (stored !== null) {
            setInputValue(field, stored);
          }
        } catch {}
      });
  
      const saveField = field => {
        try {
          if (field.type === 'radio') {
            if (field.checked) localStorage.setItem(inputKey(field), field.value);
          } else if (field.type === 'checkbox') {
            localStorage.setItem(inputKey(field), String(field.checked));
          } else {
            localStorage.setItem(inputKey(field), field.value);
          }
        } catch {}
      };
  
      fields.forEach(field => {
        field.addEventListener('input', () => saveField(field));
        field.addEventListener('change', () => saveField(field));
      });
  
      form.addEventListener('submit', () => {
        fields.forEach(saveField);
        toast('Form saved', 'Your inputs were stored locally before submission.', 'success', 1800);
      });
    }
  
    function initLivePreview() {
      const name = qs('#nimi');
      const email = qs('#email');
      const country = qs('#maa');
      const city = qs('#kaupunki');
      const topic = qs('#aihe');
      const service = qs('#palvelu');
      const message = qs('#viesti');
      const color = qs('#vari');
      const range = qs('#laatu');
      const output = qs('#laatuOut');
      const date = qs('#aloitus');
      const contact = qsa('input[name="yhteys"]');
      const interests = qsa('input[name="kiinnostus[]"]');
      const previewNodes = qsa('[data-preview]');
  
      if (!previewNodes.length && !name && !email && !message) return;
  
      const setPreview = (key, value) => {
        const target = qs(`[data-preview="${key}"]`);
        if (!target) return;
  
        if (target.classList.contains('color-pill')) {
          target.style.background = value || 'linear-gradient(135deg, var(--primary), var(--primary-2))';
          target.textContent = '';
          return;
        }
  
        target.textContent = value && String(value).trim() ? value : '—';
      };
  
      const refresh = () => {
        if (name) setPreview('nimi', name.value);
        if (email) setPreview('email', email.value);
        if (country) setPreview('maa', country.value);
        if (city) setPreview('kaupunki', city.value);
        if (topic) setPreview('aihe', topic.options[topic.selectedIndex]?.textContent || topic.value);
        if (service) setPreview('palvelu', service.options[service.selectedIndex]?.textContent || service.value);
  
        const selectedContact = contact.find(item => item.checked);
        if (selectedContact) setPreview('yhteys', selectedContact.value);
  
        const selectedInterests = interests.filter(item => item.checked).map(item => item.value);
        setPreview('kiinnostus', selectedInterests.length ? selectedInterests.join(', ') : '—');
  
        if (range) {
          setPreview('laatu', range.value);
          if (output) output.textContent = range.value;
        }
  
        if (date) setPreview('aloitus', date.value || '—');
        if (color) setPreview('vari', color.value);
        if (message) setPreview('viesti', message.value.slice(0, 160) || '—');
      };
  
      [name, email, country, city, topic, service, message, color, range, date]
        .filter(Boolean)
        .forEach(el => {
          el.addEventListener('input', refresh);
          el.addEventListener('change', refresh);
        });
  
      contact.forEach(el => el.addEventListener('change', refresh));
      interests.forEach(el => el.addEventListener('change', refresh));
  
      refresh();
    }
  
    function initAutoCountry() {
      const country = qs('#maa');
      if (!country || country.value) return;
  
      const lang = (navigator.language || '').toLowerCase();
      const map = [
        ['fi', 'Suomi'],
        ['sv', 'Ruotsi'],
        ['et', 'Viro'],
        ['nb', 'Norja'],
        ['nn', 'Norja'],
        ['no', 'Norja'],
        ['da', 'Tanska'],
        ['de', 'Saksa'],
        ['fr', 'Ranska'],
        ['es', 'Espanja'],
        ['it', 'Italia'],
        ['pl', 'Puola'],
        ['ru', 'Venäjä'],
        ['en-gb', 'Iso-Britannia'],
        ['en-us', 'Yhdysvallat']
      ];
  
      const found = map.find(([prefix]) => lang.startsWith(prefix));
      country.value = localStorage.getItem('task9-country') || (found ? found[1] : 'Suomi');
    }
  
    function initAutoDate() {
      const date = qs('#aloitus');
      if (!date || date.value) return;
      const d = now();
      const pad = n => String(n).padStart(2, '0');
      date.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }
  
    function initThemeAutoSync() {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => {
        if (getSavedTheme() === 'system') applyTheme('system');
      };
  
      if (media.addEventListener) media.addEventListener('change', onChange);
      else if (media.addListener) media.addListener(onChange);
    }
  
    function initFaq() {
      qsa('.faq-item').forEach(item => {
        const btn = qs('.faq-question', item);
        if (!btn) return;
  
        btn.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
        btn.addEventListener('click', () => {
          const open = item.classList.toggle('open');
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
      });
    }
  
    function initTabs() {
      const tabs = qsa('.tabs');
      tabs.forEach(tabRoot => {
        const buttons = qsa('.tab-button', tabRoot);
        const panels = qsa('.tab-panel', tabRoot);
  
        const activate = id => {
          buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === id));
          panels.forEach(panel => panel.classList.toggle('active', panel.id === id));
        };
  
        buttons.forEach(btn => {
          btn.addEventListener('click', () => activate(btn.dataset.tab));
        });
  
        const initial = buttons.find(btn => btn.classList.contains('active'))?.dataset.tab || buttons[0]?.dataset.tab;
        if (initial) activate(initial);
      });
    }
  
    function initCounters() {
      const counters = qsa('[data-count-to]');
      if (!counters.length) return;
  
      const animate = el => {
        const target = Number(el.dataset.countTo || 0);
        const duration = Number(el.dataset.countDuration || 1200);
        const start = performance.now();
        const initial = Number(el.dataset.countFrom || 0);
        const ease = t => 1 - Math.pow(1 - t, 3);
  
        const tick = time => {
          const p = clamp((time - start) / duration, 0, 1);
          const value = Math.round(initial + (target - initial) * ease(p));
          el.textContent = String(value);
          if (p < 1) requestAnimationFrame(tick);
        };
  
        requestAnimationFrame(tick);
      };
  
      if (!('IntersectionObserver' in window) || state.reducedMotion) {
        counters.forEach(animate);
        return;
      }
  
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
  
      counters.forEach(el => observer.observe(el));
    }
  
    function initSearchFilter() {
      const search = qs('[data-search]');
      if (!search) return;
  
      const targetSelector = search.dataset.searchTarget || '.product-card';
      const items = qsa(targetSelector);
  
      const filter = () => {
        const term = search.value.trim().toLowerCase();
        items.forEach(item => {
          const text = (item.textContent || '').toLowerCase();
          item.style.display = text.includes(term) ? '' : 'none';
        });
      };
  
      search.addEventListener('input', filter);
    }
  
    function initClipboardCopy() {
      qsa('[data-copy]').forEach(btn => {
        btn.addEventListener('click', async () => {
          const text = btn.dataset.copy || '';
          if (!text) return;
          try {
            await navigator.clipboard.writeText(text);
            toast('Copied', 'Text copied to clipboard.', 'success', 1600);
          } catch {
            toast('Copy failed', 'Clipboard access was blocked.', 'warn', 1800);
          }
        });
      });
    }
  
    function initStickyFocus() {
      qsa('input, select, textarea, button').forEach(el => {
        el.addEventListener('focus', () => el.classList.add('is-focused'));
        el.addEventListener('blur', () => el.classList.remove('is-focused'));
      });
    }
  
    function initAutoYear() {
      qsa('[data-year]').forEach(node => {
        node.textContent = String(new Date().getFullYear());
      });
    }
  
    function initGreetBlocks() {
      qsa('[data-greet]').forEach(node => {
        const hour = new Date().getHours();
        const message =
          hour < 6 ? 'Good night' :
          hour < 12 ? 'Good morning' :
          hour < 18 ? 'Good afternoon' :
          'Good evening';
        node.textContent = node.dataset.greet || message;
      });
    }
  
    function initNavActiveIndicators() {
      const current = location.pathname.split('/').pop() || 'index.php';
      qsa('.nav__link, .menu a, .site-nav__link').forEach(link => {
        const href = link.getAttribute('href') || '';
        const normalized = href.split('/').pop();
        if (normalized && normalized === current) {
          const li = link.closest('li');
          if (li) li.classList.add('active');
        }
      });
    }
  
    function initPrintButtonHints() {
      qsa('[data-print]').forEach(btn => {
        btn.addEventListener('click', () => window.print());
      });
    }
  
    function initAnimationClock() {
      qsa('[data-clock]').forEach(node => {
        const update = () => {
          const d = new Date();
          node.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };
        update();
        setInterval(update, 1000);
      });
    }
  
    function initProgressiveCards() {
      qsa('.card, .product-card, .feature-card, .pricing-card').forEach(card => {
        card.addEventListener('mouseenter', () => card.classList.add('hover-glow'));
        card.addEventListener('mouseleave', () => card.classList.remove('hover-glow'));
      });
    }
  
    function initHeroVisuals() {
      qsa('.hero, .hero-banner').forEach(hero => {
        if (!hero.querySelector('.media-frame')) return;
        hero.classList.add('animate-fade-up');
      });
    }
  
    function initImageFallbacks() {
      qsa('img[data-fallback]').forEach(img => {
        img.addEventListener('error', () => {
          const fallback = img.getAttribute('data-fallback');
          if (fallback) img.src = fallback;
        });
      });
    }
  
    function initFormFocusState() {
      const inputs = qsa('input, textarea, select');
      inputs.forEach(input => {
        const wrapper = input.closest('label, .field, .form-field, p');
        if (!wrapper) return;
        input.addEventListener('focus', () => wrapper.classList.add('is-active'));
        input.addEventListener('blur', () => wrapper.classList.remove('is-active'));
      });
    }
  
    function initNavigationHeight() {
      const header = qs('.site-header');
      if (!header) return;
  
      const update = () => {
        const h = header.getBoundingClientRect().height;
        setCssVar('--header-height', `${Math.round(h)}px`);
      };
  
      update();
      window.addEventListener('resize', update);
    }
  
    function initKeyboardEscape() {
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          const navList = qs('#navList, .nav__list, .menu, .site-nav__list');
          const button = qs('.menu-toggle');
          if (navList && button) {
            navList.classList.remove('open');
            button.classList.remove('open');
          }
        }
      });
    }
  
    function initInfoPanels() {
      qsa('[data-info]').forEach(node => {
        const text = node.dataset.info || '';
        if (!text) return;
        node.title = text;
      });
    }
  
    function initMarquee() {
      qsa('[data-marquee]').forEach(node => {
        const text = node.textContent.trim();
        if (!text) return;
        node.setAttribute('aria-hidden', 'true');
      });
    }
  
    function initFancyState() {
      initNavigationHeight();
      initThemeAutoSync();
      initMobileMenu();
      initThemeSwitcher();
      initScrollProgress();
      initBackToTop();
      initRevealAnimations();
      initParallaxTilt();
      initRippleButtons();
      initSmoothAnchors();
      initFormPersistence();
      initLivePreview();
      initAutoCountry();
      initAutoDate();
      initFaq();
      initTabs();
      initCounters();
      initSearchFilter();
      initClipboardCopy();
      initStickyFocus();
      initAutoYear();
      initGreetBlocks();
      initNavActiveIndicators();
      initPrintButtonHints();
      initAnimationClock();
      initProgressiveCards();
      initHeroVisuals();
      initImageFallbacks();
      initFormFocusState();
      initInfoPanels();
      initMarquee();
      injectStructuralUI();
    }
  
    function boot() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFancyState, { once: true });
      } else {
        initFancyState();
      }
    }
  
    boot();
  })();
  
  
  // --- Utility block 01 ---
  function utilBlock1() {
    return {
      index: 1,
      even: false,
      label: `utility-1`,
      value: Math.sin(1) + Math.cos(1)
    };
  }
  
  
  // --- Utility block 02 ---
  function utilBlock2() {
    return {
      index: 2,
      even: true,
      label: `utility-2`,
      value: Math.sin(2) + Math.cos(2)
    };
  }
  
  
  // --- Utility block 03 ---
  function utilBlock3() {
    return {
      index: 3,
      even: false,
      label: `utility-3`,
      value: Math.sin(3) + Math.cos(3)
    };
  }
  
  
  // --- Utility block 04 ---
  function utilBlock4() {
    return {
      index: 4,
      even: true,
      label: `utility-4`,
      value: Math.sin(4) + Math.cos(4)
    };
  }
  
  
  // --- Utility block 05 ---
  function utilBlock5() {
    return {
      index: 5,
      even: false,
      label: `utility-5`,
      value: Math.sin(5) + Math.cos(5)
    };
  }
  
  
  // --- Utility block 06 ---
  function utilBlock6() {
    return {
      index: 6,
      even: true,
      label: `utility-6`,
      value: Math.sin(6) + Math.cos(6)
    };
  }
  
  
  // --- Utility block 07 ---
  function utilBlock7() {
    return {
      index: 7,
      even: false,
      label: `utility-7`,
      value: Math.sin(7) + Math.cos(7)
    };
  }
  
  
  // --- Utility block 08 ---
  function utilBlock8() {
    return {
      index: 8,
      even: true,
      label: `utility-8`,
      value: Math.sin(8) + Math.cos(8)
    };
  }
  
  
  // --- Utility block 09 ---
  function utilBlock9() {
    return {
      index: 9,
      even: false,
      label: `utility-9`,
      value: Math.sin(9) + Math.cos(9)
    };
  }
  
  
  // --- Utility block 10 ---
  function utilBlock10() {
    return {
      index: 10,
      even: true,
      label: `utility-10`,
      value: Math.sin(10) + Math.cos(10)
    };
  }
  
  
  // --- Utility block 11 ---
  function utilBlock11() {
    return {
      index: 11,
      even: false,
      label: `utility-11`,
      value: Math.sin(11) + Math.cos(11)
    };
  }
  
  
  // --- Utility block 12 ---
  function utilBlock12() {
    return {
      index: 12,
      even: true,
      label: `utility-12`,
      value: Math.sin(12) + Math.cos(12)
    };
  }
  
  
  // --- Utility block 13 ---
  function utilBlock13() {
    return {
      index: 13,
      even: false,
      label: `utility-13`,
      value: Math.sin(13) + Math.cos(13)
    };
  }
  
  
  // --- Utility block 14 ---
  function utilBlock14() {
    return {
      index: 14,
      even: true,
      label: `utility-14`,
      value: Math.sin(14) + Math.cos(14)
    };
  }
  
  
  // --- Utility block 15 ---
  function utilBlock15() {
    return {
      index: 15,
      even: false,
      label: `utility-15`,
      value: Math.sin(15) + Math.cos(15)
    };
  }
  
  
  // --- Utility block 16 ---
  function utilBlock16() {
    return {
      index: 16,
      even: true,
      label: `utility-16`,
      value: Math.sin(16) + Math.cos(16)
    };
  }
  
  
  // --- Utility block 17 ---
  function utilBlock17() {
    return {
      index: 17,
      even: false,
      label: `utility-17`,
      value: Math.sin(17) + Math.cos(17)
    };
  }
  
  
  // --- Utility block 18 ---
  function utilBlock18() {
    return {
      index: 18,
      even: true,
      label: `utility-18`,
      value: Math.sin(18) + Math.cos(18)
    };
  }
  
  
  // --- Utility block 19 ---
  function utilBlock19() {
    return {
      index: 19,
      even: false,
      label: `utility-19`,
      value: Math.sin(19) + Math.cos(19)
    };
  }
  
  
  // --- Utility block 20 ---
  function utilBlock20() {
    return {
      index: 20,
      even: true,
      label: `utility-20`,
      value: Math.sin(20) + Math.cos(20)
    };
  }
  
  
  // --- Utility block 21 ---
  function utilBlock21() {
    return {
      index: 21,
      even: false,
      label: `utility-21`,
      value: Math.sin(21) + Math.cos(21)
    };
  }
  
  
  // --- Utility block 22 ---
  function utilBlock22() {
    return {
      index: 22,
      even: true,
      label: `utility-22`,
      value: Math.sin(22) + Math.cos(22)
    };
  }
  
  
  // --- Utility block 23 ---
  function utilBlock23() {
    return {
      index: 23,
      even: false,
      label: `utility-23`,
      value: Math.sin(23) + Math.cos(23)
    };
  }
  
  
  // --- Utility block 24 ---
  function utilBlock24() {
    return {
      index: 24,
      even: true,
      label: `utility-24`,
      value: Math.sin(24) + Math.cos(24)
    };
  }
  
  
  // --- Utility block 25 ---
  function utilBlock25() {
    return {
      index: 25,
      even: false,
      label: `utility-25`,
      value: Math.sin(25) + Math.cos(25)
    };
  }
  
  
  // --- Utility block 26 ---
  function utilBlock26() {
    return {
      index: 26,
      even: true,
      label: `utility-26`,
      value: Math.sin(26) + Math.cos(26)
    };
  }
  
  
  // --- Utility block 27 ---
  function utilBlock27() {
    return {
      index: 27,
      even: false,
      label: `utility-27`,
      value: Math.sin(27) + Math.cos(27)
    };
  }
  
  
  // --- Utility block 28 ---
  function utilBlock28() {
    return {
      index: 28,
      even: true,
      label: `utility-28`,
      value: Math.sin(28) + Math.cos(28)
    };
  }
  
  
  // --- Utility block 29 ---
  function utilBlock29() {
    return {
      index: 29,
      even: false,
      label: `utility-29`,
      value: Math.sin(29) + Math.cos(29)
    };
  }
  
  
  // --- Utility block 30 ---
  function utilBlock30() {
    return {
      index: 30,
      even: true,
      label: `utility-30`,
      value: Math.sin(30) + Math.cos(30)
    };
  }
  
  
  // --- Utility block 31 ---
  function utilBlock31() {
    return {
      index: 31,
      even: false,
      label: `utility-31`,
      value: Math.sin(31) + Math.cos(31)
    };
  }
  
  
  // --- Utility block 32 ---
  function utilBlock32() {
    return {
      index: 32,
      even: true,
      label: `utility-32`,
      value: Math.sin(32) + Math.cos(32)
    };
  }
  
  
  // --- Utility block 33 ---
  function utilBlock33() {
    return {
      index: 33,
      even: false,
      label: `utility-33`,
      value: Math.sin(33) + Math.cos(33)
    };
  }
  
  
  // --- Utility block 34 ---
  function utilBlock34() {
    return {
      index: 34,
      even: true,
      label: `utility-34`,
      value: Math.sin(34) + Math.cos(34)
    };
  }
  
  
  // --- Utility block 35 ---
  function utilBlock35() {
    return {
      index: 35,
      even: false,
      label: `utility-35`,
      value: Math.sin(35) + Math.cos(35)
    };
  }
  
  
  // --- Utility block 36 ---
  function utilBlock36() {
    return {
      index: 36,
      even: true,
      label: `utility-36`,
      value: Math.sin(36) + Math.cos(36)
    };
  }
  
  
  // --- Utility block 37 ---
  function utilBlock37() {
    return {
      index: 37,
      even: false,
      label: `utility-37`,
      value: Math.sin(37) + Math.cos(37)
    };
  }
  
  
  // --- Utility block 38 ---
  function utilBlock38() {
    return {
      index: 38,
      even: true,
      label: `utility-38`,
      value: Math.sin(38) + Math.cos(38)
    };
  }
  
  
  // --- Utility block 39 ---
  function utilBlock39() {
    return {
      index: 39,
      even: false,
      label: `utility-39`,
      value: Math.sin(39) + Math.cos(39)
    };
  }
  
  
  // --- Utility block 40 ---
  function utilBlock40() {
    return {
      index: 40,
      even: true,
      label: `utility-40`,
      value: Math.sin(40) + Math.cos(40)
    };
  }
  
  
  // --- Utility block 41 ---
  function utilBlock41() {
    return {
      index: 41,
      even: false,
      label: `utility-41`,
      value: Math.sin(41) + Math.cos(41)
    };
  }
  
  
  // --- Utility block 42 ---
  function utilBlock42() {
    return {
      index: 42,
      even: true,
      label: `utility-42`,
      value: Math.sin(42) + Math.cos(42)
    };
  }
  
  
  // --- Utility block 43 ---
  function utilBlock43() {
    return {
      index: 43,
      even: false,
      label: `utility-43`,
      value: Math.sin(43) + Math.cos(43)
    };
  }
  
  
  // --- Utility block 44 ---
  function utilBlock44() {
    return {
      index: 44,
      even: true,
      label: `utility-44`,
      value: Math.sin(44) + Math.cos(44)
    };
  }
  
  
  // --- Utility block 45 ---
  function utilBlock45() {
    return {
      index: 45,
      even: false,
      label: `utility-45`,
      value: Math.sin(45) + Math.cos(45)
    };
  }
  
  
  // --- Utility block 46 ---
  function utilBlock46() {
    return {
      index: 46,
      even: true,
      label: `utility-46`,
      value: Math.sin(46) + Math.cos(46)
    };
  }
  
  
  // --- Utility block 47 ---
  function utilBlock47() {
    return {
      index: 47,
      even: false,
      label: `utility-47`,
      value: Math.sin(47) + Math.cos(47)
    };
  }
  
  
  // --- Utility block 48 ---
  function utilBlock48() {
    return {
      index: 48,
      even: true,
      label: `utility-48`,
      value: Math.sin(48) + Math.cos(48)
    };
  }
  
  
  // --- Utility block 49 ---
  function utilBlock49() {
    return {
      index: 49,
      even: false,
      label: `utility-49`,
      value: Math.sin(49) + Math.cos(49)
    };
  }
  
  
  // --- Utility block 50 ---
  function utilBlock50() {
    return {
      index: 50,
      even: true,
      label: `utility-50`,
      value: Math.sin(50) + Math.cos(50)
    };
  }
  
  
  // --- Utility block 51 ---
  function utilBlock51() {
    return {
      index: 51,
      even: false,
      label: `utility-51`,
      value: Math.sin(51) + Math.cos(51)
    };
  }
  
  
  // --- Utility block 52 ---
  function utilBlock52() {
    return {
      index: 52,
      even: true,
      label: `utility-52`,
      value: Math.sin(52) + Math.cos(52)
    };
  }
  
  
  // --- Utility block 53 ---
  function utilBlock53() {
    return {
      index: 53,
      even: false,
      label: `utility-53`,
      value: Math.sin(53) + Math.cos(53)
    };
  }
  
  
  // --- Utility block 54 ---
  function utilBlock54() {
    return {
      index: 54,
      even: true,
      label: `utility-54`,
      value: Math.sin(54) + Math.cos(54)
    };
  }
  
  
  // --- Utility block 55 ---
  function utilBlock55() {
    return {
      index: 55,
      even: false,
      label: `utility-55`,
      value: Math.sin(55) + Math.cos(55)
    };
  }
  
  
  // --- Utility block 56 ---
  function utilBlock56() {
    return {
      index: 56,
      even: true,
      label: `utility-56`,
      value: Math.sin(56) + Math.cos(56)
    };
  }
  
  
  // --- Utility block 57 ---
  function utilBlock57() {
    return {
      index: 57,
      even: false,
      label: `utility-57`,
      value: Math.sin(57) + Math.cos(57)
    };
  }
  
  
  // --- Utility block 58 ---
  function utilBlock58() {
    return {
      index: 58,
      even: true,
      label: `utility-58`,
      value: Math.sin(58) + Math.cos(58)
    };
  }
  
  
  // --- Utility block 59 ---
  function utilBlock59() {
    return {
      index: 59,
      even: false,
      label: `utility-59`,
      value: Math.sin(59) + Math.cos(59)
    };
  }
  
  
  // --- Utility block 60 ---
  function utilBlock60() {
    return {
      index: 60,
      even: true,
      label: `utility-60`,
      value: Math.sin(60) + Math.cos(60)
    };
  }
  
  
  /* Additional small helpers kept separate for readability and to make extension easier. */
  
  function task9FormatNumber(value) {
    return new Intl.NumberFormat('fi-FI').format(value);
  }
  
  function task9Debounce(fn, wait = 150) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), wait);
    };
  }
  
  function task9Throttle(fn, wait = 100) {
    let locked = false;
    return (...args) => {
      if (locked) return;
      locked = true;
      fn(...args);
      setTimeout(() => { locked = false; }, wait);
    };
  }
  
  function task9Clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
  