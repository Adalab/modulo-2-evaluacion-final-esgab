'use strict';

// QUERYSELECTORS

const charactersList = document.querySelector('.js__charactersList');
const favoritesCharactersList = document.querySelector('.js__favoritesList');
const searchCharacter = document.querySelector('.js__searchCharacter');
const searchCharacterInput = document.querySelector('.js__searchCharacterInput');

// DATA

let disneyCharacters = [];
let favoritesCharacters = [];
const favoritesCharactersFromLS = JSON.parse( localStorage.getItem('favoritesCharacters') );

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

// Listen clicked characters
function listenClickedCharacters() {
  const allCharactersLi = document.querySelectorAll('.js__characterItem');

  for (const characterLi of allCharactersLi) {
    characterLi.addEventListener('click', handleClickResult);
  }
}

// Render favorites from localStorage
function renderFavoritesFromLS() {
  if (favoritesCharactersFromLS === null) {
    renderCharacters(favoritesCharacters, favoritesCharactersList);
  } 
  else {
    favoritesCharacters = favoritesCharactersFromLS;
    renderCharacters(favoritesCharacters, favoritesCharactersList);
  } 
}

// EVENT FUNCTIONS (HANDLER)

function handleClickResult(event) {
  // get the id of the clicked character
  const clickedLi = event.currentTarget;
  const clickedCharacterId = parseInt(clickedLi.dataset.id);
  console.log(clickedLi);
  console.log(clickedCharacterId);
  console.log("array", disneyCharacters)

  const selectedCharacter = disneyCharacters.find( (character) => character._id === clickedCharacterId );
  const favoriteCharacterIndex = favoritesCharacters.findIndex( (favoriteCharacter) => favoriteCharacter._id === clickedCharacterId );

  if(favoriteCharacterIndex === -1) {
    // put the character when it is not in favorites
    favoritesCharacters.push( selectedCharacter );
  }
  else {
    // remove when it is in favorites
    favoritesCharacters.splice( favoriteCharacterIndex, 1 );
  }
  
  localStorage.setItem('favoritesCharacters', JSON.stringify(favoritesCharacters));
  renderFavoritesFromLS();
  // add the "favorite" class to the <li> element inside the clicked <li>
  clickedLi.classList.toggle('favorite');
}

const getApiFilteredData = (event) => {
  event.preventDefault();
  fetch(`//api.disneyapi.dev/character?pageSize=50&name=${searchCharacterInput.value}`)
    .then(response => response.json())
    .then(data => { 
      disneyCharacters = data.data;
      renderCharacters(disneyCharacters, charactersList);
  });
};

// EVENTS

searchCharacter.addEventListener( 'submit', getApiFilteredData );

// CODE WHEN LOADING THE PAGE

// Get data from api
const getApiData = () => {
  fetch('//api.disneyapi.dev/character?pageSize=50')
    .then(response => response.json())
    .then(data => { 
      disneyCharacters = data.data;
      console.log(disneyCharacters);
      renderCharacters(disneyCharacters, charactersList);
      renderFavoritesFromLS();
  });
};
  
getApiData();