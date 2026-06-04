/* ============================================
   SKOLAR — SETTINGS PAGE JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────
  // ACCORDION LOGIC
  // ──────────────────────────────────

  const settingHeaders = document.querySelectorAll('.st-header');

  settingHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parentItem = header.parentElement;
      const content = header.nextElementSibling;
      const isOpen = parentItem.classList.contains('open');

      // Optional: Close all others first (exclusive accordion)
      document.querySelectorAll('.st-item').forEach(item => {
        item.classList.remove('open');
        const itemContent = item.querySelector('.st-content');
        if (itemContent) itemContent.style.maxHeight = null;
      });

      // If it wasn't open, open it now
      if (!isOpen) {
        parentItem.classList.add('open');
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // ──────────────────────────────────
  // INTERACTIVE CONTROLS
  // ──────────────────────────────────

  const radios = document.querySelectorAll('input[type="radio"][name="language"]');
  const toggles = document.querySelectorAll('.st-toggle input[type="checkbox"]');
  const signoutBtn = document.getElementById('stSignout');
  const downloadBtn = document.getElementById('stDownload');
  const toast = document.getElementById('stToast');

  // Language Radio Buttons
  radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const langName = e.target.parentElement.textContent.trim();
      showToast(`Language changed to ${langName}`, 'success');
    });
  });

  // Toggle Switches
  toggles.forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const settingName = e.target.closest('.st-control-row').querySelector('.st-control-label').textContent;
      const state = e.target.checked ? 'Enabled' : 'Disabled';
      showToast(`${settingName} ${state}`, 'info');
    });
  });

  // Download Data Button
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      showToast('Preparing your data for download...', 'success');
    });
  }

  // Sign Out Button
  if (signoutBtn) {
    signoutBtn.addEventListener('click', () => {
      showToast('Signing out... Redirecting to login.', 'info');
      // In a real app: window.location.href = 'login.html';
    });
  }

  // ──────────────────────────────────
  // TOAST NOTIFICATION
  // ──────────────────────────────────

  function showToast(message, type) {
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'st-toast show';
    if (type === 'success') toast.classList.add('st-toast-success');
    if (type === 'info')    toast.classList.add('st-toast-info');

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
