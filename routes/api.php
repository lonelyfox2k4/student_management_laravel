<?php

use App\Http\Controllers\StudentController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\EnrollmentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Quản lý sinh viên
|--------------------------------------------------------------------------
*/

Route::apiResource('students', StudentController::class);
Route::put('students/{student}/enrollments', [EnrollmentController::class, 'sync']);
Route::apiResource('classrooms', ClassroomController::class);
Route::apiResource('enrollments', EnrollmentController::class)->only(['index', 'store', 'destroy']);
