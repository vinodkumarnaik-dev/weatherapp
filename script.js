let key="411a21a712424ed8b8240614252605"

async function getForcast() {
    let enteredcityidEle = document.getElementById("enteredcityid");
    let enteredcity = enteredcityidEle.value;
    console.log(enteredcity);

    let API = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${enteredcity}&days=7`;
    let res = await axios.get(API);
    let data = res.data;
    console.log(data);

    let currentIdEle = document.getElementById("currentId");
    let presentDetails = `
        <div class="col content-center">
            <h1>${enteredcity}</h1>
            <h6>${data.location.country}</h6>
            <h1>${data.current.temp_c} <sup>o</sup> C</h1>
        </div>
        <div class="col img-center">
            <img src="${data.current.condition.icon}">
        </div>
    `;
    currentIdEle.innerHTML = presentDetails;

    getForecast(data);
    getSevenDayForecast(data);  // <-- New function for 7-day forecast
    getSevenDayForecast(data);
    getAirConditions(data); 
}

function getForecast(data) {
    let hour = data.forecast.forecastday[0].hour;
    let forecastIdEle = document.getElementById("forecastId");

    let returnval = hour.reduce(function (acc, obj, ind) {
        if (ind == 6 || ind == 9 || ind == 12 || ind == 15 || ind == 18 || ind == 21) {
            let time = ind;
            let period = ind < 12 ? "AM" : "PM";
            if (time > 12) {
                time = time - 12;
            }
            acc += `
                <div class="container2">
                    <h6>${time}:00 ${period}</h6>
                    <img src="${obj.condition.icon}">
                    <h3>${obj.temp_c}°c</h3>
                </div>
            `;
        }
        return acc;
    }, "");

    forecastIdEle.innerHTML = returnval;
}

function getSevenDayForecast(data) {
    let dailyData = data.forecast.forecastday;
    let forecast7IdEle = document.getElementById("forecast7Id");

    let weekForecast = dailyData.map(day => {
        let date = new Date(day.date);
        let options = { weekday: 'short' };
        let dayName = date.toLocaleDateString('en-US', options);

        return `
            <div class="day-forecast">
                <h4>${dayName}</h4>
                <img src="${day.day.condition.icon}">
                <p>${day.day.condition.text}</p>
            </div>
        `;
    }).join("");

    forecast7IdEle.innerHTML = weekForecast;
}

function getAirConditions(data) {
    const airConditionsEle = document.getElementById("airConditions");

    const html = `
        <div class="row text-center">
            <div class="col">
                <p><i class="bi bi-thermometer-half"></i> Real Feel</p>
                <h4>${data.current.feelslike_c}°</h4>
            </div>
            <div class="col">
                <p><i class="bi bi-wind"></i> Wind</p>
                <h4>${data.current.wind_kph} km/h</h4>
            </div>
            <div class="col">
                <p><i class="bi bi-cloud-drizzle"></i> Chance of Rain</p>
                <h4>${data.forecast.forecastday[0].day.daily_chance_of_rain}%</h4>
            </div>
            <div class="col">
                <p><i class="bi bi-brightness-high"></i> UV Index</p>
                <h4>${data.current.uv}</h4>
            </div>
        </div>
    `;

    airConditionsEle.innerHTML = html;
}
