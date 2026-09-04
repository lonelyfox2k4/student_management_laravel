// =============================================
// API CLIENT & CONFIGURATION
// =============================================

export const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]')?.content || '';

export const API = {
    students: '/api/students',
    classrooms: '/api/classrooms',
};

/**
 * Wrapper for fetch API with JSON and CSRF header handling
 */
export async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': CSRF_TOKEN,
            ...options.headers,
        },
    });
    const data = await res.json();
    if (!res.ok) throw { status: res.status, data };
    return data;
}
