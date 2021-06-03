import './styles.scss';
import contactTpl from './tpl/contact.handlebars';
import oneContactTpl from './tpl/oneContact.handlebars';
import formTpl from './tpl/form.handlebars';
// http://127.0.0.1:3000 - домен
// /api/contacts      (POST)   - создание           | C
// /api/contacts      (GET)    - все контакты       | R
// /api/contacts/{id} (GET)    - конкретный контакт | R
// /api/contacts/{id} (PATCH)  - изменение          | U
// /api/contacts/{id} (DELETE) - удаление           | D

// "contact": {
//     "_id": "5eb074232c30a1378dacdbdf",
//     "name": "Abbot Franks",
//     "email": "scelerisque@magnis.org",
//     "phone": "(186) 568-3720",
//     "subscription": "premium",
//     "password": "password",
//     "token": ""
// }

const contentNode = document.querySelector('#content');
const formNode = document.querySelector('#form');

const baseUrl = 'http://127.0.0.1:3000/api';

formNode.addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return false;

    if (e.target.dataset.action === 'create')
        createContact(getDataForm()).then(data => {
            formNode.innerHTML = '';

            contentNode.querySelector('table').insertAdjacentHTML('beforeend', oneContactTpl(data.data.contact));
        });

    if (e.target.dataset.action === 'edit') {
        const data = getDataForm();
        updateContact(data.id, data).then(data => {
            formNode.innerHTML = '';
            
            const newHtml = oneContactTpl(data.data.contact);
            contentNode.querySelector(`table tr[data-id="${data.data.contact._id}"]`).outerHTML = newHtml;

        });
    }
});

contentNode.addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return false;

    const action = e.target.dataset.action;
    const trNode = e.target.parentNode.parentNode;
    const id = trNode.dataset.id;

    if (action === 'create') renderForm();
    if (action === 'delete') {
        if (confirm(`${id} - delete?`))
            deleteContact(id).then(data => trNode.remove());
    }
    if (action === 'edit') {
        const data = { action: 'edit' };
        const tdNodeArr = trNode.querySelectorAll('td');
        data.email = tdNodeArr[0].textContent;
        data.name = tdNodeArr[1].textContent;
        data.password = tdNodeArr[2].textContent;
        data.phone = tdNodeArr[3].textContent;
        data.subscription = tdNodeArr[4].textContent;
        data.id = id;

        renderForm(data);
    }
});

const updateContact = (id, data) => {
    return fetch(`${baseUrl}/contacts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
    })
        .then(response => response.json())
        .catch(error => console.log('ERROR' + error));
};

const deleteContact = (id) => {
    return fetch(`${baseUrl}/contacts/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .catch(error => console.log('ERROR' + error));
};

const renderForm = (data = { action: 'create' }) => {
    formNode.innerHTML = formTpl(data);
};

const createContact = (data) => {
    return fetch(`${baseUrl}/contacts`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
    })
        .then(response => response.json())
        .catch(error => console.log(error));
};

const getDataForm = () => {
    const data = {};
    formNode.querySelectorAll('input').forEach(input => {
        data[input.getAttribute('name')] = input.value;
    });
    return data;
};

const getContacts = () => {
    return fetch(`${baseUrl}/contacts`)
        .then(res => res.json());
};

const getContactById = (id) => {
    return fetch(`${baseUrl}/contacts/${id}`)
        .then(res => res.json());
}

getContacts().then(data => {
    contentNode.innerHTML = contactTpl(data.data.contacts);
});