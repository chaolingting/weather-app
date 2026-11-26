// src/index.js
import "./styles.css";
import { currentTime } from "./date.js";


// const timeSlot = document.querySelector('.time-slot');
// timeSlot.append(currentTime());

const weatherForm = document.querySelector('#weather-form');
const weatherInput = document.querySelector('#search-input');
const weatherOutput = document.querySelector('.weather-output');



const loader = document.querySelector('.loader');

function showLoader() {
  loader.classList.remove('hidden');
  weatherOutput.replaceChildren();
}

function hideLoader() {
  loader.classList.add('hidden')
}

weatherForm.addEventListener('submit', async function(e){
  e.preventDefault();
  const searchTerm = weatherInput.value.trim();
  if(!searchTerm) return;

  // loader.classList.remove('hidden')
  // printWeather.textContent = await getWeather(searchTerm);

  showLoader();
  try {
    const { location, temp, conditions, icon } = await getWeather(searchTerm);
    await renderWeather(location, temp, conditions, icon);
  } catch(err) {
    weatherOutput.textContent = `Error ${err.message}`;
    const errorMsg = document.createElement('p');
    errorMsg.textContent = err.message;
    errorMsg.classList.add('err-msg');

    weatherOutput.replaceChildren(errorMsg);
  } finally {
    hideLoader();
  }

})




async function getWeather(location) {

    const apiKey = "XTSUZFGMDUPMU27KH8PYK2Y7G";
    

    const result = await fetch (`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}/?key=${apiKey}&unitGroup=metric&include=current&iconSet=icons1&contentType=json&lang=en`)
    console.log(result)


    if (!result.ok) {
      const message = {
        400: "Location not found, please try again."
      }
      throw new Error(message[result.status] ?? "Can't get weather at the moment, please try again");
    }

    const data = await result.json();    
    console.log(data);

    const now = data.currentConditions;
    console.log(now);


    const parts = data.resolvedAddress.split(",").map((part)=>part.trim());
    const city = parts[0];
    const country = parts[parts.length -1]

    return {
      location: parts.length > 1 ? `${city}, ${country}` : city,
      temp:now.temp,
      conditions: now.conditions,
      icon: now.icon,
    }


    

}

async function getWeatherIcon(iconName) {
  try{
    const module = await import(`./icons/${iconName}.svg`)
    return module.default
  } catch {
    return null;
  }
  
}



let currentTemp = null;
let isCelsius = true;

const tempEl = document.createElement('h2');
tempEl.classList.add('temp-el')
const weatherToggle = document.createElement('button');


weatherToggle.textContent = "Change to Fahrenheit"
weatherToggle.addEventListener('click', () => {
 isCelsius = !isCelsius;
 updateTemp();

})

weatherToggle.classList.add('weather-toggle');


function updateTemp() {
  if(isCelsius) {
    tempEl.textContent = `${Math.round(currentTemp)}°C `
    weatherToggle.textContent = "→°F"
  } else {
    tempEl.textContent = `${Math.round(toFahrenheit(currentTemp))}°F`;
    weatherToggle.textContent = "→°C"
  }
}


async function renderWeather(location, temp, conditions, icon) {

  updateBackground(icon);

  const all = document.createElement('div');
  all.classList.add('all-conditions')
 

  const gifEl = document.createElement('img');
  gifEl.classList.add('weather-gif');
  getWeatherGif(conditions, gifEl);


  const locationEl = document.createElement('h2');
  locationEl.classList.add('location-el')
  locationEl.textContent = location;

  currentTemp = temp;
  // const tempEl = document.createElement('h2');
  // tempEl.textContent = `${temp}°C`;

 

  const conditionsEl = document.createElement('h3');
  conditionsEl.textContent = conditions;

  const iconEl = document.createElement('img');
  const iconSrc = await getWeatherIcon(icon);
  if(iconSrc){
    iconEl.src = iconSrc;
    iconEl.alt = conditions;
    iconEl.classList.add('icon')
  }
  
   const conditionsDiv = document.createElement('div');
   conditionsDiv.classList.add('conditions')
   conditionsDiv.append(iconEl,conditionsEl);

   const tempDiv = document.createElement('div');
   tempDiv.classList.add('temp-div')
   tempDiv.append(tempEl, weatherToggle);
  
   updateTemp();

  all.append(locationEl, tempDiv, iconEl, conditionsDiv);
  weatherOutput.replaceChildren(all, gifEl);

 

  
}


function toFahrenheit(celsius) {
  return celsius * 9 / 5 + 32;
}


async function showDefaultWeather() {
  showLoader()
  try {
    const {location, temp, conditions, icon} = await getWeather("Birmingham, uk")
    await renderWeather(location, temp, conditions, icon)
  } catch(err) {
    weatherOutput.textContent = `Error! ${err.message}`
  }finally {
    hideLoader();
  }
}

showDefaultWeather()

const headerText = document.querySelector('.header-text');
// const body = document.querySelector('body')
function colorful() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 50%, 55%)`
}

// function colorfulBg() {
//   const hue = Math.floor(Math.random() * 360);
//   return `hsl(${hue}, 10%, 85%)`
// }


setInterval(() => {
  headerText.style.color = colorful()
  

}, 1500);




function updateBackground(icon) {
  document.body.className = "";
  document.body.classList.add(`weather-${icon}`)

}


async function getWeatherGif(keyword) {
  
  const gifAPIkey = "Bykqaxuj8O0md0XGl7Za6tEVvkpd2NOJ";

  try {

    const res = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${gifAPIkey}&s=${encodeURIComponent(keyword)}`
);

    const json = await res.json();
    const img = document.querySelector('.weather-gif');
    const gif = json.data.images.fixed_height;
    img.src = gif.webp || gif.url;r
    img.alt = `${keyword} gif`;

    console.log(res)
  }catch(err) {
    console.log('error!', err)

  }

  
};