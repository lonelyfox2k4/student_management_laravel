// =============================================
// CLASSROOMS MANAGEMENT MODULE
// =============================================

import { apiFetch, API } from './api.js';
import { showToast } from './toast.js';
import { escapeHtml, formatDate, updateStats, renderPagination } from './utils.js';
import { openModal, closeModal, clearFormErrors, showFormErrors } from './modal.js';
import { getStudentsData, loadStudents } from './student.js';

let classroomsData = [];
let classroomCurrentPage = 1;
const CLASSROOM_PAGE_SIZE = 10;

let currentDetailClassroom = null;
let detailStudentPage = 1;
const DETAIL_PAGE_SIZE = 5;

export function getClassroomsData() {
    return classroomsData;
}

export function setClassroomsData(data) {
    classroomsData = data;
}

export function setClassroomPage(page) {
    classroomCurrentPage = page;
    renderClassrooms();
}

export function setClassroomDetailPage(page) {
    detailStudentPage = page;
    renderClassroomDetail();
}

/**
 * Fetch classrooms list from server and render table
 */
export async function loadClassrooms() {
    try {
        classroomsData = await apiFetch(API.classrooms);
        const maxPage = Math.max(1, Math.ceil(classroomsData.length / CLASSROOM_PAGE_SIZE));
        if (classroomCurrentPage > maxPage) classroomCurrentPage = maxPage;
        renderClassrooms();
        updateStats(getStudentsData().length, classroomsData.length);
    } catch (e) { 
        showToast('Không thể tải danh sách lớp', 'error'); 
    }
}

/**
 * Render classroom rows into the table body
 */
