(function () {
  function formatRemainingTime(
    targetDate,
    labels = { left: "left", overdue: "Overdue" },
  ) {
    if (!targetDate) return null;

    const targetMs = new Date(targetDate).getTime();
    if (Number.isNaN(targetMs)) return null;

    const diffMs = targetMs - Date.now();
    if (diffMs <= 0) return labels.overdue;

    const totalMinutes = Math.ceil(diffMs / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${labels.left}`;
    }

    if (hours > 0) {
      return `${hours}h ${minutes}m ${labels.left}`;
    }

    return `${minutes}m ${labels.left}`;
  }

  window.formatRemainingTime = formatRemainingTime;
})();
