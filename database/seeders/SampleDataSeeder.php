<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Classroom;
use App\Models\Enrollment;
use Illuminate\Support\Facades\DB;

class SampleDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Tạo 10 Lớp học
        $classroomsData = [
            ['class_code' => 'CNTT_02', 'name' => 'Lập trình Web nâng cao (Laravel & Vue)'],
            ['class_code' => 'CNTT_03', 'name' => 'Lập trình Di động Đa nền tảng (Flutter)'],
            ['class_code' => 'KHMT_01', 'name' => 'Trí tuệ Nhân tạo & Xử lý Ngôn ngữ Tự nhiên'],
            ['class_code' => 'KHMT_02', 'name' => 'Học máy & Khai phá Dữ liệu Lớn'],
            ['class_code' => 'HTTT_01', 'name' => 'Hệ Quản trị Cơ sở Dữ liệu Nâng cao'],
            ['class_code' => 'HTTT_02', 'name' => 'Phân tích & Thiết kế Hệ thống Thông tin'],
            ['class_code' => 'ANM_01',  'name' => 'An toàn & Bảo mật Thông tin Mạng'],
            ['class_code' => 'MANG_01', 'name' => 'Điện toán Đám mây & Kiến trúc Hệ thống'],
            ['class_code' => 'KTPM_01', 'name' => 'Công nghệ Phần mềm & DevOps'],
            ['class_code' => 'KTPM_02', 'name' => 'Kiểm thử & Đảm bảo Chất lượng Phần mềm'],
        ];

        $createdClassrooms = [];
        foreach ($classroomsData as $c) {
            $createdClassrooms[] = Classroom::firstOrCreate(
                ['class_code' => $c['class_code']],
                ['name' => $c['name']]
            );
        }

        // 2. Danh sách 40 Sinh viên với họ tên tiếng Việt
        $names = [
            'Nguyễn Văn An', 'Trần Thị Bích', 'Lê Hoàng Cường', 'Phạm Minh Dũng',
            'Hoàng Quốc Em', 'Vũ Thị Phương', 'Đặng Thành Giang', 'Bùi Thu Hương',
            'Đỗ Quang Huy', 'Ngô Bảo Khánh', 'Dương Thùy Linh', 'Lý Tuấn Minh',
            'Đinh Ngọc Nga', 'Trịnh Thế Phong', 'Võ Hồng Quân', 'Trương Quốc Sơn',
            'Mai Thảo Trang', 'Phan Gia Uy', 'Đoàn Bảo Vy', 'Tạ Đình Xuân',
            'Cao Minh Anh', 'Hồ Diệu Châu', 'Lâm Khắc Duy', 'Quách Hải Đăng',
            'Lưu Thị Gấm', 'Bạch Thái Hà', 'Phùng Vĩnh Hưng', 'Thân Trọng Khoa',
            'Thái Thảo Lam', 'Cù Trọng Mạnh', 'Nghiêm Tuyết Như', 'Châu Phúc Nguyên',
            'Ân Hữu Phát', 'Khổng Đình Quang', 'Lương Diễm Quỳnh', 'Tôn Thất Sang',
            'Mã Quốc Tuấn', 'Vương Thúy Vi', 'Liêu Quang Vĩ', 'Trầm Hữu Ý'
        ];

        $createdStudents = [];
        $now = now();

        foreach ($names as $idx => $name) {
            $studentCode = 'SV' . str_pad($idx + 10, 3, '0', STR_PAD_LEFT);
            $age = rand(18, 23);

            $createdStudents[] = Student::firstOrCreate(
                ['student_code' => $studentCode],
                [
                    'name' => $name,
                    'age' => $age,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        // 3. Tạo enrollment (mỗi lớp tối đa 30 SV, mỗi SV đăng ký 1 - 3 lớp)
        $classroomCounts = array_fill(0, count($createdClassrooms), 0);

        foreach ($createdStudents as $sIdx => $student) {
            // Mỗi sinh viên đăng ký ngẫu nhiên 1 đến 3 lớp (có thể có SV chưa đăng ký)
            $enrollCount = ($sIdx % 8 === 0) ? 0 : rand(1, 3);
            if ($enrollCount === 0) continue;

            $shuffledIndices = range(0, count($createdClassrooms) - 1);
            shuffle($shuffledIndices);

            $registered = 0;
            foreach ($shuffledIndices as $cIdx) {
                if ($registered >= $enrollCount) break;

                // Đảm bảo không vượt quá 28 sinh viên/lớp (để lớp vẫn còn chỗ < 30)
                if ($classroomCounts[$cIdx] < 28) {
                    $classroom = $createdClassrooms[$cIdx];
                    $randomDays = rand(1, 30);
                    $enrollDate = now()->subDays($randomDays)->toDateString();

                    Enrollment::firstOrCreate(
                        [
                            'student_id' => $student->id,
                            'classroom_id' => $classroom->id,
                        ],
                        [
                            'enrolled_at' => $enrollDate,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );

                    $classroomCounts[$cIdx]++;
                    $registered++;
                }
            }
        }
    }
}
