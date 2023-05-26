console.log(document.title);

// Setting the time in time element and updating every second to make it functio like a clock
let TimeElement=document.getElementById('headerTime');TimeElement.innerText=setElementTime();
function setElementTime(){let date=Date().split(' ');let dateStr='';for (let i=0;i<5;i++){dateStr+=' '+(date[i])};return dateStr;};
setInterval(()=>{document.getElementById('headerTime').innerText=setElementTime()},1000);

// Creating header image element
let cimgElement=document.getElementById('cimg');cimgElement.style.background='right no-repeat';
cimgElement.style.backgroundSize='contain';cimgElement.style.backgroundImage='url(images/icon.svg)';

// Dark mode setup
let darkModeButton=document.getElementById('darkModeButton');let mode='light';
let darkModeElements=document.getElementsByClassName('darkModeElement');
let cityInput=document.getElementById('cityInput');
function darkModeToggle(){
    if (mode==='light'){mode='dark';darkModeButton.innerText='☀️';darkModeButton.style.backgroundColor='#e1e1e1';
        for (let i=0;i<darkModeElements.length;i++){darkModeElements[i].classList.add('darkModeEnable');}
        document.getElementById('header').style.backgroundColor='#1f1f1f';cityInput.style.borderColor='white';
        locationOptions.style.backgroundColor='#1e1e1e';
    }
    else {mode='light';darkModeButton.innerText='🌙';darkModeButton.style.backgroundColor='#454545';
        for (let i=0;i<darkModeElements.length;i++){darkModeElements[i].classList.remove('darkModeEnable');}
        document.getElementById('header').style.backgroundColor='white';cityInput.style.borderColor='black';
        locationOptions.style.backgroundColor='white';
    };
};

// Function that handles searching for a location based on the text typed in the searchbar
let longitude=77.25; let latitude=28.625;let possibleLocations=[];let place;
function searchLocation(){
    let query=cityInput.value;let searchURL='https://photon.komoot.io/api/?q='+query+'&limit=10';
    possibleLocations=[];openLocationOptionsDialog();
    if (query===''){showElement(defaultLocationOptionItem);hideElement(otherLocationOptions);}
    else{
    fetch(searchURL).then((response)=>response.json()).then((result)=>{return result.features;}).then((f)=>{possibleLocations=f;
        otherLocationOptions.innerHTML='';
        showElement(defaultLocationOptionItem);showElement(otherLocationOptions);
        for (let i=0;i<possibleLocations.length;i++){
            let newLocationOptionItem=document.createElement('div');
            let newLocationOptionItemText=placeLabelCreator(possibleLocations[i]);
            newLocationOptionItem.className='locationOptionItem';newLocationOptionItem.id='locationOptionItem'+i;newLocationOptionItem.innerText=newLocationOptionItemText;
            newLocationOptionItem.addEventListener('click', locationItemClicked);otherLocationOptions.appendChild(newLocationOptionItem);
            }
        if ((cityInput.value!=='')&&(possibleLocations.length===0)){defaultLocationOptionItem.innerText='Not Found';}
        else if (possibleLocations.length!==0){hideElement(defaultLocationOptionItem);}
        })
    .catch((error)=>console.error('Error: Could not load data:',error))
    };
};
cityInput.addEventListener('keyup',searchLocation);

// Function that handles creating a label for each of matching place result found
function placeLabelCreator(place){
    let candidates=['name', 'osm_value','city','county','state','country'];let placeLabel='';
    for (let i=0;i<candidates.length;i++){if (place.properties.hasOwnProperty(candidates[i])){placeLabel+=', '+place.properties[candidates[i]].replace(place.properties[candidates[i]].charAt(0),place.properties[candidates[i]].charAt(0).toUpperCase())}}
    placeLabel=placeLabel.substring(2);return placeLabel;
};

// Function that handles when a ceratin matching place is selected
function locationItemClicked(){console.log(this.innerText);
    if (this.innerText!==undefined){cityInput.value=this.innerText;};
    longitude=possibleLocations[this.id.charAt(18)].geometry.coordinates[0];
    latitude=possibleLocations[this.id.charAt(18)].geometry.coordinates[1];
    city=this.innerText;
    place=possibleLocations[new Number(this.id.charAt(18))];
};

// Functions that handle showing and hiding elements
function hideElement(element){element.style.visibility='hidden';element.style.display='none';};
function showElement(element, DISPLAY='block'){element.style.visibility='visible';element.style.display=DISPLAY;};

// Function that handles displaying and hiding of entries in matching places list
let locationOptions=document.getElementById('locationOptions');
let otherLocationOptions=document.getElementById('otherLocationOptions');
let defaultLocationOptionItem=document.getElementById('defaultLocationOptionItem');
function openLocationOptionsDialog(){showElement(locationOptions);showElement(defaultLocationOptionItem);
    if (cityInput.value===''){defaultLocationOptionItem.innerText='Start typing to search for locations';}
    else{defaultLocationOptionItem.innerText='Loading...';}
};
cityInput.addEventListener('focus',searchLocation());

