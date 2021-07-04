const ENDPOINT = " http://localhost:3000/api/contacts/";

class Model {
  constructor() {
    this.allContacts = [];
  }
  
  /* CRUD operations are stored in Model since they deal with data, data in this case are the contact and contact info */

  // finish ONE operation at a time - in all of MODEL -> VIEW -> CONTROLLER 

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
      console.log('result data in getAllContacts', data);
      console.log('status code:', result.status);
      console.log('ok status:', result.ok);
      this.allContacts = data;
      // console.log('state updated!');
      return data;
    } catch (err) {
      console.error(err);
    }
  }

  /* UPDATE */
  async editContact(id, data) {
    /* PUT endpoint: http://localhost:3000/api/contacts/:id */
    console.log(`this is PUT request ID`);
    try {
      let response = await fetch(`http://localhost:3000/api/contacts/${id}`, {
        method : 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(data)
      });
      switch(response.status) {
        case 201:
          let data = await response.json();
          console.log(`response status: ${response.status}`);
          console.log(`response status text: ${response.statusText}`);
          console.log(`response ok: ${response.ok}`);
          console.log(' why is this unchanged response', data);
          return data;
        case 400:
          console.log(`response status: ${response.status}`);
          console.log(`response status text: ${response.statusText}`);
          console.log(`response ok: ${response.ok}`);
          return response.statusText;
      }
    } catch(err) {
      console.error(err);
    }
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

    this.editContactForm = document.querySelector(".editContactForm"); // new
    this.editContactDisplay = document.querySelector('#editContactDisplay'); // new

    this.tagsContainer = document.querySelector('#tags-container'); // tags container
    // this.allTagsButton = document.querySelector('#tag-1'); // tag 1
    // this.coworkerTagButton = document.querySelector('#tag-2'); // tag 2
    // this.friendTagButton = document.querySelector('#tag-3'); // tag 3
    // this.familyTagButton = document.querySelector('#tag-4'); // tag 4
    // this.girlFriendTagButton = document.querySelector('#tag-5'); // tag 5

    this.searchbar = document.querySelector('#search-contact-input');
    this.editContactForm = document.querySelector('#displayEditForm');
    this.contactDivUl = document.querySelector('#contactsList');
    this.submitButton = document.querySelector('#submit-button');
    this.addContactCancelButton = document.querySelector('#cancel-button');
    this.editContactCancelButton = document.querySelector('#cancel-button-2');
    this.deleteButton = document.querySelector('#delete-button');
    this.bindAddContactButtonClick();
    /* this.editID; initialize here*/
    this.editListID = undefined;
  }

  // use arrow function / bind to preserve context
  compileHTMLtoHandlebarsFunction = (id) => {
    return Handlebars.compile(document.querySelector(id).innerHTML);
  }

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

  // add event listeners for actions triggered in UI
  // when something happens -> what method to be invoke in controller
  // e.g. when there is a submit, event listener on View triggered and ask controller to handle with handler, and reset UI 

  extractFormData(formData) {
    const obj = {};
    for (let [key, value] of formData.entries()) { 
      // console.log(key, value);
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
    });
  }

  bindAddContactFormSubmit(handler) {
    this.addContactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      console.log('submitted!! contact form');
      let target = event.target;
      let form = target;
      // console.log(`this is form: `, form); 
      let formData = new FormData(form);
      
      let tagSelectedValue = target.children[3].children[1].value;
      formData.append('tags', tagSelectedValue);

      // console.log('this is form data entries', formData.entries());
      let formDataFormatted = this.extractFormData(formData);
      // console.log('formatted data', formDataFormatted);
      handler(formDataFormatted);
    });
  }

  bindDeleteButtonClick(handler) {
    this.contactDivUl.addEventListener('click', (event) => {
      event.preventDefault();

      let target = event.target;
      // console.log(target);
      let listID = target.parentNode.parentNode.getAttribute('data-id');
      if (target.type === 'button' && target.value === 'Delete') {
        let answer = window.confirm('Are you sure you want to delete this contact?');
        if (answer) {
          handler(listID);
        }
      }
    });
  }

  bindEditButtonClick(handler) {
    this.contactDivUl.addEventListener('click', (event) => {
      event.preventDefault();

      let target = event.target;
      console.log(target);
      let listID = target.parentNode.parentNode.getAttribute('data-id');
      console.log(listID);
      this.editListID = listID;
      // put listID into constructor so you can access it from formSubmit
      if (target.type === 'button' && target.value === 'Edit') {
        console.log(`Edit button clicked!`);
        handler();
      }
    });
  }

  bindEditContactFormSubmit(handler)  {
    this.editContactDisplay.addEventListener('submit', (event) => {
      event.preventDefault();

      let target = event.target;
      // console.log('this is target', target);
      console.log(`in bind edit contact form submit!!!`);
      // find h2 and have condition to check for h2 text content
      let h2 = target.parentNode.children[0];
      console.log('this is h2', h2);
      console.log('this is h2 text content', h2.textContent);

      let form = event.target;
      let formData = new FormData(form);
      let formDataFormatted = this.extractFormData(formData);
      console.log('formatted', formDataFormatted);
      formDataFormatted.id = this.editListID;
      console.log('id:', this.editListID);
  
      handler(this.editListID, formDataFormatted);
    });
  }

  bindAddContactCancelButtonClick(handler) {
    this.addContactCancelButton.addEventListener('click', (event) => {
      event.preventDefault();

      handler();
    });
  }

  bindEditContactCancelButtonClick(handler) {
    this.editContactCancelButton.addEventListener('click', (event) => {
      event.preventDefault();

      handler();
    });
  }

  bindSearchBarInputChange(handler) {
    this.searchbar.addEventListener('keyup', (event) => {
      // event.preventDefault();

      handler(event);
    });
  }

  bindTagsContainerClick(handler) {
    this.tagsContainer.addEventListener('click', (event) => {
      // event.preventDefault();
      // console.log(event.target);
      handler(event);
    })
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.loadInitialState();
    this.bind();
  }

  async loadInitialState() {
    await this.loadContactsFromServer();
    this.refreshContactList();
  }

  async loadContactsFromServer() {
    this.model.allContacts = await this.model.getAllContacts();
  }

  refreshContactList() {
    this.view.display("#contactsTemplate", { contacts: this.model.allContacts }, this.view.contactDivUl);
  }

  handleCreateContact = (data) => {
    this.model.createContact(data);
    this.loadInitialState();
    this.view.hide('#addContactDisplay');
    this.view.show('#contactsList');
  }

  handleDeleteContact = (id) => {
    this.model.deleteContact(id);
    this.loadInitialState();
  }

  handleEditButton = () => {
    this.view.hide('#contactsList');
    this.view.show('#editContactDisplay');
    this.loadInitialState();
  }

  handleEditContactForm = (id, data) => {
    this.model.editContact(id, data);
    this.loadInitialState();
    this.view.hide('#editContactDisplay');
    this.view.show('#contactsList');
  }

  handleAddContactCancelButton = () => {
    this.view.hide('#addContactDisplay');
    this.view.show('#contactsList');
  }

  handleEditContactCancelButton = () => {
    this.view.hide('#editContactDisplay');
    this.view.show('#contactsList');
  }

  handleSearchBarInputChange = (event) => {
    let target = event.target;
    let searchString = target.value.toLowerCase();
    // console.log('this is search string', searchString);
    let allContacts = this.model.allContacts;
    console.log(allContacts);
    let filteredContacts = allContacts.filter((contact) => {
      return(contact.full_name.toLowerCase().includes(searchString) || contact.email.toLowerCase().includes(searchString));
    });
    // console.log('filtered', filteredContacts);
    this.view.display("#contactsTemplate", { contacts: filteredContacts }, this.view.contactDivUl);
  }

  handleTagButtonClick = (event) => {
    console.log('clicked');
    console.log('e.target:', event.target);
    let target = event.target;
    let tagLookingFor = target.dataset.tag;
    let allContacts = this.model.allContacts;
    console.log(allContacts);

    if(tagLookingFor === 'all') {
      this.view.display("#contactsTemplate", { contacts: allContacts }, this.view.contactDivUl);
      return;
    }
    
    let filteredContactsByTag = allContacts.filter((contact) => {
      return contact.tags === tagLookingFor;
    });

    console.log('filtered by tag', filteredContactsByTag);
    this.view.display("#contactsTemplate", { contacts: filteredContactsByTag }, this.view.contactDivUl);
  }

  bind() {
    this.view.bindAddContactFormSubmit(this.handleCreateContact);
    this.view.bindDeleteButtonClick(this.handleDeleteContact);
    this.view.bindEditButtonClick(this.handleEditButton);
    this.view.bindEditContactFormSubmit(this.handleEditContactForm);
    this.view.bindAddContactCancelButtonClick(this.handleAddContactCancelButton);
    this.view.bindEditContactCancelButtonClick(this.handleEditContactCancelButton);
    this.view.bindSearchBarInputChange(this.handleSearchBarInputChange);
    this.view.bindTagsContainerClick(this.handleTagButtonClick);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new Controller(new Model(), new View());
});
