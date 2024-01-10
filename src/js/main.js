'use strict';

// QUERYSELECTORS

const charactersList = document.querySelector('.js__charactersList');
const favoritesCharactersList = document.querySelector('.js__favoritesList');
const searchCharacter = document.querySelector('.js__searchCharacter');
const searchCharacterInput = document.querySelector('.js__searchCharacterInput');
const resetFavoritesBtn = document.querySelector('.js__resetFavoritesBtn');

// DATA

// Array to store Disney characters data
let disneyCharacters = [];
// Array to store favorite Disney characters data
let favoritesCharacters = [];

// FUNCTIONS

/**
 * Generates the HTML code for a character item
 * @param {Object} character - The character data
 * @returns {string} The HTML code for the character item
 */
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

/**
 * Renders character items in a specified HTML element
 * @param {Array} characters - The array of characters to render
 * @param {HTMLElement} element - The HTML element to render the characters into
 */
function renderCharactersItems(characters, element) {
// Render characters items
function renderCharactersItems(characters, htmlelement) {
  let charactersCode = '';

  for (const character of characters) {
    charactersCode += getCharacterHtmlCode(character);
  }

  element.innerHTML = charactersCode;
}

// Renders Disney characters into the characters list
// Render characters
function renderCharacters() {
  renderCharactersItems(disneyCharacters, charactersList);
}

// Renders favorite characters into the favorites list
// Render favorites characters
function renderFavoritesCharacters() {
  renderCharactersItems(favoritesCharacters, favoritesCharactersList);
}

// Applies 'favorite' class to character items if they are favorites
function applyFavoriteClass() {
  const characterItems = document.querySelectorAll('.js__characterItem');
  
  for (const characterItem of characterItems) {
    const characterId = parseInt(characterItem.dataset.id);
  
    // Verify if the character is in favorites list
    const isFavorite = favoritesCharacters.find(character => character._id === characterId);

    if (isFavorite) {
      characterItem.classList.add('favorite');
    } 
    else {
      characterItem.classList.remove('favorite');
    }
  }
}

// Gets the favorite characters from LocalStorage and shows them on the page
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

// Sets favorite characters in LocalStorage
function setInLocalStorage() {
  localStorage.setItem('favoritesCharacters', JSON.stringify(favoritesCharacters));
}

// EVENT FUNCTIONS (HANDLER)

/**
 * Event handler for the click event on character items
 * @param {Event} event - The click event
 */
function handleClickResult(event) {
  // Get the id of the clicked character
  // Get the id of the clicked character
  const clickedLi = event.currentTarget;
  const clickedCharacterId = parseInt(clickedLi.dataset.id);
  // Verify which character is the clicked character
  // Verify which character is the clicked character
  const selectedCharacter = disneyCharacters.find( (character) => character._id === clickedCharacterId );
  // Find the position of the clicked character inside the favorites characters array
  // Find the position inside the favorites characters array
  const favoriteCharacterIndex = favoritesCharacters.findIndex( (favoriteCharacter) => favoriteCharacter._id === clickedCharacterId );

  if(favoriteCharacterIndex === -1) {
    // Put the character when it is not in favorites
    // Put the character when it is not in favorites
    favoritesCharacters.push( selectedCharacter );
  }
  else {
    // Remove when it is in favorites
    // Remove when it is in favorites
    favoritesCharacters.splice( favoriteCharacterIndex, 1 );
  }
  
  applyFavoriteClass();
  setInLocalStorage();
  renderFavoritesCharacters();
  listenFavoritesDeleteBtns();
  displayResetButton();
  displayResetButton();
}

/**
 * Event handler for the form to filter characters by name
 * @param {Event} event - The form submit event
 */
// Filter characters by its name
const getApiFilteredData = (event) => {
  event.preventDefault();
  fetch(`//api.disneyapi.dev/character?pageSize=50&name=${searchCharacterInput.value}`)
    .then(response => response.json())
    .then(data => { 
      // Ensures that disneyCharacters is always an array
      if (Array.isArray(data.data)) {
        disneyCharacters = data.data;
      } else {
        disneyCharacters = [data.data];
      }
      renderCharacters();
      listenClickedCharacters();
      applyFavoriteClass();
  });
};

/**
 * Event handler for the click event on the delete favorite button
 * @param {Event} event - The click event
 */
function handleClickDeleteFavorite(event) {
  // Get the id of the mother (character item) of the clicked button
// Delete favorite from the favorites list
function handleClickDeleteFavorite(event) {
  const motherOfclickedBtn = event.currentTarget.parentElement;
  const clickedCharacterId = parseInt(motherOfclickedBtn.dataset.id);
  // Find the position of the character of the clicked button inside the favorites characters array
  const favoriteCharacterIndex = favoritesCharacters.findIndex( (favoriteCharacter) => favoriteCharacter._id === clickedCharacterId );
  favoritesCharacters.splice( favoriteCharacterIndex, 1 );
  setInLocalStorage();
  renderFavoritesCharacters();
  listenFavoritesDeleteBtns();
  applyFavoriteClass();
  displayResetButton();
  displayResetButton();
}

/**
 * Event handler for the click on the reset favorites button
 * @param {Event} event - The click event
 */
function handleClickResetFavorites(event) {
  event.preventDefault();
  favoritesCharacters = [];
  setInLocalStorage();
  applyFavoriteClass();
  favoritesCharactersList.innerHTML = '';
  displayResetButton();
}

// Displays or hides the reset button if there are favorites characters or not 
function displayResetButton() {
  if (favoritesCharacters.length === 0) {
    resetFavoritesBtn.classList.add('hidden');
  }
  else {
    resetFavoritesBtn.classList.remove('hidden');
  }
}

// Resets the value on the search form input
function resetSearchCharacterInput() {
  searchCharacterInput.value = '';
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
resetFavoritesBtn.addEventListener( 'click', handleClickResetFavorites );

function listenClickedCharacters() {
  listenClickEvents('.js__characterItem', handleClickResult);
}

function listenFavoritesDeleteBtns() {
  listenClickEvents('.js__deleteItem', handleClickDeleteFavorite);
  listenClickEvents('.js__deleteItem', handleClickDeleteFavorite);
}

// Listen click events helper
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
resetSearchCharacterInput();
displayResetButton();
searchCharacterInput.value = '';