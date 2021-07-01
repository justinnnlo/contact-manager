const ENDPOINT = " http://localhost:3000/api/contacts/";

class Model {
  constructor() {
    this.allContacts = [];
  }
  
  /* CRUD operations are stored in Model since they deal with data, data in this case are the contact and contact info */

  // finish ONE operation at a time - in all of MODEL -> CONTROLLER -> VIEW 

  /* CREATE */ 
  async createContact(contact) {
    /* POST endpoint:  http://localhost:3000/api/contacts/ */
    try {
      let response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(contact),
      });
      switch(response.status) {
        case 201:
          let data = await response.json();
          console.log(`response status: ${response.status}`);
          console.log(`response status text: ${response.statusText}`);
          console.log(`response ok: ${response.ok}`);
          console.log(data);
          return data;
        case 400:
          console.log(`response status: ${response.status}`);
          console.log(`response status text: ${response.statusText}`);
          console.log(`response ok: ${response.ok}`);
          return response.statusText;
      }
    } catch (err){
      console.error(err);
    }
  }

   /* READ 1  */ 
  async getContact(id) {
    /* GET endpoint: http://localhost:3000/api/contacts/:id */
    let request = new XMLHttpRequest();
    request.open('GET', `/api/contacts/${id}`);
    request.send();
  }

  /* READ ALL  */ 
  async getAllContacts() {
    /* GET endpoint: http://localhost:3000/api/contacts */
    try {
      const result = await fetch(ENDPOINT);
      const data = await result.json();
      console.log(data);
      console.log('status code:', result.status);
      console.log('ok status:', result.ok);
      this.allContacts = data;
      console.log('state updated!');
      // console.log(this.allContacts);
      return data;
    } catch (err) {
      console.error(err);
    }
  }

  /* UPDATE */
  async editContact(json) {
    /* PUT endpoint: http://localhost:3000/api/contacts/:id */
    let request = new XMLHttpRequest();
    request.open('PUT', `/api/contacts/${json.id}`);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.send(json);
  }

  /* DELETE */
  async deleteContact(id) {
    /* DELETE endpoint: http://localhost:3000/api/contacts/:id */
    try {
      let response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });
      switch(response.status) {
        case 204:
          console.log(`Delete operation was successful`);
          return 'Delete operation was successful';
        case 400:
          console.log(`response status: ${response.status}`);
          console.log(`response status text: ${response.statusText}`);
          console.log(`response ok: ${response.ok}`);
          return response.statusText;
      }
    } catch(err) {
      console.err(err);
    }
  }
}

class View {
  constructor() {
    /* get access to UI elements here*/
    this.headers = document.querySelector('#header-container');
    this.addContactButton = document.querySelector('#add-contact-button');
    this.addContactForm = document.querySelector("#addContactForm")
    this.addContactDisplay = document.querySelector('#addContactDisplay');
    this.searchbar = document.querySelector('#search-contact-input');
    this.editContactForm = document.querySelector('#displayEditForm');
    this.contactDivUl = document.querySelector('#contactsList');
    this.submitButton = document.querySelector('#submit-button');
    this.cancelButton = document.querySelector('#cancel-button');
    this.deleteButton = document.querySelector('#delete-button');
    this.bindAddContactButtonClick();
  }

  // use arrow function / bind to preserve context
  compileHTMLtoHandlebarsFunction = (id) => {
    return Handlebars.compile(document.querySelector(id).innerHTML);
  }

  // displayContacts(contacts) {
  //   let contactsTemplate = this.compileHTMLtoHandlebarsFunction("#contactsTemplate");
  //   let html = contactsTemplate(contacts);
  //   this.contactDivUl.innerHTML = html;
  // }

  display(id, data, location) {
    let template = this.compileHTMLtoHandlebarsFunction(id);
    let html = template(data);
    location.innerHTML = html;
  }

  clearPreviousFormValues(formElem) {
    let inputs = Array.prototype.slice.call(formElem.querySelectorAll('input')).slice(0, -2);
    // console.log(`theres are inputs: ${inputs}`);
    inputs.forEach(input => {
      // console.log('this is val:', input.value);
      input.value = '';
    });
  }

  hide(selector) {
    $(selector).hide();
  }

  show(selector) {
    $(selector).show();
  }

  // add event listeners for actions in UI
  // when something happens -> what method to be invoke in controller
  // e.g. when there is a submit, event listener on View triggered and ask controller to handle with handler, and reset UI 

  extractFormData(formData) {
    const obj = {};
    for (let [key, value] of formData.entries()) { 
      console.log(key, value);
      obj[key] = value;
    }

    return obj;
  }

  bindAddContactButtonClick() {
    this.addContactButton.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('clicked add contact button');
      this.hide('#contactsList');
      this.show('#addContactDisplay');
      this.clearPreviousFormValues(this.addContactDisplay);
      // this.show('#addContactDis');

    });
  }

  bindAddContactFormSubmit(handler) {
    this.addContactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      console.log('submitted!! contact form');
      let form = event.target;
      console.log(`this is form: `, form); 
      let formData = new FormData(form);
      console.log('this is form data entries', formData.entries());
      let formDataFormatted = this.extractFormData(formData);
      handler(formDataFormatted);
    });
  }

  bindDeleteButtonClick(handler) {
    this.contactDivUl.addEventListener('click', (event) => {
      event.preventDefault();
      let target = event.target;
      console.log(target);
      let listID = target.parentNode.parentNode.getAttribute('data-id');
      if (target.type === 'button' && target.value === 'Delete') {
        handler(listID);
      }
    });
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.loadInitialState();
    this.bind();
  }

  // 
  init() {
    // this.view.display("#contactsTemplate", {contacts:[{"id":1,"full_name":"Naveed Fida","email":"nf@example.com","phone_number":"12345678901","tags":"work,friend"},{"id":2,"full_name":"Victor Reyes","email":"vpr@example.com","phone_number":"09876543210","tags":"work,friend"},{"id":3,"full_name":"Pete Hanson","email":"ph@example.com","phone_number":"54321098761","tags":null}]}, this.view.contactDivUl );

    // this.view.hide(this.view.headers);
  }

  async loadInitialState() {
    await this.loadContactsFromServer();
    this.refreshContactList();
  }

  async loadContactsFromServer() {
    this.model.allContacts = await this.model.getAllContacts();
  }

  refreshContactList() {
    this.view.display("#contactsTemplate", {contacts: this.model.allContacts}, this.view.contactDivUl);
  }

  handleCreateContact = (data) => {
    this.model.createContact(data);
    this.view.hide('#addContactDisplay');
    this.view.show('#contactsList');
    this.loadInitialState();
  }

  handleDeleteContact = (id) => {
    this.model.deleteContact(id);
    this.loadInitialState();
  }

  bind() {
    this.view.bindAddContactFormSubmit(this.handleCreateContact);
    this.view.bindDeleteButtonClick(this.handleDeleteContact);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new Controller(new Model(), new View());
});
