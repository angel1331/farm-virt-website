    let income = Number(localStorage.getItem('income') ?? 0);
    let expenses = Number(localStorage.getItem('expenses') ?? 0);

    let historyRecords = JSON.parse(localStorage.getItem('historyRecords')) || [];

    let editingRecordId = null; 

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

        if (oldRecord.imageUrl) {
            URL.revokeObjectURL(oldRecord.imageUrl);
        }

        const newRecord = {
            id: id,
            value: finalNewValue,
            comment: newComment,
            imageUrl: newImageUrl,
            type: finalNewValue < 0 ? 'expense' : 'income'
        }

        historyRecords[index] = newRecord;

        if(finalNewValue < 0) {
            expenses += finalNewValue;
        } else {
            income += finalNewValue;
        }
    }

    function renderPage() {
        const incomeStat = document.querySelector('.income');
        const expensesStat = document.querySelector('.expenses');
        const history = document.querySelector('.history-container');

        let historyHTML = '';

        historyRecords.forEach(record => {
            const borderClass = record.type === 'expense' ? 'red-border' : 'green-border';

            const colorStyle = record.type === 'expense' ? 'red' : 'green';

            const valueDisplay = record.type === 'expense' ?
            `<p style="color:red">${record.value}</p>` :
            `<p style="color:green">+${record.value}</p>`
            
            const imageHTML = record.imageUrl ?
            `<img src="${record.imageUrl}" style="width: auto; height: 50px; margin-right: 10px;">` : '';

            historyHTML += `
                <div class="history-item ${borderClass}">
                    ${imageHTML}
                    ${valueDisplay}
                    <p class="comment" style="margin-left: 5px;">${record.comment}</p>
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

        if (incomeStat && expensesStat) {
            incomeStat.innerHTML = `<p>+$${income}</p>`;
            expensesStat.innerHTML = `<p>-$${Math.abs(expenses)}</p>`;
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

    document.querySelector('.button-calculate').addEventListener('click', () => {
        const { inputNumber, inputComments, inputImage, calculateButton } = getInputs();

        const inputNumberValue = Number(inputNumber.value);
        const inputCommentsValue = inputComments.value;
        const files = inputImage.files;

        let imageUrl = '';
        
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            imageUrl = URL.createObjectURL(files[0]);
        }

        let finalValue = inputNumberValue;

        if(editingRecordId !== null) {
            updateExistingRecord(editingRecordId, inputNumberValue, inputCommentsValue, imageUrl);

            editingRecordId = null;
            calculateButton.textContent = 'Записать'
        } else {
            finalValue = inputNumberValue;

            const record = {
                value: finalValue,
                id: generateUUID(),
                comment: inputCommentsValue,
                imageUrl: imageUrl,
                type: finalValue < 0 ? 'expense' : 'income'
            };

            historyRecords.push(record);

            if (finalValue < 0) {
            expenses += finalValue;
            } else {
                income += finalValue;
            }
        }

        renderPage();

        const imagePreview = document.getElementById('imagePreview')

        finalValue.value = '';
        inputNumber.value = '';
        inputComments.value = '';
        inputImage.value = '';
        document.querySelector('.file-name').textContent = 'Файл не выбран';

        saveToStorage();
    })

    document.getElementById('real-input').addEventListener('change', (e) => {
        const fileNameDisplay = document.querySelector('.file-name');
        if (e.target.files && e.target.files.length > 0) {
            fileNameDisplay.textContent = e.target.files[0].name;
        } else {
            fileNameDisplay.textContent = 'Файл не выбран';
        }
    })