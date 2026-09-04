// =============================================
// STUDENTS MANAGEMENT MODULE
// =============================================

import { apiFetch, API } from './api.js';
import { showToast } from './toast.js';
import { escapeHtml, formatDate, updateStats, renderPagination } from './utils.js';
import { openModal, closeModal, clearFormErrors, showFormErrors } from './modal.js';
import { getClassroomsData, loadClassrooms } from './classroom.js';

let studentsData = [];
let studentCurrentPage = 1;
const STUDENT_PAGE_SIZE = 10;

export function getStudentsData() {
    return studentsData;
}

export function setStudentsData(data) {
    studentsData = data;
}

export function setStudentPage(page) {
    studentCurrentPage = page;
    renderStudents();
}

/**
 * Fetch students list from server and render table
 */
export async function loadStudents() {
    try {
        studentsData = await apiFetch(API.students);
        const maxPage = Math.max(1, Math.ceil(studentsData.length / STUDENT_PAGE_SIZE));
        if (studentCurrentPage > maxPage) studentCurrentPage = maxPage;
        renderStudents();
        updateStats(studentsData.length, getClassroomsData().length);
    } catch (e) { 
        showToast('Không thể tải danh sách sinh viên', 'error'); 
    }
}

/**
 * Render student rows into the table body
 */
