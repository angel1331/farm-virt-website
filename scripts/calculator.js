import { syncDataToServer } from "./main-toDoList.js";

let income = Number(localStorage.getItem('income') ?? 0);
let expenses = Number(localStorage.getItem('expenses') ?? 0);

let historyRecords = JSON.parse(localStorage.getItem('historyRecords')) || [];

let editingRecordId = null; 

const BACKEND_URL = 'https://farm-money-api.rakashev39.workers.dev';

async function uploadToR2(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${BACKEND_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        return data.success ? data.url : null;
    } catch (e) {
        console.error("Ошибка загрузки картинки:", e);
        return null;
    }
}

function getCurrentDateTime() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const hour = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hour}:${minutes}`;
}


const getInputs = () => ({
    inputNumber: document.querySelector('.input-calculator-number'),
    inputComments: document.querySelector('.input-calculator'),
    inputImage: document.getElementById('real-input'),
    calculateButton: document.querySelector('.button-calculate')
});

function saveToStorage() {
    localStorage.setItem('income', income);
    localStorage.setItem('expenses', expenses);
    localStorage.setItem('historyRecords', JSON.stringify(historyRecords));
}

function generateUUID() {
    const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    const uuid = template.replace(/[xy]/g, function(placeholderCharacter) {
        const randomNumber = Math.floor(Math.random() * 16);
        
        let finalValue;

        if(placeholderCharacter === 'x') {
            finalValue = randomNumber;
        } else {
            finalValue = (randomNumber & 0x3) | 0x8;
        }

        return finalValue.toString(16);
    })
    return uuid;
}

function deleteRecord(recordId) {
    const recordToDelete = historyRecords.find(record => record.id === recordId);

    if(!recordToDelete) {
        return;
    }

    if(recordToDelete.imageUrl) {
        URL.revokeObjectURL(recordToDelete.imageUrl);
    }

    if(recordToDelete.type === 'income') {
        income -= recordToDelete.value;
    } else {
        expenses -= recordToDelete.value;
    }

    historyRecords = historyRecords.filter(record => record.id !== recordId);

    saveToStorage();
    renderPage();
    syncDataToServer();
}

function startEdit(recordId) {
    const recordToEdit = historyRecords.find(record => record.id === recordId);

    if(!recordToEdit) {
        return;
    }

    editingRecordId = recordId;

    const { inputNumber, inputComments, calculateButton } = getInputs();

    inputNumber.value = Math.abs(recordToEdit.value);
    inputComments.value = recordToEdit.comment;

    calculateButton.textContent = "Сохранить изменения";
}

function updateExistingRecord(id, inputValue, newComment, newImageUrl) {
    const index = historyRecords.findIndex(record => record.id === id);
    if(index === -1) {
        return;
    }

    const oldRecord = historyRecords[index];

    if (oldRecord.imageUrl && oldRecord.imageUrl !== newImageUrl && oldRecord.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(oldRecord.imageUrl);
    }

    let finalNewValue = inputValue;

    if(oldRecord.type === 'expense') {
        finalNewValue = -Math.abs(inputValue);
    } else {
        finalNewValue = Math.abs(inputValue);
    }

    if (oldRecord.type === 'income') {
    income -= oldRecord.value;
    } else {
        expenses -= oldRecord.value;
    }

    const newRecord = {
        id: id,
        value: finalNewValue,
        comment: newComment,
        imageUrl: newImageUrl,
        type: finalNewValue < 0 ? 'expense' : 'income',
        date: getCurrentDateTime()
    }

    historyRecords[index] = newRecord;

    if(finalNewValue < 0) {
        expenses += finalNewValue;
    } else {
        income += finalNewValue;
    }

    saveToStorage();

    syncDataToServer();
}

function renderPage() {
    const incomeStat = document.querySelector('.income');
    const expensesStat = document.querySelector('.expenses');
    const cleanIncomeExpensesStat = document.querySelector('.clean-income-expenses');
    const history = document.querySelector('.history-container');

    let historyHTML = '';

    historyRecords.forEach(record => {
        const borderClass = record.type === 'expense' ? 'red-border' : 'green-border';

        const colorStyle = record.type === 'expense' ? 'red' : 'green';

        const valueDisplay = record.type === 'expense' ?
        `<p class="record-el" style="color:red">${record.value}</p>` :
        `<p class="record-el" style="color:green">+${record.value}</p>`
        
        const imageHTML = record.imageUrl ?
        `<img src="${record.imageUrl}" style="width: auto; height: 50px; margin-right: 10px;">` : '';

        historyHTML += `
            <div class="history-item ${borderClass}">
                ${imageHTML}
                ${valueDisplay}
                <div class="comment-container">
                    <span class="comment" style="margin-left: 5px;">${record.comment || "Без комментария"}</span>
                </div>
                <p class="date-history">${record.date}</p>
                <div class="button-container">
                    <button class="edit-btn" data-id="${record.id}">Редактировать запись</button>
                    <button class="delete-btn" data-id="${record.id}">Удалить запись</button>
                </div>
            </div>
        `;

        const historyItem = document.querySelectorAll('.history-item');
    });

    if (history) {
        history.innerHTML = historyHTML;
    }

    if (incomeStat && expensesStat && cleanIncomeExpensesStat) {
        const netValue = income + expenses;

        const netValueSign = netValue >= 0 ? '+$' : '-$';
        const netValueColor = netValue >= 0 ? 'green' : 'red';

        incomeStat.innerHTML = `<p>+$${income}</p>`;
        expensesStat.innerHTML = `<p>-$${Math.abs(expenses)}</p>`;
        cleanIncomeExpensesStat.innerHTML = `<p style="color: ${netValueColor};">${netValueSign}${Math.abs(netValue)}</p>`
    }

    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const recordId = event.currentTarget.dataset.id;

            deleteRecord(recordId);
        })
    })

    const editButtons = document.querySelectorAll('.edit-btn');

    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const recordId = event.currentTarget.dataset.id;
            startEdit(recordId);
        })
    })
}

renderPage();

document.querySelector('.button-calculate').addEventListener('click', async () => {
    const { inputNumber, inputComments, inputImage, calculateButton } = getInputs();

    const inputNumberValue = Number(inputNumber.value);
    const inputCommentsValue = inputComments.value;
    const files = inputImage.files;

    let imageUrl = '';

    let finalValue = inputNumberValue;

    if(editingRecordId !== null) {
        const oldRecord = historyRecords.find(r => r.id === editingRecordId);

        if (files.length > 0) {
            imageUrl = await uploadToR2(files[0]); 
        } else {
            imageUrl = oldRecord ? oldRecord.imageUrl : '';
        }

        updateExistingRecord(editingRecordId, inputNumberValue, inputCommentsValue, imageUrl);
        editingRecordId = null;
        calculateButton.textContent = 'Записать'
    } else {

        if (files.length > 0) {
            imageUrl = await uploadToR2(files[0]);
        }

        finalValue = inputNumberValue;

        const record = {
            value: finalValue,
            id: generateUUID(),
            comment: inputCommentsValue,
            imageUrl: imageUrl,
            type: finalValue < 0 ? 'expense' : 'income',
            date: getCurrentDateTime()
        };

        historyRecords.push(record);

        if (finalValue < 0) {
        expenses += finalValue;
        } else {
            income += finalValue;
        }
    }

    const imagePreview = document.getElementById('imagePreview');

    inputNumber.value = '';
    inputComments.value = '';
    inputImage.value = '';
    document.querySelector('.file-name').textContent = 'Файл не выбран';

    saveToStorage();
    renderPage();
    syncDataToServer();
})

document.getElementById('real-input').addEventListener('change', (e) => {
    const fileNameDisplay = document.querySelector('.file-name');
    if (e.target.files && e.target.files.length > 0) {
        fileNameDisplay.textContent = e.target.files[0].name;
    } else {
        fileNameDisplay.textContent = 'Файл не выбран';
    }
})