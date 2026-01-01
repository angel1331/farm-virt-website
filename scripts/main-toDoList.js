let toDoList = JSON.parse(localStorage.getItem('toDoList')) || [];

function saveToStorage() {
    localStorage.setItem('toDoList', JSON.stringify(toDoList));
}

function renderPage() {
    const tasksContainer = document.querySelector('.tasks');
    const completedTasksContainer = document.querySelector('.completed-tasks');

    tasksContainer.innerHTML = '';
    completedTasksContainer.innerHTML = '';

    for (let i = 0 ; i < toDoList.length; i++) {
        const task = toDoList[i];

        const html = `
            <div class="task" data-task-id="${task.id}">
                <p class="task-text">${task.text}</p>
                <p class="task-date">${task.date}</p>
                <input class="checkbox" type="checkbox" ${task.completed ? 'checked' : ''}>
                <button class="delete-task-btn">Удалить</button>
            </div>
        `

        if(!task.completed) {
            tasksContainer.innerHTML += html;
        } else {
            completedTasksContainer.innerHTML += html;
        }
    }
}

document.querySelector('.to-do-add-btn').addEventListener('click', () => {
    const inputText = document.querySelector('.to-do-input');
    const inputDate = document.querySelector('.to-do-date-input');
    const inputTextValue = inputText.value;
    const inputDateValue = inputDate.value;

    if(inputTextValue === '') return;

    const toDoObject = {
        id: Date.now(),
        text: inputTextValue,
        date: inputDateValue,
        completed: false
    }

    toDoList.push(toDoObject);

    saveToStorage();

    inputText.value = '';
    inputDate.value = '';

    renderPage();
})

document.querySelector('.to-do-list-container').addEventListener('click', (e) => {
    const taskEl = e.target.closest('.task');
    
    if(!taskEl) return;
    
    const taskId = taskEl.getAttribute('data-task-id');
    const index = toDoList.findIndex(task => task.id == taskId);

    if(e.target.classList.contains('checkbox')){
        toDoList[index].completed = e.target.checked;
        saveToStorage();
        renderPage();
    }

    if(e.target.classList.contains('delete-task-btn')) {
        toDoList.splice(index, 1)
        saveToStorage();
        renderPage();
    }
})

renderPage();