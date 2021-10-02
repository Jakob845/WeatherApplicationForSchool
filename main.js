
      window.onload = getLocation(), WhatRadioIsChecked();

let jsonText;
let ArrayOfObjects;

let day0 = [];
let day1 = [];
let day2 = [];
let day3 = [];
let day4 = [];
let day5 = [];
let day6 = [];
let day7 = [];
let day8 = [];
let day9 = [];

var la;
var lo;
    
    function getLocation() {
      if(la == null || lo == null){
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(savePosition);
        } else { 
          alert("Geolocation is not supported by this browser.");
        }
      }else{
        document.getElementById("Longitude").value = lo;
        document.getElementById("Lattitude").value = la;
        return;
      }

      }
      function savePosition(position) {
        lo = Math.round(position.coords.longitude * 100000) / 100000;
        la = Math.round(position.coords.latitude * 100000) / 100000;
        document.getElementById("Longitude").value = lo;
        document.getElementById("Lattitude").value = la;
        
        if(document.getElementById("rbn2").checked){
          AnimateCanv();
        }
      }
      


      function AnimateCanv(){
        var c = document.getElementById("StartCanvas");
        setTimeout(function(){ c.classList.remove("CanvasAnim"); }, 1100);
        c.classList.add("CanvasAnim");

        var ctx = c.getContext("2d");
        ctx.font = 'Bold 75px Calibri';


        let rbn1 = document.getElementById("rbn1");
        let rbn2 = document.getElementById("rbn2");
        let rbn3 = document.getElementById("rbn3");

          if(rbn1.checked){
            setTimeout(function(){ 
              GetGavleData();
           }, 400);
          }else if(rbn2.checked){
            setTimeout(function(){ 
              GetCurrentPosData();
            }, 400);
          }else{
            setTimeout(function(){ 
              GetChoosenFavoritePosData();
              }, 400);
          }
      }

      function WhatRadioIsChecked(){
        let rbn1 = document.getElementById("rbn1");
        let rbn2 = document.getElementById("rbn2");
        
        if(rbn1.checked){
          GetGavleData();
        }
        else if(rbn2.checked){
          GetCurrentPosData();
        }
        else{
          GetChoosenFavoritePosData();
        }
      }

      var longi;
      var latti;

      function GetGavleData(){
        ShowWeatherOnStartCanvas('Gävle', 17.14549, 60.67426);
      }
      
      function GetCurrentPosData(){
        if(la != null || lo != null){
          ShowWeatherOnStartCanvas('Här', lo, la);
        }else{
          var c = document.getElementById("StartCanvas");
          var ctx = c.getContext("2d");
          ctx.font = 'Bold 75px Calibri';
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
          ctx.fillText("Gick inte att hämta din position", 10, 150);
        }
      }

      function GetChoosenFavoritePosData(){

          if(selected != null && selected != undefined){
            let i = favoriteList.findIndex((x) => x.namn === selected.name);
            ShowWeatherOnStartCanvas(favoriteList[i].namn, 
              Math.round(favoriteList[i].long * 1000000)/1000000, 
              Math.round(favoriteList[i].latt * 1000000)/1000000);
          }else{
            var c = document.getElementById("StartCanvas");
            var ctx = c.getContext("2d");
            ctx.font = 'Bold 75px Calibri';
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillText("Välj från dina favoriter", 20, 150);
          }
        }

      function ShowWeatherOnStartCanvas(place ,lon, lat){
        getJsonText(
          "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/" +
            lon +
            "/lat/" +
            lat +
            "/data.json"
            );
          
            var c = document.getElementById("StartCanvas");
            var ctx = c.getContext("2d");
            ctx.font = 'Bold 75px Calibri';
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
            ctx.fillText(place, 400, 100);
      
            setTimeout(function(){
            let tem = day0[1].parameters[FindIndex("day0", 1, 't')].values[0];
            ctx.fillText("temp: " + tem + " °C", 10, 350);
            
            let startSymbNbr = day0[1].parameters[FindIndex("day0", 1, 'Wsymb2')].values[0];
            let startSymb = new Image();
            startSymb.src = WhichSymbol(startSymbNbr);
            startSymb.onload = () => {
              ctx.drawImage(startSymb, 500, 160);
              }
            }, 200);
      }

