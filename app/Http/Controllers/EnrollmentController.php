<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Classroom;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EnrollmentController extends Controller
{
    /**
     * Danh sách đăng ký lớp
     */
    public function index(): JsonResponse
    {
        $enrollments = Enrollment::with(['student', 'classroom'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($enrollments);
    }

    /**
     * Đồng bộ danh sách lớp học của sinh viên (modal Đăng ký lớp)
     */
    public function sync(Request $request, Student $student): JsonResponse
    {
        $validated = $request->validate([
            'classroom_ids' => 'nullable|array|max:4',
            'classroom_ids.*' => 'exists:classrooms,id',
        ], [
            'classroom_ids.max' => 'Một sinh viên chỉ được đăng ký tối đa 4 lớp học.',
        ]);

        $classroomIds = $validated['classroom_ids'] ?? [];

        // Kiểm tra không quá 4 lớp
        if (count($classroomIds) > 4) {
            return response()->json([
                'message' => 'Một sinh viên không thể đăng ký quá 4 lớp học.',
                'errors' => ['classroom_ids' => ['Một sinh viên chỉ được đăng ký tối đa 4 lớp học.']]
            ], 422);
        }

        $currentIds = $student->classrooms()->pluck('classrooms.id')->toArray();
        $toAdd = array_diff($classroomIds, $currentIds);

        // Kiểm tra sĩ số các lớp mới đăng ký thêm (không quá 30 SV)
        foreach ($toAdd as $classroomId) {
            $count = Enrollment::where('classroom_id', $classroomId)->count();
            if ($count >= 30) {
                $classroom = Classroom::find($classroomId);
                $className = $classroom ? $classroom->name : "ID $classroomId";
                return response()->json([
                    'message' => "Lớp '{$className}' đã đạt giới hạn tối đa 30 sinh viên.",
                    'errors' => ['classroom_ids' => ["Lớp '{$className}' đã đủ 30 sinh viên."]]
                ], 422);
            }
        }

        // Xóa enrollment không còn trong danh sách
        $toRemove = array_diff($currentIds, $classroomIds);
        if (!empty($toRemove)) {
            Enrollment::where('student_id', $student->id)
                ->whereIn('classroom_id', $toRemove)
                ->delete();
        }

        // Thêm enrollment mới
        foreach ($toAdd as $classroomId) {
            Enrollment::create([
                'student_id' => $student->id,
                'classroom_id' => $classroomId,
                'enrolled_at' => now()->toDateString(),
            ]);
        }

        $student->load('classrooms');
        $student->loadCount('enrollments');

        return response()->json([
            'message' => 'Cập nhật đăng ký lớp thành công',
            'student' => $student,
        ]);
    }

    /**
     * Đăng ký sinh viên vào lớp
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'enrolled_at' => 'nullable|date',
        ]);

        // Kiểm tra đăng ký trùng
        $exists = Enrollment::where('student_id', $validated['student_id'])
            ->where('classroom_id', $validated['classroom_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Sinh viên đã đăng ký lớp này rồi',
                'errors' => ['classroom_id' => ['Sinh viên đã đăng ký lớp này rồi']]
            ], 422);
        }

        // Kiểm tra tối đa 4 lớp cho 1 sinh viên
        $studentClassCount = Enrollment::where('student_id', $validated['student_id'])->count();
        if ($studentClassCount >= 4) {
            return response()->json([
                'message' => 'Một sinh viên không thể đăng ký quá 4 lớp học.',
                'errors' => ['student_id' => ['Một sinh viên chỉ được đăng ký tối đa 4 lớp học.']]
            ], 422);
        }

        // Kiểm tra sĩ số tối đa 30 sinh viên / lớp
        $count = Enrollment::where('classroom_id', $validated['classroom_id'])->count();
        if ($count >= 30) {
            $classroom = Classroom::find($validated['classroom_id']);
            $className = $classroom ? $classroom->name : 'Lớp này';
            return response()->json([
                'message' => "Lớp '{$className}' đã đạt giới hạn tối đa 30 sinh viên.",
                'errors' => ['classroom_id' => ["Lớp '{$className}' đã đủ 30 sinh viên."]]
            ], 422);
        }

        $validated['enrolled_at'] = $validated['enrolled_at'] ?? now()->toDateString();

        $enrollment = Enrollment::create($validated);
        $enrollment->load(['student', 'classroom']);

        return response()->json($enrollment, 201);
    }

    /**
     * Hủy đăng ký
     */
    public function destroy(Enrollment $enrollment): JsonResponse
    {
        $enrollment->delete();
        return response()->json(['message' => 'Đã hủy đăng ký thành công']);
    }
}
