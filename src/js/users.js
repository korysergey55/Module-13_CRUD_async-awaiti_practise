import { Modal, Toast } from 'bootstrap';
import * as api from './services/crud';
import getFormData from './services/getFormData';
import findNameErrors from './services/validateUser';
import createUsersMarkup from '../templates/users.hbs';

const refs = {
  form: document.querySelector('form'),
  usersList: document.querySelector('.users-list'),
  modal: document.getElementById('exampleModal'),
  modalForm: document.getElementById('modal-form'),
  updateBtn: document.querySelector('button[data-action="update"]'),
  toast: document.querySelector('.toast'),
  toastText: document.querySelector('.toast-body'),
};

const myModal = new Modal(refs.modal);
const myToast = new Toast(refs.toast, { delay: 6000 });

// ********************* READ  ********************* //

// Promise

// const renderAllUsers = () =>
//   api.getUsers().then(users => {
//     refs.usersList.innerHTML = createUsersMarkup(users);
//   });

// async / await

const renderAllUsers = async () => {
  const users = await api.getUsers();
  refs.usersList.innerHTML = createUsersMarkup(users);
};

renderAllUsers();

// ********************* CREATE  ********************* //

refs.form.addEventListener('submit', saveUser);

// async / await

async function saveUser(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const newUser = getFormData(form.elements);

  const nameError = findNameErrors(newUser);
  if (nameError) {
    refs.toastText.textContent = nameError;
    myToast.show();
    return;
  }

  newUser.icon = 'https://cdn4.iconfinder.com/data/icons/pretty_office_3/256/Add-Male-User.png';

  await api.saveUser(newUser);
  renderAllUsers();

  // api.saveUser(newUser).then(renderAllUsers);

  form.reset();
}

// Promise

// function saveUser(e) {
//   e.preventDefault();

//   const form = e.currentTarget;
//   const newUser = getFormData(form.elements);

//   const nameError = findNameErrors(newUser);
//   if (nameError) {
//     refs.toastText.textContent = nameError;
//     myToast.show();
//     return;
//   }

//   newUser.icon = 'https://cdn4.iconfinder.com/data/icons/pretty_office_3/256/Add-Male-User.png';

//   api.saveUser(newUser).then(renderAllUsers);

//   form.reset();
// }

// // ********************* UPDATE / DELETE  ********************* //

refs.usersList.addEventListener('click', handleListClick);

// async / await

async function handleListClick(e) {
  if (e.target.dataset.action === 'delete') {
    await api.deleteUser(e.target.dataset.id);
    renderAllUsers();
  }

  if (e.target.dataset.action === 'edit') {
    handleEditUser(e.target.dataset.id);
  }
}

// Promise

// function handleListClick(e) {
//   if (e.target.dataset.action === 'delete') {
//     api.deleteUser(e.target.dataset.id).then(renderAllUsers);
//   }

//   if (e.target.dataset.action === 'edit') {
//     handleEditUser(e.target.dataset.id);
//   }
// }

// async / await

async function handleEditUser(id) {
  const inputs = refs.modalForm.elements;

  const user = await api.getUserById(id);

  Object.keys(user).forEach(key => {
    if (inputs.hasOwnProperty(key)) {
      inputs[key].value = user[key];
    }
  });

  refs.updateBtn.addEventListener('click', saveChanges);

  async function saveChanges() {
    const updatedUser = getFormData(inputs);

    const nameError = findNameErrors(updatedUser);
    if (nameError) {
      refs.toastText.textContent = nameError;
      myToast.show();
      return;
    }

    await api.editUser(id, updatedUser);
    renderAllUsers();

    myModal.hide();
    refs.updateBtn.removeEventListener('click', saveChanges);
  }

  // Promise

  // api.getUserById(id).then(user => {
  // Object.entries(user).forEach(([key, value]) => {
  //   if (inputs.hasOwnProperty(key)) {
  //     inputs[key].value = value;
  //   }
  // });

  // Object.keys(user).forEach(key => {
  //   if (inputs.hasOwnProperty(key)) {
  //     inputs[key].value = user[key];
  //   }
  // });

  // refs.updateBtn.addEventListener('click', saveChanges);

  // function saveChanges() {
  //   const updatedUser = getFormData(inputs);

  //   const nameError = findNameErrors(updatedUser);
  //   if (nameError) {
  //     refs.toastText.textContent = nameError;
  //     myToast.show();
  //     return;
  //   }

  //   api.editUser(id, updatedUser).then(renderAllUsers);
  //   myModal.hide();

  //   refs.updateBtn.removeEventListener('click', saveChanges);
  // }
  // });
}

// Promise

// function handleEditUser(id) {
//   const inputs = refs.modalForm.elements;

//   api.getUserById(id).then(user => {
//     // Object.entries(user).forEach(([key, value]) => {
//     //   if (inputs.hasOwnProperty(key)) {
//     //     inputs[key].value = value;
//     //   }
//     // });

//     Object.keys(user).forEach(key => {
//       if (inputs.hasOwnProperty(key)) {
//         inputs[key].value = user[key];
//       }
//     });

//     refs.updateBtn.addEventListener('click', saveChanges);

//     function saveChanges() {
//       const updatedUser = getFormData(inputs);

//       const nameError = findNameErrors(updatedUser);
//       if (nameError) {
//         refs.toastText.textContent = nameError;
//         myToast.show();
//         return;
//       }

//       api.editUser(id, updatedUser).then(renderAllUsers);
//       myModal.hide();

//       refs.updateBtn.removeEventListener('click', saveChanges);
//     }
//   });
// }

refs.modal.addEventListener('hidden.bs.modal', () => refs.modalForm.reset());
