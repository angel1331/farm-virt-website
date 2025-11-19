document.querySelector('.button-calculate').addEventListener('click', () => {
    const input = document.querySelector('.input-calculator');
    const inputValue = Number(input.value);
    const history = document.querySelector('.history-container');

    history.innerHTML += `
    <p class="history"> +$${inputValue}</p>
    `
})