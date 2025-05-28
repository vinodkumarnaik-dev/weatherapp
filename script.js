let key="411a21a712424ed8b8240614252605"

async function getForcast() {
    let enteredcityidEle = document.getElementById("enteredcityid");
    let enteredcity = enteredcityidEle.value;
    console.log(enteredcity);

    let API = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${enteredcity}&days=7`;
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
