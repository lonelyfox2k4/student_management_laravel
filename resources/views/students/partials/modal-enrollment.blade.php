<!-- MODAL: Enroll Student into Classrooms -->
<div class="modal-overlay" id="enroll-modal">
    <div class="modal modal-md">
        <div class="modal-header">
            <h2 id="enroll-modal-title">📝 Đăng ký lớp học</h2>
            <button class="modal-close" onclick="closeModal('enroll-modal')">&times;</button>
        </div>
        <div class="modal-body">
            <form id="enroll-form" onsubmit="saveEnrollment(event)">
                <input type="hidden" id="enroll-student-id">
                
                <!-- Student Info Card -->
                <div class="student-brief-card" id="enroll-student-info">
                    <!-- Populated by JS -->
                </div>

                <div class="form-group">
                    <label>Lớp học đã đăng ký <span id="enroll-limit-badge" class="capacity-badge" style="margin-left:8px;font-size:0.75rem"></span></label>
                    <div class="selected-tags-container" id="enroll-selected-tags"></div>
                </div>

                <div class="form-group">
                    <label>Tìm và thêm lớp học</label>
                    <div class="search-dropdown-wrapper" id="enroll-dropdown-wrapper">
                        <div class="dropdown-input-box" id="enroll-dropdown-box" onclick="focusEnrollSearch()">
                            <span class="dropdown-search-icon">🔍</span>
                            <input type="text" 
                                   id="enroll-search-input" 
                                   class="dropdown-search-input" 
                                   placeholder="Tìm kiếm theo tên hoặc mã lớp..." 
                                   autocomplete="off"
                                   onfocus="openEnrollDropdown()"
                                   oninput="filterEnrollDropdown(this.value)">
                            <button type="button" class="dropdown-arrow-btn" id="enroll-dropdown-arrow-btn" onclick="toggleEnrollDropdown(event)">▼</button>
                        </div>

                        <!-- Dropdown Menu List -->
                        <div class="dropdown-menu-list" id="enroll-dropdown-menu">
                            <!-- Populated by JS -->
                        </div>
                    </div>
                    <div class="form-error" id="error-enroll-classroom-ids"></div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-ghost" onclick="closeModal('enroll-modal')">Hủy</button>
                    <button type="submit" class="btn btn-primary" id="enroll-submit-btn">Lưu đăng ký</button>
                </div>
            </form>
        </div>
    </div>
</div>
