<!-- MODAL: Add/Edit Student -->
<div class="modal-overlay" id="student-modal">
    <div class="modal">
        <div class="modal-header">
            <h2 id="student-modal-title">Thêm sinh viên</h2>
            <button class="modal-close" onclick="closeModal('student-modal')">&times;</button>
        </div>
        <div class="modal-body">
            <form id="student-form" onsubmit="saveStudent(event)">
                <input type="hidden" id="student-id">
                <div class="form-group">
                    <label for="student-code">Mã sinh viên</label>
                    <input type="text" id="student-code" placeholder="VD: SV001" required>
                    <div class="form-error" id="error-student-code"></div>
                </div>
                <div class="form-group">
                    <label for="student-name">Họ tên</label>
                    <input type="text" id="student-name" placeholder="VD: Nguyễn Văn A" required>
                    <div class="form-error" id="error-student-name"></div>
                </div>
                <div class="form-group">
                    <label for="student-age">Tuổi</label>
                    <input type="number" id="student-age" placeholder="VD: 20" min="16" max="100" required>
                    <div class="form-error" id="error-student-age"></div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-ghost" onclick="closeModal('student-modal')">Hủy</button>
                    <button type="submit" class="btn btn-primary" id="student-submit-btn">Lưu sinh viên</button>
                </div>
            </form>
        </div>
    </div>
</div>
