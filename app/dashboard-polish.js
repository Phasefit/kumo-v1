(function () {
  function injectStyles() {
    if (document.getElementById("kumo-dashboard-polish")) return;

    const style = document.createElement("style");
    style.id = "kumo-dashboard-polish";
    style.textContent = `
      #home-view .topbar {
        align-items: flex-start;
        margin-bottom: 20px;
      }

      #home-view .level-chip {
        min-width: 220px;
        padding: 9px 12px;
        border: 1px solid rgba(49, 93, 82, 0.12);
        border-radius: 14px;
        background: rgba(255, 253, 248, 0.76);
        box-shadow: 0 8px 24px rgba(51, 66, 57, 0.06);
      }

      #home-view .level-chip > span:first-child {
        font-weight: 600;
        color: var(--ink);
      }

      #home-view .level-chip > span:last-child {
        min-width: 48px;
        font-weight: 700;
        color: var(--coral-dark);
        text-align: right;
      }

      #home-view .mini-progress {
        flex: 1;
        width: auto;
        height: 7px;
        background: #e7e1d6;
      }

      #home-view .mini-progress i {
        background: linear-gradient(90deg, var(--coral), var(--gold));
      }

      #home-view .hero {
        min-height: 365px;
      }

      #home-view .hero .primary-button {
        min-height: 48px;
        padding-inline: 20px;
        box-shadow: 0 10px 24px rgba(18, 38, 33, 0.14);
      }

      #home-view .stats-grid {
        margin-top: 18px;
      }

      #home-view .stat-card {
        min-height: 92px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      #home-view .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 14px 32px rgba(51, 66, 57, 0.09);
      }

      #home-view .section-heading {
        margin-top: 42px;
        margin-bottom: 18px;
      }

      #home-view .lesson-total {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 7px 11px;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: var(--paper);
        color: var(--muted);
        font-size: 12px;
      }

      #home-view .lesson-total b {
        color: var(--green-dark);
      }

      #home-view .lesson-grid {
        position: relative;
      }

      #home-view .lesson-grid::before {
        content: "";
        position: absolute;
        top: 34px;
        left: 10%;
        right: 10%;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--line), transparent);
        pointer-events: none;
      }

      #home-view .lesson-card {
        position: relative;
        z-index: 1;
        overflow: hidden;
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
      }

      #home-view .lesson-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 18px 38px rgba(51, 66, 57, 0.11);
      }

      #home-view .lesson-card[data-dashboard-status="active"] {
        border-color: rgba(233, 102, 76, 0.42);
        box-shadow: 0 14px 34px rgba(233, 102, 76, 0.11);
      }

      #home-view .lesson-card[data-dashboard-status="completed"] {
        border-color: rgba(108, 145, 130, 0.42);
      }

      #home-view .lesson-card[data-dashboard-status="completed"] .lesson-cta {
        color: var(--green-dark);
      }

      #home-view .dashboard-status {
        position: absolute;
        top: 14px;
        right: 14px;
        padding: 5px 8px;
        border-radius: 999px;
        background: rgba(247, 242, 232, 0.9);
        color: var(--muted);
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      #home-view .lesson-card[data-dashboard-status="active"] .dashboard-status {
        background: #fae2d9;
        color: var(--coral-dark);
      }

      #home-view .lesson-card[data-dashboard-status="completed"] .dashboard-status {
        background: #e3eee9;
        color: var(--green-dark);
      }

      @media (max-width: 720px) {
        #home-view .level-chip {
          min-width: 0;
          width: 100%;
        }

        #home-view .topbar {
          flex-direction: column;
          gap: 10px;
        }

        #home-view .lesson-grid::before {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function updateLessonStatuses() {
    const home = document.getElementById("home-view");
    if (!home) return;

    const cards = [...home.querySelectorAll(".lesson-card")];
    if (!cards.length) return;

    const completed = Number(document.getElementById("completed-lessons")?.textContent || 0);

    cards.forEach((card, index) => {
      const status = index < completed ? "completed" : index === completed ? "active" : "next";
      card.dataset.dashboardStatus = status;

      let badge = card.querySelector(".dashboard-status");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "dashboard-status";
        badge.setAttribute("aria-hidden", "true");
        card.appendChild(badge);
      }

      badge.textContent = status === "completed" ? "Fullført" : status === "active" ? "Neste steg" : "Kommer";
    });
  }

  function observeProgress() {
    const progress = document.getElementById("completed-lessons");
    if (!progress || progress.dataset.dashboardObserved === "true") return;

    progress.dataset.dashboardObserved = "true";
    new MutationObserver(updateLessonStatuses).observe(progress, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  function init() {
    injectStyles();
    updateLessonStatuses();
    observeProgress();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.KumoDashboardPolish = Object.freeze({ init, updateLessonStatuses });
})();
