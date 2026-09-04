// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str 
 * @returns {string}
 */
export function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Format ISO date string into Vietnamese locale format (DD/MM/YYYY)
 * @param {string} dateStr 
 * @returns {string}
 */
export function formatDate(dateStr) {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Update stats badges in dashboard header and tab pills
 * @param {number} studentsCount 
 * @param {number} classroomsCount 
 */
export function updateStats(studentsCount = 0, classroomsCount = 0) {
    const statStudents = document.getElementById('stat-students');
    const statClassrooms = document.getElementById('stat-classrooms');
    const badgeStudents = document.getElementById('badge-students');
    const badgeClassrooms = document.getElementById('badge-classrooms');

    if (statStudents) statStudents.textContent = studentsCount;
    if (statClassrooms) statClassrooms.textContent = classroomsCount;
    if (badgeStudents) badgeStudents.textContent = studentsCount;
    if (badgeClassrooms) badgeClassrooms.textContent = classroomsCount;
}

/**
 * Render pagination controls into a container element
 * @param {string|HTMLElement} container
 * @param {Object} options
 * @param {number} options.currentPage
 * @param {number} options.totalItems
 * @param {number} options.pageSize
 * @param {string} options.onPageChange - Name of global function to call with page number
 */
export function renderPagination(container, { currentPage, totalItems, pageSize, onPageChange }) {
    const el = typeof container === 'string' ? document.getElementById(container) : container;
    if (!el) return;

    if (totalItems === 0) {
        el.innerHTML = '';
        return;
    }

    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    if (totalPages <= 1) {
        el.innerHTML = `
            <div class="pagination-container">
                <div class="pagination-info">
                    Hiển thị tất cả <strong>${totalItems}</strong> bản ghi
                </div>
            </div>
        `;
        return;
    }

    let pagesHtml = '';
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        pagesHtml += `<button type="button" class="page-btn" onclick="${onPageChange}(1)">1</button>`;
        if (startPage > 2) pagesHtml += `<span class="page-ellipsis">...</span>`;
    }

    for (let p = startPage; p <= endPage; p++) {
        pagesHtml += `<button type="button" class="page-btn ${p === currentPage ? 'active' : ''}" onclick="${onPageChange}(${p})">${p}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) pagesHtml += `<span class="page-ellipsis">...</span>`;
        pagesHtml += `<button type="button" class="page-btn" onclick="${onPageChange}(${totalPages})">${totalPages}</button>`;
    }

    el.innerHTML = `
        <div class="pagination-container">
            <div class="pagination-info">
                Hiển thị <strong>${startItem}</strong> - <strong>${endItem}</strong> / <strong>${totalItems}</strong> bản ghi
            </div>
            <div class="pagination-buttons">
                <button type="button" class="page-btn nav-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="${onPageChange}(${currentPage - 1})" title="Trang trước">‹ Trước</button>
                ${pagesHtml}
                <button type="button" class="page-btn nav-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="${onPageChange}(${currentPage + 1})" title="Trang sau">Sau ›</button>
            </div>
        </div>
    `;
}
