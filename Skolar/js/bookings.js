/* ============================================
   SKOLAR — BOOKINGS PAGE JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────
  // MOCK DATA
  // ──────────────────────────────────

  const bookingsData = [
    { name: 'Sarah Plattos',   initials: 'SP', avatar: 'av-2', grade: 'Grade 2', subject: 'Math',    schedule: 'June 2 | 2:00 - 3:00 pm',     email: 'Sarah@gmail.com',   contact: '09000000000', status: 'confirmed' },
    { name: 'Ronald Stone',    initials: 'RS', avatar: 'av-5', grade: 'Grade 1', subject: 'English',  schedule: 'June 4 | 5:00 - 6:00 pm',     email: 'Bato@gmail.com',    contact: '09000000000', status: 'pending'   },
    { name: 'Maria Lim',       initials: 'ML', avatar: 'av-1', grade: 'Grade 3', subject: 'Math',    schedule: 'June 5 | 10:00 - 11:00 am',   email: 'Maria@gmail.com',   contact: '09123456789', status: 'confirmed' },
    { name: 'Marc Santos',     initials: 'MS', avatar: 'av-3', grade: 'Grade 2', subject: 'Writing', schedule: 'June 6 | 1:00 - 2:00 pm',     email: 'Marc@gmail.com',    contact: '09234567890', status: 'pending'   },
    { name: 'Camille Bill',    initials: 'CB', avatar: 'av-4', grade: 'Grade 1', subject: 'Filipino',schedule: 'June 7 | 3:00 - 4:00 pm',     email: 'Camille@gmail.com', contact: '09345678901', status: 'done'      },
    { name: 'Ana Cruz',        initials: 'AC', avatar: 'av-6', grade: 'Grade 4', subject: 'Science', schedule: 'June 8 | 9:00 - 10:00 am',    email: 'Ana@gmail.com',     contact: '09456789012', status: 'confirmed' },
    { name: 'John Rivera',     initials: 'JR', avatar: 'av-7', grade: 'Grade 3', subject: 'English', schedule: 'June 9 | 11:00 am - 12:00 pm',email: 'John@gmail.com',    contact: '09567890123', status: 'rejected'  },
    { name: 'Ella Torres',     initials: 'ET', avatar: 'av-8', grade: 'Grade 2', subject: 'Math',    schedule: 'June 10 | 4:00 - 5:00 pm',    email: 'Ella@gmail.com',    contact: '09678901234', status: 'done'      },
    { name: 'Miguel Reyes',    initials: 'MR', avatar: 'av-1', grade: 'Grade 1', subject: 'Filipino',schedule: 'June 11 | 2:00 - 3:00 pm',    email: 'Miguel@gmail.com',  contact: '09789012345', status: 'pending'   },
    { name: 'Sofia Garcia',    initials: 'SG', avatar: 'av-2', grade: 'Grade 3', subject: 'Science', schedule: 'June 12 | 10:00 - 11:00 am',  email: 'Sofia@gmail.com',   contact: '09890123456', status: 'confirmed' },
  ];

  // ──────────────────────────────────
  // DOM REFERENCES
  // ──────────────────────────────────

  const tableBody     = document.getElementById('bookingsTableBody');
  const searchInput   = document.getElementById('bookingsSearch');
  const filterBtns    = document.querySelectorAll('.filter-btn');

  let activeFilter = 'confirmed'; // Confirmed is active by default per mockup

  // ──────────────────────────────────
  // RENDER TABLE
  // ──────────────────────────────────

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getFilteredData() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    return bookingsData.filter(b => {
      // Apply status filter (skip if "all")
      const matchesFilter = activeFilter === 'all' || b.status === activeFilter;

      // Apply search
      const matchesSearch = !query ||
        b.name.toLowerCase().includes(query) ||
        b.subject.toLowerCase().includes(query) ||
        b.grade.toLowerCase().includes(query) ||
        b.email.toLowerCase().includes(query) ||
        b.schedule.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }

  function renderTable() {
    if (!tableBody) return;

    const data = getFilteredData();
    tableBody.innerHTML = '';

    if (data.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="bk-no-results">
            <div class="bk-empty-state">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                <path d="M8 11h6"/>
              </svg>
              <span>No bookings found</span>
            </div>
          </td>
        </tr>`;
      return;
    }

    data.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="student-cell">
            <div class="student-avatar ${b.avatar}">${b.initials}</div>
            <span>${b.name}</span>
          </div>
        </td>
        <td>${b.grade}</td>
        <td>${b.subject}</td>
        <td>${b.schedule}</td>
        <td>${b.email}</td>
        <td>${b.contact}</td>
        <td><span class="badge badge-${b.status}">${capitalize(b.status)}</span></td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Initial render
  renderTable();

  // ──────────────────────────────────
  // SEARCH
  // ──────────────────────────────────

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderTable();
    });
  }

  // ──────────────────────────────────
  // FILTER BUTTONS
  // ──────────────────────────────────

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add to clicked
      btn.classList.add('active');
      // Update filter
      activeFilter = btn.dataset.filter;
      // Re-render
      renderTable();
    });
  });

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
