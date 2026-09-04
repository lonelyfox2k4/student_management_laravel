<!-- TAB: STUDENTS -->
<div class="tab-content active" id="tab-students">
    <div class="panel">
        <div class="panel-header">
            <div class="panel-title">👤 Danh sách sinh viên</div>
            <button class="btn btn-primary" onclick="openStudentModal()">+ Thêm sinh viên</button>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Mã sinh viên</th>
                    <th>Họ tên</th>
                    <th>Tuổi</th>
                    <th>Lớp đăng ký</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody id="students-tbody">
                <tr><td colspan="5">
                    <div class="empty-state">
                        <div class="empty-icon">👤</div>
                        <p>Chưa có sinh viên nào</p>
                        <span class="empty-hint">Nhấn "Thêm sinh viên" để bắt đầu</span>
                    </div>
                </td></tr>
            </tbody>
        </table>
        <div class="pagination-wrapper" id="students-pagination"></div>
    </div>
</div>
