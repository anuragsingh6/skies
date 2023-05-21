console.log(document.title);

let TimeElement=document.getElementById('headerTime');TimeElement.innerText=setElementTime();
function setElementTime(){let date=Date().split(' ');let dateStr='';for (let i=0;i<5;i++){dateStr+=' '+(date[i])};return dateStr;}
setInterval(()=>{document.getElementById('headerTime').innerText=setElementTime()},1000);

let cimgElement=document.getElementById('cimg');cimgElement.style.background='right no-repeat';
cimgElement.style.backgroundSize='contain';cimgElement.style.backgroundImage='url(images/icon.svg)';

let darkModeButton=document.getElementById('darkModeButton');let mode='light';
let darkModeElements=document.getElementsByClassName('darkModeElement');
let cityInput=document.getElementById('cityInput');
function darkModeToggle(){
    if (mode==='light'){mode='dark';darkModeButton.innerText="☀️";darkModeButton.style.backgroundColor='#e1e1e1';
        for (let i=0;i<darkModeElements.length;i++){darkModeElements[i].classList.add('darkModeEnable');}
        document.getElementById('header').style.backgroundColor='#1f1f1f';cityInput.style.borderColor='white';
        locationOptions.style.backgroundColor='#1e1e1e';
    }
    else {mode='light';darkModeButton.innerText="🌙";darkModeButton.style.backgroundColor='#454545';
        for (let i=0;i<darkModeElements.length;i++){darkModeElements[i].classList.remove('darkModeEnable');}
        document.getElementById('header').style.backgroundColor='white';cityInput.style.borderColor='black';
        locationOptions.style.backgroundColor='white';
    }
}
let longitude=77.25; let latitude=28.625;
let possibleLocations=[];
function searchLocation(){
    let query=cityInput.value;
    // let searchURL='https://photon.komoot.io/api/?q='+query+'&layer=city&limit=10';
    let searchURL='https://photon.komoot.io/api/?q='+query+'&limit=10';
    possibleLocations=[];
    openLocationOptionsDialog();
    if (query===''){showElement(defaultLocationOptionItem);hideElement(otherLocationOptions);}
    else{
    fetch(searchURL).then((response)=>response.json()).then((result)=>{return result.features;}).then((f)=>{possibleLocations=f;//console.log(cityInput.value, possibleLocations);
        otherLocationOptions.innerHTML='';
        showElement(defaultLocationOptionItem);showElement(otherLocationOptions);
        for (let i=0;i<possibleLocations.length;i++){
            let newLocationOptionItem=document.createElement('div');
            let newLocationOptionItemText='';
            if (!(possibleLocations[i].properties.hasOwnProperty('county'))&&!(possibleLocations[i].properties.hasOwnProperty('state'))){newLocationOptionItemText=possibleLocations[i].properties.name+' '+possibleLocations[i].properties.osm_value.replace(possibleLocations[i].properties.osm_value.charAt(0),possibleLocations[i].properties.osm_value.charAt(0).toUpperCase())+', '+possibleLocations[i].properties.country;}
            else{
            if ((possibleLocations[i].properties.hasOwnProperty('county'))&&(possibleLocations[i].properties.hasOwnProperty('state'))){newLocationOptionItemText=possibleLocations[i].properties.name+' '+possibleLocations[i].properties.osm_value.replace(possibleLocations[i].properties.osm_value.charAt(0),possibleLocations[i].properties.osm_value.charAt(0).toUpperCase())+', '+possibleLocations[i].properties.state+', '+possibleLocations[i].properties.country;}
            else if ((possibleLocations[i].properties.county===undefined)){newLocationOptionItemText=possibleLocations[i].properties.name+' '+possibleLocations[i].properties.osm_value.replace(possibleLocations[i].properties.osm_value.charAt(0),possibleLocations[i].properties.osm_value.charAt(0).toUpperCase())+', '+possibleLocations[i].properties.city+', '+possibleLocations[i].properties.state+', '+possibleLocations[i].properties.country;}
            else if ((possibleLocations[i].properties.state===undefined)){newLocationOptionItemText=possibleLocations[i].properties.name+' '+possibleLocations[i].properties.osm_value.replace(possibleLocations[i].properties.osm_value.charAt(0),possibleLocations[i].properties.osm_value.charAt(0).toUpperCase())+', '+possibleLocations[i].properties.city+', '+possibleLocations[i].properties.county+', '+possibleLocations[i].properties.country;}
            else{newLocationOptionItemText=possibleLocations[i].properties.name+' '+possibleLocations[i].properties.osm_value.replace(possibleLocations[i].properties.osm_value.charAt(0),possibleLocations[i].properties.osm_value.charAt(0).toUpperCase())+', '+possibleLocations[i].properties.city+', '+possibleLocations[i].properties.county+', '+possibleLocations[i].properties.state+', '+possibleLocations[i].properties.country;}
            }
            newLocationOptionItem.className='locationOptionItem';newLocationOptionItem.id='locationOptionItem'+i;newLocationOptionItem.innerText=newLocationOptionItemText;
            newLocationOptionItem.addEventListener('click', locationItemClicked);otherLocationOptions.appendChild(newLocationOptionItem);
            }
        if ((cityInput.value!=='')&&(possibleLocations.length===0)){defaultLocationOptionItem.innerText='Not Found';}
        else if (possibleLocations.length!==0){hideElement(defaultLocationOptionItem);}
        })
    .catch((error)=>console.error('Error: Could not load data:',error))
    }
}
cityInput.addEventListener('keyup',searchLocation);

