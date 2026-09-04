<!-- MODAL: Add/Edit Classroom -->
<div class="modal-overlay" id="classroom-modal">
    <div class="modal">
        <div class="modal-header">
            <h2 id="classroom-modal-title">Thêm lớp</h2>
            <button class="modal-close" onclick="closeModal('classroom-modal')">&times;</button>
        </div>
        <div class="modal-body">
            <form id="classroom-form" onsubmit="saveClassroom(event)">
                <input type="hidden" id="classroom-id">
                <div class="form-group">
                    <label for="classroom-code">Mã lớp</label>
                    <input type="text" id="classroom-code" placeholder="VD: CNTT01" required>
                    <div class="form-error" id="error-classroom-code"></div>
                </div>
                <div class="form-group">
                    <label for="classroom-name">Tên lớp</label>
                    <input type="text" id="classroom-name" placeholder="VD: Công nghệ thông tin K18" required>
                    <div class="form-error" id="error-classroom-name"></div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-ghost" onclick="closeModal('classroom-modal')">Hủy</button>
                    <button type="submit" class="btn btn-primary" id="classroom-submit-btn">Lưu</button>
                </div>
            </form>
        </div>
    </div>
</div>
