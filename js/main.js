const openMenu = document.querySelector("[data-open-menu]");
const closeMenu = document.querySelector("[data-close-menu]");
const sidebar = document.querySelector("[data-sidebar]");
const overlay = document.querySelector("[data-overlay]");
const sidebarBtn = document.querySelectorAll("[data-btn]");
const cityBtn = document.querySelectorAll("[data-city]");

// opening the sidebar in mobile
openMenu.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
});

// close sidebar function
const closeActiveClass = () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
}

// calling function on click of cross btn
closeMenu.addEventListener("click", () => {
    closeActiveClass();
});

// calling function on click of overlay
overlay.addEventListener("click", () => {
    closeActiveClass();
});

// calling function on click of any link of sidebar
sidebarBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        closeActiveClass();
    });
});

// class reseter function
const resetClass = () => {
    cityBtn.forEach((btn) => {
        btn.classList.remove("active");
    });
}

// adding a class on click of any city buttons
cityBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        resetClass();
        btn.classList.add("active");
    });
});

// ===================================================================================


const mainContainer = document.querySelector("[data-main]");
const loader = document.querySelector("[data-loader]");
// celsius and Ferh. btn
const celBtn = document.querySelector(".cel");
const ferBtn = document.querySelector(".fer");
// current loc. btn
const currentLocationButton = document.querySelector("[data-current-btn]");

// My Api key
const API_KEY = "4f46732062f42662447d5770c3ef673e";

// onClick of currentLocationButton
currentLocationButton.addEventListener("click", (e) => {
    navigator.geolocation.getCurrentPosition(onSuccess , onError);
});

// onSuccess of fetching current location
const onSuccess = (location) => {
    // console.log(location.coords);
    const {latitude, longitude} = location.coords;

    fetchDataCurrentLocation(latitude , longitude);
    fetchHourlyData(latitude , longitude);
}

// when user denied or geolocation api not support in browser
const onError = () => {
    alert("permission issue or internet issue");
    return;
}

// fetching current weather data on basisi of latitiude and longitude
const fetchDataCurrentLocation = async (lat , lon , unit="metric") => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;

    try {
        loader.classList.add("active");
        
        const response = await fetch(url);
        if(response.ok){
            const result = await response.json();
            // console.log(result);

            displayCurrentWeatherData(result);

            loader.classList.remove("active");
        } else {
            throw Error;
        }

    } catch(err) {
        loader.classList.remove("active");
        alert("Wrong:", err);
        return;
    }
}

// fetching 3 hourly data on basisi of latitiude and longitude
const fetchHourlyData = async(lat, lon, unit="metric") => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;

    try {
        loader.classList.add("active");
        
        const response = await fetch(url);
        if(response.ok){
            const result = await response.json();
            // console.log(result.list);

            displayHourlyWeather(result.list);
            loader.classList.remove("active");
        } else {
            throw Error;
        }

    } catch(err) {
        loader.classList.remove("active");
        alert("Wrong:", err);
        return;
    }
}

// references which we update
const currTemp = document.querySelector("[data-temp]");
const weatherIcon = document.querySelector("[data-icon]");
const weatherDescription = document.querySelector("[data-description]");
const todayDate = document.querySelector("[data-date]");
const weatherLocation = document.querySelector("[data-location]");
const sunRiseEl = document.querySelector("[data-sunrise]");
const sunSetEl = document.querySelector("[data-sunset]");
const humidityEl = document.querySelector("[data-humidity]");
const pressureEl = document.querySelector("[data-pressure]");
const visibilityEl = document.querySelector("[data-visibility]");
const feelLikeEl = document.querySelector("[data-feel]");

// creates utility function to convert into date and time also we return the required things
const cd = (inSeconds) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["JAN", "FEB", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"];

    const date = new Date(inSeconds * 1000);
    const dayIndex = date.getDay();
    const monthIndex = date.getMonth();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    let ampm = "AM";
    if(hours >= 12){
        hours = hours - 12;
        ampm = "PM";
    }
    
    const todayDate = date.getDate();
    const day = days[dayIndex];
    const month = months[monthIndex];

    return {
        todayDate,
        day,
        month,
        hours,
        minutes,
        ampm
    }
}

