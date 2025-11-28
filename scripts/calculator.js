let income = 0;
let expenses = 0;

document.querySelector('.button-calculate').addEventListener('click', () => {
    const input = document.querySelector('.input-calculator-number');
    const inputComments = document.querySelector('.input-calculator');
    const inputValue = Number(input.value);
    const inputCommentsValue = inputComments.value;
    const inputImage = document.getElementById('real-input');

    const history = document.querySelector('.history-container');

    const incomeStat = document.querySelector('.income');
    const expensesStat = document.querySelector('.expenses');

    const files = inputImage.files;
    
    let imageUrl = '';

    if (files.length > 0 && files[0].type.startsWith('image/')) {
        imageUrl = URL.createObjectURL(files[0]);
    }

    let historyHTML = '';

    if(inputValue < 0) {
        expenses += inputValue;
        
        historyHTML = `
            <div class="history-item">
                ${imageUrl ? `<img src="${imageUrl}" style="width: 50px; height: 50px; margin-right: 10px;">` : ''}
                <p style="color: red">${inputValue}</p>
                <p style="margin-left: 5px;>${inputCommentsValue}</p>
            </div>
        `
    } else {
        income += inputValue;

        historyHTML = `
            <div class="history-item">
                ${imageUrl ? `<img src="${imageUrl}" style="width: 50px; height: 50px; margin-right: 10px;">` : ''}
                <p style="color: green">+$${inputValue}</p>
                <p style="margin-left: 5px;">${inputCommentsValue}</p>
            </div>
        `
    }

    history.innerHTML += historyHTML;

    incomeStat.innerHTML = `
    <p>+${income}</p>
    `
    expensesStat.innerHTML = `
    <p>${expenses}</p>
    `

    const imagePreview = document.getElementById('imagePreview')



    input.value = '';
    inputComments.value = '';
    inputImage.value = '';
    document.querySelector('.file-name').textContent = 'Файл не выбран';
})

document.getElementById('real-input').addEventListener('change', (e) => {
    const fileNameDisplay = document.querySelector('.file-name');
    if (e.target.files && e.target.files.length > 0) {
        fileNameDisplay.textContent = e.target.files[0].name;
    } else {
        fileNameDisplay.textContent = 'Файл не выбран';
    }
})