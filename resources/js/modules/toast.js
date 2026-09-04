// =============================================
// TOAST NOTIFICATIONS
// =============================================

/**
 * Display toast notification at bottom-right of screen
 * @param {string} message 
 * @param {'success'|'error'} type 
 */
export function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `${type === 'success' ? '✅' : '❌'} ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
