'use strict';
/* global store, $ */

// eslint-disable-next-line no-unused-vars
const shoppingList = (function () {

  function generateItemElement(item) {
    const checkedClass = item.checked ? 'shopping-item__checked' : '';
    const editBtnStatus = item.checked ? 'disabled' : '';

    let itemTitle = `<span class="shopping-item ${checkedClass}">${item.name}</span>`;
    if (item.isEditing) {
      itemTitle = `
        <form class="js-edit-item">
          <input class="shopping-item" type="text" value="${item.name}" />
        </form>
      `;
    }

    return `
      <li class="js-item-element" data-item-id="${item.id}">
        ${itemTitle}
        <div class="shopping-item-controls">
          <button class="shopping-item-edit js-item-edit" ${editBtnStatus}>
            <span class="button-label">edit</span>
          </button>
          <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
          </button>
          <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
          </button>
        </div>
      </li>`;
  }


  function generateShoppingItemsString(shoppingList) {
    const items = shoppingList.map((item) => generateItemElement(item));
    return items.join('');
  }


  function render() {
    // Filter item list if store prop is true by item.checked === false
    let items = [...store.items];
    if (store.hideCheckedItems) {
      items = items.filter(item => !item.checked);
    }

    // Filter item list if store prop `searchTerm` is not empty
    if (store.searchTerm) {
      items = items.filter(item => item.name.includes(store.searchTerm));
    }

    // render the shopping list in the DOM
    console.log('`render` ran');
    const shoppingListItemsString = generateShoppingItemsString(items);

    // insert that HTML into the DOM
    $('.js-shopping-list').html(shoppingListItemsString);
  }


  function handleNewItemSubmit() {
    $('#js-shopping-list-form').submit(function (event) {
      store.clearError();
      event.preventDefault();
      const newItemName = $('.js-shopping-list-entry').val();
      $('.js-shopping-list-entry').val('');

      if (newItemName === undefined){
        alert('Sorry please input an object')
      }

      //creating a new item and adding it to store
      api.createItem(newItemName)
        .then(res => res.json())
        .then((newItemName) => {
          store.addItem(newItemName);
          render();
        }).catch(err => {
          store.getError(err);
        });
    });
  }

  function getItemIdFromElement(item) {
    return $(item)
      .closest('.js-item-element')
      .data('item-id');
  }

  function handleItemCheckClicked() {
    $('.js-shopping-list').on('click', '.js-item-toggle', event => {
      store.clearError();
      const id = getItemIdFromElement(event.currentTarget);
      let tof = store.findById(id);
      api.updateItem(id, {
        checked: !tof.checked
      }).then(() => {
        store.findAndUpdate(id, {
          checked: !tof.checked
        });
        render();
      }).catch(err => {
        store.getError(err);
      });
    });
  }

  function handleDeleteItemClicked() {
    // like in `handleItemCheckClicked`, we use event delegation
    $('.js-shopping-list').on('click', '.js-item-delete', event => {
      store.clearError();
      // get the index of the item in store.items
      const id = getItemIdFromElement(event.currentTarget);
      // delete the item
      api.deleteItem(id).then(() => {
        store.findAndDelete(id);
        render();
      }).catch(err => {
        store.getError(err);
      });
    });
  }

  function handleEditShoppingItemSubmit() {
    $('.js-shopping-list').on('submit', '.js-edit-item', event => {
      store.clearError();
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      const itemName = $(event.currentTarget).find('.shopping-item').val();
      console.log(store.findAndUpdate(id, itemName));
      store.setItemIsEditing(id, false);
      api.updateItem(id, {
        name: itemName
      }).then(() => {
        store.findAndUpdate(id, {
          name: itemName
        });
        render();
      }).catch(err => {
        store.getError(err);
      });
    });
  }

  function handleToggleFilterClick() {
    $('.js-filter-checked').click(() => {
      store.toggleCheckedFilter();
      render();
    });
  }

  function handleShoppingListSearch() {
    $('.js-shopping-list-search-entry').on('keyup', event => {
      const val = $(event.currentTarget).val();
      store.setSearchTerm(val);
      render();
    });
  }

  function handleItemStartEditing() {
    $('.js-shopping-list').on('click', '.js-item-edit', event => {
      const id = getItemIdFromElement(event.target);
      store.setItemIsEditing(id, true);
      render();
    });
  }

  function bindEventListeners() {
    handleNewItemSubmit();
    handleItemCheckClicked();
    handleDeleteItemClicked();
    handleEditShoppingItemSubmit();
    handleToggleFilterClick();
    handleShoppingListSearch();
    handleItemStartEditing();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
    handleEditShoppingItemSubmit
  };
}());