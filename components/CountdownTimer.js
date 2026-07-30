(function () {
  class CountdownTimer {
    constructor(
      element,
      labels = { left: "left", overdue: "Overdue" },
    ) {
      this.element = element;
      this.labels = labels;
      this.dueAt = null;
      this.intervalId = null;
    }

    setDueAt(dueAt) {
      this.stop();
      this.dueAt = dueAt;

      if (!dueAt) {
        this.hide();
        return;
      }

      this.render();
      this.intervalId = window.setInterval(() => this.render(), 60_000);
    }

    render() {
      const text = window.formatRemainingTime(this.dueAt, this.labels);
      if (!text) {
        this.hide();
        return;
      }

      this.element.textContent = text;
      this.element.setAttribute("aria-label", text);
      this.element.classList.remove("hidden");
    }

    hide() {
      this.element.textContent = "";
      this.element.removeAttribute("aria-label");
      this.element.classList.add("hidden");
    }

    stop() {
      if (this.intervalId !== null) {
        window.clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }

    destroy() {
      this.stop();
      this.dueAt = null;
      this.hide();
    }
  }

  window.CountdownTimer = CountdownTimer;
})();
