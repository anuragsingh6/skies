console.log(document.title);

let TimeElement=document.getElementById('headerTime');TimeElement.innerText=setElementTime();
function setElementTime(){let date=Date().split(' ');let dateStr='';for (let i=0;i<5;i++){dateStr+=' '+(date[i])};return dateStr;}
setInterval(()=>{document.getElementById('headerTime').innerText=setElementTime()},1000);

let cimgElement=document.getElementById('cimg');cimgElement.style.background='right no-repeat';
cimgElement.style.backgroundSize='contain';cimgElement.style.backgroundImage='url(imgs/icon.svg)';

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