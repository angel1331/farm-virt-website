    let income = Number(localStorage.getItem('income') ?? 0);
    let expenses = Number(localStorage.getItem('expenses') ?? 0);

    let historyRecords = JSON.parse(localStorage.getItem('historyRecords')) || [];

    function saveToStorage() {
        localStorage.setItem('income', income);
        localStorage.setItem('expenses', expenses);
        localStorage.setItem('historyRecords', JSON.stringify(historyRecords));
    }

    function renderPage () {
        const incomeStat = document.querySelector('.income');
        const expensesStat = document.querySelector('.expenses');
        const history = document.querySelector('.history-container');

        let historyHTML = '';

        historyRecords.forEach(record => {
            const valueDisplay = record.type === 'expense' ?
            `<p style="color:red">${record.value}</p>` :
            `<p style="color:green">+${record.value}</p>`
            
            const imageHTML = record.imageUrl ?
            `<img src="${record.imageUrl}" style="width: auto; height: 50px; margin-right: 10px;">` : '';

            historyHTML += `
                <div class="history-item">
                    ${imageHTML}
                    ${valueDisplay}
                    <p style="margin-left: 5px;">${record.comment}</p>
                </div>
            `;

        });

        if (history) {
            history.innerHTML = historyHTML;
        }

        if (incomeStat && expensesStat) {
            incomeStat.innerHTML = `<p>+$${income}</p>`;
            expensesStat.innerHTML = `<p>${expenses}</p>`;
        }
    }

    renderPage();

    document.querySelector('.button-calculate').addEventListener('click', () => {
        const input = document.querySelector('.input-calculator-number');
        const inputComments = document.querySelector('.input-calculator');
        const inputValue = Number(input.value);
        const inputCommentsValue = inputComments.value;
        const inputImage = document.getElementById('real-input');

        const files = inputImage.files;
        
        let imageUrl = '';
        
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            imageUrl = URL.createObjectURL(files[0]);
        }

        const record = {
            value: inputValue,
            comment: inputCommentsValue,
            imageUrl: imageUrl,
            type: inputValue < 0 ? 'expense' : 'income'
        }

        historyRecords.push(record);

        if (inputValue < 0) {
            expenses += inputValue;
        } else {
            income += inputValue;
        }

        renderPage();

        const imagePreview = document.getElementById('imagePreview')

        input.value = '';
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