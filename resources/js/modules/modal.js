// =============================================
// MODAL & TAB CONTROLLER
// =============================================

/**
 * Switch tabs between Students and Classrooms
 */
export function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById(`tab-${btn.dataset.tab}`);
            if (target) target.classList.add('active');
        });
    });
}

/**
 * Open modal by element ID
 * @param {string} id 
 */
export function openModal(id) { 
    const el = document.getElementById(id);
    if (el) el.classList.add('show'); 
}

/**
 * Close modal by element ID and clear error messages
 * @param {string} id 
 */
export function closeModal(id) { 
    const el = document.getElementById(id);
    if (el) el.classList.remove('show'); 
    clearFormErrors(); 
}

/**
 * Setup backdrop click listener to close modals
 */
export function initModalOverlays() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) { 
                overlay.classList.remove('show'); 
                clearFormErrors(); 
            }
        });
    });
}

/**
 * Clear all error messages from forms
 */
export function clearFormErrors() {
    document.querySelectorAll('.form-error').forEach(el => { 
        el.style.display = 'none'; 
        el.textContent = ''; 
    });
    const enrollDropdownBox = document.getElementById('enroll-dropdown-box');
    if (enrollDropdownBox) enrollDropdownBox.classList.remove('has-error');
}

/**
 * Display backend validation errors under corresponding inputs
 * @param {Object} errors 
 */
export function showFormErrors(errors) {
    clearFormErrors();
    const fieldMap = {
        'student_code': 'error-student-code',
        'name': 'error-student-name',
        'age': 'error-student-age',
        'class_code': 'error-classroom-code',
        'classroom_ids': 'error-enroll-classroom-ids',
    };
    for (const [field, messages] of Object.entries(errors)) {
        const el = document.getElementById(fieldMap[field]);
        if (el) { 
            el.textContent = messages[0]; 
            el.style.display = 'block'; 
        }
    }
}
