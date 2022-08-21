import * as UI from './selectors.js';

let client = {
    table: '',
    hour: '',
    order: []
}

function saveClient() {
    const table = UI.tableInput.value;
    const time = UI.timeImput.value;

    if ( !table || !time ) {
        showMessage('All the fields are required!');
        return;
    }

    client.table = table;
    client.hour = time;

    // Hide modal after assign values needed
    const modalForm = UI.clientModal;
    hideElementBootStrap(modalForm);

    showHidden();

    getProducts();

}

function showMessage( message ) {
    if ( !document.querySelector('.invalid-feedback') ) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.classList.add('d-block', 'text-center', 'invalid-feedback');
    
        UI.modalBody.appendChild(messageDiv);
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

function hideElementBootStrap( element ) {
    const modalBootstrap = bootstrap.Modal.getInstance(element);
    modalBootstrap.hide();
}

function showHidden(){
    const hiddenSections = document.querySelectorAll('.d-none');
    
    hiddenSections.forEach( e => {
        e.classList.remove('d-none');
    });
}

function getProducts() {
    const URL = 'http://localhost:3000/products';
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            showProducts( data );
        })
        .catch(error => console.log(error));

}
const categories = {
    1: 'Food',
    2: 'Drinks',
    3: 'Desserts'
}

function showProducts( productsArr ) {
    const contentDiv = document.querySelector('#products .content');

    productsArr.forEach( product => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row', 'py-3', 'border-top', 'justify-content');

        const nameDiv = document.createElement('div');
        nameDiv.textContent = product.name;
        nameDiv.classList.add('col-md-4');

        const priceDiv = document.createElement('div');
        priceDiv.textContent = `${product.price} €`;
        priceDiv.classList.add('col-md-3', 'fw-bold');

        const categoryDiv = document.createElement('div');
        categoryDiv.textContent = categories[product.category];
        categoryDiv.classList.add('col-md-3', 'fw-bold');

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = 0;
        quantityInput.id = `${product.id}`;
        quantityInput.value = 0;
        quantityInput.classList.add('form-control');

        const quantityDiv = document.createElement('div');
        quantityDiv.classList.add('col-md-2');
        quantityDiv.appendChild(quantityInput);

        rowDiv.appendChild(nameDiv);
        rowDiv.appendChild(priceDiv);
        rowDiv.appendChild(categoryDiv);
        rowDiv.appendChild(quantityDiv);

        contentDiv.appendChild(rowDiv);
    });
}

export {
    saveClient
}