'use strict';



const api = (function() {

  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/daniel';
  
  function getItems() {
    fetch(`${BASE_URL}/items`)
      .then(responseJSON => 
        responseJSON.json())
      .then(data => console.log(data)
      );
    return Promise.resolve('A successful response');
  }

  function createItem(name) {
    const newItem = JSON.stringify({
      name: name
    });
    fetch(`${BASE_URL}/items`, {
      method: 'POST',
      headers: new Headers ({
        'Content-Type': 'application/json'
      }),

      body: newItem
    });
  }

  return{
    getItems: getItems,
    BASE_URL: BASE_URL,
    createItem: createItem
  };
})();