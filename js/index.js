
const icon = document.getElementById("icon");
const city = document.getElementById("city");
const date = document.getElementById('date');
const temp = document.getElementById('temp');
const inputCity = document.getElementById('inputCity');
const submitCityBtn = document.getElementById('submitCityBtn');
const form = document.getElementById('form')

const minmaxtemp = document.getElementById('minmaxtemp')


async function getDataByLatLong(lat,long){

    let url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`
    console.log(url)
    let response = await fetch(url)
    let result = await response.json();
    return result;

}

async function getDataByCity(city){

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    console.log(url)
    let response = await fetch(url)
    let result = await response.json();
    return result;

}

function getRequiredData(response){
    console.log(response);
    let icon = response.weather[0].icon;
    let city = response.name
    console.log(city)
    let country = response.sys.country
    console.log(country);
    let temp = response.main.temp;
    temp = temp-273.15;
    temp = temp.toString().substring(0,5);
    
    let temp_min = response.main.temp_min;
    temp_min = temp_min-273.15;
    temp_min = temp_min.toString().substring(0,5);
    let temp_max = response.main.temp_max;
    temp_max = temp_max-273.15;
    temp_max = temp_max.toString().substring(0,5);

    console.log(temp)
    let date = new Date();
    return {
        icon:icon,
        city:city,
        country:country,
        temp:temp,
        date:date.toDateString(),
        time:date.toTimeString().substring(0,8),
        temp_max:temp_max,
        temp_min:temp_min
    }
}

function getLocation(){
    if(navigator.geolocation){
        console.log("Supporting");
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        console.log("Browser not supporting")
    }
}
function putData(data){
    console.log(data);
    let iconUrl = ` http://openweathermap.org/img/wn/${data.icon}@2x.png`
    icon.setAttribute("src",iconUrl);
    city.innerHTML = `${data.city},${data.country}`;
    date.innerHTML = `${data.date} | ${data.time}`.toUpperCase();

    temp.innerHTML = `${data.temp}°C`
    minmaxtemp.innerHTML = `Min ${data.temp_min}°C|Max ${data.temp_max}°C`
}
function showPosition(position){

    console.log("Latitude = "+position.coords.latitude);
    console.log("Longitude = " + position.coords.longitude);
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    
    getDataByLatLong(lat,long)
    .then((response)=>{
        // console.log(response);
       let requiredData = getRequiredData(response);
       putData(requiredData);
    })


}


getLocation();
form.style.display='none'

city.addEventListener("click",()=>{
    console.log('click');
    form.style.display='block'
    inputCity.value = `${city.innerText}`
    city.style.display='none'
})

submitCityBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    let cityName = inputCity.value;
    console.log(cityName);
    getDataByCity(cityName).then((response)=>{
        let requiredData = getRequiredData(response);
        putData(requiredData);
    })
    form.style.display='none';
    city.style.display='inline'

})