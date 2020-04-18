const urlPlace = 'https://api.ipdata.co/?api-key=test';

const urlWeatherNowDay = 'https://api.weatherapi.com/v1/current.json?key=9146a513ed4545b4800125347200204&q=';

const urlWeatherNextDay = 'https://api.weatherapi.com/v1/forecast.json?key=9146a513ed4545b4800125347200204&q=';


async function getPlace() {
    let response = await fetch(urlPlace);
    if (response.ok) {
        let jsonData = response.json();
        return jsonData;
    } else {
        alert('Error: ' + response.status);
    }
}


async function getWeatherNowDay(place) {
    let response = await fetch(urlWeatherNowDay + place);
    if (response.ok) {
        let jsonData = response.json();
        console.log(jsonData);
        return jsonData;
    } else {
        alert('Error: ' + response.status);
    }
}


async function getWeatherNextDay(place) {
    let response = await fetch(urlWeatherNextDay + place + '&days=6');
    if (response.ok) {
        let jsonData = response.json();
        console.log(jsonData);
        return jsonData;
    } else {
        alert('Error: ' + response.status);
    }
}


function renderDetailsItem(className, value) {
    let container = document.querySelector(`.${className}`).querySelector('.details__value');
    container.innerHTML = value;
}


function render(data) {

    renderDetailsItem('current__city', data.city);

    getWeatherNowDay(data.city).then(dataWeather => {
        currentDataWeather = dataWeather;

        renderDetailsItem('current__temperature', Math.round(data.current.temp_c) + '˚');
        renderDetailsItem('current__description', data.current.condition.text);
        renderDetailsItem('feelslike', Math.round(data.current.feelslike_c) + '˚');
        renderDetailsItem('humidity', data.current.humidity + ' %');
        renderDetailsItem('wind', Math.round(data.current.wind_kph) + ' kp/h');
        renderDetailsItem('uvindex', data.current.uv);
    })

    getWeatherNextDay(data.city).then(dataWeather => {
        currentDataWeather = dataWeather;
        renderForecast(dataWeather);
    })
}

var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];


function renderForecast(data) {

    let forecastDataContainer = document.querySelector('.forecast');
    let forecasts = '';

    for (let i = 1; i < 6; i++) {
        var png = 'https://' + data.forecast.forecastday[i].day.condition.icon;

        var date = data.forecast.forecastday[i].date;
        var day = new Date(date);
        var n = day.getDay();

        var temp = Math.round(data.forecast.forecastday[i].day.avgtemp_c) + '˚';

        let template = `<div class="forecast__item">
        <div class="forecast__time">${days[n]}</div>
        <div class="forecast__icon"><img src="${png}" class="imgNow${i}"></div>
        <div class="forecast__temperature">${temp}</div>
        </div>`;

        forecasts += template;
    }

    forecastDataContainer.innerHTML = forecasts;

    renderDayOrNight(data);

    document.querySelector('.loading').style.display = 'none';
    document.querySelector('.weather').style.display = 'block';
}


function renderDayOrNight(data) {
    let attrName = '';

    let timeSunsire = data.forecast.forecastday[0].astro.sunrise;
    let timeSunset = data.forecast.forecastday[0].astro.sunset;

    var h1 = Number.parseInt(timeSunsire[0] + '' + timeSunsire[1]);
    var m1 = Number.parseInt(timeSunsire[3] + '' + timeSunsire[4]);

    var h2 = Number.parseInt(timeSunset[0] + '' + timeSunset[1]) + 12;

    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();

    if ((h1 < hour) && (m1 < minute) && (hour < h2)) {
        attrName = 'day';
    } else {
        attrName = 'night';
    }

    document.documentElement.setAttribute('data-theme', attrName);
}





function start() {
    document.querySelector('.loading').style.display = 'block';
    document.querySelector('.weather').style.display = 'none';

    getPlace().then(data => {
        currentData = data;
        render(data);
    })
}



start();