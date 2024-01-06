'use strict';

// QUERYSELECTORS

const charactersList = document.querySelector('.js__charactersList');
const favoritesCharactersList = document.querySelector('.js__favoritesList');

// DATA

let disneyCharacters = [];
let favoritesCharacters  = [];

// FUNCTIONS

function getCharacterHtmlCode(character) {
  let characterHtml = '';

  if (typeof character.imageUrl  === 'undefined') {
    character.imageUrl = 'https://via.placeholder.com/400x500/bbbbbb/ffffff/?text=Disney';
  }

  characterHtml += 
  `<li class="character js__characterItem" data-id="${character._id}>
    <div class="character__image-container">
      <img src="${character.imageUrl}" class="character__image alt="Producto: ${character.name}">
    </div>
    <h3 class="character__name">${character.name}</h3>
  </li>`;

  return characterHtml;
}

// Render characters
function renderCharacters(characters, htmlelement) {
  let charactersCode = '';

  for (const character of characters) {
    charactersCode += getCharacterHtmlCode(character);
  }

  htmlelement.innerHTML = charactersCode;
  listenClickedCharacters();
}

// CODE WHEN LOADING THE PAGE

// Get data from api
const getApiData = () => {
  fetch('//api.disneyapi.dev/character?pageSize=50')
    .then(response => response.json())
    .then(data => { 
      disneyCharacters = data.data;
      console.log(disneyCharacters);
      renderCharacters(disneyCharacters, charactersList);
  });
};
  
getApiData();