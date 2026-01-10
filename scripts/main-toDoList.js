let toDoList = JSON.parse(localStorage.getItem('toDoList')) || [];

const BACKEND_URL = 'https://farm-money-api.rakashev39.workers.dev';

const addBtn = document.querySelector('.to-do-add-btn');
const listContainer = document.querySelector('.to-do-list-container');


function saveToStorage() {
    localStorage.setItem('toDoList', JSON.stringify(toDoList));
}

function renderPage() {
    const tasksContainer = document.querySelector('.tasks');
    const completedTasksContainer = document.querySelector('.completed-tasks');
    
    if (!tasksContainer || !completedTasksContainer) return;

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

export async function syncDataToServer() {
    const user = JSON.parse(localStorage.getItem('tg_user'));
    if (!user) return;

    const payload = {
        userId: user.id,
        operations: JSON.parse(localStorage.getItem('historyRecords') || '[]'),
        state: {
            income: localStorage.getItem('income') || '0',
            expenses: localStorage.getItem('expenses') || '0',
            cleanIncomeExpenses: localStorage.getItem('cleanIncomeExpenses') || '0',
            todoList: JSON.parse(localStorage.getItem('toDoList') || '[]')
        }
    };

    try {
        await fetch(`${BACKEND_URL}/sync-all`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        console.log("Данные сохранены в облаке");
    } catch (e) {
        console.error("Ошибка синхронизации:", e);
    }
}

export async function loadUserData(userId) {
    try {
        const response = await fetch(`${BACKEND_URL}/load-all/${userId}`);
        const data = await response.json();

        if (data.operations && data.operations.length > 0) {
            localStorage.setItem('historyRecords', JSON.stringify(data.operations));
            
            if (data.state) {
                localStorage.setItem('income', data.state.income);
                localStorage.setItem('expenses', data.state.expenses);
                localStorage.setItem('cleanIncomeExpenses', data.state.clean_income_expenses);
                localStorage.setItem('toDoList', data.state.todo_list);
            }
            return true;
        }
    } catch (e) {
        console.error("Ошибка загрузки:", e);
    }
    return false;
}

if (addBtn) {
    addBtn.querySelector('.to-do-add-btn').addEventListener('click', () => {
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
        syncDataToServer();

        inputText.value = '';
        inputDate.value = '';

        renderPage();
    })
}

if(listContainer) {
    listContainer.querySelector('.to-do-list-container').addEventListener('click', (e) => {
        const taskEl = e.target.closest('.task');
        
        if(!taskEl) return;
        
        const taskId = taskEl.getAttribute('data-task-id');
        const index = toDoList.findIndex(task => task.id == taskId);

        if(e.target.classList.contains('checkbox')){
            toDoList[index].completed = e.target.checked;
            saveToStorage();
            renderPage();
            syncDataToServer();
        }

        if(e.target.classList.contains('delete-task-btn')) {
            toDoList.splice(index, 1)
            saveToStorage();
            renderPage();
            syncDataToServer();
        }
    });
}

window.addEventListener('load', async () => {
    const user = JSON.parse(localStorage.getItem('tg_user'));
    if (user) {
        console.log("Загрузка данных пользователя...");
        await loadUserData(user.id);
        renderPage();
    }
});

renderPage();