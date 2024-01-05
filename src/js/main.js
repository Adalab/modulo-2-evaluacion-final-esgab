'use strict';

// DATA

let disneyCharacters = [];

// Get data from api
const getApiData = () => {
  fetch('//api.disneyapi.dev/character?pageSize=50')
    .then(response => response.json())
    .then(data => { 
      disneyCharacters = data.data;
      console.log(disneyCharacters);
  });
};
  
getApiData();