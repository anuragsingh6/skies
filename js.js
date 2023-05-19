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
let possibleLocations=[];
function searchLocation(){
    let query=cityInput.value;let searchURL='https://photon.komoot.io/api/?q='+query+'&layer=city&limit=10';
    openLocationOptionsDialog();
    fetch(searchURL).then((response)=>response.json()).then((result)=>{return result.features;}).then((f)=>{possibleLocations=f;console.log(possibleLocations)
        locationOptions.innerHTML='';
        for (let i=0;i<possibleLocations.length;i++){
            let newLocationOptionItem=document.createElement('div');
            let newLocationOptionItemText='';
            if (possibleLocations[i].county===undefined){newLocationOptionItemText=possibleLocations[i].properties.name+' '+possibleLocations[i].properties.osm_value+', '+possibleLocations[i].properties.state+', '+possibleLocations[i].properties.country;}
            else{newLocationOptionItemText=possibleLocations[i].properties.name+' '+possibleLocations[i].properties.osm_value+', '+possibleLocations[i].properties.county+', '+possibleLocations[i].properties.state+', '+possibleLocations[i].properties.country;}
            newLocationOptionItem.className='locationOptionItem';newLocationOptionItem.innerText=newLocationOptionItemText;
            newLocationOptionItem.addEventListener('click', locationItemClicked);locationOptions.appendChild(newLocationOptionItem);
            }
        if (possibleLocations.length===0){defaultLocationOptionItem.style.display='block';defaultLocationOptionItem.style.visibility='visible';defaultLocationOptionItem.innerText='Not Found';console.log('Not Found');}
        else{defaultLocationOptionItem.style.display='none';defaultLocationOptionItem.style.visibility='hidden';defaultLocationOptionItem.innerText='Loading';console.log('Loading...');}
        })
    .catch((error)=>console.error('Error: Could not get data:',error))
    
}
cityInput.addEventListener('keyup',searchLocation);


function locationItemClicked(){
    console.log(this.innerText);cityInput.value=this.innerText;
}
let locationItemElements=document.getElementsByClassName('locationOptionItem');

let getWeatherButton=document.getElementById('getWeatherButton');
let locationOptions=document.getElementById('locationOptions');
let defaultLocationOptionItem=document.getElementById('defaultLocationOptionItem');
function openLocationOptionsDialog(){
    if (cityInput.value!==''){locationOptions.style.display='flex';locationOptions.style.visibility='visible';
    defaultLocationOptionItem.style.display='block';defaultLocationOptionItem.style.visibility='visible';}
    else{locationOptions.style.display='none';locationOptions.style.visibility='hidden';
    defaultLocationOptionItem.style.display='none';defaultLocationOptionItem.style.visibility='hidden';}
}

addEventListener('click', e=>{//console.log(e.target);
    if (!(e.target===locationOptions)){console.log('adsa');locationOptions.style.display='none';locationOptions.style.visibility='hidden';}
    else{console.log('aksd');}
})


let city="New York City, USA";let cityElement=document.getElementById('cityName');
cityElement.innerText=city;

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