// displaying the current weather data
const displayCurrentWeatherData = (allData) => {
    const {main: {feels_like, humidity, pressure, temp}, dt, name, sys: {country, sunrise, sunset}, weather, visibility} = allData;
    const {icon, description} = weather[0];
    // calling function
    const currentDate = cd(dt);
    const sunRiseTime = cd(sunrise);
    const sunSetTime = cd(sunset);

    currTemp.textContent = `${temp.toFixed()}°`;
    weatherIcon.src = `./images/${icon}.png`;
    weatherDescription.textContent = `${description}`;
    todayDate.textContent = `${currentDate.day} ${currentDate.todayDate}, ${currentDate.month}`;
    weatherLocation.textContent = `${name}, ${country}`;
    sunRiseEl.textContent = `${sunRiseTime.hours}:${sunRiseTime.minutes} ${sunRiseTime.ampm}`;
    sunSetEl.textContent = `${sunSetTime.hours}:${sunSetTime.minutes} ${sunSetTime.ampm}`;
    humidityEl.textContent = `${humidity}%`;
    pressureEl.textContent = `${pressure}hPa`;
    visibilityEl.textContent = `${visibility/1000}KM`;
    feelLikeEl.textContent = `${feels_like.toFixed()}°`;

}


// displaying 3 hourly weather cards
const displayHourlyWeather = (arrayOfData) => {
    const tempCardsContainer = document.querySelector("[data-temp-cards]");

    tempCardsContainer.innerHTML = arrayOfData.map((data) => {
        const {main: {temp}, dt, weather} = data;
        const {icon , main} = weather[0];

        // calculation of time and AM PM
        const date = new Date(dt * 1000);
        let time = date.getHours();
        let ampm = "AM";
        if(time >= 12) {
            time = time - 12;
            ampm = "PM";
        }



        return `
        <div class="temp-card">
            <p>${time} ${ampm}</p>

            <img src="./images/${icon}.png" alt="weather-img">

            <span>${main}</span>

            <span>${temp.toFixed()}°</span>
        </div>
        `;

    }).join("");
}


// onclick of any city button we fetch the weather data
cityBtn.forEach((button) => {
    button.addEventListener("click", () => {
        const cityName = button.textContent.toLowerCase();

        fetchCityWeather(cityName);
        fetchCityHourlyData(cityName);
    });
});

// fetching current weather data basis of city name
const fetchCityWeather = async(name, unit="metric") => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API_KEY}&units=${unit}`;

    try {
        loader.classList.add("active");
        
        const response = await fetch(url);

        // console.log(response);
        if(response.ok){
            const result = await response.json();
            // console.log(result);

            displayCurrentWeatherData(result);
            loader.classList.remove("active");
        } else {
            throw Error;
        }

    } catch(err) {
        loader.classList.remove("active");
        alert("Wrong:", err);
        return;
    }
}


// fetching 3 hourly data basis of city name
const fetchCityHourlyData = async(name, unit="metric") => {

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=${API_KEY}&units=${unit}`;

    try {
        loader.classList.add("active");
        const response = await fetch(url);
        const result = await response.json();
        // console.log(result.list);
        displayHourlyWeather(result.list);
        
        loader.classList.remove("active");
    } catch(err) {
        loader.classList.remove("active");
        alert("Wrong:", err);
        return;
    }
}


const searchForm = document.querySelector("[data-form]");
const inputField = document.querySelector("[data-input]");

// fetching data on basis of user search
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchedCity = inputField.value.trim().toLowerCase();
    if(searchedCity.length < 1) return;

    fetchCityWeather(searchedCity);
    fetchCityHourlyData(searchedCity);
    
    
    inputField.value = "";
});

// onLoad we fetch delhi city weather
window.addEventListener("DOMContentLoaded", () => {
    fetchCityWeather("delhi");
    fetchCityHourlyData("delhi");
});


celBtn.addEventListener("click", () => {
    alert("This feature is not implemented yet");
});
ferBtn.addEventListener("click", () => {
    alert("This feature is not implemented yet");
});