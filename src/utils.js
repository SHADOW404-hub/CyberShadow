export const escapeHTML = (str) => {
    if (!str) return "";
    return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
};

let notificationQueue = [];
let isNotificationShowing = false;

const processQueue = () => {
    if (notificationQueue.length === 0 || isNotificationShowing) return;

    isNotificationShowing = true;
    const { message, type } = notificationQueue.shift();

    let notification = document.getElementById('cyber-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'cyber-notification';
        document.body.appendChild(notification);
    }

    notification.textContent = message.toUpperCase();
    notification.className = `notification-overlay show notification-${type}`;

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            isNotificationShowing = false;
            processQueue();
        }, 400); // Wait for fade-out
    }, 3000);
};

export const showNotification = (message, type = 'info') => {
    notificationQueue.push({ message, type });
    processQueue();
};

export const updateClock = (elementId) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    el.textContent = `TIME: ${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

export const updateStatusUI = (stateClass, text) => {
    const indicator = document.querySelector('.status-indicator');
    const console = document.getElementById('statusConsole');
    if (indicator) indicator.className = `status-indicator ${stateClass}`;
    if (console) console.textContent = `SYSTEM: ${text.toUpperCase()}`;
};