// Handling displaying of matching places list depending on whether or not searchbar(cityInput) has focus or not
addEventListener('click', e=>{if ((e.target!==cityInput)){hideElement(locationOptions)}else{showElement(locationOptions)}});

// Functions that handle getWeatherButton and reloadWeather button clicks
let weather;
function getWeatherButtonClick(){if (cityInput.value!==''){getWeather();getAQI();updateMap();}else{alert('No location selected to get weather for.')}};
function reloadWeather(){getWeather();getAQI();};

// Function that handles fetching weather data from open-meteo api and calling functions to update weather, weatherCondition and weatherTip to display and update/create weather graph
async function getWeather(){
    let weatherURL='https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+'&current_weather=true&hourly=temperature_2m,precipitation,windspeed_80m,cloudcover,snowfall,rain,visibility&daily=temperature_2m_max,temperature_2m_min,uv_index_max&forecast_days=1&timezone=auto';
    try{
        let response=await fetch(weatherURL);
        weather=await response.json();
        console.log('WEATHER DATA:', weather);cityName.innerText=city;
        temp=weather.current_weather.temperature;
        minTemp=weather.daily.temperature_2m_min[0].toFixed(1);
        maxTemp=weather.daily.temperature_2m_max[0].toFixed(1);
        prec=weather.hourly.precipitation[new Date().getHours()].toFixed(1);
        rain=weather.hourly.rain[new Date().getHours()].toFixed(1);
        snow=weather.hourly.snowfall[new Date().getHours()].toFixed(1);
        visibility=(weather.hourly.visibility[new Date().getHours()]/1000).toFixed(1);
        cloud=weather.hourly.cloudcover[new Date().getHours()].toFixed(1);
        wind=weather.current_weather.windspeed;
        uvin=weather.daily.uv_index_max;
        if (unit==='F'){formatTempInF();};updateWeather();updateWeatherStatus();
    }
    catch{console.error('Error loading weather data. Please refresh page.');conditionElement.innerText='Error. Try searching for your location or reload.';weatherTipValueElement.innerText='Error. Try searching for your location or reload.';};
    
    let graphStatusElement=document.getElementById('graphStatus');
    try{if (graphCreated){updateGraph();}else{createGraph();};graphStatusElement.style.display='none';}
    catch{console.error('Error drawing graph. Please refresh page.');graphStatusElement.innerText='Error drawing graph. Please reload page.';graphStatusElement.style.display='block';};
};

// Function that handles fetching aqi data from open-meteo api and displaying it
async function getAQI(){let yyyy=new Date().getFullYear();let mm='0'+(new Date().getMonth()+1);let dd=new Date().getDate();
    let aqiURL='https://air-quality-api.open-meteo.com/v1/air-quality?latitude='+latitude+'&longitude='+longitude+'&hourly=european_aqi&start_date='+yyyy+'-'+mm+'-'+dd+'&end_date='+yyyy+'-'+mm+'-'+dd;
    try{
        let aqiString=await fetch(aqiURL);let aqiData=await aqiString.json();console.log('AQI DATA:', aqiData);
        aqi=Number(aqiData.hourly.european_aqi[new Date().getHours()].toFixed(1));
        if (aqi<=20){aqiCondition='Good';aqiColor='Green';}else if (aqi<=40){aqiCondition='Fair';aqiColor='Yellow';}else if (aqi<=60){aqiCondition='Moderate';aqiColor='Orange';}else if (aqi<=80){aqiCondition='Poor';aqiColor='Red';}else if (aqi<=100){aqiCondition='Very Poor';aqiColor='Maroon';}else{aqiCondition='Extremely Poor';aqiColor='Black';}
        aqiElement.innerHTML=aqi+'/100.0'+'<div>'+aqiCondition+'</div>';aqiColorElement.style.backgroundColor=aqiColor;
    }
    catch{console.error('Error loading AQI data. Please refresh page.');};
};

// Function that handles loading and displaying default map
let map;let mapLoadingElement=document.getElementById('mapLoading');
async function loadMap(){
    try{map = L.map('map').setView([latitude,longitude-0.04],9);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
    document.getElementsByClassName('leaflet-control-container')[0].remove();
    setInterval(()=>{mapLoadingElement.style.display='none';},3000);
    }
    catch{console.error('Error loading map. Please refresh page.');
    mapLoadingElement.style.display='block';mapLoadingElement.innerText='Error loading map. Please refresh page.';
    };
};

