'use strict';
/* global shoppingList, store, Item */
// eslint-disable-next-line no-unused-vars
$(document).ready(function() {
  shoppingList.bindEventListeners();
  shoppingList.render();

  api.getItems()
    .then(res => res.json())
    .then((items) => {
      items.forEach((item) => store.addItem(item));
      shoppingList.render();
    });

  api.getItems()
    .then(res => res.json())
    .then((items) => {
      const storeItem = store.items[0];
      shoppingList.handleEditShoppingItemSubmit();
      console.log('current name: ' + storeItem.name);
      console.log('new name: ' + storeItem.name);
      const item = items[0];
      return api.updateItem(item.id, { name: 'foo'})
    .then(res => res.json())
    .then(() => console.log('updated!'));
  });
});

