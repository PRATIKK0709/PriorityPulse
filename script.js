// script.js
document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const taskPriority = document.getElementById('taskPriority');
    const addTaskBtn = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Initialize Flatpickr
    flatpickr(taskDate, {
        dateFormat: "Y-m-d",
        minDate: "today"
    });

    // Initialize FullCalendar
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: tasks.map(task => ({
            title: task.text,
            start: task.date,
            backgroundColor: getPriorityColor(task.priority)
        }))
    });
    calendar.render();

    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = filterTasks();
        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="task-info">
                    <span class="task-text">${task.text}</span>
                    <div class="task-meta">
                        <span class="task-date"><i class="far fa-calendar"></i> ${task.date}</span>
                        <span class="task-priority"><i class="fas fa-flag"></i> ${task.priority}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="toggle-btn" data-index="${index}" title="Toggle Complete"><i class="fas fa-check"></i></button>
                    <button class="delete-btn" data-index="${index}" title="Delete Task"><i class="fas fa-trash"></i></button>
                </div>
            `;
            taskList.appendChild(li);
        });
        updateTaskCount();
        saveTasks();
        updateCalendar();
    }

    function addTask() {
        const text = taskInput.value.trim();
        const date = taskDate.value;
        const priority = taskPriority.value;
        if (text) {
            const newTask = { text, date, priority, completed: false };
            tasks.push(newTask);
            taskInput.value = '';
            taskDate.value = '';
            taskPriority.value = 'low';
            renderTasks();
            
            // Animate the new task
            const newTaskElement = taskList.lastElementChild;
            gsap.from(newTaskElement, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: "power2.out"
            });
        }
    }

    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        renderTasks();
    }

    function clearCompleted() {
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
    }

    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} remaining`;
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function filterTasks() {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        switch (activeFilter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            default:
                return tasks;
        }
    }

    function updateCalendar() {
        calendar.removeAllEvents();
        calendar.addEventSource(tasks.map(task => ({
            title: task.text,
            start: task.date,
            backgroundColor: getPriorityColor(task.priority)
        })));
    }

    function getPriorityColor(priority) {
        switch (priority) {
            case 'high':
                return '#e74c3c';
            case 'medium':
                return '#f39c12';
            default:
                return '#3498db';
        }
    }

    addTaskBtn.addEventListener('click', addTask);
    clearCompletedBtn.addEventListener('click', clearCompleted);

    taskList.addEventListener('click', function(e) {
        if (e.target.closest('.toggle-btn')) {
            const index = e.target.closest('.toggle-btn').dataset.index;
            toggleTask(parseInt(index));
        } else if (e.target.closest('.delete-btn')) {
            const index = e.target.closest('.delete-btn').dataset.index;
            deleteTask(parseInt(index));
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTasks();
        });
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}Tab`).classList.add('active');
            if (btn.dataset.tab === 'calendar') {
                calendar.render();
            }
        });
    });

    renderTasks();
});