//This function finds the corect address to get the json file from.
function getData() {
    
    let lon = Math.round(parseFloat(document.getElementById("Longitude").value) *100000)/100000; //mellan 0 - 30
    let lat = Math.round(parseFloat(document.getElementById("Lattitude").value) *100000)/100000; //mellan 54 - 72

    //if the input are numbers
    if (!isNaN(lon) && isFinite(lon) && !isNaN(lat) && isFinite(lat)) {
      getJsonText(
        "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/" +
          lon +
          "/lat/" +
          lat +
          "/data.json"
      );
    } else {
      alert("Du kan bara skriva siffror i kordinatfälten.");
      return;
    }
  }

  //fetches the data from the fileLoc that is inputed and parse it into an array of objects
  async function getJsonText(filePath) {
    try{
      let myFile = await fetch(filePath);
      jsonText = await myFile.text();
  
      ArrayOfObjects = JSON.parse(jsonText);
      TurnJsonStringInToOrganizedLists();
    }
    catch{
      alert("Tyvärr så gick det inte att hämta data för dom här kordinaterna just nu.");
    }
  }

  function TurnJsonStringInToOrganizedLists() {

    ClearLists();

    //This is an ugly solution but i could not find out how to store all the arrays into
    // multidimensional array in js.
    //to sort the data in to seperate arrays for each day.
    //So here i loop through all the objects stored from the json file and then store it in
    //seperate arrays 
    var newDay = 0;
    for(let i = 1; i < ArrayOfObjects.timeSeries.length; i++){

        //if the new date do not match the old date it's a new day
        if(ArrayOfObjects.timeSeries[i].validTime.slice(0, 10) != ArrayOfObjects.timeSeries[i-1].validTime.slice(0, 10)){
          newDay++;
        }

        switch(newDay){
            case 0:
                day0.push(ArrayOfObjects.timeSeries[i]);
              break;
            case 1:
                day1.push(ArrayOfObjects.timeSeries[i]);
              break;
            case 2:
                day2.push(ArrayOfObjects.timeSeries[i]);
              break;
            case 3:
                day3.push(ArrayOfObjects.timeSeries[i]);
              break;
            case 4:
                day4.push(ArrayOfObjects.timeSeries[i]);
              break;
            case 5:
                day5.push(ArrayOfObjects.timeSeries[i]);
              break;
            case 6:
                day6.push(ArrayOfObjects.timeSeries[i]);
              break;
            case 7:
                day7.push(ArrayOfObjects.timeSeries[i]);
              break;
            case 8:
                day8.push(ArrayOfObjects.timeSeries[i]);
              break;
            case 9:
                day9.push(ArrayOfObjects.timeSeries[i]);
              break;
                
        }
      }
    }

    //This function puts data into the tables and the canvases in the cards
    function PutListDataIntoTables(){

    ClearTables();
    ClearCardCanvases();
    
    var MosteOccuringImageArray = new Array();

    var d = new Date();    
    var i;
    for (i = 0; i < 10; i++){
      let table = document.getElementById("tBody" + i);
      let day = "day" + i;
      
      //some vars to input to canvases when a complete array has gone through
      let dayTemp = new Array;
      let daySymbol = new Array;
      let minRain = 0;
      let maxRain = 0;

      let canv = document.getElementById("canvas" + i);
      let ctx = canv.getContext('2d');
      
        for (let a = 0; a < eval(day).length; a++){

          let dateHeaderText;
          ctx.font = 'Bold 100px Calibri';

          //Puts today, tomorrow or the date for the card into it's canvas
            if (i === 0) {
                dateHeaderText = "Idag";
                ctx.fillText(dateHeaderText, 650, 100);
            } else if(i === 1){
              dateHeaderText = "Imorgon";
              ctx.fillText(dateHeaderText, 600, 100);
            } else{
                if(a!= eval(day).length -1)
                dateHeaderText = "";
                dateHeaderText = eval(day)[a].validTime.toString().slice(0, 10);
                ctx.fillText(dateHeaderText, 500, 100);
            }

            var rowCount = table.rows.length;
                        
            let row = table.insertRow(rowCount);
            let cell0 = row.insertCell(0);
            let cell1 = row.insertCell(1);
            let cell2 = row.insertCell(2);
            let cell3 = row.insertCell(3);
            let cell4 = row.insertCell(4);
            let cell5 = row.insertCell(5);

            //This if statement puts "NU" under time if it is now. 
            //Else it puts the hour stored in array; 
            if(eval(day)[a].validTime.toString().slice(11, 13) == d.getHours() &&
            eval(day)[a].validTime.toString().split('T')[0] == d.toISOString().split('T')[0]
            ){
                cell0.innerHTML = "NU";
                row.setAttribute("class", "bg-success");
            }else{
                cell0.innerHTML = eval(day)[a].validTime.toString().slice(11, 13); 
              }

              //The rest of this loop is used to put data in to the tables in the cards
              //temp
              let temp = eval(day)[a].parameters[FindIndex(day, a, 't')].values[0];
              cell1.innerHTML = temp + " °C";
              dayTemp.push(temp);

              //pmin and pmax
              let pMin = eval(day)[a].parameters[FindIndex(day, a, 'pmin')].values[0];
              let pMax = eval(day)[a].parameters[FindIndex(day, a, 'pmax')].values[0];

              cell2.innerHTML = pMin + " - " + pMax + " mm";

              minRain += pMin;
              maxRain += pMax;

              //Wind Speed
              cell3.innerHTML = eval(day)[a].parameters[FindIndex(day, a, 'ws')].values[0] + " m/s";
              //Wind Direction
              cell4.innerHTML = WindDirection(eval(day)[a].parameters[FindIndex(day, a, 'wd')].values[0]);

              //WeatherSymbol
              var img = document.createElement('IMG');
              let symbolNumber = eval(day)[a].parameters[FindIndex(day, a, 'Wsymb2')].values[0];
              daySymbol.push(symbolNumber);
              let symbolName = WhichSymbol(symbolNumber);
              img.src = symbolName;
              img.height = "60";
              img.width = "60";
              img.style.borderRadius = "25%";

              //Extract a string from the img name to use as a description to the symbol
              if(symbolName != null){
                let symbolDescription = symbolName.slice(15, symbolName.length -4);
  
                cell5.appendChild(img);
                cell5.innerHTML += "<br> (" + symbolDescription + ")";
              }else{
                cell5.innerHTML = "Bilden kunde inte laddas upp";
              }


          }

          //Write text to the cards canvas
          ctx.font = 'italic 80px Arial';
          ctx.fillText("MinTemp: " + Math.min.apply(Math, dayTemp).toString() + " °C", 100, 200);
          ctx.fillText("MaxTemp: " + Math.max.apply(Math, dayTemp).toString() + " °C", 100, 400);
          ctx.fillText("Regn: " + (Math.round(minRain * 10) /10).toString() + "-" + (Math.round(maxRain * 10) /10).toString() + " mm", 100, 600);

          ima = new Image();
          var mosteOccuringWeatherSymbolNumber = MosteOccuringValueInArray(daySymbol);
          var mosteOccuringWeatherSymbolName = WhichSymbol(mosteOccuringWeatherSymbolNumber);
          
          ima.src = mosteOccuringWeatherSymbolName;
          ctx.font = 'italic 60px Arial';
          ctx.fillText("(" + mosteOccuringWeatherSymbolName.slice(15, mosteOccuringWeatherSymbolName.length - 4) + ")", 1000, 600);

          MosteOccuringImageArray.push(ima);

        }

        //Draws all the images to the canvases when they are loaded
          MosteOccuringImageArray[0].onload = function() {DrawImage(0)};
          MosteOccuringImageArray[1].onload = function (){DrawImage(1)};
          MosteOccuringImageArray[2].onload = function (){DrawImage(2)};
          MosteOccuringImageArray[3].onload = function (){DrawImage(3)};
          MosteOccuringImageArray[4].onload = function (){DrawImage(4)};
          MosteOccuringImageArray[5].onload = function (){DrawImage(5)};
          MosteOccuringImageArray[6].onload = function (){DrawImage(6)};
          MosteOccuringImageArray[7].onload = function (){DrawImage(7)};
          MosteOccuringImageArray[8].onload = function (){DrawImage(8)};
          MosteOccuringImageArray[9].onload = function (){DrawImage(9)};

          function DrawImage(im) {
            c = document.getElementById("canvas" + im);
            ctx = c.getContext('2d');
            ctx.drawImage(MosteOccuringImageArray[im], 1000, 150);
          }
        
  }

  //A function that return the moste occuring weatherSymbol on each day
  function MosteOccuringValueInArray(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

//A function for finding the correct index in the data
    function FindIndex(day, number, name){
      return eval(day)[number].parameters.findIndex((x) => x.name === name);
    }

    //A function to get the correct weatherSymbol
  function WhichSymbol(int){
    switch(int){
      case 1:
        return "weatherSymbols/KlarHimmel.png"
      break;
      case 2:
        return "weatherSymbols/NästanKlarHimmel.png"
      break;
      case 3:
        return "weatherSymbols/VarierandeMolnigt.png"
      break;
      case 4:
        return "weatherSymbols/HalvKlarHimmel.png"
      break;
      case 5:
        return "weatherSymbols/MolnigHimmel.png"
      break;
      case 6:
        return "weatherSymbols/Mulet.png"
      break;
      case 7:
        return "weatherSymbols/Dimma.png"
      break;
      case 8, 18:
        return "weatherSymbols/LättRegn.png"
      break;
      case 9, 19:
        return "weatherSymbols/MåttligtRegn.png"
      break;
      case 10, 20:
        return "weatherSymbols/KraftigtRegn.png"
      break;
      case 11, 21:
        return "weatherSymbols/ÅskVäder.png"
      break;
      case 12, 22:
        return "weatherSymbols/LättSnöBlandatRegn.png"
      break;
      case 13, 23:
        return "weatherSymbols/MåttligtSnöBlandatRegn.png"
      break;
      case 14, 24:
        return "weatherSymbols/KraftigtSnöBlandatRegn.png"
      break;
      case 15, 25:
        return "weatherSymbols/LättSnöFall.png"
      break;
      case 16, 26:
        return "weatherSymbols/MåttligtSnöFall.png"
      break;
      case 17, 27:
        return "weatherSymbols/KraftigtSnöFall.png"
      break;
      default: 
        return "Fel:Ingen bild";
      break;
    }
  } 

  //A function for returning the windDirecton from the api instead of in degrees.  
  function WindDirection(degree){
    if(degree >= 342 && degree <= 360 || degree >= 0 && degree <= 22){ //N
      return "N";
    }else if(degree >= 23 && degree <= 67){//NE
      return "N/Ö";
    }else if(degree >= 68 && degree <= 112){//E
      return "Ö";
    }else if(degree >= 113 && degree <= 158){//SE
      return "S/Ö";
    }else if(degree >= 159 && degree <= 204){//S
      return "S";
    }else if(degree >= 205 && degree <= 250){//SW
      return "S/V";
    }else if(degree >= 251 && degree <= 296){//W
      return "V";
    }else if(degree >= 297 && degree <= 341){//NW
      return "N/V";
    }else{
      return "error";
    }
  }

  function ClearLists(){
    day0 = [];
    day1 = [];
    day2 = [];
    day3 = [];
    day4 = [];
    day5 = [];
    day6 = [];
    day7 = [];
    day8 = [];
    day9 = [];
  }

  function ClearTables(){
    document.getElementById("tBody0").innerHTML = "";
    document.getElementById("tBody1").innerHTML = "";
    document.getElementById("tBody2").innerHTML = "";
    document.getElementById("tBody3").innerHTML = "";
    document.getElementById("tBody4").innerHTML = "";
    document.getElementById("tBody5").innerHTML = "";
    document.getElementById("tBody6").innerHTML = "";
    document.getElementById("tBody7").innerHTML = "";
    document.getElementById("tBody8").innerHTML = "";
    document.getElementById("tBody9").innerHTML = "";
  }

  function ClearCardCanvases(){
    for(i=0;i<10;i++){
      let c = document.getElementById("canvas" + i);
      let cont = c.getContext("2d");
      cont.clearRect(0, 0, cont.canvas.width, cont.canvas.height);
    }
  }