// Function that handles updating map when a new place is selected to see weather
function updateMap(){console.log('updateMap called');
    mapLoadingElement.style.display='block';
    setInterval(()=>{mapLoadingElement.style.display='none';},3000);
    let zoomLevel=9;
    if (place.properties.osm_value==='continent'){zoomLevel=2;}
    else if (place.properties.osm_value==='country'){zoomLevel=4;}
    else if ((place.properties.osm_value==='state')||(place.properties.osm_value==='county')){zoomLevel=6;}
    else if(place.properties.osm_value==='city'){zoomLevel=9;}
    else{zoomLevel=12;}
    map.flyTo([latitude,longitude],zoomLevel,{animation:true});};

getWeather();
getAQI();
loadMap();

let city='New Delhi City, Delhi, India';let cityName=document.getElementById('cityName');cityName.innerText=city;
let unit='C';let temp=0;let minTemp=0;let maxTemp=0;let prec=0;let rain=0;let snow=0;let wind=0;let visibility=0;let cloud=0;let uvin=0;let aqi=0;let aqiCondition='';let weatherCondition='';let weatherTip='';
let conditionImages={'Sunny':'url(images/sunny.svg)','Partly Cloudy':'url(images/icon.svg)','Cloudy':'url(images/cloudy.svg)','Rain':'url(images/rain.svg)','Snow':'url(images/snow.svg)','Windy':'url(images/windy.svg)','Clear Night':'url(images/night_clear.svg)','Partly Cloudy Night':'url(images/night_partly_cloudy.svg)','Thunder':'url(images/thunder.svg)','Fog':'url(images/fog.svg)'};
let conditionImage=conditionImages['Partly Cloudy'];
let tempElement=document.getElementById('temp');let conditionElement=document.getElementById('condition');
let minTempElement=document.getElementById('minTemp');let maxTempElement=document.getElementById('maxTemp');
let precElement=document.getElementById('prec');let rainElement=document.getElementById('rain');
let snowElement=document.getElementById('snow');let windElement=document.getElementById('wind');
let visibilityElement=document.getElementById('visibility');let cloudElement=document.getElementById('cloud');
let uvinElement=document.getElementById('uvin');let aqiElement=document.getElementById('aqi');
let aqiColorElement=document.getElementById('aqiColor');let aqiColor='transparent';
let weatherTipValueElement=document.getElementById('weatherTipValue');

updateWeather();

// Functions that handle converting passed temperature from celsius to fahrenheit and vice versa
function cTOf(c){f=(c*(9/5))+32;return f.toFixed(1);};
function fTOc(f){c=(f-32)*(5/9);return c.toFixed(1);};

// Function that handles converting temperature into celsius and displaying it
function formatTempInC(){unit='C';
    temp=fTOc(temp);tempElement.innerHTML=temp+'&deg;'+unit;
    minTemp=fTOc(minTemp);minTempElement.innerHTML=minTemp+'&deg;'+unit;
    maxTemp=fTOc(maxTemp);maxTempElement.innerHTML=maxTemp+'&deg;'+unit;
    console.log(temp, minTemp, maxTemp);console.log(unit);
};

// Function that handles converting temperature into fahrenheit and displaying it
function formatTempInF(){unit='F';
    temp=cTOf(temp);tempElement.innerHTML=temp+'&deg;'+unit;
    minTemp=cTOf(minTemp);minTempElement.innerHTML=minTemp+'&deg;'+unit;
    maxTemp=cTOf(maxTemp);maxTempElement.innerHTML=maxTemp+'&deg;'+unit;
    console.log(temp, minTemp, maxTemp);console.log(unit);
};

// Function that handles temperature unit change button(tempUnitChangeButton) click
function changeTempUnit(){document.getElementById('tempUnitChangeButton').innerHTML='&deg;'+unit;
    if (unit==='C'){formatTempInF();}else if (unit==='F'){formatTempInC();}
};

// Function that handles displaying weather
function updateWeather(){
    tempElement.innerHTML=temp+'&deg'+unit;minTempElement.innerHTML=minTemp+'&deg'+unit;maxTempElement.innerHTML=maxTemp+'&deg'+unit;
    precElement.innerHTML=prec+' mm<div>'+(prec/25.4).toFixed(1)+' in</div>';rainElement.innerHTML=rain+' mm<div>'+(rain/25.4).toFixed(1)+' in</div>';snowElement.innerHTML=snow+' cm<div>'+(snow/2.54).toFixed(1)+' in</div>';
    windElement.innerHTML=wind+' km/h<div>'+(wind/1.609).toFixed(1)+' miles/h</div>';cloudElement.innerHTML=cloud+'%';
    visibilityElement.innerHTML=visibility+' km<div>'+(visibility/1.609).toFixed(1)+' miles</div>';uvinElement.innerHTML=uvin;
    aqiElement.innerHTML=aqi+'/100.0'+'<div>'+aqiCondition+'</div>';aqiColorElement.style.backgroundColor=aqiColor;
};

