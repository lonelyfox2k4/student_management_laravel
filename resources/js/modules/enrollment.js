// =============================================
// ENROLLMENT MANAGEMENT MODULE
// =============================================

import { apiFetch, API } from './api.js';
import { showToast } from './toast.js';
import { escapeHtml } from './utils.js';
import { openModal, closeModal } from './modal.js';
import { getStudentsData, loadStudents } from './student.js';
import { getClassroomsData, loadClassrooms } from './classroom.js';

let enrollSelectedClassroomIds = [];
let currentEnrollingStudent = null;

/**
 * Open enrollment modal for a student
 * @param {number} studentId 
 */
export function openEnrollModal(studentId) {
    const student = getStudentsData().find(s => s.id === studentId);
    if (!student) return;

    currentEnrollingStudent = student;
    enrollSelectedClassroomIds = (student.classrooms || []).map(c => c.id);

    const idInput = document.getElementById('enroll-student-id');
    if (idInput) idInput.value = student.id;

    const title = document.getElementById('enroll-modal-title');
    if (title) title.textContent = `📝 Đăng ký lớp học - ${student.name}`;

    const infoBox = document.getElementById('enroll-student-info');
    if (infoBox) {
        infoBox.innerHTML = `
            <div class="brief-row">
                <div>
                    <span class="brief-label">Mã SV:</span>
                    <span class="code-badge">${escapeHtml(student.student_code)}</span>
                </div>
                <div>
                    <span class="brief-label">Họ tên:</span>
                    <strong>${escapeHtml(student.name)}</strong>
                </div>
                <div>
                    <span class="brief-label">Tuổi:</span>
                    <span class="age-badge">${student.age}</span>
                </div>
            </div>
        `;
    }

    const searchInput = document.getElementById('enroll-search-input');
    if (searchInput) searchInput.value = '';
    closeEnrollDropdown();
    renderEnrollSelectedTags();
    openModal('enroll-modal');
}

/**
 * Render selected class tags with remove buttons
 */
export function renderEnrollSelectedTags() {
    const container = document.getElementById('enroll-selected-tags');
    const badge = document.getElementById('enroll-limit-badge');
    
    if (badge) {
        const count = enrollSelectedClassroomIds.length;
        badge.textContent = count >= 4 ? `${count}/4 lớp (Tối đa)` : `${count}/4 lớp`;
        badge.className = count >= 4 ? 'full-badge' : 'capacity-badge';
    }

    if (!container) return;

    if (enrollSelectedClassroomIds.length === 0) {
        container.innerHTML = '<span class="no-selection-hint">Chưa đăng ký lớp nào. Hãy tìm và chọn lớp ở bên dưới.</span>';
        return;
    }

    const classrooms = getClassroomsData();
    container.innerHTML = enrollSelectedClassroomIds.map(id => {
        const classroom = classrooms.find(c => c.id === id);
        const name = classroom ? classroom.name : `Lớp #${id}`;
        const code = classroom ? classroom.class_code : '';
        return `
            <span class="selected-class-tag">
                <span class="selected-tag-name">${escapeHtml(name)}</span>
                ${code ? `<span class="selected-tag-code">(${escapeHtml(code)})</span>` : ''}
                <button type="button" class="remove-tag-btn" onclick="removeEnrollClassSelection(${id}, event)" title="Bỏ chọn">&times;</button>
            </span>
        `;
    }).join('');
}

/**
 * Render dropdown list filtered by search keyword
 * @param {string} filterText 
 */
export function renderEnrollDropdownList(filterText = '') {
    const menu = document.getElementById('enroll-dropdown-menu');
    if (!menu) return;

    const query = (filterText || '').trim().toLowerCase();
    const classrooms = getClassroomsData();
    const filtered = classrooms.filter(c => {
        if (!query) return true;
        return (c.name && c.name.toLowerCase().includes(query)) || 
               (c.class_code && c.class_code.toLowerCase().includes(query));
    });

    if (filtered.length === 0) {
        menu.innerHTML = '<div class="dropdown-empty-item">Không tìm thấy lớp học nào phù hợp</div>';
        return;
    }

    menu.innerHTML = filtered.map(c => {
        const isSelected = enrollSelectedClassroomIds.includes(c.id);
        const count = c.students_count || 0;
        const isOriginallyInClass = currentEnrollingStudent && (currentEnrollingStudent.classrooms || []).some(sc => sc.id === c.id);
        const isClassFull = count >= 30 && !isOriginallyInClass;
        const isLimitReached = !isSelected && enrollSelectedClassroomIds.length >= 4;
        const isDisabled = isClassFull || isLimitReached;

        let badgeHtml = '';
        if (isLimitReached) {
            badgeHtml = '<span class="full-badge" style="font-size:0.72rem">Tối đa 4 lớp</span>';
        } else if (count >= 30) {
            badgeHtml = '<span class="full-badge">Đã đầy (30/30)</span>';
        } else {
            badgeHtml = `<span class="capacity-badge">${count}/30</span>`;
        }

        return `
            <div class="dropdown-menu-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}"
                 title="${isLimitReached ? 'Đã đạt tối đa 4 lớp học' : (isClassFull ? 'Lớp học đã đủ 30 sinh viên' : '')}"
                 onclick="${isDisabled ? `showLimitWarning(${isLimitReached})` : `toggleEnrollClassSelection(${c.id})`}">
                <div class="dropdown-item-left">
                    <span class="dropdown-checkbox">${isSelected ? '✓' : ''}</span>
                    <div class="dropdown-item-info">
                        <span class="dropdown-item-name">${escapeHtml(c.name)}</span>
                        <span class="dropdown-item-code">${escapeHtml(c.class_code)}</span>
                    </div>
                </div>
                <div class="dropdown-item-right">
                    ${badgeHtml}
                </div>
            </div>
        `;
    }).join('');
}