export function renderStudents() {
    const tbody = document.getElementById('students-tbody');
    if (!tbody) return;

    if (studentsData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">
            <div class="empty-icon">👤</div><p>Chưa có sinh viên nào</p>
            <span class="empty-hint">Nhấn "Thêm sinh viên" để bắt đầu</span>
        </div></td></tr>`;
        renderPagination('students-pagination', {
            currentPage: 1,
            totalItems: 0,
            pageSize: STUDENT_PAGE_SIZE,
            onPageChange: 'setStudentPage',
        });
        return;
    }

    const startIdx = (studentCurrentPage - 1) * STUDENT_PAGE_SIZE;
    const pagedStudents = studentsData.slice(startIdx, startIdx + STUDENT_PAGE_SIZE);

    tbody.innerHTML = pagedStudents.map(s => {
        const classTags = (s.classrooms || []).map(c =>
            `<span class="class-tag">${escapeHtml(c.name)}</span>`
        ).join('') || '<span style="color:var(--text-muted);font-size:0.82rem">Chưa đăng ký</span>';

        return `<tr>
            <td><span class="code-badge">${escapeHtml(s.student_code)}</span></td>
            <td>${escapeHtml(s.name)}</td>
            <td><span class="age-badge">${s.age}</span></td>
            <td>${classTags}</td>
            <td>
                <div class="actions-cell">
                    <button class="btn btn-enroll" onclick="openEnrollModal(${s.id})">📝 Đăng ký lớp</button>
                    <button class="btn btn-view" onclick="viewStudent(${s.id})">👁️ Xem</button>
                    <button class="btn btn-edit" onclick="editStudent(${s.id})">✏️ Sửa</button>
                    <button class="btn btn-delete" onclick="deleteStudent(${s.id})">🗑️ Xóa</button>
                </div>
            </td>
        </tr>`;
    }).join('');

    renderPagination('students-pagination', {
        currentPage: studentCurrentPage,
        totalItems: studentsData.length,
        pageSize: STUDENT_PAGE_SIZE,
        onPageChange: 'setStudentPage',
    });
}

/**
 * Open create or edit modal for student
 * @param {Object|null} student 
 */
export function openStudentModal(student = null) {
    const form = document.getElementById('student-form');
    if (form) form.reset();
    clearFormErrors();

    if (student) {
        document.getElementById('student-modal-title').textContent = 'Sửa sinh viên';
        document.getElementById('student-id').value = student.id;
        document.getElementById('student-code').value = student.student_code;
        document.getElementById('student-name').value = student.name;
        document.getElementById('student-age').value = student.age;
    } else {
        document.getElementById('student-modal-title').textContent = 'Thêm sinh viên';
        document.getElementById('student-id').value = '';
    }

    openModal('student-modal');
}

/**
 * Trigger edit student by ID
 * @param {number} id 
 */
export function editStudent(id) {
    const student = studentsData.find(s => s.id === id);
    if (student) openStudentModal(student);
}

/**
 * Fetch and view student details with enrolled classes
 * @param {number} id 
 */
export async function viewStudent(id) {
    try {
        const student = await apiFetch(`${API.students}/${id}`);
        renderStudentDetail(student);
        openModal('student-detail-modal');
    } catch (e) { 
        showToast('Không thể tải thông tin sinh viên', 'error'); 
    }
}

/**
 * Render detail view for a student
 * @param {Object} student 
 */
export function renderStudentDetail(student) {
    const enrollments = student.enrollments || [];
    const body = document.getElementById('student-detail-body');
    if (!body) return;

    let enrolledHtml = '';
    if (enrollments.length === 0) {
        enrolledHtml = '<div class="enrolled-empty">Chưa đăng ký lớp nào</div>';
    } else {
        enrolledHtml = '<ul class="enrolled-list">' + enrollments.map(e => `
            <li class="enrolled-list-item">
                <div class="enrolled-info">
                    <span class="class-tag" style="margin:0">${escapeHtml(e.classroom?.name || '—')}</span>
                    <span class="enrolled-name" style="color:var(--text-muted);font-size:0.85rem">(${escapeHtml(e.classroom?.class_code || '')})</span>
                </div>
                <span class="enrolled-date">📅 ${formatDate(e.enrolled_at)}</span>
            </li>
        `).join('') + '</ul>';
    }

    body.innerHTML = `
        <div class="detail-section">
            <div class="detail-section-title">Thông tin cá nhân</div>
            <div class="detail-grid">
                <div class="detail-item">
                    <label>Mã sinh viên</label>
                    <div class="detail-value code">${escapeHtml(student.student_code)}</div>
                </div>
                <div class="detail-item">
                    <label>Họ tên</label>
                    <div class="detail-value">${escapeHtml(student.name)}</div>
                </div>
                <div class="detail-item">
                    <label>Tuổi</label>
                    <div class="detail-value">${student.age}</div>
                </div>
                <div class="detail-item">
                    <label>Số lớp đăng ký</label>
                    <div class="detail-value">${enrollments.length}</div>
                </div>
            </div>
        </div>
        <div class="detail-section">
            <div class="detail-section-title">Lớp đã đăng ký (${enrollments.length})</div>
            ${enrolledHtml}
        </div>
    `;
}

/**
 * Save student (Create or Update)
 * @param {Event} event 
 */
export async function saveStudent(event) {
    event.preventDefault();
    clearFormErrors();

    const id = document.getElementById('student-id').value;
    const payload = {
        student_code: document.getElementById('student-code').value.trim(),
        name: document.getElementById('student-name').value.trim(),
        age: parseInt(document.getElementById('student-age').value),
    };

    try {
        if (id) {
            await apiFetch(`${API.students}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
            showToast('Cập nhật sinh viên thành công');
        } else {
            await apiFetch(API.students, { method: 'POST', body: JSON.stringify(payload) });
            showToast('Thêm sinh viên thành công');
        }
        closeModal('student-modal');
        loadStudents();
    } catch (e) {
        if (e.data?.errors) showFormErrors(e.data.errors);
        else showToast(e.data?.message || 'Có lỗi xảy ra', 'error');
    }
}

/**
 * Delete a student by ID
 * @param {number} id 
 */
export async function deleteStudent(id) {
    if (!confirm('Bạn có chắc muốn xóa sinh viên này?')) return;
    try {
        await apiFetch(`${API.students}/${id}`, { method: 'DELETE' });
        showToast('Đã xóa sinh viên');
        loadStudents();
        loadClassrooms();
    } catch (e) { 
        showToast('Không thể xóa sinh viên', 'error'); 
    }
}