function locationItemClicked(){console.log(this.innerText);
    if (this.innerText!==undefined){cityInput.value=this.innerText;};
    longitude=possibleLocations[this.id.charAt(18)].geometry.coordinates[0];
    latitude=possibleLocations[this.id.charAt(18)].geometry.coordinates[1];
    console.log(this.id, latitude,longitude);
    city=this.innerText;
}

function hideElement(element){element.style.visibility='hidden';element.style.display='none';}
function showElement(element, DISPLAY='block'){element.style.visibility='visible';element.style.display=DISPLAY;}

let locationOptions=document.getElementById('locationOptions');
let otherLocationOptions=document.getElementById('otherLocationOptions');
let defaultLocationOptionItem=document.getElementById('defaultLocationOptionItem');
function openLocationOptionsDialog(){showElement(locationOptions);showElement(defaultLocationOptionItem);
    if (cityInput.value===''){defaultLocationOptionItem.innerText='Start typing to search for locations';}
    else{defaultLocationOptionItem.innerText='Loading...';}
    // else if ((cityInput.value!=='')&&(possibleLocations.length===0)){defaultLocationOptionItem.innerText='Loading...';}
}
cityInput.addEventListener('focus',()=>{searchLocation();});
cityInput.addEventListener('keyup',()=>{searchLocation();});
// cityInput.addEventListener('focusout',()=>{locationItemClicked();});

addEventListener('click', e=>{if ((e.target!==cityInput)){hideElement(locationOptions)}else{showElement(locationOptions)}})

let getWeatherButton=document.getElementById('getWeatherButton');let weather;
function getWeatherButtonClick(){if (cityInput.value!==''){getWeather();getAQI();}else{alert('No location selected to get weather for.')}}

