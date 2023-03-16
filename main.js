/*------------------------OBS--------------------Denna kod kan vara lite långsam!-------------OBS-----------------*/



//Skapar en klass med olika atributer
class Character {
  constructor(name, gender, height, mass, hairColor, skinColor, eyeColor, movies, homeworld, vehicles, starships, movieswith) {
    this.name = name;
    this.gender = gender;
    this.height = height;
    this.mass = mass;
    this.hairColor = hairColor;
    this.skinColor = skinColor;
    this.eyeColor = eyeColor;
    this.movies = movies.length;
    this.firstAppearanceDate = null; 
    this.filmNames = []; 
    this.homeworldName = ""; 
    this.vehicleCost = null; 
    this.homeworld = homeworld;
    this.vehicles = vehicles;
    this.starships = starships;
    this.movieswith = movieswith;
  }
}

// Async-funktion med namnet 'fetchCharacterData' som accepterar namnet på tecknet för vilket data hämtas
async function fetchCharacterData(character) {
  // Anropa ett API för att få data för det givna tecknet
  // Hämta hemvärldsdata från API:t med hjälp av URL:en som är tillgänglig i det första API:et
  const response = await fetch(`https://swapi.dev/api/people/?search=${character}`);
  const data = await response.json();
  const homeworldResponse = await fetch(data.results[0].homeworld);
  const homeworldData = await homeworldResponse.json();

// Skapa en rad promises för att hämta karaktärens filmdata och vänta tills alla promises är uppfyllda
  const filmPromises = data.results[0].films.map(url => fetch(url).then(response => response.json()));
  const filmsData = await Promise.all(filmPromises);

  // Skapa en rad promises för att hämta fordonsdata och vänta tills alla uppfyllda
  const vehiclePromises = data.results[0].vehicles.map(url => fetch(url).then(response => response.json()));
  const vehiclesData = await Promise.all(vehiclePromises);

// Storea all viktig information om karaktär i objektet 'characterData'
  const characterData = {
    name: data.results[0].name,
    gender: data.results[0].gender,
    height: data.results[0].height,
    mass: data.results[0].mass,
    hairColor: data.results[0].hair_color,
    skinColor: data.results[0].skin_color,
    eyeColor: data.results[0].eye_color,
    movies: filmsData,
    homeworld: homeworldData,
    vehicles: vehiclesData,
  }

// Tilldela det för närvarande hämtade hemvärldsnamnet till attributet 'homeworldName' för Character-objekt
  characterData.homeworldName = homeworldData.name;

// Hitta den första filmen karaktären dök upp i och extrahera dess releasedatum
// Sortering av släppdatum hjälper oss att ta reda på den första filmen
  const releaseDates = characterData.movies.map(movie => movie.release_date);
  releaseDates.sort((date1, date2) => new Date(date1) - new Date(date2));
  characterData.firstAppearanceDate = releaseDates[0];

// Extrakta namnen på filmerna karaktären dök upp i och tilldela den till ett tomt array-attribut 'filmNames' för karaktärsobjekt
characterData.filmNames = characterData.movies.map(movie => movie.title);

// Bestäm kostnaden för karaktärens dyraste fordon och tilldela den till attributet 'vehicleCost'
  const vehicleCosts = characterData.vehicles.map(vehicle => vehicle.cost_in_credits !== 'unknown' ? parseInt(vehicle.cost_in_credits) : 0);
  characterData.vehicleCost = Math.max(...vehicleCosts);

  return characterData;
}


// Funktion med namnet 'displayCharacterInfo' används för att visa de givna tecknen
function displayCharacterInfo(character, data) {
  // Uppdatering av HTML-innehållet för respektive taggar/element inom div
  const characterInfoDiv = document.getElementById(`${character}-info`);
  characterInfoDiv.innerHTML = `
    <p>Name: ${data.name}</p>
    <p>Gender: ${data.gender}</p>
    <p>Height: ${data.height} cm</p>
    <p>Mass: ${data.mass} kg</p>
    <p>Hair color: ${data.hairColor}</p>
    <p>Skin color: ${data.skinColor}</p>
    <p>Eye color: ${data.eyeColor}</p>
    <p>First appearance date: ${data.firstAppearanceDate}</p>
    <p>Films: ${data.filmNames.join(', ')}</p>
    <p>Homeworld: ${data.homeworldName}</p>
    <p>Most expensive vehicle cost: ${data.vehicleCost} credits</p>
  `;
}

