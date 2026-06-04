/* ============================================
   SKOLAR TUTOR DASHBOARD — APP.JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────
  // MOCK DATA
  // ──────────────────────────────────

  const bookings = [
    { name: 'Maria Lim',      initials: 'ML', avatar: 'av-1', subject: 'Math',     status: 'pending'   },
    { name: 'Sara Plattos',   initials: 'SP', avatar: 'av-2', subject: 'Filipino',  status: 'confirmed' },
    { name: 'Marc Santos',    initials: 'MS', avatar: 'av-3', subject: 'Writing',   status: 'pending'   },
    { name: 'Camille Bill',   initials: 'CB', avatar: 'av-4', subject: 'Writing',   status: 'confirmed' },
    { name: 'Ronald Stone',   initials: 'RS', avatar: 'av-5', subject: 'Math',      status: 'confirmed' },
    // Extra rows for search demonstration
    { name: 'Ana Cruz',       initials: 'AC', avatar: 'av-6', subject: 'Science',   status: 'pending'   },
    { name: 'John Rivera',    initials: 'JR', avatar: 'av-7', subject: 'Math',      status: 'confirmed' },
    { name: 'Ella Torres',    initials: 'ET', avatar: 'av-8', subject: 'English',   status: 'pending'   },
    { name: 'Miguel Reyes',   initials: 'MR', avatar: 'av-1', subject: 'Filipino',  status: 'confirmed' },
    { name: 'Sofia Garcia',   initials: 'SG', avatar: 'av-2', subject: 'Science',   status: 'confirmed' },
    { name: 'Daniel Flores',  initials: 'DF', avatar: 'av-3', subject: 'Writing',   status: 'pending'   },
    { name: 'Isabella Ramos', initials: 'IR', avatar: 'av-4', subject: 'English',   status: 'confirmed' },
    { name: 'Carlos Mendoza', initials: 'CM', avatar: 'av-5', subject: 'Math',      status: 'pending'   },
  ];

  // Only show first 5 by default (matching the mockup), but all are searchable
  const DEFAULT_VISIBLE = 5;

  const reviews = [
    {
      name: 'Camille Bill',
      initials: 'CB',
      avatar: 'rv-1',
      stars: 4,
      status: 'pending',
      text: 'Honestly a really good and funny teacher, she understands me really good when I ask her a question and motivates me to work harder. I definitely recommend :)'
    },
    {
      name: 'Sarah Plattos',
      initials: 'SP',
      avatar: 'rv-2',
      stars: 5,
      status: 'published',
      text: 'Honestly a really good and funny teacher, she understands me really good when I ask her a question and motivates me to work harder. I definitely recommend :)'
    }
  ];


  // ──────────────────────────────────
  // DATE DISPLAY
  // ──────────────────────────────────

  const dateEl = document.getElementById('currentDate');
  if (dateEl) {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);
  }


  // ──────────────────────────────────
  // RENDER BOOKINGS TABLE
  // ──────────────────────────────────

  const bookingsBody = document.getElementById('bookingsBody');

  function renderBookings(data, limit) {
    if (!bookingsBody) return;
    bookingsBody.innerHTML = '';

    const visibleData = limit ? data.slice(0, limit) : data;

    if (visibleData.length === 0) {
      bookingsBody.innerHTML = '<tr><td colspan="3" class="no-results">No matching bookings found</td></tr>';
      return;
    }

    visibleData.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="student-cell">
            <div class="student-avatar ${b.avatar}">${b.initials}</div>
            ${b.name}
          </div>
        </td>
        <td>${b.subject}</td>
        <td><span class="badge badge-${b.status}">${capitalize(b.status)}</span></td>
      `;
      bookingsBody.appendChild(tr);
    });
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Initial render (show first 5)
  renderBookings(bookings, DEFAULT_VISIBLE);


  // ──────────────────────────────────
  // RENDER REVIEWS
  // ──────────────────────────────────

  const reviewsContainer = document.getElementById('reviewsContainer');

  function renderReviews(data) {
    if (!reviewsContainer) return;
    reviewsContainer.innerHTML = '';

    data.forEach(r => {
      const starsSvg = Array.from({ length: 5 }, (_, i) => {
        const filled = i < r.stars;
        return `<svg viewBox="0 0 24 24" width="14" height="14" fill="${filled ? '#F5A623' : 'none'}" stroke="${filled ? '#F5A623' : '#555'}" stroke-width="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>`;
      }).join('');

      const badgeClass = r.status === 'published' ? 'badge-published' : 'badge-pending';

      const card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `
        <div class="review-top">
          <div class="review-user">
            <div class="review-avatar ${r.avatar}">${r.initials}</div>
            <span class="review-name">${r.name}</span>
          </div>
          <span class="badge ${badgeClass}">${capitalize(r.status)}</span>
        </div>
        <div class="review-stars">${starsSvg}</div>
        <p class="review-text">${r.text}</p>
      `;
      reviewsContainer.appendChild(card);
    });
  }

  renderReviews(reviews);


  // ──────────────────────────────────
  // SEARCH FILTER
  // ──────────────────────────────────

  const searchInput = document.getElementById('searchInput');
  if (searchInput && bookingsBody) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      if (!query) {
        renderBookings(bookings, DEFAULT_VISIBLE);
        return;
      }

      const filtered = bookings.filter(b =>
        b.name.toLowerCase().includes(query) ||
        b.subject.toLowerCase().includes(query) ||
        b.status.toLowerCase().includes(query)
      );

      renderBookings(filtered); // Show all matches when searching
    });
  }


  // ──────────────────────────────────
  // SIDEBAR — MOBILE TOGGLE
  // ──────────────────────────────────

  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  function toggleSidebar() {
    if (!sidebar) return;
    sidebar.classList.toggle('open');
    if (sidebarOverlay) sidebarOverlay.classList.toggle('show');
  }

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('show');
  }

  if (hamburger) hamburger.addEventListener('click', toggleSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);


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
  // NEW BOOKING MODAL
  // ──────────────────────────────────

  const modalOverlay = document.getElementById('modalOverlay');
  const newBookingBtn = document.getElementById('newBookingBtn');
  const modalCancel = document.getElementById('modalCancel');
  const modalSubmit = document.getElementById('modalSubmit');

  function openModal() {
    if (modalOverlay) modalOverlay.classList.add('show');
  }
  function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('show');
    // Clear form
    const studentInput = document.getElementById('modalStudent');
    const subjectSelect = document.getElementById('modalSubject');
    const dateInput = document.getElementById('modalDate');
    if (studentInput) studentInput.value = '';
    if (subjectSelect) subjectSelect.value = '';
    if (dateInput) dateInput.value = '';
  }

  if (newBookingBtn) newBookingBtn.addEventListener('click', openModal);
  if (modalCancel) modalCancel.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Submit new booking (adds to table)
  if (modalSubmit) {
    modalSubmit.addEventListener('click', () => {
      const studentName = document.getElementById('modalStudent').value.trim();
      const subject = document.getElementById('modalSubject').value;

      if (!studentName || !subject) {
        // Subtle shake animation on empty fields
        const modal = document.querySelector('.modal');
        modal.style.animation = 'none';
        modal.offsetHeight; // trigger reflow
        modal.style.animation = 'shake 0.4s ease';
        return;
      }

      // Create initials from name
      const parts = studentName.split(' ');
      const initials = parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
      const avatarIdx = (bookings.length % 8) + 1;

      bookings.unshift({
        name: studentName,
        initials: initials,
        avatar: `av-${avatarIdx}`,
        subject: subject,
        status: 'pending'
      });

      // Re-render and close
      const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
      if (searchVal) {
        const filtered = bookings.filter(b =>
          b.name.toLowerCase().includes(searchVal) ||
          b.subject.toLowerCase().includes(searchVal) ||
          b.status.toLowerCase().includes(searchVal)
        );
        renderBookings(filtered);
      } else {
        renderBookings(bookings, DEFAULT_VISIBLE);
      }

      closeModal();

      // Update stat
      const totalEl = document.querySelector('.stat-card:first-child .stat-number');
      if (totalEl) totalEl.textContent = parseInt(totalEl.textContent) + 1;

      const pendingEl = document.querySelector('.stat-card:nth-child(2) .stat-number');
      if (pendingEl) pendingEl.textContent = parseInt(pendingEl.textContent) + 1;
    });
  }


  // ──────────────────────────────────
  // KEYBOARD — ESC TO CLOSE
  // ──────────────────────────────────

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeSidebar();
      if (notifDropdown) notifDropdown.classList.remove('show');
    }
  });

});