async function getWeather(){
    let weatherURL='https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+'&current_weather=true&hourly=temperature_2m,precipitation,windspeed_80m,cloudcover,snowfall,rain,visibility&daily=temperature_2m_max,temperature_2m_min,uv_index_max&forecast_days=1&timezone=auto';
    try{
        let response=await fetch(weatherURL);
        weather=await response.json();

        console.log('WEATHER DATA:', weather);cityName.innerText=city;
        temp=weather.hourly.temperature_2m[new Date().getHours()].toFixed(1);
        minTemp=weather.daily.temperature_2m_min[0].toFixed(1);
        maxTemp=weather.daily.temperature_2m_max[0].toFixed(1);
        prec=weather.hourly.precipitation[new Date().getHours()].toFixed(1);
        rain=weather.hourly.rain[new Date().getHours()].toFixed(1);
        snow=weather.hourly.snowfall[new Date().getHours()].toFixed(1);
        visibility=(weather.hourly.visibility[new Date().getHours()]/1000).toFixed(1);
        cloud=weather.hourly.cloudcover[new Date().getHours()].toFixed(1);
        wind=weather.hourly.windspeed_80m[new Date().getHours()].toFixed(1);
        uvin=weather.daily.uv_index_max;
        updateWeather();updateWeatherStatus();console.log('unit:', unit);if (unit==='F'){formatTempInF();};
    }
    catch{console.error('Error loading weather data. Please try again.');conditionElement.innerText='Error. Try searching for your location.';}
}

async function getAQI(){let yyyy=new Date().getFullYear();let mm='0'+(new Date().getMonth()+1);let dd=new Date().getDate();
    let aqiURL='https://air-quality-api.open-meteo.com/v1/air-quality?latitude='+latitude+'&longitude='+longitude+'&hourly=european_aqi&start_date='+yyyy+'-'+mm+'-'+dd+'&end_date='+yyyy+'-'+mm+'-'+dd;
    try{
        let aqiString=await fetch(aqiURL);let aqiData=await aqiString.json();console.log('AQI DATA:', aqiData);
        aqi=aqiData.hourly.european_aqi[new Date().getHours()].toFixed(1);
        if (aqi<=20){aqiCondition='Good';}else if (aqi<=40){aqiCondition='Fair';}else if (aqi<=60){aqiCondition='Moderate';}else if (aqi<=80){aqiCondition='Poor';}if (aqi<=100){aqiCondition='Very Poor';}else{aqiCondition='Extremely Poor';}
        aqiElement.innerHTML=aqi+'/100.0'+'<div>'+aqiCondition+'</div>';
    }
    catch{console.error('Error loading AQI data. Please try again.');}
}

getWeather();
getAQI();

let city='New Delhi City, Delhi, India';
let cityName=document.getElementById('cityName');cityName.innerText=city;

let unit='C';
let temp=0;let minTemp=0;let maxTemp=0;let prec=0;let rain=0;let snow=0;let wind=0;let visibility=0;let cloud=0;let uvin=0;let aqi=0;let aqiCondition='';
// let temp='...';let minTemp='...';let maxTemp='...';let prec='...';let rain='...';let snow='...';let wind='...';let cloud='...';let uvin='...';let aqi='...';
let conditionImages={'Sunny':'url(images/sunny.svg)','Partly Cloudy':'url(images/icon.svg)','Cloudy':'url(images/cloudy.svg)','Rain':'url(images/rain.svg)','Snow':'url(images/snow.svg)','Windy':'url(images/windy.svg)'};
let conditionImage=conditionImages['Partly Cloudy'];
let tempElement=document.getElementById('temp');

let conditionElement=document.getElementById('condition');
let minTempElement=document.getElementById('minTemp');
let maxTempElement=document.getElementById('maxTemp');
let precElement=document.getElementById('prec');let rainElement=document.getElementById('rain');
let snowElement=document.getElementById('snow');let windElement=document.getElementById('wind');
let visibilityElement=document.getElementById('visibility');let cloudElement=document.getElementById('cloud');
let uvinElement=document.getElementById('uvin');let aqiElement=document.getElementById('aqi');

updateWeather();

function cTOf(c){f=(c*(9/5))+32;return f.toFixed(1);}
function fTOc(f){c=(f-32)*(5/9);return c.toFixed(1);}

