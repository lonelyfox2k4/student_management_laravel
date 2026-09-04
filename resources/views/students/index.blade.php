@extends('layout')

@section('title', 'Quản Lý Sinh Viên')

@section('styles')
@vite(['resources/css/students.css'])
@endsection

@section('content')
<div class="app-container">
    @include('students.partials.header')
    @include('students.partials.tabs')
    @include('students.partials.students-table')
    @include('students.partials.classrooms-table')
</div>

<!-- Modals -->
@include('students.partials.modal-student')
@include('students.partials.modal-enrollment')
@include('students.partials.modal-student-detail')
@include('students.partials.modal-classroom')
@include('students.partials.modal-classroom-detail')

<!-- Toast -->
@include('students.partials.toast')
@endsection

@section('scripts')
@vite(['resources/js/students.js'])
@endsection
