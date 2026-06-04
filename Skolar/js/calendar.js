/* ============================================
   SKOLAR — CALENDAR PAGE JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────
  // EVENT DATA
  // ──────────────────────────────────

  // Events keyed by "YYYY-MM-DD" for easy lookup
  const events = [
    // Week of June 1-5, 2026 (matches mockup)
    { date: '2026-06-02', student: 'Maria Lim',     subject: 'Filipino', startHour: 8,  duration: 1, color: 'purple' },
    { date: '2026-06-03', student: 'Mary Santos',    subject: 'Math',     startHour: 10, duration: 1, color: 'orange' },
    { date: '2026-06-04', student: 'Jane Santos',    subject: 'Math',     startHour: 14, duration: 1, color: 'gray'   },
    { date: '2026-06-03', student: 'Ronald Stone',   subject: 'Writing',  startHour: 17, duration: 1, color: 'pink'   },

    // Week of June 8-12, 2026
    { date: '2026-06-08', student: 'Sara Plattos',   subject: 'Filipino', startHour: 9,  duration: 1, color: 'purple' },
    { date: '2026-06-09', student: 'Maria Lim',      subject: 'Math',     startHour: 10, duration: 1, color: 'orange' },
    { date: '2026-06-10', student: 'Camille Bill',   subject: 'Writing',  startHour: 13, duration: 1, color: 'pink'   },
    { date: '2026-06-11', student: 'Ana Cruz',       subject: 'Science',  startHour: 15, duration: 1, color: 'gray'   },
    { date: '2026-06-12', student: 'Marc Santos',    subject: 'English',  startHour: 8,  duration: 1, color: 'orange' },

    // Week of May 25-29, 2026
    { date: '2026-05-25', student: 'Ronald Stone',   subject: 'Writing',  startHour: 11, duration: 1, color: 'pink'   },
    { date: '2026-05-27', student: 'Ella Torres',    subject: 'Math',     startHour: 14, duration: 1, color: 'orange' },
    { date: '2026-05-28', student: 'Sofia Garcia',   subject: 'Science',  startHour: 9,  duration: 1, color: 'gray'   },
    { date: '2026-05-29', student: 'Miguel Reyes',   subject: 'Filipino', startHour: 16, duration: 1, color: 'purple' },
  ];

  // ──────────────────────────────────
  // STATE
  // ──────────────────────────────────

  // Start on the mockup week: June 1, 2026 (Monday)
  let currentMonday = new Date(2026, 5, 1); // June 1, 2026 is a Monday

  const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]; // 8am-6pm
  const DAY_NAMES = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

  // ──────────────────────────────────
  // DOM REFERENCES
  // ──────────────────────────────────

  const dateRangeEl = document.getElementById('calDateRange');
  const prevBtn     = document.getElementById('calPrev');
  const nextBtn     = document.getElementById('calNext');
  const todayBtn    = document.getElementById('calToday');
  const gridEl      = document.getElementById('calGrid');

  // ──────────────────────────────────
  // HELPERS
  // ──────────────────────────────────

  function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function formatDateKey(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function getWeekDates(monday) {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d);
    }
    return dates;
  }

  function formatDateRange(monday) {
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    const mMonth = monthNames[monday.getMonth()];
    const fMonth = monthNames[friday.getMonth()];
    const mDay = monday.getDate();
    const fDay = friday.getDate();
    const year = friday.getFullYear();

    if (monday.getMonth() === friday.getMonth()) {
      return `${mMonth} ${mDay} - ${fDay}, ${year}`;
    } else {
      return `${mMonth} ${mDay} - ${fMonth} ${fDay}, ${year}`;
    }
  }

  function formatHour(h) {
    if (h === 12) return '12 pm';
    if (h > 12) return `${h - 12} pm`;
    return `${h} am`;
  }

  function getEventsForDate(dateKey) {
    return events.filter(e => e.date === dateKey);
  }

  // ──────────────────────────────────
  // RENDER
  // ──────────────────────────────────

  function render() {
    if (!gridEl || !dateRangeEl) return;

    const weekDates = getWeekDates(currentMonday);
    dateRangeEl.textContent = formatDateRange(currentMonday);

    // Build grid HTML
    let html = '';

    // Header row: empty corner + 5 day headers
    html += '<div class="cal-corner"></div>';
    weekDates.forEach((d, i) => {
      const isToday = formatDateKey(d) === formatDateKey(new Date());
      html += `<div class="cal-header ${isToday ? 'cal-today-col' : ''}">
        <span class="cal-day-name">${DAY_NAMES[i]}</span>
        <span class="cal-day-num ${isToday ? 'cal-today-num' : ''}">${d.getDate()}</span>
      </div>`;
    });

    // Time rows
    HOURS.forEach(hour => {
      // Time label
      html += `<div class="cal-time">${formatHour(hour)}</div>`;

      // 5 day cells for this hour
      weekDates.forEach(d => {
        const dateKey = formatDateKey(d);
        const isToday = dateKey === formatDateKey(new Date());
        const cellEvents = getEventsForDate(dateKey).filter(e => e.startHour === hour);

        html += `<div class="cal-cell ${isToday ? 'cal-today-cell' : ''}">`;
        cellEvents.forEach(ev => {
          html += `<div class="cal-event cal-event-${ev.color}" style="height: ${ev.duration * 100}%;">
            <span class="cal-event-name">${ev.student}</span>
            <span class="cal-event-subject">Subject : ${ev.subject}</span>
          </div>`;
        });
        html += '</div>';
      });
    });

    gridEl.innerHTML = html;
  }

  // Initial render
  render();

  // ──────────────────────────────────
  // NAVIGATION
  // ──────────────────────────────────

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentMonday.setDate(currentMonday.getDate() - 7);
      render();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentMonday.setDate(currentMonday.getDate() + 7);
      render();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      currentMonday = getMonday(new Date());
      render();
    });
  }

  // ──────────────────────────────────
  // SIDEBAR MOBILE TOGGLE
  // ──────────────────────────────────

  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('show');
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (sidebarOverlay) sidebarOverlay.classList.toggle('show');
    });
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // ──────────────────────────────────
  // NOTIFICATION DROPDOWN
  // ──────────────────────────────────

  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
      if (!notifBtn.contains(e.target)) {
        notifDropdown.classList.remove('show');
      }
    });
  }

  // ──────────────────────────────────
  // KEYBOARD — ESC
  // ──────────────────────────────────

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
      if (notifDropdown) notifDropdown.classList.remove('show');
    }
  });

});
