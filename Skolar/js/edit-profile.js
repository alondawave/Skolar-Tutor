/* ============================================
   SKOLAR — EDIT PROFILE JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────
  // INITIAL STATE / MOCK DATA
  // ──────────────────────────────────

  const initialData = {
    personal: {
      firstName: 'Vannesa',
      lastName: 'Cainong',
      displayTitle: 'Professional Teacher',
      gmail: 'vannesa.cainong@gmail.com',
      phone: '09000000000',
      location: 'Manila, Philippines'
    },
    about: {
      tagline: 'Passionate educator helping students excel',
      bio: 'I am a dedicated professional teacher with 5+ years of classroom experience. I specialize in personalizing curricula to fit individual learning styles, helping my students gain confidence and academic success in Filipino, Math, and English.',
      yearsExp: '5 Years',
      studentsTaught: '50+ Students',
      sessionRate: '$20/hr'
    },
    subjects: ['Filipino', 'Math', 'English']
  };

  // Keep track of current state to allow discard
  let currentData = JSON.parse(JSON.stringify(initialData));

  // ──────────────────────────────────
  // DOM REFERENCES
  // ──────────────────────────────────

  // Personal Info
  const fNameInput = document.getElementById('epFirstName');
  const lNameInput = document.getElementById('epLastName');
  const titleInput = document.getElementById('epDisplayTitle');
  const gmailInput = document.getElementById('epGmail');
  const phoneInput = document.getElementById('epPhone');
  const locInput   = document.getElementById('epLocation');
  
  const btnPersonalSave = document.getElementById('epPersonalSave');
  const btnPersonalDiscard = document.getElementById('epPersonalDiscard');

  // About Me
  const taglineInput = document.getElementById('epTagline');
  const bioInput     = document.getElementById('epBio');
  const expInput     = document.getElementById('epYearsExp');
  const taughtInput  = document.getElementById('epStudentsTaught');
  const rateInput    = document.getElementById('epSessionRate');

  const btnAboutSave = document.getElementById('epAboutSave');
  const btnAboutDiscard = document.getElementById('epAboutDiscard');

  // Subjects Taught
  const subjectInput = document.getElementById('epSubjectInput');
  const btnAddSubject = document.getElementById('epAddSubject');
  const btnSubjectsSave = document.getElementById('epSubjectsSave');
  const btnSubjectsDiscard = document.getElementById('epSubjectsDiscard');
  const subjectsList = document.getElementById('epSubjectsList');

  // Misc
  const toast = document.getElementById('epToast');
  const btnViewProfile = document.getElementById('epViewProfile');

  // Sidebar Profile Card elements
  const sidebarName = document.querySelector('.profile-card .profile-name');
  const sidebarRole = document.querySelector('.profile-card .profile-role');

  // ──────────────────────────────────
  // FORM POPULATION & RENDERING
  // ──────────────────────────────────

  function populatePersonal() {
    if(!fNameInput) return;
    fNameInput.value = currentData.personal.firstName;
    lNameInput.value = currentData.personal.lastName;
    titleInput.value = currentData.personal.displayTitle;
    gmailInput.value = currentData.personal.gmail;
    phoneInput.value = currentData.personal.phone;
    locInput.value   = currentData.personal.location;
  }

  function populateAbout() {
    if(!taglineInput) return;
    taglineInput.value = currentData.about.tagline;
    bioInput.value     = currentData.about.bio;
    expInput.value     = currentData.about.yearsExp;
    taughtInput.value  = currentData.about.studentsTaught;
    rateInput.value    = currentData.about.sessionRate;
  }

  function renderSubjects() {
    if (!subjectsList) return;
    subjectsList.innerHTML = '';
    currentData.subjects.forEach((subj, index) => {
      const pill = document.createElement('div');
      pill.className = 'ep-subject-pill';
      pill.innerHTML = `
        <span>${subj}</span>
        <span class="ep-subject-delete" data-index="${index}">&times;</span>
      `;
      subjectsList.appendChild(pill);
    });

    // Attach delete handlers
    document.querySelectorAll('.ep-subject-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        currentData.subjects.splice(index, 1);
        renderSubjects();
      });
    });
  }

  // Initial fill
  populatePersonal();
  populateAbout();
  renderSubjects();

  // ──────────────────────────────────
  // TOAST NOTIFICATION
  // ──────────────────────────────────

  function showToast(message, type = 'success') {
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'ep-toast show';
    if (type === 'success') toast.classList.add('ep-toast-success');
    if (type === 'info')    toast.classList.add('ep-toast-info');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // ──────────────────────────────────
  // BUTTON HANDLERS
  // ──────────────────────────────────

  if (btnPersonalSave) {
    btnPersonalSave.addEventListener('click', () => {
      // Update state
      currentData.personal.firstName = fNameInput.value;
      currentData.personal.lastName  = lNameInput.value;
      currentData.personal.displayTitle = titleInput.value;
      currentData.personal.gmail     = gmailInput.value;
      currentData.personal.phone     = phoneInput.value;
      currentData.personal.location  = locInput.value;
      
      // Update sidebar dynamically
      if (sidebarName) sidebarName.textContent = `${currentData.personal.firstName} ${currentData.personal.lastName}`;
      if (sidebarRole) sidebarRole.textContent = currentData.personal.displayTitle;

      showToast('Personal information saved!', 'success');
    });
  }

  if (btnPersonalDiscard) {
    btnPersonalDiscard.addEventListener('click', () => {
      populatePersonal();
      showToast('Changes discarded', 'info');
    });
  }

  if (btnAboutSave) {
    btnAboutSave.addEventListener('click', () => {
      currentData.about.tagline = taglineInput.value;
      currentData.about.bio     = bioInput.value;
      currentData.about.yearsExp = expInput.value;
      currentData.about.studentsTaught = taughtInput.value;
      currentData.about.sessionRate = rateInput.value;
      
      showToast('About Me saved!', 'success');
    });
  }

  if (btnAboutDiscard) {
    btnAboutDiscard.addEventListener('click', () => {
      populateAbout();
      showToast('Changes discarded', 'info');
    });
  }

  if (btnAddSubject) {
    btnAddSubject.addEventListener('click', () => {
      const val = subjectInput.value.trim();
      if (val !== "") {
        currentData.subjects.push(val);
        renderSubjects();
        showToast(`Added subject: ${val}`, 'success');
        subjectInput.value = "";
      } else {
        showToast('Please enter a subject', 'info');
      }
    });
  }

  if (subjectInput) {
    subjectInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        btnAddSubject.click();
      }
    });
  }

  if (btnSubjectsSave) {
    btnSubjectsSave.addEventListener('click', () => {
      initialData.subjects = JSON.parse(JSON.stringify(currentData.subjects));
      showToast('Subjects saved!', 'success');
    });
  }
  
  if (btnSubjectsDiscard) {
    btnSubjectsDiscard.addEventListener('click', () => {
      currentData.subjects = JSON.parse(JSON.stringify(initialData.subjects));
      renderSubjects();
      subjectInput.value = "";
      showToast('Changes discarded', 'info');
    });
  }

  if (btnViewProfile) {
    btnViewProfile.addEventListener('click', () => {
      showToast('Public profile preview coming soon!', 'info');
    });
  }

  // ──────────────────────────────────
  // PHOTO UPLOAD (Mock)
  // ──────────────────────────────────
  const btnUpload = document.getElementById('epUploadBtn');
  const fileInput = document.getElementById('epFileInput');
  const avatar    = document.getElementById('epAvatar');

  if (btnUpload && fileInput) {
    btnUpload.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        // Read file and set as background
        const reader = new FileReader();
        reader.onload = (e) => {
          avatar.innerHTML = ''; // Clear SVG icon
          avatar.style.backgroundImage = `url(${e.target.result})`;
          avatar.style.backgroundSize = 'cover';
          avatar.style.backgroundPosition = 'center';
          showToast('Profile photo updated!', 'success');
        };
        reader.readAsDataURL(file);
      }
    });
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
