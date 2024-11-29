const taskList = document.querySelector('.task-collection');
const addTaskButton = document.querySelector('.task-add');

taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('task-delete')) {
        const task = e.target.closest('.task-entry');
        if (task) task.remove();
    }
});

addTaskButton.addEventListener('click', () => {
    const newTask = document.createElement('div');
    newTask.classList.add('task-entry');
    newTask.setAttribute('draggable', true);
    newTask.innerHTML = `
        <input type="text" class="task-text">
        <button class="task-delete"></button>
    `;
    taskList.appendChild(newTask);
    enableDragDrop(newTask);
});

function sortTasks(ascending) {
    const tasks = Array.from(document.querySelectorAll('.task-collection .task-entry'));

    tasks.sort((a, b) => {
        const aValue = a.querySelector('.task-text').value;
        const bValue = b.querySelector('.task-text').value;
        return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

    taskList.innerHTML = '';
    tasks.forEach(task => taskList.appendChild(task));
}

let isAscending = false;
const sortToggle = document.querySelector('.sort-toggle');

sortToggle.addEventListener('click', () => {
    sortToggle.classList.add('active');
    if (!isAscending) {
        sortToggle.classList.replace('descending', 'ascending');
    } else {
        sortToggle.classList.replace('ascending', 'descending');
    }
    isAscending = !isAscending;
    sortTasks(isAscending);
});

let draggedTask = null;
function enableDragDrop(task) {
    task.addEventListener('dragstart', () => {
        sortToggle.classList.remove('active');
        draggedTask = task;
        setTimeout(() => {
            task.style.display = 'none';
        }, 0);
    });

    task.addEventListener('dragend', () => {
        task.style.display = '';
        draggedTask = null;
    });

    task.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingAbove = e.clientY < task.getBoundingClientRect().top + task.offsetHeight / 2;
        if (draggingAbove) {
            taskList.insertBefore(draggedTask, task);
        } else if (task.nextSibling) {
            taskList.insertBefore(draggedTask, task.nextSibling);
        } else {
            taskList.appendChild(draggedTask);
        }
    });
}

enableDragDrop(document.querySelector('.task-collection .task-entry'));
