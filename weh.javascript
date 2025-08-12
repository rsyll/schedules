 // Current week tracking
        let currentDate = new Date();
        
        // DOM Elements
        const weekDaysEl = document.getElementById('week-days');
        const tasksContainerEl = document.getElementById('tasks-container');
        const currentWeekEl = document.getElementById('current-week');
        const prevWeekBtn = document.getElementById('prev-week');
        const nextWeekBtn = document.getElementById('next-week');

        // Predefined tasks for each day
        const predefinedTasks = {
            Monday: [
                "taga hugas (ronian)",
                "morning cook rice (pau)",
                "morning cook rice (roche)",
                "buy dinner (3)",
                "throw trash(ronian)"
                "lock gate(ronian)"
            ],
            Tuesday: [
                "wash dishes (pau)",
                "morning cook rice (roche)",
                "evening cook rice (ronian)",
                "tidy space(all)",
                "sweep the floor(morning;ronian)"
                 "lock gate(ronian)"
            ],
            Wednesday: [
                "wash dishes (roche)",
                "morning cook rice (ronian)",
                "evening cook rice (pau)",
                "sweep outside/inside (chelle)",
                "grocery(chelle/pau)"
                 "lock gate(ronian)"
            ],
            Thursday: [
                "wash dishes (ronian)",
                "morning cook rice (pau)",
                "morning cook rice (roche)",
                "buy dinner (3)",
                "throw trash(ronian)"
                 "lock gate(ronian)"
            ],
            Friday: [
               "wash dishes (pau)",
                "morning cook rice (roche)",
                "evening cook rice (ronian)",
                "tidy space(all)",
                "sweep the floor(morning;ronian),
                 "lock gate(ronian)"
            ],
            Saturday: [
               "wash dishes (roche)",
                "morning cook rice (ronian)",
                "evening cook rice (pau)",
                "sweep outside/inside (chelle)",
                "clean bathroom (ronian)"
            ],
            Sunday: [
                "break",
                "pagusto ka",
            ]
        };

        // Initialize
        renderWeek(currentDate);

        // Navigation
        prevWeekBtn.addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() - 7);
            renderWeek(currentDate);
        });

        nextWeekBtn.addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() + 7);
            renderWeek(currentDate);
        });

        // Render the week
        function renderWeek(date) {
            const startOfWeek = new Date(date);
            startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)); // Monday start

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            currentWeekEl.textContent = `Week of ${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;

            // Clear existing
            weekDaysEl.innerHTML = '';
            tasksContainerEl.innerHTML = '';

            // Render days (Monday to Sunday)
            for (let i = 0; i < 7; i++) {
                const day = new Date(startOfWeek);
                day.setDate(startOfWeek.getDate() + i);

                const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
                const shortDayName = day.toLocaleDateString('en-US', { weekday: 'short' });
                const dateNum = day.getDate();

                // Day header
                const dayEl = document.createElement('div');
                dayEl.className = 'day';
                
                // Highlight today
                const today = new Date();
                if (day.toDateString() === today.toDateString()) {
                    dayEl.classList.add('today');
                }
                
                dayEl.textContent = `${shortDayName} ${dateNum}`;
                weekDaysEl.appendChild(dayEl);

                // Task column
                const taskColumn = document.createElement('div');
                taskColumn.className = 'task-column';
                taskColumn.dataset.date = day.toISOString().split('T')[0]; // YYYY-MM-DD

                // Add predefined tasks
                const dayTasks = predefinedTasks[dayName] || [];
                dayTasks.forEach(task => {
                    addTaskToColumn(task, false, taskColumn);
                });

                // Task input (hidden in this version)
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'task-input';
                input.placeholder = 'Add a task...';
                input.style.display = 'none'; // Hide input in this version
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && input.value.trim()) {
                        addTaskToColumn(input.value.trim(), false, taskColumn);
                        saveTasks(day);
                        input.value = '';
                    }
                });

                taskColumn.appendChild(input);
                tasksContainerEl.appendChild(taskColumn);
            }
        }

        // Add task to a column
        function addTaskToColumn(text, completed, column) {
            const taskEl = document.createElement('div');
            taskEl.className = 'task-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = completed;
            checkbox.addEventListener('change', () => saveTasks(new Date(column.dataset.date)));

            const label = document.createElement('label');
            label.textContent = text;
            if (completed) {
                label.style.textDecoration = 'line-through';
                label.style.opacity = '0.7';
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '✕';
            deleteBtn.style.display = 'none'; // Hide delete button in this version
            deleteBtn.addEventListener('click', () => {
                taskEl.remove();
                saveTasks(new Date(column.dataset.date));
            });

            taskEl.appendChild(checkbox);
            taskEl.appendChild(label);
            taskEl.appendChild(deleteBtn);
            column.insertBefore(taskEl, column.lastChild); // Add before input
        }

        // Save tasks to localStorage
        function saveTasks(date) {
            const dateStr = date.toISOString().split('T')[0];
            const column = document.querySelector(`.task-column[data-date="${dateStr}"]`);
            const tasks = [];

            column.querySelectorAll('.task-item').forEach(taskEl => {
                tasks.push({
                    text: taskEl.querySelector('label').textContent,
                    completed: taskEl.querySelector('input').checked
                });
            });

            localStorage.setItem(dateStr, JSON.stringify(tasks));
        }

        // Helper: Format date as MM/DD/YYYY
        function formatDate(date) {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        }