export function renderClassrooms() {
    const tbody = document.getElementById('classrooms-tbody');
    if (!tbody) return;

    if (classroomsData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">
            <div class="empty-icon">📚</div><p>Chưa có lớp nào</p>
            <span class="empty-hint">Nhấn "Thêm lớp" để bắt đầu</span>
        </div></td></tr>`;
        renderPagination('classrooms-pagination', {
            currentPage: 1,
            totalItems: 0,
            pageSize: CLASSROOM_PAGE_SIZE,
            onPageChange: 'setClassroomPage',
        });
        return;
    }

    const startIdx = (classroomCurrentPage - 1) * CLASSROOM_PAGE_SIZE;
    const pagedClassrooms = classroomsData.slice(startIdx, startIdx + CLASSROOM_PAGE_SIZE);

    tbody.innerHTML = pagedClassrooms.map(c => {
        const count = c.students_count || 0;
        const statusHtml = count >= 30
            ? `<span class="full-badge">Đã đầy (30/30)</span>`
            : `<span class="capacity-badge">${count}/30 sinh viên</span>`;

        const deleteBtn = count > 0
            ? `<button class="btn btn-delete btn-disabled" disabled title="Không thể xóa lớp đang có ${count} sinh viên">🔒 Xóa</button>`
            : `<button class="btn btn-delete" onclick="deleteClassroom(${c.id})">🗑️ Xóa</button>`;

        return `<tr>
            <td><span class="code-badge">${escapeHtml(c.class_code)}</span></td>
            <td>${escapeHtml(c.name)}</td>
            <td>${statusHtml}</td>
            <td>
                <div class="actions-cell">
                    <button class="btn btn-view" onclick="viewClassroom(${c.id})">👁️ Xem</button>
                    <button class="btn btn-edit" onclick="editClassroom(${c.id})">✏️ Sửa</button>
                    ${deleteBtn}
                </div>
            </td>
        </tr>`;
    }).join('');

    renderPagination('classrooms-pagination', {
        currentPage: classroomCurrentPage,
        totalItems: classroomsData.length,
        pageSize: CLASSROOM_PAGE_SIZE,
        onPageChange: 'setClassroomPage',
    });
}

/**
 * Open create or edit modal for classroom
 * @param {Object|null} classroom 
 */
export function openClassroomModal(classroom = null) {
    const form = document.getElementById('classroom-form');
    if (form) form.reset();
    clearFormErrors();

    if (classroom) {
        document.getElementById('classroom-modal-title').textContent = 'Sửa lớp';
        document.getElementById('classroom-id').value = classroom.id;
        document.getElementById('classroom-code').value = classroom.class_code;
        document.getElementById('classroom-name').value = classroom.name;
    } else {
        document.getElementById('classroom-modal-title').textContent = 'Thêm lớp';
        document.getElementById('classroom-id').value = '';
    }

    openModal('classroom-modal');
}

/**
 * Trigger edit classroom by ID
 * @param {number} id 
 */
export function editClassroom(id) {
    const classroom = classroomsData.find(c => c.id === id);
    if (classroom) openClassroomModal(classroom);
}

/**
 * Fetch and view classroom details with student roster
 * @param {number} id 
 */
export async function viewClassroom(id) {
    try {
        const classroom = await apiFetch(`${API.classrooms}/${id}`);
        currentDetailClassroom = classroom;
        detailStudentPage = 1;
        renderClassroomDetail();
        openModal('classroom-detail-modal');
    } catch (e) { 
        showToast('Không thể tải thông tin lớp', 'error'); 
    }
}

/**
 * Render detail view for a classroom with pagination and enrolled_at date
 */
export function renderClassroomDetail() {
    if (!currentDetailClassroom) return;
    const classroom = currentDetailClassroom;
    const students = classroom.students || [];
    const body = document.getElementById('classroom-detail-body');
    if (!body) return;

    let studentsHtml = '';
    if (students.length === 0) {
        studentsHtml = '<div class="enrolled-empty">Chưa có sinh viên nào trong lớp</div>';
    } else {
        const maxPage = Math.max(1, Math.ceil(students.length / DETAIL_PAGE_SIZE));
        if (detailStudentPage > maxPage) detailStudentPage = maxPage;

        const startIdx = (detailStudentPage - 1) * DETAIL_PAGE_SIZE;
        const pagedStudents = students.slice(startIdx, startIdx + DETAIL_PAGE_SIZE);

        studentsHtml = '<ul class="enrolled-list">' + pagedStudents.map(s => `
            <li class="enrolled-list-item">
                <div class="enrolled-info">
                    <span class="code-badge" style="font-size:0.75rem;padding:3px 8px">${escapeHtml(s.student_code)}</span>
                    <span class="enrolled-name" style="font-weight:600">${escapeHtml(s.name)}</span>
                    <span class="age-badge" style="width:28px;height:28px;font-size:0.72rem" title="Tuổi">${s.age}t</span>
                </div>
                <div class="enrolled-extra">
                    <span class="enrolled-date" style="display:inline-flex;align-items:center;gap:5px;color:var(--accent-emerald);font-size:0.8rem;background:rgba(16,185,129,0.1);padding:4px 10px;border-radius:20px;border:1px solid rgba(16,185,129,0.2)">
                        📅 Ngày đăng ký: <strong>${formatDate(s.pivot?.enrolled_at)}</strong>
                    </span>
                </div>
            </li>
        `).join('') + '</ul>';
    }

    body.innerHTML = `
        <div class="detail-section">
            <div class="detail-section-title">Thông tin lớp</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Mã lớp</label>
                    <div class="detail-value code">${escapeHtml(classroom.class_code)}</div>
                </div>
                <div class="detail-item">
                    <label>Tên lớp</label>
                    <div class="detail-value">${escapeHtml(classroom.name)}</div>
                </div>
                <div class="detail-item">
                    <label>Sĩ số</label>
                    <div class="detail-value">${students.length}/30 sinh viên ${students.length >= 30 ? '<span class="full-badge" style="margin-left:6px">Đã đầy</span>' : '<span class="capacity-badge" style="margin-left:6px">Còn chỗ</span>'}</div>
                </div>
            </div>
        </div>
        <div class="detail-section">
            <div class="detail-section-title">Danh sách sinh viên (${students.length}/30)</div>
            ${studentsHtml}
            <div class="pagination-wrapper in-modal" id="classroom-detail-pagination"></div>
        </div>
    `;

    renderPagination('classroom-detail-pagination', {
        currentPage: detailStudentPage,
        totalItems: students.length,
        pageSize: DETAIL_PAGE_SIZE,
        onPageChange: 'setClassroomDetailPage',
    });
}

/**
 * Save classroom (Create or Update)
 * @param {Event} event 
 */
export async function saveClassroom(event) {
    event.preventDefault();
    clearFormErrors();

    const id = document.getElementById('classroom-id').value;
    const payload = {
        class_code: document.getElementById('classroom-code').value.trim(),
        name: document.getElementById('classroom-name').value.trim(),
    };

    try {
        if (id) {
            await apiFetch(`${API.classrooms}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
            showToast('Cập nhật lớp thành công');
        } else {
            await apiFetch(API.classrooms, { method: 'POST', body: JSON.stringify(payload) });
            showToast('Thêm lớp thành công');
        }
        closeModal('classroom-modal');
        loadClassrooms();
        loadStudents();
    } catch (e) {
        if (e.data?.errors) showFormErrors(e.data.errors);
        else showToast(e.data?.message || 'Có lỗi xảy ra', 'error');
    }
}

/**
 * Delete classroom by ID (forbidden if has students)
 * @param {number} id 
 */
export async function deleteClassroom(id) {
    const classroom = classroomsData.find(c => c.id === id);
    if (classroom && (classroom.students_count || 0) > 0) {
        showToast(`Không thể xóa lớp "${classroom.name}" vì đang có ${classroom.students_count} sinh viên theo học!`, 'error');
        return;
    }
    if (!confirm('Bạn có chắc muốn xóa lớp này?')) return;
    try {
        await apiFetch(`${API.classrooms}/${id}`, { method: 'DELETE' });
        showToast('Đã xóa lớp thành công');
        loadClassrooms();
        loadStudents();
    } catch (e) { 
        showToast(e.data?.message || 'Không thể xóa lớp', 'error'); 
    }
}
