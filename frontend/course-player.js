/* =========================================================================
   CourseHub course player
   Shared by every course-detail page (python-course.html, etc). Renders the
   interactive module list (image -> video -> reading) for a given courseId,
   gates it behind login, and wires up completion tracking:
     - image : click it once to mark it done
     - video : click / press play once to mark it done
     - text  : scroll the reading box to the bottom to mark it done

   Include AFTER coursehub-data.js:
     <script src="coursehub-data.js"></script>
     <script src="course-player.js"></script>

   Each page just needs these elements (ids) somewhere on the page:
     #lockedNotice          - shown when the visitor isn't enrolled/logged in
     #courseProgressWrap    - wraps the progress bar (hidden until unlocked)
     #courseProgressBar     - the .progress-bar element
     #courseProgressLabel   - small text label, e.g. "40% complete"
     #interactiveModules    - container the module accordion gets rendered into

   Then call, once, after coursehub-data.js has initialized:
     CoursePlayer.renderModules('python-masterclass');

   And point the page's "Enroll" button at:
     onclick="CoursePlayer.handleEnrollClick('python-masterclass')"
   ========================================================================= */
(function (window) {

    function iconFor(type) {
        if (type === 'image') return 'bi-image';
        if (type === 'video') return 'bi-play-circle';
        return 'bi-file-text';
    }

    function renderModules(courseId) {
        const container   = document.getElementById('interactiveModules');
        const lockedNotice = document.getElementById('lockedNotice');
        const progressWrap = document.getElementById('courseProgressWrap');
        if (!container) return;

        const user = CourseHub.getCurrentUser();

        if (!CourseHub.isLoggedIn() || !user) {
            container.classList.add('d-none');
            if (progressWrap) progressWrap.classList.add('d-none');
            if (lockedNotice) lockedNotice.classList.remove('d-none');
            return;
        }

        let enrollment = CourseHub.getEnrollmentsForStudent(user.id)
            .find(e => e.courseId === courseId);

        if (!enrollment) {
            enrollment = CourseHub.enrollInCourse(courseId);
        }
        if (!enrollment) return;

        if (lockedNotice) lockedNotice.classList.add('d-none');
        container.classList.remove('d-none');
        if (progressWrap) progressWrap.classList.remove('d-none');

        container.innerHTML = '';

        enrollment.modules.forEach(function (mod, mIdx) {
            const collapseId = 'modcol-' + mod.id;
            const doneCount = mod.content.filter(c => c.done).length;

            const modWrap = document.createElement('div');
            modWrap.className = 'accordion-item border-0 mb-3';
            modWrap.innerHTML =
                '<h2 class="accordion-header">' +
                '  <button class="accordion-button fw-semibold ' + (mIdx === 0 ? '' : 'collapsed') + '" type="button" data-bs-toggle="collapse" data-bs-target="#' + collapseId + '">' +
                '    <span class="me-2">' + (mod.completed ? '<i class="bi bi-check-circle-fill text-success"></i>' : '<i class="bi bi-circle text-muted"></i>') + '</span>' +
                '    <span class="flex-grow-1 text-start">Module ' + (mIdx + 1) + ': ' + mod.name + '</span>' +
                '    <span class="badge bg-light text-dark border ms-2">' + doneCount + '/' + mod.content.length + '</span>' +
                '  </button>' +
                '</h2>' +
                '<div id="' + collapseId + '" class="accordion-collapse collapse ' + (mIdx === 0 ? 'show' : '') + '">' +
                '  <div class="accordion-body content-stack d-flex flex-column gap-4"></div>' +
                '</div>';

            const body = modWrap.querySelector('.content-stack');

            mod.content.forEach(function (item, cIdx) {
                const block = document.createElement('div');
                block.className = 'content-block p-3 rounded-3 border ' + (item.done ? 'content-done border-success-subtle' : 'border-light-subtle bg-light bg-opacity-50');

                if (item.type === 'image') {
                    block.innerHTML =
                        '<p class="small fw-semibold mb-2"><i class="bi ' + iconFor('image') + ' me-1"></i>' + item.title +
                        (item.done ? ' <span class="badge bg-success ms-1">Completed</span>' : ' <span class="badge bg-secondary ms-1">Click image to complete</span>') + '</p>' +
                        '<img src="' + item.src + '" class="img-fluid rounded-3 content-image" style="cursor:pointer;max-height:320px;width:100%;object-fit:cover;" alt="' + item.title + '">' +
                        '<p class="text-muted small mt-2 mb-0">' + item.caption + '</p>';

                    const img = block.querySelector('img');
                    img.addEventListener('click', function () {
                        if (item.done) return;
                        CourseHub.markContentDone(enrollment.id, mod.id, cIdx);
                        renderModules(courseId);
                    });

                } else if (item.type === 'video') {
                    block.innerHTML =
                        '<p class="small fw-semibold mb-2"><i class="bi ' + iconFor('video') + ' me-1"></i>' + item.title +
                        (item.done ? ' <span class="badge bg-success ms-1">Completed</span>' : ' <span class="badge bg-secondary ms-1">Click video to complete</span>') + '</p>' +
                        '<video class="content-video rounded-3 w-100" style="max-height:320px;background:#000;" controls preload="metadata">' +
                        '  <source src="' + item.src + '" type="video/mp4">' +
                        '</video>' +
                        '<p class="text-muted small mt-2 mb-0">' + item.caption + '</p>';

                    const vid = block.querySelector('video');
                    const markDone = function () {
                        if (item.done) return;
                        CourseHub.markContentDone(enrollment.id, mod.id, cIdx);
                        renderModules(courseId);
                    };
                    vid.addEventListener('play', markDone, { once: true });
                    vid.addEventListener('click', markDone);

                } else {
                    block.innerHTML =
                        '<p class="small fw-semibold mb-2"><i class="bi ' + iconFor('text') + ' me-1"></i>' + item.title +
                        (item.done ? ' <span class="badge bg-success ms-1">Completed</span>' : ' <span class="badge bg-secondary ms-1">Scroll to the end to complete</span>') + '</p>' +
                        '<div class="content-reading border rounded-3 p-3 bg-white" style="max-height:170px;overflow-y:auto;">' +
                        '  <p class="mb-0 text-muted">' + item.body + '</p>' +
                        '</div>';

                    const reading = block.querySelector('.content-reading');
                    reading.addEventListener('scroll', function () {
                        if (item.done) return;
                        if (reading.scrollTop + reading.clientHeight >= reading.scrollHeight - 4) {
                            CourseHub.markContentDone(enrollment.id, mod.id, cIdx);
                            renderModules(courseId);
                        }
                    });
                    // Short readings that don't overflow can't be "scrolled" —
                    // treat them as already viewable/complete-on-scroll-area-click.
                    if (reading.scrollHeight <= reading.clientHeight + 2 && !item.done) {
                        reading.style.cursor = 'pointer';
                        reading.title = 'Click to mark as read';
                        reading.addEventListener('click', function () {
                            if (item.done) return;
                            CourseHub.markContentDone(enrollment.id, mod.id, cIdx);
                            renderModules(courseId);
                        });
                    }
                }

                body.appendChild(block);
            });

            container.appendChild(modWrap);
        });

        const bar = document.getElementById('courseProgressBar');
        const label = document.getElementById('courseProgressLabel');
        if (bar) {
            bar.style.width = enrollment.progress + '%';
            bar.setAttribute('aria-valuenow', enrollment.progress);
        }
        if (label) label.textContent = enrollment.progress + '% complete';
    }

    /* ---------------------------------------------------------------------
       Nav login indicator — once a student passes the access gate, the
       site remembers them (normal "stay logged in" behavior), so on later
       visits/clicks they go straight into content without being asked
       again. That's correct, but invisible without an indicator — this
       swaps the Login/Register buttons for "<name> ▾ / Log Out" whenever
       #navAuthArea is present and someone is logged in, so it's always
       obvious who (if anyone) is currently signed in, and easy to log out
       to test the gate again.
       --------------------------------------------------------------------- */
    function renderAuthNav() {
        const area = document.getElementById('navAuthArea');
        if (!area) return;

        if (!CourseHub.isLoggedIn()) {
            return; // leave the default Login / Register markup as-is
        }

        const user = CourseHub.getCurrentUser();
        const firstName = user && user.name ? user.name.split(' ')[0] : 'Account';
        const unread = user ? CourseHub.getUnreadNotificationCount(user.id) : 0;
        const badge = unread > 0
            ? '<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size:10px;">' +
              (unread > 9 ? '9+' : unread) + '</span>'
            : '';

        area.innerHTML =
            '<a href="notifications.html" class="btn btn-outline-secondary position-relative px-3" title="Notifications">' +
            '  <i class="bi bi-bell-fill"></i>' + badge +
            '</a>' +
            '<div class="dropdown">' +
            '  <a class="btn btn-outline-primary dropdown-toggle px-4" href="#" role="button" data-bs-toggle="dropdown">' +
            '    <i class="bi bi-person-check-fill me-1"></i>' + firstName +
            '  </a>' +
            '  <ul class="dropdown-menu dropdown-menu-end shadow-sm">' +
            '    <li><span class="dropdown-item-text small text-muted">' + (user ? user.email : '') + '</span></li>' +
            '    <li><hr class="dropdown-divider"></li>' +
            '    <li><a class="dropdown-item" href="notifications.html"><i class="bi bi-bell me-2"></i>Notifications' +
            (unread > 0 ? ' <span class="badge bg-danger rounded-pill ms-1">' + unread + '</span>' : '') + '</a></li>' +
            '    <li><a class="dropdown-item" href="#" id="navLogoutBtn"><i class="bi bi-box-arrow-right me-2"></i>Log Out</a></li>' +
            '  </ul>' +
            '</div>';

        const logoutBtn = document.getElementById('navLogoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                CourseHub.logout();
                window.location.reload();
            });
        }
    }

    document.addEventListener('DOMContentLoaded', renderAuthNav);

    /* ---------------------------------------------------------------------
       Inline "Enroll" gate — asks only for the student's name + email.
       If it matches an already-registered account, they're logged in and
       dropped straight into the course content. If not, they're told to
       register (and log in) before they can access the course — this gate
       does not register anyone itself. Markup is injected once, on first
       use, so any page that includes this script gets it for free.
       --------------------------------------------------------------------- */
    let authModalInstance = null;
    let pendingEnrollCourseId = null;
    let pendingOnSuccess = null;

    function ensureAuthModal() {
        if (document.getElementById('chAuthModal')) return;

        const wrap = document.createElement('div');
        wrap.innerHTML =
            '<div class="modal fade" id="chAuthModal" tabindex="-1" aria-hidden="true">' +
            '  <div class="modal-dialog modal-dialog-centered">' +
            '    <div class="modal-content rounded-4 border-0 shadow">' +
            '      <div class="modal-header border-0 pb-0">' +
            '        <h5 class="modal-title fw-bold">Access this course</h5>' +
            '        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +
            '      </div>' +
            '      <div class="modal-body pt-2">' +
            '        <p class="text-muted small mb-3">Enter the name and email you registered with to open the course.</p>' +
            '        <div id="chAuthError" class="alert alert-warning py-2 small d-none"></div>' +
            '        <form id="chAccessForm">' +
            '          <div class="mb-3"><label class="form-label small text-muted">Full Name</label><input type="text" class="form-control" id="chAccessName" required></div>' +
            '          <div class="mb-3"><label class="form-label small text-muted">Email</label><input type="email" class="form-control" id="chAccessEmail" required></div>' +
            '          <button type="submit" class="btn btn-primary w-100 py-2 fw-medium">Continue to Course</button>' +
            '        </form>' +
            '        <p class="text-center small text-muted mt-3 mb-0">Not registered yet? <a href="user-register.html">Create an account</a></p>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>';
        document.body.appendChild(wrap.firstElementChild);

        const modalEl  = document.getElementById('chAuthModal');
        const form     = document.getElementById('chAccessForm');
        const errorBox = document.getElementById('chAuthError');

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const name  = document.getElementById('chAccessName').value;
            const email = document.getElementById('chAccessEmail').value;
            const result = CourseHub.loginByNameEmail(name, email);

            if (!result.success) {
                errorBox.innerHTML = result.error === 'not_registered'
                    ? 'We couldn\'t find an account with that email. Please <a href="user-register.html" class="alert-link">register</a> first, then come back and log in to access this course.'
                    : 'That name doesn\'t match the account on file for this email. Please double-check and try again, or <a href="user-login.html" class="alert-link">log in</a> directly.';
                errorBox.classList.remove('d-none');
                return;
            }

            if (pendingEnrollCourseId) {
                CourseHub.enrollInCourse(pendingEnrollCourseId);
            }
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
            form.reset();
            errorBox.classList.add('d-none');
            renderAuthNav();
            const cb = pendingOnSuccess;
            pendingEnrollCourseId = null;
            pendingOnSuccess = null;
            if (cb) cb();
        });
    }

    // Opens the name+email access gate (or, if already logged in, skips
    // straight to enrolling) and runs onSuccess once the student is
    // verified and enrolled — used to jump straight into the content
    // without ever leaving the page.
    function ensureAuthThenEnroll(courseId, onSuccess) {
        if (CourseHub.isLoggedIn()) {
            CourseHub.enrollInCourse(courseId);
            if (onSuccess) onSuccess();
            return;
        }

        ensureAuthModal();
        pendingEnrollCourseId = courseId;
        pendingOnSuccess = onSuccess;

        const modalEl = document.getElementById('chAuthModal');
        document.getElementById('chAuthError').classList.add('d-none');
        document.getElementById('chAccessForm').reset();

        if (!authModalInstance) {
            authModalInstance = new bootstrap.Modal(modalEl);
        }
        authModalInstance.show();
    }

    // Wired to the page's "Enroll" button. Already-logged-in visitors get
    // enrolled (idempotent) and the module list unlocks in place;
    // logged-out visitors get the name+email access gate and land right
    // back in the content the moment they're verified — no page leaves.
    function handleEnrollClick(courseId) {
        ensureAuthThenEnroll(courseId, function () {
            renderModules(courseId);
            const section = document.getElementById('interactiveModulesSection');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
    }

    window.CoursePlayer = { renderModules, handleEnrollClick, ensureAuthThenEnroll, renderAuthNav };

})(window);