export function showLimitWarning(isLimit) {
    if (isLimit) {
        showToast('Một sinh viên không thể đăng ký quá 4 lớp học!', 'error');
        const errEl = document.getElementById('error-enroll-classroom-ids');
        if (errEl) {
            errEl.textContent = 'Một sinh viên chỉ được đăng ký tối đa 4 lớp học.';
            errEl.style.display = 'block';
        }
    }
}

export function focusEnrollSearch() {
    const input = document.getElementById('enroll-search-input');
    if (input) input.focus();
}

export function openEnrollDropdown() {
    const menu = document.getElementById('enroll-dropdown-menu');
    const box = document.getElementById('enroll-dropdown-box');
    if (menu) menu.classList.add('open');
    if (box) box.classList.add('open');
    const searchInput = document.getElementById('enroll-search-input');
    renderEnrollDropdownList(searchInput ? searchInput.value : '');
}

export function closeEnrollDropdown() {
    const menu = document.getElementById('enroll-dropdown-menu');
    const box = document.getElementById('enroll-dropdown-box');
    if (menu) menu.classList.remove('open');
    if (box) box.classList.remove('open');
}

export function toggleEnrollDropdown(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('enroll-dropdown-menu');
    if (menu && menu.classList.contains('open')) {
        closeEnrollDropdown();
    } else {
        openEnrollDropdown();
        focusEnrollSearch();
    }
}

export function filterEnrollDropdown(val) {
    openEnrollDropdown();
    renderEnrollDropdownList(val);
}

export function toggleEnrollClassSelection(id) {
    const index = enrollSelectedClassroomIds.indexOf(id);
    if (index > -1) {
        enrollSelectedClassroomIds.splice(index, 1);
        const errEl = document.getElementById('error-enroll-classroom-ids');
        if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
    } else {
        if (enrollSelectedClassroomIds.length >= 4) {
            const errEl = document.getElementById('error-enroll-classroom-ids');
            if (errEl) {
                errEl.textContent = 'Một sinh viên chỉ được đăng ký tối đa 4 lớp học.';
                errEl.style.display = 'block';
            }
            showToast('Một sinh viên không thể đăng ký quá 4 lớp học!', 'error');
            return;
        }
        enrollSelectedClassroomIds.push(id);
        const errEl = document.getElementById('error-enroll-classroom-ids');
        if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
    }

    renderEnrollSelectedTags();
    const searchInput = document.getElementById('enroll-search-input');
    renderEnrollDropdownList(searchInput ? searchInput.value : '');
}

export function removeEnrollClassSelection(id, event) {
    if (event) event.stopPropagation();
    const index = enrollSelectedClassroomIds.indexOf(id);
    if (index > -1) {
        enrollSelectedClassroomIds.splice(index, 1);
        const errEl = document.getElementById('error-enroll-classroom-ids');
        if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
        renderEnrollSelectedTags();
        const searchInput = document.getElementById('enroll-search-input');
        renderEnrollDropdownList(searchInput ? searchInput.value : '');
    }
}

/**
 * Submit updated enrollments to backend
 * @param {Event} event 
 */
export async function saveEnrollment(event) {
    event.preventDefault();
    const studentId = document.getElementById('enroll-student-id').value;
    if (!studentId) return;

    if (enrollSelectedClassroomIds.length > 4) {
        const errEl = document.getElementById('error-enroll-classroom-ids');
        if (errEl) {
            errEl.textContent = 'Một sinh viên chỉ được đăng ký tối đa 4 lớp học.';
            errEl.style.display = 'block';
        }
        showToast('Một sinh viên không thể đăng ký quá 4 lớp học!', 'error');
        return;
    }

    try {
        await apiFetch(`${API.students}/${studentId}/enrollments`, {
            method: 'PUT',
            body: JSON.stringify({
                classroom_ids: enrollSelectedClassroomIds,
            }),
        });
        showToast('Cập nhật đăng ký lớp thành công');
        closeModal('enroll-modal');
        loadStudents();
        loadClassrooms();
    } catch (e) {
        if (e.data?.errors?.classroom_ids) {
            const errEl = document.getElementById('error-enroll-classroom-ids');
            if (errEl) {
                errEl.textContent = e.data.errors.classroom_ids[0];
                errEl.style.display = 'block';
            }
        } else {
            showToast(e.data?.message || 'Có lỗi khi cập nhật đăng ký lớp', 'error');
        }
    }
}

/**
 * Click outside to close enrollment dropdown menu
 */
export function initEnrollmentEvents() {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#enroll-dropdown-wrapper') && !e.target.closest('#enroll-selected-tags')) {
            closeEnrollDropdown();
        }
    });
}