//API
const charactersUrl = 'https://swapi.dev/api/people/';

//Fetch methoden används för att hämta data från swapi
fetch(charactersUrl)
  .then(response => response.json())
  .then(data => {
    const characters = data.results.slice(0, 6);

    //Följande rader väljer HTML-element efter deras id och lägger till eventList
    const select1 = document.querySelector('#character1');
    const select2 = document.querySelector('#character2');

    //lägg till eventList för när karaktär ska ändras
    select1.addEventListener('change', () => {
      const selectedCharacter = characters.find(character => character.name === select1.value);
    });

    select2.addEventListener('change', () => {
      const selectedCharacter = characters.find(character => character.name === select2.value);
    });

    const compareButton = document.querySelector('#compare-button');

    //lägg till eventList för min jämföra knapp
    compareButton.addEventListener('click', () => {

      //dessa rader hämtar värdena för de valda tecknen från rullgardinsmenyerna
      const selectedCharacter1 = document.querySelector('#character1').value;
      const selectedCharacter2 = document.querySelector('#character2').value;
    
      // Hämtar data
      const character1Data = characters.find(character => character.name === selectedCharacter1);
      const character2Data = characters.find(character => character.name === selectedCharacter2);
    
      
      // Jämför 
      //dessa variabler har boolesk utdata oavsett om vissa egenskaper matchade eller inte.
      const hairColorMatch = character1Data.hair_color === character2Data.hair_color;
      const heightDifference = Math.abs(parseFloat(character1Data.height) - parseFloat(character2Data.height));
      const weightDifference = Math.abs(parseFloat(character1Data.mass) - parseFloat(character2Data.mass));
      const sameGender = character1Data.gender === character2Data.gender;
      const skinColorMatch = character1Data.skin_color === character2Data.skin_color;
      const eyeColorMatch = character1Data.eye_color === character2Data.eye_color;
      const tallest = parseFloat(character1Data.height) > parseFloat(character2Data.height) ? character1Data.name : character2Data.name;
      const heaviest = parseFloat(character1Data.mass) > parseFloat(character2Data.mass) ? character1Data.name : character2Data.name;
      const sameMovies = character1Data.films.filter(film => character2Data.films.includes(film));
      const sameMoviesCount = sameMovies.length;
      const samePlanet = character1Data.homeworld === character2Data.homeworld;

      // Visa i DOM:en
      //Dessa rader använder ovanstående variabler för att visa teckenstatistik
      hairColorResult.textContent = `${selectedCharacter1} and ${selectedCharacter2}: ${hairColorMatch ? 'Yes, the hair color do match' : 'No, the hair color dont match'}`;
      lengthResult.textContent = `${selectedCharacter1} is ${heightDifference}cm ${heightDifference > 0 ? 'taller' : 'shorter'} than ${selectedCharacter2}`;
      weightResult.textContent = `${selectedCharacter1} is ${weightDifference}kg ${weightDifference > 0 ? 'heavier' :  'ligher '} than ${selectedCharacter2}`;
      genderResult.textContent = `Both characters are ${sameGender ? "of the same gender (which is "+selectedCharacter1+" or "+selectedCharacter2+")" : "not of the same gender."}`;
      skinColorResult.textContent = `${selectedCharacter1} and ${selectedCharacter2}: ${skinColorMatch ? 'Yes, the skin color do match' : 'No, the skin color dont match'}`;
      eyeColorResult.textContent = `${selectedCharacter1} and ${selectedCharacter2}: ${eyeColorMatch ? 'Yes, the eye color do match' : 'No, the eye color dont match'}`;
      filmNumberResult.textContent = `${selectedCharacter1} and ${selectedCharacter2} have ${character1Data.films.length} and ${character2Data.films.length} films respectively. ${sameMoviesCount > 0 ? `They appear together in ${sameMoviesCount} ${sameMoviesCount === 1 ? 'movie' : 'movies'}.` : 'They do not appear together in any movie.'}`;
      heightResult.textContent = `${tallest} is taller`;
      heaviestResult.textContent = `${heaviest} is heavier`;
      samePlanetResult.textContent = `${selectedCharacter1} and ${selectedCharacter2} ${samePlanet ? 'are from the same planet.' : 'are from different planets.'}`; // output whether the two characters are from the same planet or not
    });

    // Få referenser till HTML-elementen (för tecken1)
    const hairColorResult = document.querySelector('#hair-color-result');
    const lengthResult = document.querySelector('#length-result');
    const weightResult = document.querySelector('#weight-result');
    const genderResult = document.querySelector('#sex-result');
    const skinColorResult = document.querySelector('#skin-color-result');
    const eyeColorResult = document.querySelector('#eye-color-result');
    const heightResult = document.querySelector('#longest-result');
    const heaviestResult = document.querySelector('#heaviest-result');
    const filmNumberResult = document.querySelector('#most-films-result');
    const samePlanetResult = document.querySelector('#same-planet-result');
  
  });

