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

// Get html code for all the character items
function getCharacterHtmlCode(character) {
  let characterHtml = '';

  if (typeof character.imageUrl  === 'undefined') {
    character.imageUrl = 'https://via.placeholder.com/400x500/bbbbbb/ffffff/?text=Disney';
  }

  characterHtml += 
  `<li class="character js__characterItem" data-id="${character._id}">
  <button class="character__btn js__deleteItem"><i class="fa-solid fa-xmark"></i></button>
    <div class="character__image-container">
      <img src="${character.imageUrl}" class="character__image alt="Producto: ${character.name}">
    </div>
    <h3 class="character__name">${character.name}</h3>
  </li>`;

  return characterHtml;
}

// Render characters items
function renderCharactersItems(characters, htmlelement) {
  let charactersCode = '';

  for (const character of characters) {
    charactersCode += getCharacterHtmlCode(character);
  }

  htmlelement.innerHTML = charactersCode;
}

// Render characters
function renderCharacters() {
  renderCharactersItems(disneyCharacters, charactersList);
}

// Render favorites characters
function renderFavoritesCharacters() {
  renderCharactersItems(favoritesCharacters, favoritesCharactersList);
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
  // Get the id of the clicked character
  const clickedLi = event.currentTarget;
  const clickedCharacterId = parseInt(clickedLi.dataset.id);
  // Verify which character is the clicked character
  const selectedCharacter = disneyCharacters.find( (character) => character._id === clickedCharacterId );
  // Find the position inside the favorites characters array
  const favoriteCharacterIndex = favoritesCharacters.findIndex( (favoriteCharacter) => favoriteCharacter._id === clickedCharacterId );

  if(favoriteCharacterIndex === -1) {
    // Put the character when it is not in favorites
    favoritesCharacters.push( selectedCharacter );
  }
  else {
    // Remove when it is in favorites
    favoritesCharacters.splice( favoriteCharacterIndex, 1 );
  }
  
  applyFavoriteClass();
  setInLocalStorage();
  renderFavoritesCharacters();
  listenFavoritesDeleteBtns();
  displayResetButton();
}

// Filter characters by its name
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

// Delete favorite from the favorites list
function handleClickDeleteFavorite(event) {
  const motherOfclickedBtn = event.currentTarget.parentElement;
  const clickedCharacterId = parseInt(motherOfclickedBtn.dataset.id);
  const favoriteCharacterIndex = favoritesCharacters.findIndex( (favoriteCharacter) => favoriteCharacter._id === clickedCharacterId );
  favoritesCharacters.splice( favoriteCharacterIndex, 1 );
  applyFavoriteClass();
  setInLocalStorage();
  renderFavoritesCharacters();
  listenFavoritesDeleteBtns();
  displayResetButton();
}

// Reset favorites
function resetFavorites(event) {
  event.preventDefault();
  applyFavoriteClass();
  favoritesCharacters = [];
  setInLocalStorage();
  favoritesCharactersList.innerHTML = '';
  displayResetButton();
}

// Show or hide the reset button when there are not favorites characters
function displayResetButton() {
  if (favoritesCharacters.length === 0) {
    resetFavoritesBtn.classList.add('hidden');
  }
  else {
    resetFavoritesBtn.classList.remove('hidden');
  }
}

// EVENTS

searchCharacter.addEventListener( 'submit', getApiFilteredData );
resetFavoritesBtn.addEventListener( 'click', resetFavorites );

function listenClickedCharacters() {
  listenClickEvents('.js__characterItem', handleClickResult);
}

function listenFavoritesDeleteBtns() {
  listenClickEvents('.js__deleteItem', handleClickDeleteFavorite);
}

// Listen click events helper
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
displayResetButton();
searchCharacterInput.value = '';