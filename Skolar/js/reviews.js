/* ============================================
   SKOLAR — REVIEWS PAGE JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────
  // MOCK DATA
  // ──────────────────────────────────

  let reviewsData = [
    { id: 1, student: 'Student 1',    date: 'May 13', stars: 5, text: 'Review and comment of the student. The tutor was very patient and helped me understand the difficult math concepts easily.', status: 'pending' },
    { id: 2, student: 'Student 2',    date: 'May 22', stars: 5, text: 'Review and comment of the student. Highly recommended! Great teaching style and very engaging sessions.', status: 'pending' },
    { id: 3, student: 'Sarah Plattos',date: 'May 25', stars: 5, text: 'She is an amazing teacher. My daughter improved her reading skills in just two weeks!', status: 'published' },
    { id: 4, student: 'Maria Lim',    date: 'May 28', stars: 4, text: 'Good session, clear explanations. Just had a slight issue with internet connection at the start.', status: 'published' },
    { id: 5, student: 'John Rivera',  date: 'June 1', stars: 1, text: 'Tutor was 10 minutes late and seemed unprepared for the topic we were supposed to cover.', status: 'rejected' },
    { id: 6, student: 'Camille Bill', date: 'June 2', stars: 5, text: 'Very nice and accommodating! Will definitely book another session next week.', status: 'pending' }
  ];

  // ──────────────────────────────────
  // DOM REFERENCES
  // ──────────────────────────────────

  const reviewsList = document.getElementById('reviewsList');
  const searchInput = document.getElementById('searchInput'); // topbar search
  const filterBtns  = document.querySelectorAll('.rv-filter-btn');
  const toast       = document.getElementById('rvToast');

  let activeFilter = 'all'; // Default filter

  // ──────────────────────────────────
  // RENDER REVIEWS
  // ──────────────────────────────────

  // SVG for a single star (filled or empty)
  function getStarSvg(isFilled) {
    const fill = isFilled ? '#F5A623' : '#E0E5EC'; // Gold or Light Gray
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="${fill}">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>`;
  }

  function renderStars(count) {
    let html = '<div class="rv-stars">';
    for (let i = 1; i <= 5; i++) {
      html += getStarSvg(i <= count);
    }
    html += '</div>';
    return html;
  }

  function getFilteredData() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    return reviewsData.filter(r => {
      // Filter by status
      const matchesFilter = activeFilter === 'all' || r.status === activeFilter;
      // Filter by search (name or text)
      const matchesSearch = !query ||
        r.student.toLowerCase().includes(query) ||
        r.text.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }

  function renderReviews() {
    if (!reviewsList) return;

    const data = getFilteredData();
    reviewsList.innerHTML = '';

    if (data.length === 0) {
      reviewsList.innerHTML = `
        <div class="rv-empty-state">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
          <p>No reviews found</p>
        </div>`;
      return;
    }

    data.forEach(r => {
      const isPending = r.status === 'pending';
      const badgeClass = `rv-badge-${r.status}`;
      const statusText = r.status.charAt(0).toUpperCase() + r.status.slice(1);

      const card = document.createElement('div');
      card.className = 'rv-card';
      
      let html = `
        <div class="rv-card-header">
          <h3 class="rv-student">${r.student}</h3>
          <span class="rv-badge ${badgeClass}">${statusText}</span>
        </div>
        <div class="rv-date">${r.date}</div>
        ${renderStars(r.stars)}
        <p class="rv-text">${r.text}</p>
      `;

      // Add actions if pending
      if (isPending) {
        html += `
          <div class="rv-actions">
            <button class="rv-action-btn rv-btn-approve" data-id="${r.id}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              Approve
            </button>
            <button class="rv-action-btn rv-btn-reject" data-id="${r.id}">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              Reject
            </button>
          </div>
        `;
      }

      card.innerHTML = html;
      reviewsList.appendChild(card);
    });

    // Attach listeners to newly created action buttons
    attachActionListeners();
  }

  // Initial render
  renderReviews();

  // ──────────────────────────────────
  // FILTER BUTTONS
  // ──────────────────────────────────

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add to clicked
      btn.classList.add('active');
      // Update state
      activeFilter = btn.dataset.filter;
      // Re-render
      renderReviews();
    });
  });

  // ──────────────────────────────────
  // SEARCH
  // ──────────────────────────────────

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderReviews();
    });
  }

  // ──────────────────────────────────
  // ACTION HANDLERS (Approve/Reject)
  // ──────────────────────────────────

  function attachActionListeners() {
    const approveBtns = document.querySelectorAll('.rv-btn-approve');
    const rejectBtns  = document.querySelectorAll('.rv-btn-reject');

    approveBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const review = reviewsData.find(r => r.id === id);
        if (review) {
          review.status = 'published';
          showToast(`Review from ${review.student} approved!`, 'success');
          renderReviews();
        }
      });
    });

    rejectBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const review = reviewsData.find(r => r.id === id);
        if (review) {
          review.status = 'rejected';
          showToast(`Review from ${review.student} rejected.`, 'info');
          renderReviews();
        }
      });
    });
  }

  // ──────────────────────────────────
  // TOAST NOTIFICATION
  // ──────────────────────────────────

  function showToast(message, type) {
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'rv-toast show';
    if (type === 'success') toast.classList.add('rv-toast-success');
    if (type === 'info')    toast.classList.add('rv-toast-info');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // ──────────────────────────────────
  // SIDEBAR & NOTIFICATIONS (Shared)
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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
      if (notifDropdown) notifDropdown.classList.remove('show');
    }
  });

});