//ignorera just nu 
function compareCharacters() {
  const character1Data =characters.find(character => character.name === selectedCharacter1); 
  const character2Data = characters.find(character => character.name === selectedCharacter2);

  const sameHairColor = character1Data.hair_color === character2Data.hair_color;
  const sameHairColorResult = document.getElementById('same-hair-color-result');
  sameHairColorResult.textContent = sameHairColor ? 'Yes' : 'No';

  const sameSkinColor = character1Data.skin_color === character2Data.skin_color;
  const sameSkinColorResult = document.getElementById('same-skin-color-result');
  sameSkinColorResult.textContent = sameSkinColor ? 'Yes' : 'No';
}

// Addera eventlist till buttons
const character1Button = document.getElementById('character1-info-button');
character1Button.addEventListener('click', async () => {
  const character1Select = document.getElementById('character1');
  const character1 = character1Select.value;
  const character1Data = await fetchCharacterData(character1);
  displayCharacterInfo('character1', character1Data);
});

// Addera eventlist till buttons
const character2Button = document.getElementById('character2-info-button');
character2Button.addEventListener('click', async () => {
  const character2Select = document.getElementById('character2');
  const character2 = character2Select.value;
  const character2Data = await fetchCharacterData(character2);
  displayCharacterInfo('character2', character2Data);
});

const compareButton = document.getElementById('compare-button');
compareButton.addEventListener('click', compareCharacters);


// Få referenser till HTML-elementen
const character1Select = document.getElementById("character1");
const character1Name = document.getElementById("character1-name");
const character1Image = document.getElementById("character1-image");
const character1InfoButton = document.getElementById("character1-info-button");
const character1Info = document.getElementById("character1-info");

const character2Select = document.getElementById("character2");
const character2Name = document.getElementById("character2-name");
const character2Image = document.getElementById("character2-image");
const character2InfoButton = document.getElementById("character2-info-button");
const character2Info = document.getElementById("character2-info");

// eventlist button
character1InfoButton.addEventListener("click", function() {
    // Hämta det valda tecknet från dropdownmeny
    const selectedCharacter = character1Select.value;

    // Gör en begäran till Star Wars API för den valda karaktären
  fetch(`https://swapi.dev/api/people/?search=${selectedCharacter}`)
    .then(response => response.json())
    .then(data => {
      // Visa karaktärens namn och information
      character1Name.textContent = data.results[0].name;
      character1Info.textContent = `Gender: ${data.results[0].gender}, Height: ${data.results[0].height}, Mass: ${data.results[0].mass},Hair color: ${data.results[0].hair_color} Skin color: ${data.results[0].skin_color} Eye color: ${data.results[0].eye_color}, Movies: ${data.results[0].films.length}`;

      // Visa characters bilder
      character1Image.src = `https://starwars-visualguide.com/assets/img/characters/${data.results[0].url.match(/(\d+)\/$/)[1]}.jpg`;
    })
    .catch(error => console.error(error));
});

// eventlist button
character2InfoButton.addEventListener("click", function() {
      // Hämta det valda tecknet från dropdownmeny
      const selectedCharacter = character2Select.value;

    // Gör en begäran till Star Wars API för den valda karaktären
  fetch(`https://swapi.dev/api/people/?search=${selectedCharacter}`)
    .then(response => response.json())
    .then(data => {
      // Visa karaktärens namn och information
      character2Name.textContent = data.results[0].name;
      character2Info.textContent = `Gender: ${data.results[0].gender}, Height: ${data.results[0].height}, Mass: ${data.results[0].mass},Hair color: ${data.results[0].hair_color} Skin color: ${data.results[0].skin_color} Eye color: ${data.results[0].eye_color}, Movies: ${data.results[0].films.length}`;

      // Visa characters bilder
      character2Image.src = `https://starwars-visualguide.com/assets/img/characters/${data.results[0].url.match(/(\d+)\/$/)[1]}.jpg`;
    })
    .catch(error => console.error(error));
});