// Function that handles displaying weather status that includes both weatherCondition and weatherTip
function updateWeatherStatus(){
    if (wind>15){weatherCondition='Windy';conditionImage=conditionImages['Windy'];}
    else{
        switch (weather.current_weather.weathercode) {
            case 0:
            case 1:
                if (weather.current_weather.is_day===1){weatherCondition='Sunny';conditionImage=conditionImages['Sunny'];}
                else{weatherCondition='Clear Sky';conditionImage=conditionImages['Clear Night'];}
                break;
            case 2:
                if (weather.current_weather.is_day===1){weatherCondition='Partly Cloudy';conditionImage=conditionImages['Partly Cloudy'];}
                else{weatherCondition='Partly Cloudy';conditionImage=conditionImages['Partly Cloudy Night'];}
                break;
            case 3:
                weatherCondition='Cloudy';conditionImage=conditionImages['Cloudy'];
                break;
            case 45:
            case 48:
                weatherCondition='Fog';conditionImage=conditionImages['Fog'];
                break;
            case 51:
            case 53:
            case 55:
            case 56:
            case 57:
                weatherCondition='Rain (Drizzle)';conditionImage=conditionImages['Rain'];
                break;
            case 61:
            case 63:
            case 65:
            case 66:
            case 67:
                weatherCondition='Rain';conditionImage=conditionImages['Rain'];
                break;
            case 80:
            case 81:
            case 82:
                weatherCondition='Rain (Showers)';conditionImage=conditionImages['Rain'];
                break;
            case 71:
            case 73:
            case 75:
            case 77:
            case 85:
            case 86:
                weatherCondition='Snow';conditionImage=conditionImages['Snow'];
                break;
            case 95:
            case 96:
            case 99:
                weatherCondition='Thunderstorm';conditionImage=conditionImages['Thunder'];
                break;
            default:
                if (wind>15){weatherCondition='Windy';conditionImage=conditionImages['Windy'];}
                break;
        };
    };
    switch (weatherCondition) {
        case 'Snow':
            weatherTip='Wear warm clothes as it is snowing.';
            break;
        case 'Rain':
        case 'Rain (Drizzle)':
        case 'Rain (Showers)':
            weatherTip='Carry an umbrella or raincoat when going outside as it is raining.';
            break;
        case 'Thunderstorm':
            weatherTip='Stay safe when going outside in thunder.';
            break;
        case 'Cloudy':
            weatherTip='Carry an umbrella or raincoat when going outside as it may rain.';
            break;
        case 'Fog':
            weatherTip='Be safe ouside especially if driving in fog.';
            break;
        case 'Windy':
            weatherTip='Be safe outside as it is windy';
            break;
        case 'Sunny':
            weatherTip='Wear lightweight and breathable clothing, carry caps or hats and sunglasses if required.';
            break;
        default:
            if (uvin>5){weatherTip='High UV index, use sunscreen.'}
            else if (aqi>60){weatherTip='Bad air quality, use masks when going outside and air filters inside. Stay inside if possible.'}
            else{weatherTip='Good weather outside, enjoy!'};
            break;
    };
    conditionElement.innerText=weatherCondition;
    cimgElement.style.backgroundImage=conditionImage;
    weatherTipValueElement.innerText=weatherTip;
};

// Function that handles generating data for graph
let graphElement=document.getElementById('weatherGraph');
let weatherGraph;let timeData=[];let graphDataSets=[];let graphCreated=0;
function generateGraphData(){timeData=[];graphDataSets=[];
    let dataset={label:'',data:[],borderwidth:1};
    let dataSetKeys=['Temperature','Maximum Temperature','Minimum Temperature','Precipitation','Rain','Snow'];
    let dataSetValues=[weather.hourly.temperature_2m,weather.daily.temperature_2m_max,weather.daily.temperature_2m_min,weather.hourly.precipitation,weather.hourly.rain,weather.hourly.snow];
    for (let i=0;i<weather.hourly.time.length;i++){timeData.push(weather.hourly.time[i].substring(11))};
    for (let i=0;i<dataSetKeys.length;i++){dataset.label=dataSetKeys[i];dataset.data=dataSetValues[i];
        graphDataSets.push(dataset);dataset={label:'',data:[],borderwidth:1};
    };
};

// Function that handles initialization of the weather graph
function createGraph(){graphCreated=1;generateGraphData();
    weatherGraph=new Chart(graphElement, {type:'line',data:{labels:timeData,datasets:graphDataSets},options:{responsive:true,maintainAspectRatio:false}});
};

// Function that handles updating the weather graph every time a new place is selected
function updateGraph(){generateGraphData();weatherGraph.data.labels=timeData;weatherGraph.data.datasets=graphDataSets;weatherGraph.update();};