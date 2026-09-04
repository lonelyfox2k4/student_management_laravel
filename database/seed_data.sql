-- ==========================================================
-- SCRIPT SQL TẠO DỮ LIỆU MẪU: 10 LỚP HỌC & 40 SINH VIÊN & ENROLLMENT
-- Database: student_management
-- Hệ quản trị CSDL: MySQL
-- ==========================================================

-- ----------------------------------------------------------
-- 1. TẠO 10 LỚP HỌC (CLASSROOMS)
-- ----------------------------------------------------------
INSERT INTO `classrooms` (`class_code`, `name`, `created_at`, `updated_at`) VALUES
('CNTT_01', 'Lập trình Web nâng cao (Laravel & Vue)', NOW(), NOW()),
('CNTT_02', 'Lập trình Di động Đa nền tảng (Flutter)', NOW(), NOW()),
('KHMT_01', 'Trí tuệ Nhân tạo & Xử lý Ngôn ngữ Tự nhiên', NOW(), NOW()),
('KHMT_02', 'Học máy & Khai phá Dữ liệu Lớn', NOW(), NOW()),
('HTTT_01', 'Hệ Quản trị Cơ sở Dữ liệu Nâng cao', NOW(), NOW()),
('HTTT_02', 'Phân tích & Thiết kế Hệ thống Thông tin', NOW(), NOW()),
('ANM_01',  'An toàn & Bảo mật Thông tin Mạng', NOW(), NOW()),
('MANG_01', 'Điện toán Đám mây & Kiến trúc Hệ thống', NOW(), NOW()),
('KTPM_01', 'Công nghệ Phần mềm & DevOps', NOW(), NOW()),
('KTPM_02', 'Kiểm thử & Đảm bảo Chất lượng Phần mềm', NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ----------------------------------------------------------
-- 2. TẠO 40 SINH VIÊN (STUDENTS)
-- ----------------------------------------------------------
INSERT INTO `students` (`student_code`, `name`, `age`, `created_at`, `updated_at`) VALUES
('SV101', 'Nguyễn Văn An', 20, NOW(), NOW()),
('SV102', 'Trần Thị Bích', 21, NOW(), NOW()),
('SV103', 'Lê Hoàng Cường', 19, NOW(), NOW()),
('SV104', 'Phạm Minh Dũng', 22, NOW(), NOW()),
('SV105', 'Hoàng Quốc Em', 20, NOW(), NOW()),
('SV106', 'Vũ Thị Phương', 21, NOW(), NOW()),
('SV107', 'Đặng Thành Giang', 23, NOW(), NOW()),
('SV108', 'Bùi Thu Hương', 20, NOW(), NOW()),
('SV109', 'Đỗ Quang Huy', 19, NOW(), NOW()),
('SV110', 'Ngô Bảo Khánh', 22, NOW(), NOW()),
('SV111', 'Dương Thùy Linh', 21, NOW(), NOW()),
('SV112', 'Lý Tuấn Minh', 20, NOW(), NOW()),
('SV113', 'Đinh Ngọc Nga', 19, NOW(), NOW()),
('SV114', 'Trịnh Thế Phong', 22, NOW(), NOW()),
('SV115', 'Võ Hồng Quân', 20, NOW(), NOW()),
('SV116', 'Trương Quốc Sơn', 21, NOW(), NOW()),
('SV117', 'Mai Thảo Trang', 23, NOW(), NOW()),
('SV118', 'Phan Gia Uy', 20, NOW(), NOW()),
('SV119', 'Đoàn Bảo Vy', 21, NOW(), NOW()),
('SV120', 'Tạ Đình Xuân', 19, NOW(), NOW()),
('SV121', 'Cao Minh Anh', 22, NOW(), NOW()),
('SV122', 'Hồ Diệu Châu', 20, NOW(), NOW()),
('SV123', 'Lâm Khắc Duy', 21, NOW(), NOW()),
('SV124', 'Quách Hải Đăng', 19, NOW(), NOW()),
('SV125', 'Lưu Thị Gấm', 22, NOW(), NOW()),
('SV126', 'Bạch Thái Hà', 20, NOW(), NOW()),
('SV127', 'Phùng Vĩnh Hưng', 21, NOW(), NOW()),
('SV128', 'Thân Trọng Khoa', 23, NOW(), NOW()),
('SV129', 'Thái Thảo Lam', 20, NOW(), NOW()),
('SV130', 'Cù Trọng Mạnh', 19, NOW(), NOW()),
('SV131', 'Nghiêm Tuyết Như', 22, NOW(), NOW()),
('SV132', 'Châu Phúc Nguyên', 21, NOW(), NOW()),
('SV133', 'Ân Hữu Phát', 20, NOW(), NOW()),
('SV134', 'Khổng Đình Quang', 19, NOW(), NOW()),
('SV135', 'Lương Diễm Quỳnh', 22, NOW(), NOW()),
('SV136', 'Tôn Thất Sang', 20, NOW(), NOW()),
('SV137', 'Mã Quốc Tuấn', 21, NOW(), NOW()),
('SV138', 'Vương Thúy Vi', 23, NOW(), NOW()),
('SV139', 'Liêu Quang Vĩ', 20, NOW(), NOW()),
('SV140', 'Trầm Hữu Ý', 19, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `age` = VALUES(`age`);

-- ----------------------------------------------------------
-- 3. TẠO ĐĂNG KÝ LỚP HỌC (ENROLLMENTS)
-- Sử dụng subquery theo mã sinh viên và mã lớp để bảo đảm khóa ngoại chính xác
-- ----------------------------------------------------------
INSERT IGNORE INTO `enrollments` (`student_id`, `classroom_id`, `enrolled_at`, `created_at`, `updated_at`)
SELECT s.id, c.id, '2026-08-15', NOW(), NOW()
FROM students s, classrooms c
WHERE s.student_code IN ('SV101', 'SV102', 'SV103', 'SV104', 'SV105', 'SV111', 'SV112', 'SV121', 'SV122', 'SV131')
  AND c.class_code = 'CNTT_01';

INSERT IGNORE INTO `enrollments` (`student_id`, `classroom_id`, `enrolled_at`, `created_at`, `updated_at`)
SELECT s.id, c.id, '2026-08-18', NOW(), NOW()
FROM students s, classrooms c
WHERE s.student_code IN ('SV103', 'SV105', 'SV106', 'SV107', 'SV108', 'SV113', 'SV114', 'SV123', 'SV124', 'SV132', 'SV133')
  AND c.class_code = 'CNTT_02';

INSERT IGNORE INTO `enrollments` (`student_id`, `classroom_id`, `enrolled_at`, `created_at`, `updated_at`)
SELECT s.id, c.id, '2026-08-20', NOW(), NOW()
FROM students s, classrooms c
WHERE s.student_code IN ('SV101', 'SV107', 'SV109', 'SV110', 'SV115', 'SV116', 'SV125', 'SV126', 'SV134', 'SV135')
  AND c.class_code = 'KHMT_01';

INSERT IGNORE INTO `enrollments` (`student_id`, `classroom_id`, `enrolled_at`, `created_at`, `updated_at`)
SELECT s.id, c.id, '2026-08-22', NOW(), NOW()
FROM students s, classrooms c
WHERE s.student_code IN ('SV102', 'SV108', 'SV111', 'SV112', 'SV117', 'SV118', 'SV127', 'SV128', 'SV136', 'SV137')
  AND c.class_code = 'KHMT_02';

INSERT IGNORE INTO `enrollments` (`student_id`, `classroom_id`, `enrolled_at`, `created_at`, `updated_at`)
SELECT s.id, c.id, '2026-08-25', NOW(), NOW()
FROM students s, classrooms c
WHERE s.student_code IN ('SV104', 'SV109', 'SV113', 'SV114', 'SV119', 'SV120', 'SV129', 'SV130', 'SV138', 'SV139')
  AND c.class_code = 'HTTT_01';

INSERT IGNORE INTO `enrollments` (`student_id`, `classroom_id`, `enrolled_at`, `created_at`, `updated_at`)
SELECT s.id, c.id, '2026-08-26', NOW(), NOW()
FROM students s, classrooms c
WHERE s.student_code IN ('SV105', 'SV110', 'SV115', 'SV116', 'SV121', 'SV122', 'SV131', 'SV132', 'SV140')
  AND c.class_code = 'HTTT_02';

INSERT IGNORE INTO `enrollments` (`student_id`, `classroom_id`, `enrolled_at`, `created_at`, `updated_at`)
SELECT s.id, c.id, '2026-08-28', NOW(), NOW()
FROM students s, classrooms c
WHERE s.student_code IN ('SV106', 'SV117', 'SV118', 'SV123', 'SV124', 'SV133', 'SV134')
  AND c.class_code = 'ANM_01';

INSERT IGNORE INTO `enrollments` (`student_id`, `classroom_id`, `enrolled_at`, `created_at`, `updated_at`)
SELECT s.id, c.id, '2026-08-30', NOW(), NOW()
FROM students s, classrooms c
WHERE s.student_code IN ('SV102', 'SV107', 'SV119', 'SV120', 'SV125', 'SV126', 'SV135', 'SV136')
  AND c.class_code = 'MANG_01';

INSERT IGNORE INTO `enrollments` (`student_id`, `classroom_id`, `enrolled_at`, `created_at`, `updated_at`)
SELECT s.id, c.id, '2026-09-01', NOW(), NOW()
FROM students s, classrooms c
WHERE s.student_code IN ('SV101', 'SV103', 'SV108', 'SV127', 'SV128', 'SV137', 'SV138')
  AND c.class_code = 'KTPM_01';

INSERT IGNORE INTO `enrollments` (`student_id`, `classroom_id`, `enrolled_at`, `created_at`, `updated_at`)
SELECT s.id, c.id, '2026-09-03', NOW(), NOW()
FROM students s, classrooms c
WHERE s.student_code IN ('SV104', 'SV106', 'SV109', 'SV129', 'SV130', 'SV139', 'SV140')
  AND c.class_code = 'KTPM_02';
