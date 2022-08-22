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
        
        // Event to get the quantity of the product
        quantityDiv.onchange = function() {
            const quantity = Number(quantityInput.value);
            updateQuantity({...product, quantity});

            showResume();
        };
        
        rowDiv.appendChild(nameDiv);
        rowDiv.appendChild(priceDiv);
        rowDiv.appendChild(categoryDiv);
        rowDiv.appendChild(quantityDiv);

        contentDiv.appendChild(rowDiv);
    });
}

function updateQuantity( productObj ) {

    if( productObj.quantity > 0 ) {
        // Add new product or update quantity
        if( client.order.some(product => product.id === productObj.id) ) {
            const index = client.order.findIndex( product => product.id == productObj.id);
            client.order[index] = productObj;
        } else {
            client.order.push( productObj );
        };
    } else {
        // Delete order
        client.order = client.order.filter( product => product.id !== productObj.id);
    }
}

function showResume() {
    
    const resumeDiv = document.createElement('div');
    resumeDiv.classList.add('col-md-6', 'py-5', 'px-3', 'shadow', 'card');

    const tablep = document.createElement('p');
    tablep.textContent = `Table: ${client.table}`;
    tablep.classList.add('fw-bold');

    const timep = document.createElement('p');
    timep.textContent = `Hour: ${client.hour}`;
    timep.classList.add('fw-bold');

    const title = document.createElement('h1');
    title.textContent = 'Orders';
    title.classList.add('my-4');

    const orderUl = document.createElement('ul');
    orderUl.classList.add('list-group');

    resumeDiv.appendChild(title);
    resumeDiv.appendChild(tablep);
    resumeDiv.appendChild(timep);

    client.order.forEach( product => {
        const productLi = document.createElement('li');
        productLi.classList.add('list-group-item');
        productLi.innerHTML = `
            <h4 classs="text-center my-4">${product.name}</h4>
            <p class="fw-bold">Quantity: <span class="fw-light">${product.quantity}</span></p>
            <p class="fw-bold">Price: <span class="fw-light">${product.price} €</span></p>
            <p class="fw-bold">Subtotal: <span class="fw-light">${product.quantity * product.price} €</span></p>
        `;

        const btnDelete = document.createElement('btn');
        btnDelete.textContent = 'Detele';
        btnDelete.classList.add('btn', 'btn-danger');
        btnDelete.onclick = () => {
            deleteItem(product.id, productLi);
        }

        productLi.appendChild(btnDelete);

        orderUl.appendChild(productLi);
    });

    
    resumeDiv.appendChild(orderUl);
    
    UI.resumeContent.textContent = '';
    UI.resumeContent.appendChild(resumeDiv);

    showTipsSection();
}

function deleteItem( productId, htmlElement ) {
    // Update order array, delete html element and update quantity
    client.order = client.order.filter( product => product.id !== productId );
    htmlElement.remove();
    const input = document.getElementById(`${productId}`);
    input.value = 0;

    // Update the resume section if there are not products to show
    if( client.order.length === 0 ) {
        UI.resumeContent.innerHTML = '<p class="text-center">Add elements to the new order:</p>';
    }
}

function showTipsSection() {

    const tipsDiv = document.createElement('div');
    tipsDiv.classList.add('col-md-6','tips');

    const title = document.createElement('h3');
    title.classList.add('my-4');
    title.textContent = 'Tips';
    
    const tipsOptionsDiv = document.createElement('div');
    tipsOptionsDiv.classList.add('card', 'py-5', 'px-3', 'shadow');

    tipsOptionsDiv.appendChild(title);
    tipsDiv.appendChild(tipsOptionsDiv);

    // Radio button
    const radio10Div = document.createElement('div');
    radio10Div.classList.add('form-check');
    
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'tips';
    radio10.value = '10';
    radio10.classList.add('form-check-input');
    radio10.onclick = (e) => {
        getTotal(e);
    };
    
    const radio10Label = document.createElement('label');
    radio10Label.classList.add('form-check-label');
    radio10Label.textContent = '10 %'
    
    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    const radio15Div = document.createElement('div');
    radio15Div.classList.add('form-check');
    
    const radio15 = document.createElement('input');
    radio15.type = 'radio';
    radio15.name = 'tips';
    radio15.value = '15';
    radio15.classList.add('form-check-input');
    radio15.onclick = (e) => {
        getTotal(e);
    };
    
    const radio15Label = document.createElement('label');
    radio15Label.classList.add('form-check-label');
    radio15Label.textContent = '15 %'
    
    radio15Div.appendChild(radio15);
    radio15Div.appendChild(radio15Label);
    
    tipsOptionsDiv.appendChild(radio10Div);
    tipsOptionsDiv.appendChild(radio15Div);

    UI.resumeContent.appendChild(tipsDiv);
}

function getTotal(e) {
    let subtotal = 0;
    let total = 0;

    const tip = Number(e.target.value);

    client.order.forEach( p => {
        subtotal += p.price * p.quantity;
    });

    total = subtotal + (subtotal * tip / 100);

    showTotalPrice(subtotal, total, tip);
}

function showTotalPrice( subtotal, totalPrice, tipApplied ) {
    let totalDiv;
    const tipsDiv = document.querySelector('.tips');
    
    if( ! document.querySelector('.total') ) {
        totalDiv = document.createElement('div');
        totalDiv.classList.add('card', 'shadow', 'total');
    } else {
        totalDiv = document.querySelector('.total');
        clearTotalElement();
    }
    
    totalDiv.innerHTML = `
        <p class="text-center fw-bold">Subtotal: <span class="fw-light">${subtotal} €</span></p>
        <p class="text-center fw-bold">Total: <span class="fw-light">${totalPrice} €</span></p>
    `;

    tipsDiv.appendChild(totalDiv);
}

function clearTotalElement() {
    document.querySelector('.total').textContent = '';
}

export {
    saveClient
}