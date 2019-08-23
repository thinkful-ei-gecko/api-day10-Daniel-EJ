'use strict';



const api = (function () {

  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/daniel';

  function getItems() {
    return fetch(`${BASE_URL}/items`);
  }

  function createItem(name) {
    const newItem = {
      name: name
    };

    return fetch(BASE_URL + '/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem)
    });

  }

  function updateItem(id, updateData){
    return fetch(
    `${BASE_URL}/items/${id}`, 
    {method : 'PATCH', 
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify(updateData)
  })}

  return {
    getItems,
    BASE_URL,
    createItem,
    updateItem
  };
}());