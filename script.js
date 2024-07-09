        const form = document.getElementById('todo-form');
        const input = document.getElementById('todo-input');
        const todoList = document.getElementById('todo-list');
        const clearCompletedBtn = document.getElementById('clear-completed');
        const saveListBtn = document.getElementById('save-list');
        const todoCount = document.getElementById('todo-count');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        let filter = 'all';
        let celebrationShown = false;
    
        function saveTodos() {
            localStorage.setItem('todos', JSON.stringify(todos));
        }
    
        function updateProgressBar() {
            const totalTasks = todos.length;
            const completedTasks = todos.filter(todo => todo.completed).length;
            const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            const progressBar = document.getElementById('progress-bar');
            progressBar.style.width = `${progressPercentage}%`;
    
            if (progressPercentage === 100 && !celebrationShown) {
                celebrateCompletion();
                celebrationShown = true;
            } else if (progressPercentage < 100) {
                celebrationShown = false;
            }
        }
    
        function celebrateCompletion() {
    // Center burst
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    // Top left corner
    confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0 }
    });

    // Top right corner
    confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0 }
    });

    // Bottom left corner
    confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0, y: 1 }
    });

    // Bottom right corner
    confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 1, y: 1 }
    });

    // Left side
    confetti({
        particleCount: 50,
        angle: 90,
        spread: 55,
        origin: { x: 0, y: 0.5 }
    });

    // Right side
    confetti({
        particleCount: 50,
        angle: 90,
        spread: 55,
        origin: { x: 1, y: 0.5 }
    });
}

    
        function renderTodos() {
            todoList.innerHTML = '';
            const filteredTodos = filterTodos();
            filteredTodos.forEach((todo, index) => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-text">${todo.text}</span>
                    <span class="delete-btn">×</span>
                `;
                todoList.appendChild(li);
    
                li.querySelector('input[type="checkbox"]').addEventListener('change', () => toggleTodoCompletion(index));
                li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(index));
            });
            updateTodoCount();
            updateProgressBar();
        }
    
        function filterTodos() {
            switch (filter) {
                case 'active':
                    return todos.filter(todo => !todo.completed);
                case 'completed':
                    return todos.filter(todo => todo.completed);
                default:
                    return todos;
            }
        }
    
        function addTodo(text) {
            todos.push({ text, completed: false });
            saveTodos();
            renderTodos();
        }
    
        function toggleTodoCompletion(index) {
            todos[index].completed = !todos[index].completed;
            saveTodos();
            renderTodos();
        }
    
        function deleteTodo(index) {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        }
    
        function clearCompleted() {
            todos = todos.filter(todo => !todo.completed);
            saveTodos();
            renderTodos();
        }
    
        function updateTodoCount() {
            const remainingTodos = todos.filter(todo => !todo.completed).length;
            todoCount.textContent = `${remainingTodos} ${remainingTodos === 1 ? 'task' : 'tasks'} remaining`;
        }
    
        function saveList() {
            let textContent = "My Tasks:\n\n";
            todos.forEach(todo => {
                textContent += `• ${todo.completed ? '[✓] ' : '[ ] '}${todo.text}\n`;
            });
    
            const blob = new Blob([textContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", url);
            downloadAnchorNode.setAttribute("download", "my_tasks.txt");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
            URL.revokeObjectURL(url);
        }
    
        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            const icon = darkModeToggle.querySelector('i');
            icon.classList.toggle('fa-moon');
            icon.classList.toggle('fa-sun');
            localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
        }
    
        darkModeToggle.addEventListener('click', toggleDarkMode);
    
        // Load saved dark mode preference
        if (JSON.parse(localStorage.getItem('dark-mode'))) {
            document.body.classList.add('dark-mode');
            const icon = darkModeToggle.querySelector('i');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (input.value.trim()) {
                addTodo(input.value.trim());
                input.value = '';
            }
        });
    
        clearCompletedBtn.addEventListener('click', clearCompleted);
        saveListBtn.addEventListener('click', saveList);
    
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filter = btn.dataset.filter;
                renderTodos();
            });
        });
    
        // Initial render
        renderTodos();
