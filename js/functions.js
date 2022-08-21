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

export {
    saveClient
}