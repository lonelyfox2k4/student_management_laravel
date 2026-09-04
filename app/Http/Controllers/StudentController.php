<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StudentController extends Controller
{
    /**
     * Danh sách sinh viên
     */
    public function index(): JsonResponse
    {
        $students = Student::with(['classrooms'])->withCount('enrollments')->orderBy('created_at', 'desc')->get();
        return response()->json($students);
    }

    /**
     * Chi tiết sinh viên + danh sách lớp đã đăng ký
     */
    public function show(Student $student): JsonResponse
    {
        $student->load(['enrollments.classroom']);
        $student->loadCount('enrollments');
        return response()->json($student);
    }

    /**
     * Thêm sinh viên mới (chỉ cần mã SV, họ tên, tuổi)
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_code' => 'required|string|max:20|unique:students,student_code',
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:16|max:100',
        ]);

        $student = Student::create($validated);
        $student->load('classrooms');
        $student->loadCount('enrollments');

        return response()->json($student, 201);
    }

    /**
     * Cập nhật thông tin sinh viên (chỉ cần mã SV, họ tên, tuổi)
     */
    public function update(Request $request, Student $student): JsonResponse
    {
        $validated = $request->validate([
            'student_code' => 'required|string|max:20|unique:students,student_code,' . $student->id,
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:16|max:100',
        ]);

        $student->update($validated);
        $student->load('classrooms');
        $student->loadCount('enrollments');

        return response()->json($student);
    }

    /**
     * Xóa sinh viên
     */
    public function destroy(Student $student): JsonResponse
    {
        $student->delete();
        return response()->json(['message' => 'Đã xóa sinh viên thành công']);
    }
}
