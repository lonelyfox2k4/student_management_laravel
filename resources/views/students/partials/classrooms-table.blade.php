<!-- TAB: CLASSROOMS -->
<div class="tab-content" id="tab-classrooms">
    <div class="panel">
        <div class="panel-header">
            <div class="panel-title">📚 Danh sách lớp học</div>
            <button class="btn btn-primary" onclick="openClassroomModal()">+ Thêm lớp</button>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Mã lớp</th>
                    <th>Tên lớp</th>
                    <th>Số sinh viên</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody id="classrooms-tbody">
                <tr><td colspan="4">
                    <div class="empty-state">
                        <div class="empty-icon">📚</div>
                        <p>Chưa có lớp nào</p>
                        <span class="empty-hint">Nhấn "Thêm lớp" để bắt đầu</span>
                    </div>
                </td></tr>
            </tbody>
        </table>
        <div class="pagination-wrapper" id="classrooms-pagination"></div>
    </div>
</div>
