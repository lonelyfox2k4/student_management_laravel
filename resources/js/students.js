// =============================================
// MAIN ENTRY POINT - STUDENTS & CLASSROOMS APP
// =============================================

// 1. Core Modules
import { showToast } from './modules/toast.js';
import { initTabs, openModal, closeModal, initModalOverlays } from './modules/modal.js';

// 2. Feature Modules
import {
    loadStudents,
    openStudentModal,
    saveStudent,
    deleteStudent,
    viewStudent,
    editStudent,
    setStudentPage,
} from './modules/student.js';

import {
    loadClassrooms,
    openClassroomModal,
    saveClassroom,
    deleteClassroom,
    viewClassroom,
    editClassroom,
    setClassroomPage,
    setClassroomDetailPage,
} from './modules/classroom.js';

import {
    openEnrollModal,
    saveEnrollment,
    focusEnrollSearch,
    openEnrollDropdown,
    closeEnrollDropdown,
    toggleEnrollDropdown,
    filterEnrollDropdown,
    toggleEnrollClassSelection,
    removeEnrollClassSelection,
    showLimitWarning,
    initEnrollmentEvents,
} from './modules/enrollment.js';

// =============================================
// EXPOSE TO WINDOW (for inline HTML events)
// =============================================

// Modal & Toast
window.openModal = openModal;
window.closeModal = closeModal;
window.showToast = showToast;

// Student handlers
window.openStudentModal = openStudentModal;
window.saveStudent = saveStudent;
window.deleteStudent = deleteStudent;
window.viewStudent = viewStudent;
window.editStudent = editStudent;
window.setStudentPage = setStudentPage;

// Classroom handlers
window.openClassroomModal = openClassroomModal;
window.saveClassroom = saveClassroom;
window.deleteClassroom = deleteClassroom;
window.viewClassroom = viewClassroom;
window.editClassroom = editClassroom;
window.setClassroomPage = setClassroomPage;
window.setClassroomDetailPage = setClassroomDetailPage;

// Enrollment handlers
window.openEnrollModal = openEnrollModal;
window.saveEnrollment = saveEnrollment;
window.focusEnrollSearch = focusEnrollSearch;
window.openEnrollDropdown = openEnrollDropdown;
window.closeEnrollDropdown = closeEnrollDropdown;
window.toggleEnrollDropdown = toggleEnrollDropdown;
window.filterEnrollDropdown = filterEnrollDropdown;
window.toggleEnrollClassSelection = toggleEnrollClassSelection;
window.removeEnrollClassSelection = removeEnrollClassSelection;
window.showLimitWarning = showLimitWarning;

// =============================================
// BOOTSTRAP APPLICATION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initModalOverlays();
    initEnrollmentEvents();
    loadClassrooms().then(() => loadStudents());
});