function formatTempInC(){console.log('unit:', unit);unit='C';
    temp=fTOc(temp);tempElement.innerHTML=temp+'&deg;'+unit;
    minTemp=fTOc(minTemp);minTempElement.innerHTML=minTemp+'&deg;'+unit;
    maxTemp=fTOc(maxTemp);maxTempElement.innerHTML=maxTemp+'&deg;'+unit;
    console.log(temp, minTemp, maxTemp);console.log(unit);
}

function formatTempInF(){console.log('unit:', unit);unit='F';
    temp=cTOf(temp);tempElement.innerHTML=temp+'&deg;'+unit;
    minTemp=cTOf(minTemp);minTempElement.innerHTML=minTemp+'&deg;'+unit;
    maxTemp=cTOf(maxTemp);maxTempElement.innerHTML=maxTemp+'&deg;'+unit;
    console.log(temp, minTemp, maxTemp);console.log(unit);
}

function changeTempUnit(){document.getElementById('tempUnitChangeButton').innerHTML='&deg;'+unit;
    if (unit==='C'){formatTempInF();}else if (unit==='F'){formatTempInC();}
}

function updateWeather(){
    tempElement.innerHTML=temp+'&deg'+unit;minTempElement.innerHTML=minTemp+'&deg'+unit;maxTempElement.innerHTML=maxTemp+'&deg'+unit;
    precElement.innerHTML=prec+' mm<div>'+(prec/25.4).toFixed(1)+' in</div>';rainElement.innerHTML=rain+' mm<div>'+(rain/25.4).toFixed(1)+' in</div>';snowElement.innerHTML=snow+' cm<div>'+(snow/2.54).toFixed(1)+' in</div>';
    windElement.innerHTML=wind+' km/h<div>'+(wind/1.609).toFixed(1)+' miles/h</div>';cloudElement.innerHTML=cloud+'%';
    visibilityElement.innerHTML=visibility+' km<div>'+(visibility/1.609).toFixed(1)+' miles</div>';uvinElement.innerHTML=uvin;
    aqiElement.innerHTML=aqi+'/100.0'+'<div>'+aqiCondition+'</div>';
    updateWeatherStatus();
}

function updateWeatherStatus(){
    if (prec!==0){
        if (Number(snow)!==0){conditionElement.innerText='Snow';conditionImage=conditionImages['Snow'];}
        else{
            if (Number(rain)!==0){conditionElement.innerText='Rain';conditionImage=conditionImages['Rain'];}
            else{
                if ((Number(cloud)!==0)||(Number(cloud)<50)){conditionElement.innerText='Partly Cloudy';conditionImage=conditionImages['Partly Cloudy'];}
                else{conditionElement.innerText='Partly Cloudy';conditionImage=conditionImages['Partly Cloudy'];}
            }
        }
    }
    else{
        conditionElement.innerText='Sunny';conditionImage=conditionImages['Sunny'];
    }

    // let weatherCondition='';
    // if (Number(snow)!==0){weatherCondition='Snow';}
    // else{
    //     if (Number(rain)!==0){weatherCondition='Rain';}
    //     else{
    //         if ((Number(cloud)!==0)||(Number(cloud)<25)){weatherCondition='Sunny';}
    //         else{weatherCondition='Cloudy';}
    //     }
    // }
    // conditionImage=conditionImages['Snow'];
    // switch (0) {
    //     case snow:
    //         conditionElement.innerText='Snow';conditionImage=conditionImages['Snow'];
    //         break;
    //     case rain:
    //         conditionElement.innerText='Rain';conditionImage=conditionImages['Rain'];
    //         break;
    //     case cloud:
    //         conditionElement.innerText='Cloudy';conditionImage=conditionImages['Cloudy'];
    //         break;
    //     case wind:
    //         conditionElement.innerText='Windy';conditionImage=conditionImages['Windy'];
    //         break;
    //     default:
    //         conditionElement.innerText='Sunny';conditionImage=conditionImages['Sunny'];
    //         break;
    // }

    cimgElement.style.backgroundImage=conditionImage;
}
