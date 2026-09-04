<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ClassroomController extends Controller
{
    /**
     * Danh sách lớp
     */
    public function index(): JsonResponse
    {
        $classrooms = Classroom::withCount('students')->orderBy('created_at', 'desc')->get();
        return response()->json($classrooms);
    }

    /**
     * Chi tiết lớp + danh sách sinh viên
     */
    public function show(Classroom $classroom): JsonResponse
    {
        $classroom->load(['students']);
        $classroom->loadCount('students');
        return response()->json($classroom);
    }

    /**
     * Thêm lớp mới
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'class_code' => 'required|string|max:20|unique:classrooms,class_code',
            'name' => 'required|string|max:255',
        ]);

        $classroom = Classroom::create($validated);

        return response()->json($classroom, 201);
    }

    /**
     * Cập nhật thông tin lớp
     */
    public function update(Request $request, Classroom $classroom): JsonResponse
    {
        $validated = $request->validate([
            'class_code' => 'required|string|max:20|unique:classrooms,class_code,' . $classroom->id,
            'name' => 'required|string|max:255',
        ]);

        $classroom->update($validated);

        return response()->json($classroom);
    }

    /**
     * Xóa lớp (không cho phép xóa nếu lớp đang có sinh viên)
     */
    public function destroy(Classroom $classroom): JsonResponse
    {
        $studentCount = $classroom->students()->count();
        if ($studentCount > 0) {
            return response()->json([
                'message' => "Không thể xóa lớp '{$classroom->name}' vì đang có {$studentCount} sinh viên theo học.",
                'errors' => ['classroom' => ["Không thể xóa lớp đang có sinh viên."]]
            ], 422);
        }

        $classroom->delete();
        return response()->json(['message' => 'Đã xóa lớp thành công']);
    }
}
