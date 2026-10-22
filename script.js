/**
 * EduTrack — Modern Student Task Hub Controller (Optimized & Structured)
 */
(() => {
    'use strict';

    const STORAGE_KEY = 'edutrack_tasks_v1';
    const THEME_KEY = 'edutrack_theme_mode';
    const $ = id => document.getElementById(id);

    const CATEGORIES = {
        Homework: { label: 'Homework', icon: '📚', cls: 'badge-category-homework' },
        Assignment: { label: 'Assignment', icon: '📝', cls: 'badge-category-assignment' },
        Exam: { label: 'Exam', icon: '🎯', cls: 'badge-category-exam' },
        Personal: { label: 'Personal', icon: '🌟', cls: 'badge-category-personal' }
    };

    const PRIORITIES = { Urgent: 4, High: 3, Medium: 2, Low: 1 };

    const getOffsetDate = days => {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
    };

    const SEED_TASKS = [
        { id: 'seed-1', title: 'Prepare CS201 Midterm Cheat Sheet & Proofs', description: 'Graph algorithms (DFS/BFS) and Dynamic Programming.', category: 'Exam', priority: 'Urgent', dueDate: getOffsetDate(1), completed: false },
        { id: 'seed-2', title: 'Calculus Assignment: Optimization Problems', description: 'Stewart Calculus Chapter 4 problems 12-28.', category: 'Assignment', priority: 'High', dueDate: getOffsetDate(3), completed: false },
        { id: 'seed-3', title: 'Physics Lab: Optics Error Analysis Report', description: 'Verify diffraction wavelength and error bars.', category: 'Homework', priority: 'Medium', dueDate: getOffsetDate(-1), completed: false },
        { id: 'seed-4', title: 'Advisor Meeting for Elective Course Registration', description: 'Select AI & Machine Learning electives.', category: 'Personal', priority: 'Low', dueDate: getOffsetDate(5), completed: true }
    ];

    let tasks = [];
    let filter = 'all';
    let category = 'all';
    let sortOrder = 'manual';
    let search = '';
    let draggedId = null;

    // LocalStorage Operations
    const loadTasks = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            tasks = raw ? JSON.parse(raw) : [...SEED_TASKS];
            if (!raw) saveTasks();
        } catch { tasks = [...SEED_TASKS]; }
    };
    const saveTasks = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

    // Toast & Theme
    const showToast = (msg, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<span>${type === 'success' ? '✅' : type === 'danger' ? '🗑️' : 'ℹ️'}</span> <span>${msg}</span>`;
        $('toast-container').appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 250); }, 2600);
    };

    const initTheme = () => {
        const saved = localStorage.getItem(THEME_KEY) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(saved);
        $('theme-toggle').onclick = () => {
            const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setTheme(next);
            showToast(`${next === 'dark' ? '🌙 Obsidian Gold Glass Mode' : '✨ Champagne Gold Glass Mode'} active`, 'info');
        };
    };

    const setTheme = t => {
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem(THEME_KEY, t);
        const icon = $('theme-toggle').querySelector('.theme-icon');
        if (icon) icon.textContent = t === 'dark' ? '☀️' : '🌙';
    };

    // Date calculations
    const isOverdue = (date, completed) => {
        if (!date || completed) return false;
        const today = new Date(); today.setHours(0,0,0,0);
        return new Date(date + 'T00:00:00') < today;
    };

    const formatRelativeDate = date => {
        if (!date) return '';
        const today = new Date(); today.setHours(0,0,0,0);
        const due = new Date(date + 'T00:00:00');
        const diff = Math.round((due - today) / 86400000);
        if (diff < 0) return `⚠️ Overdue (${Math.abs(diff)}d)`;
        if (diff === 0) return '📅 Due Today';
        if (diff === 1) return '📅 Tomorrow';
        if (diff < 7) return `📅 In ${diff} days`;
        return '📅 ' + due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    // Stats & Progress
    const updateStats = () => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const overdue = tasks.filter(t => isOverdue(t.dueDate, t.completed)).length;
        const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

        $('stat-total-count').textContent = total;
        $('stat-pending-count').textContent = pending;
        $('stat-completed-count').textContent = completed;
        $('stat-overdue-count').textContent = overdue;
        $('progress-bar-fill').style.width = `${pct}%`;
        $('progress-percent-label').textContent = `${pct}%`;

        $('progress-motto').textContent = total === 0 ? 'Add your first study goal above!'
            : pct === 100 ? '🎉 All goals complete! Amazing work!'
            : pct >= 50 ? '⚡ Over halfway done! Keep the momentum.'
            : '🌱 Ready to crush today’s study goals?';
    };

    // Filter & Sort Pipeline
    const getFilteredTasks = () => {
        return tasks.filter(t => {
            const matchesStatus = filter === 'all' || (filter === 'pending' && !t.completed) ||
                (filter === 'completed' && t.completed) || (filter === 'overdue' && isOverdue(t.dueDate, t.completed));
            const matchesCat = category === 'all' || t.category === category;
            const q = search.toLowerCase().trim();
            const matchesSearch = !q || t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q));
            return matchesStatus && matchesCat && matchesSearch;
        }).sort((a, b) => {
            if (sortOrder === 'dueDateAsc') return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
            if (sortOrder === 'dueDateDesc') return (b.dueDate || '').localeCompare(a.dueDate || '');
            if (sortOrder === 'priority') return (PRIORITIES[b.priority] || 0) - (PRIORITIES[a.priority] || 0);
            if (sortOrder === 'nameAsc') return a.title.localeCompare(b.title);
            if (sortOrder === 'nameDesc') return b.title.localeCompare(a.title);
            return 0; // manual order
        });
    };

    // Render
    const render = () => {
        updateStats();
        const list = $('task-list');
        const empty = $('empty-state');
        const items = getFilteredTasks();

        $('drag-hint').style.display = sortOrder === 'manual' && items.length > 1 ? 'flex' : 'none';
        list.innerHTML = '';

        if (!items.length) {
            empty.style.display = 'flex';
            $('empty-title').textContent = (search || filter !== 'all' || category !== 'all') ? 'No matching tasks' : 'Task list is empty';
            $('empty-reset-btn').style.display = (search || filter !== 'all' || category !== 'all') ? 'inline-block' : 'none';
            return;
        }
        empty.style.display = 'none';

        items.forEach(task => {
            const overdue = isOverdue(task.dueDate, task.completed);
            const isToday = task.dueDate === getOffsetDate(0);
            const cat = CATEGORIES[task.category] || CATEGORIES.Homework;
            const dateBadge = task.dueDate ? `<span class="badge badge-due-date ${overdue ? 'is-overdue' : isToday ? 'is-today' : ''}">${formatRelativeDate(task.dueDate)}</span>` : '';

            const li = document.createElement('li');
            li.className = `task-card ${task.completed ? 'is-completed' : ''} ${overdue ? 'is-overdue' : ''}`;
            li.setAttribute('data-id', task.id);
            li.draggable = sortOrder === 'manual';

            li.innerHTML = `
                <div class="drag-handle" title="Drag to reorder">⋮⋮</div>
                <input type="checkbox" class="custom-checkbox" ${task.completed ? 'checked' : ''} aria-label="Toggle completed">
                <div class="task-content">
                    <span class="task-title">${escape(task.title)}</span>
                    ${task.description ? `<p class="task-desc">${escape(task.description)}</p>` : ''}
                    <div class="task-meta-row">
                        <span class="badge ${cat.cls}">${cat.icon} ${cat.label}</span>
                        <span class="badge badge-priority-${task.priority.toLowerCase()}">${task.priority}</span>
                        ${dateBadge}
                    </div>
                </div>
                <div class="task-actions">
                    <button type="button" class="action-btn btn-edit" title="Edit">✏️</button>
                    <button type="button" class="action-btn btn-delete" title="Delete">🗑️</button>
                </div>
            `;

            // Card Event Handlers
            li.querySelector('.custom-checkbox').onchange = () => toggleTask(task.id);
            li.querySelector('.btn-edit').onclick = e => { e.stopPropagation(); openEdit(task.id); };
            li.querySelector('.btn-delete').onclick = e => { e.stopPropagation(); deleteTask(task.id); };

            // Drag & Drop
            li.ondragstart = e => { draggedId = task.id; li.classList.add('is-dragging'); e.dataTransfer.setData('text/plain', task.id); };
            li.ondragend = () => { li.classList.remove('is-dragging'); clearDragStyles(); draggedId = null; };
            li.ondragover = e => {
                if (!draggedId || draggedId === task.id || sortOrder !== 'manual') return;
                e.preventDefault();
                const mid = li.getBoundingClientRect().top + li.offsetHeight / 2;
                li.classList.toggle('drag-over-top', e.clientY < mid);
                li.classList.toggle('drag-over-bottom', e.clientY >= mid);
            };
            li.ondragleave = () => clearDragStyles(li);
            li.ondrop = e => {
                if (!draggedId || draggedId === task.id || sortOrder !== 'manual') return;
                e.preventDefault();
                const before = e.clientY < (li.getBoundingClientRect().top + li.offsetHeight / 2);
                reorder(draggedId, task.id, before);
                clearDragStyles();
            };

            list.appendChild(li);
        });
    };

    const clearDragStyles = el => (el ? [el] : document.querySelectorAll('.task-card')).forEach(c => c.classList.remove('drag-over-top', 'drag-over-bottom'));

    const reorder = (srcId, tgtId, before) => {
        const srcIdx = tasks.findIndex(t => t.id === srcId);
        const tgtIdx = tasks.findIndex(t => t.id === tgtId);
        if (srcIdx === -1 || tgtIdx === -1) return;
        const [item] = tasks.splice(srcIdx, 1);
        const dest = tasks.findIndex(t => t.id === tgtId);
        tasks.splice(before ? dest : dest + 1, 0, item);
        saveTasks(); render(); showToast('Order updated', 'info');
    };

    // Task Actions
    const toggleTask = id => {
        const t = tasks.find(x => x.id === id);
        if (!t) return;
        t.completed = !t.completed;
        saveTasks(); render();
        showToast(t.completed ? 'Goal completed! 🎉' : 'Marked active', t.completed ? 'success' : 'info');
    };

    const deleteTask = id => {
        const t = tasks.find(x => x.id === id);
        if (!t) return;
        tasks = tasks.filter(x => x.id !== id);
        saveTasks(); render();
        showToast(`Deleted: "${t.title}"`, 'danger');
    };

    const openEdit = id => {
        const t = tasks.find(x => x.id === id);
        if (!t) return;
        $('edit-task-id').value = t.id;
        $('edit-task-title').value = t.title;
        $('edit-task-desc').value = t.description || '';
        $('edit-task-category').value = t.category;
        $('edit-task-priority').value = t.priority;
        $('edit-task-due-date').value = t.dueDate || '';
        $('edit-modal').classList.add('open');
        $('edit-task-title').focus();
    };

    const closeEdit = () => { $('edit-modal').classList.remove('open'); $('edit-task-form').reset(); };

    const escape = s => s ? s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) : '';

    // Events Setup
    const setupEvents = () => {
        $('add-task-form').onsubmit = e => {
            e.preventDefault();
            const title = $('task-title-input').value.trim();
            if (!title) return;
            tasks.unshift({
                id: 'task-' + Date.now(),
                title,
                description: $('task-desc-input').value.trim(),
                category: $('task-category-select').value,
                priority: $('task-priority-select').value,
                dueDate: $('task-due-date').value,
                completed: false
            });
            saveTasks(); render();
            $('add-task-form').reset();
            showToast('Task added successfully', 'success');
        };

        document.querySelectorAll('.chip-btn').forEach(btn => {
            btn.onclick = () => $('task-due-date').value = getOffsetDate(+btn.dataset.dateOffset);
        });

        $('toggle-form-btn').onclick = () => {
            const closed = $('add-task-form').classList.toggle('collapsed');
            $('toggle-form-text').textContent = closed ? 'Expand' : 'Collapse';
        };

        $('search-input').oninput = e => {
            search = e.target.value;
            $('clear-search-btn').style.display = search ? 'block' : 'none';
            render();
        };

        $('clear-search-btn').onclick = () => {
            search = ''; $('search-input').value = ''; $('clear-search-btn').style.display = 'none';
            $('search-input').focus(); render();
        };

        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.onclick = () => {
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                filter = tab.dataset.filter;
                render();
            };
        });

        $('category-filter-select').onchange = e => { category = e.target.value; render(); };
        $('sort-select').onchange = e => { sortOrder = e.target.value; render(); };

        $('clear-completed-btn').onclick = () => {
            const count = tasks.filter(t => t.completed).length;
            if (!count) return showToast('No completed tasks to clear', 'info');
            if (confirm(`Clear all ${count} completed task(s)?`)) {
                tasks = tasks.filter(t => !t.completed);
                saveTasks(); render(); showToast(`Cleared ${count} task(s)`, 'danger');
            }
        };

        $('empty-reset-btn').onclick = () => {
            search = ''; $('search-input').value = ''; $('clear-search-btn').style.display = 'none';
            filter = 'all'; category = 'all'; $('category-filter-select').value = 'all';
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.toggle('active', t.dataset.filter === 'all'));
            render();
        };

        $('edit-task-form').onsubmit = e => {
            e.preventDefault();
            const t = tasks.find(x => x.id === $('edit-task-id').value);
            if (t) {
                t.title = $('edit-task-title').value.trim();
                t.description = $('edit-task-desc').value.trim();
                t.category = $('edit-task-category').value;
                t.priority = $('edit-task-priority').value;
                t.dueDate = $('edit-task-due-date').value;
                saveTasks(); render(); closeEdit();
                showToast('Task updated', 'success');
            }
        };

        $('close-modal-btn').onclick = closeEdit;
        $('cancel-edit-btn').onclick = closeEdit;
        $('edit-modal').onclick = e => { if (e.target === $('edit-modal')) closeEdit(); };

        window.onkeydown = e => {
            if (e.key === 'Escape' && $('edit-modal').classList.contains('open')) closeEdit();
            if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                e.preventDefault(); $('search-input').focus();
            }
        };

        $('export-btn').onclick = () => {
            const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `edutrack-${getOffsetDate(0)}.json`;
            a.click();
            URL.revokeObjectURL(a.href);
            showToast('Exported backup JSON', 'success');
        };
    };

    // Initialize
    initTheme();
    loadTasks();
    setupEvents();
    render();
})();
