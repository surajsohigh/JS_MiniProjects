const userTab = document.querySelector("[data-userWeather]")
const searchTab = document.querySelector("[data-searchWeather]")
const userContainer = document.querySelector(".weather-container")
const grantAccessContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".loading-container")
const userInfoContainer = document.querySelector(".user-info-container")


let oldTab = userTab;
const API_KEY = "6c53f2ecaae66f262a2cc326a230db7f";
oldTab.classList.add("current-tab")
getfromSessionStorage()


function switchTab(newTab) {
    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");
        
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active")
            grantAccessContainer.classList.remove("active")
            searchForm.classList.add("active")
        }
        else{
            searchForm.classList.remove("remove")
            userInfoContainer.classList.remove("active")
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab)
        })

searchTab.addEventListener("click", ()=> {
    switchTab(searchTab)
        })

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active")
    }
    else{
        const coordinates = JSON.parse(localCoordinates)
        fetchUserWeatherInfo(coordinates)
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    console.log(coordinates)
    console.log(lat, lon)

    grantAccessContainer.classList.remove("active")

   loadingScreen.classList.add("active")
   
//    API call 

try{
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const  data = await response.json();


    loadingScreen.classList.remove("active")
    userInfoContainer.classList.add("active")
    renderWeatherInfo(data)
}
catch(err){
    loadingScreen.classList.remove("active")
}

}

function renderWeatherInfo(weatherInfo){

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    console.log(cityName, countryIcon, desc, weatherIcon, temp, windspeed, humidity, cloudiness)

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
        // console.log(showPosition)
    }
    else{
        alert("Not Support Location Access")
    }
}


function showPosition(position){


    userCoodinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    console.log(userCoodinates)

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoodinates))
    fetchUserWeatherInfo(userCoodinates)
}


const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]")

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let cityName = searchInput.value

    if(cityName === "")
        return;
    else
        fetchSearchWeatherInfo(cityName)
    
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active")
    userInfoContainer.classList.remove("active")
    grantAccessContainer.classList.remove("active")

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }

}