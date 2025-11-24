let income = 0;
let expenses = 0;

document.querySelector('.button-calculate').addEventListener('click', () => {
    const input = document.querySelector('.input-calculator-number');
    const inputComments = document.querySelector('.input-calculator');
    const inputValue = Number(input.value);
    const inputCommentsValue = inputComments.value;

    const history = document.querySelector('.history-container');

    const incomeStat = document.querySelector('.income');
    const expensesStat = document.querySelector('.expenses');

    if(inputValue < 0) {
        history.innerHTML += `
        <p class="history" style="color: red">${inputValue} ${inputCommentsValue}</p>
        `
        expenses += inputValue;
    } else {
        history.innerHTML += `
        <p class="history" style="color: green">+$${inputValue} ${inputCommentsValue}</p>
        `
        income += inputValue;
    }

    incomeStat.innerHTML = `
    <p>${income}</p>
    `
    expensesStat.innerHTML = `
    <p>${expenses}</p>
    `

    input.value = '';
    inputComments.value = '';
})

document.getElementById('real-input').addEventListener('change', (e) => {
    const fileNameDisplay = document.querySelector('.file-name');
    if (e.target.files && e.target.files.length > 0) {
        fileNameDisplay.textContent = e.target.files[0].name;
    } else {
        fileNameDisplay.textContent = 'Файл не выбран';
    }
})