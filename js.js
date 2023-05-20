console.log(document.title);

let TimeElement=document.getElementById('headerTime');TimeElement.innerText=setElementTime();
function setElementTime(){let date=Date().split(' ');let dateStr='';for (let i=0;i<5;i++){dateStr+=' '+(date[i])};return dateStr;}
setInterval(()=>{document.getElementById('headerTime').innerText=setElementTime()},1000);

let cimgElement=document.getElementById('cimg');cimgElement.style.background='right no-repeat';
cimgElement.style.backgroundSize='contain';cimgElement.style.backgroundImage='url(imgs/icon.svg)';

let darkModeButton=document.getElementById('darkModeButton');let mode='light';
let darkModeElements=document.getElementsByClassName('darkModeElement');
let cityInput=document.getElementById('cityInput');
function darkModeToggle(){
    if (mode==='light'){mode='dark';darkModeButton.innerText="☀️";darkModeButton.style.backgroundColor='#e1e1e1';
        for (let i=0;i<darkModeElements.length;i++){darkModeElements[i].classList.add('darkModeEnable');}
        document.getElementById('header').style.backgroundColor='#1f1f1f';cityInput.style.borderColor='white';
        locationOptions.style.backgroundColor='#1e1e1e';
        document.getElementById('tempUnitChangeButton').style.backgroundColor='#1e1e1e';
    }
    else {mode='light';darkModeButton.innerText="🌙";darkModeButton.style.backgroundColor='#454545';
        for (let i=0;i<darkModeElements.length;i++){darkModeElements[i].classList.remove('darkModeEnable');}
        document.getElementById('header').style.backgroundColor='white';cityInput.style.borderColor='black';
        locationOptions.style.backgroundColor='white';
        document.getElementById('tempUnitChangeButton').style.backgroundColor='white';
    }
}
let longitude; let latitude;
let possibleLocations=[];
function searchLocation(){
    let query=cityInput.value;//let searchURL='https://photon.komoot.io/api/?q='+query+'&layer=city&limit=10';
    let searchURL='https://photon.komoot.io/api/?q='+query+'&limit=10';possibleLocations=[];
    openLocationOptionsDialog();
    fetch(searchURL).then((response)=>response.json()).then((result)=>{return result.features;}).then((f)=>{possibleLocations=f;//console.log(cityInput.value, possibleLocations);
        otherLocationOptions.innerHTML='';
        showElement(defaultLocationOptionItem);showElement(otherLocationOptions);
        for (let i=0;i<possibleLocations.length;i++){
            let newLocationOptionItem=document.createElement('div');
            let newLocationOptionItemText='';
            if (!(possibleLocations[i].properties.hasOwnProperty('county'))&&!(possibleLocations[i].properties.hasOwnProperty('state'))){newLocationOptionItemText=possibleLocations[i].properties.name+' '+possibleLocations[i].properties.type.replace(possibleLocations[i].properties.type.charAt(0),possibleLocations[i].properties.type.charAt(0).toUpperCase())+', '+possibleLocations[i].properties.country;}
            else if ((possibleLocations[i].properties.county===undefined)){newLocationOptionItemText=possibleLocations[i].properties.name+' '+possibleLocations[i].properties.type.replace(possibleLocations[i].properties.type.charAt(0),possibleLocations[i].properties.type.charAt(0).toUpperCase())+', '+possibleLocations[i].properties.state+', '+possibleLocations[i].properties.country;}
            else if ((possibleLocations[i].properties.state===undefined)){newLocationOptionItemText=possibleLocations[i].properties.name+' '+possibleLocations[i].properties.type.replace(possibleLocations[i].properties.type.charAt(0),possibleLocations[i].properties.type.charAt(0).toUpperCase())+', '+possibleLocations[i].properties.county+', '+possibleLocations[i].properties.country;}
            else{newLocationOptionItemText=possibleLocations[i].properties.name+' '+possibleLocations[i].properties.type.replace(possibleLocations[i].properties.type.charAt(0),possibleLocations[i].properties.type.charAt(0).toUpperCase())+', '+possibleLocations[i].properties.county+', '+possibleLocations[i].properties.state+', '+possibleLocations[i].properties.country;}
            newLocationOptionItem.className='locationOptionItem';newLocationOptionItem.id='locationOptionItem'+i;newLocationOptionItem.innerText=newLocationOptionItemText;
            newLocationOptionItem.addEventListener('click', locationItemClicked);otherLocationOptions.appendChild(newLocationOptionItem);
            }
        if ((cityInput.value!=='')&&(possibleLocations.length===0)){defaultLocationOptionItem.innerText='Not Found';}
        else if (possibleLocations.length!==0){hideElement(defaultLocationOptionItem);}
        })
    .catch((error)=>console.error('Error: Could not load data:',error))
    
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
cityInput.addEventListener('focusout',()=>{locationItemClicked();});

addEventListener('click', e=>{if ((e.target!==cityInput)){hideElement(locationOptions)}else{showElement(locationOptions)}})

let getWeatherButton=document.getElementById('getWeatherButton');let weather;
async function getWeather(){
    let weatherURL='https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+'&hourly=temperature_2m,precipitation,windspeed_80m&daily=temperature_2m_max,temperature_2m_min,uv_index_max&forecast_days=1&timezone=auto';
    const response=await fetch(weatherURL);
    const weather=await response.json();

    console.log(weather);cityName.innerText=city;
}


let city="New York City, USA";let cityName=document.getElementById('cityName');
cityName.innerText=city;

let unit='C';let temp=25;let minTemp=20;let maxTemp=30;
let tempElement=document.getElementById('temp');tempElement.innerHTML=temp+'&deg'+unit;
let minTempElement=document.getElementById('minTemp');minTempElement.innerHTML=minTemp+'&deg'+unit;
let maxTempElement=document.getElementById('maxTemp');maxTempElement.innerHTML=maxTemp+'&deg'+unit;

function cTOf(c){f=(c*(9/5))+32;return f;}
function fTOc(f){c=(f-32)*(5/9);return c;}

function changeTempUnit(){document.getElementById('tempUnitChangeButton').innerHTML='&deg;'+unit;
    if (unit==='C'){unit='F';
        temp=cTOf(temp);tempElement.innerHTML=temp+'&deg;'+unit;
        minTemp=cTOf(minTemp);minTempElement.innerHTML=minTemp+'&deg;'+unit;
        maxTemp=cTOf(maxTemp);maxTempElement.innerHTML=maxTemp+'&deg;'+unit;
        console.log(temp, minTemp, maxTemp);
    }
    else if (unit==='F'){unit='C';
    temp=fTOc(temp);tempElement.innerHTML=temp+'&deg;'+unit;
    minTemp=fTOc(minTemp);minTempElement.innerHTML=minTemp+'&deg;'+unit;
    maxTemp=fTOc(maxTemp);maxTempElement.innerHTML=maxTemp+'&deg;'+unit;
    console.log(temp, minTemp, maxTemp);
    }

}

let prec=0;
document.getElementById('prec').innerText=prec;