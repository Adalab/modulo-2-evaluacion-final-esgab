'use strict';

// QUERYSELECTORS

const charactersList = document.querySelector('.js__charactersList');
const favoritesCharactersList = document.querySelector('.js__favoritesList');
const searchCharacter = document.querySelector('.js__searchCharacter');
const searchCharacterInput = document.querySelector('.js__searchCharacterInput');
const resetFavoritesBtn = document.querySelector('.js__resetFavoritesBtn');

// DATA

let disneyCharacters = [];
let favoritesCharacters = [];

// FUNCTIONS

function getCharacterHtmlCode(character) {
  let characterHtml = '';

  if (typeof character.imageUrl  === 'undefined') {
    character.imageUrl = 'https://via.placeholder.com/400x500/bbbbbb/ffffff/?text=Disney';
  }

  characterHtml += 
  `<li class="character js__characterItem" data-id="${character._id}">
    <button class="character__btn js__deleteItem">❌</button>
    <div class="character__image-container">
      <img src="${character.imageUrl}" class="character__image alt="Producto: ${character.name}">
    </div>
    <h3 class="character__name">${character.name}</h3>
  </li>`;

  return characterHtml;
}

// Render characters
function renderCharactersItems(characters, htmlelement) {
  let charactersCode = '';

  for (const character of characters) {
    charactersCode += getCharacterHtmlCode(character);
  }

  htmlelement.innerHTML = charactersCode;
}

function renderCharacters() {
  renderCharactersItems(disneyCharacters, charactersList);
}

function renderFavoritesCharacters() {
  renderCharactersItems(favoritesCharacters, favoritesCharactersList);
}

// Listen clicked characters
function listenClickedCharacters() {
  const allCharactersLi = document.querySelectorAll('.js__characterItem');

  for (const characterLi of allCharactersLi) {
    characterLi.addEventListener('click', handleClickResult);
  }
}

// Apply 'favorite' class
function applyFavoriteClass() {
  const characterItems = document.querySelectorAll('.js__characterItem');
  
  for (const characterItem of characterItems) {
    const characterId = parseInt(characterItem.dataset.id);
  
    // Verify if the character is in favorites list
    const isFavorite = favoritesCharacters.find(character => character._id === characterId);

    // If the character is in favorites list, add the class 'favorite'
    // If the character is not in favorites list, remove the class 'favorite'
    if (isFavorite) {
      characterItem.classList.add('favorite');
    } 
    else {
      characterItem.classList.remove('favorite');
    }
  }
}

// Get from LocalStorage
function getFromLocalStorage() {
  const favoritesCharactersFromLS = JSON.parse( localStorage.getItem('favoritesCharacters') );
  if (favoritesCharactersFromLS === null) {
    renderFavoritesCharacters();
  } 
  else {
    favoritesCharacters = favoritesCharactersFromLS;
    renderFavoritesCharacters();
  }
}

// Set in LocalStorage
function setInLocalStorage() {
  localStorage.setItem('favoritesCharacters', JSON.stringify(favoritesCharacters));
}

// EVENT FUNCTIONS (HANDLER)

function handleClickResult(event) {
  // get the id of the clicked character
  const clickedLi = event.currentTarget;
  const clickedCharacterId = parseInt(clickedLi.dataset.id);
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
  
  setInLocalStorage();
  renderFavoritesCharacters();
  applyFavoriteClass();
}

const getApiFilteredData = (event) => {
  event.preventDefault();
  fetch(`//api.disneyapi.dev/character?pageSize=50&name=${searchCharacterInput.value}`)
    .then(response => response.json())
    .then(data => { 
      disneyCharacters = data.data;
      renderCharacters();
      listenClickedCharacters();
      applyFavoriteClass();
  });
};

// Reset favorites
function resetFavorites(event) {
  event.preventDefault();
  applyFavoriteClass();
  favoritesCharacters = [];
  setInLocalStorage();
  favoritesCharactersList.innerHTML = '';
}

// EVENTS

searchCharacter.addEventListener( 'submit', getApiFilteredData );
resetFavoritesBtn.addEventListener( 'click', resetFavorites );

function listenCharactersItems() {
  listenClickEvents('.js__characterItem', handleClickResult);
}

// Listen click events
function listenClickEvents(selector, handler) {
  const elements = document.querySelectorAll(selector);
  for (const element of elements) {
    element.addEventListener('click', handler);
  }
}

// CODE WHEN LOADING THE PAGE

// Get data from api
const getApiData = () => {
  fetch('//api.disneyapi.dev/character?pageSize=50')
    .then(response => response.json())
    .then(data => { 
      disneyCharacters = data.data;
      renderCharacters();
      listenClickedCharacters();
      applyFavoriteClass();
  });
};
  
getFromLocalStorage();
getApiData();