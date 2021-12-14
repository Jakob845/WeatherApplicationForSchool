
      window.onload = getLocation();

let jsonText;
let ArrayOfObjects;

//2d array that holds all the data organized into 10 arrays. 1 for each day.
let days = [[]];


var newLong;
var newLatt;
var cityName;
    
    function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(SetPosition);
        } else { 
          alert("Geolocation stöds tyvärr inte av den här webbläsaren.");
        }

      }
      function SetPosition(position) {
        newLong = Math.round(position.coords.longitude * 100000) / 100000;
        newLatt = Math.round(position.coords.latitude * 100000) / 100000;
        cityName = "Här";
        getJsonText(
          "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/" +
            newLong +
            "/lat/" +
            newLatt +
            "/data.json"
        );
      }

      function CityCall(){
        let serchText = document.getElementById("city").value;

        const APIKey = "Your Api key goes here";

        getJsonString("https://api.openweathermap.org/data/2.5/weather?q="+serchText+"&lang=sv&appid="+APIKey);

        async function getJsonString(filePath) {
          try{
            let myFile = await fetch(filePath);
            let jsonTest = await myFile.text();
            let obje = JSON.parse(jsonTest);
        
            newLong = await obje.coord.lon;
            newLatt = await obje.coord.lat;
            cityName = await obje.name;

           await getJsonText(
              "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/" +
                newLong +
                "/lat/" +
                newLatt +
                "/data.json"
            );
          }
          catch{
            alert("Tyvärr så gick det inte att hitta platsen du sökte efter.");
          }
        }
      }
      


      function AnimateCanv(){
        var c = document.getElementById("StartCanvas");
        setTimeout(function(){ c.classList.remove("CanvasAnim"); }, 1100);
        c.classList.add("CanvasAnim");

        setTimeout(function(){
                          var c = document.getElementById("StartCanvas");
            var ctx = c.getContext("2d");
            ctx.font = 'Bold 75px Calibri';
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
            ctx.fillText(cityName, 400, 100);
      
            let tI = 0;
            let vI = 0;
            let t = new Date();

            if(t.getHours() === 23 && t.getMinutes() >= 30){
              vI = 1;
            } else if(t.getMinutes() <= 30){
              tI = 1;
            }

            setTimeout(function(){
            let tem = days[vI][tI].parameters[FindIndex(vI, tI, 't')].values[0];
            ctx.fillText("temp: " + tem + " °C", 10, 350);
            
            let startSymbNbr = days[vI][tI].parameters[FindIndex(vI, tI, 'Wsymb2')].values[0];
            let startSymb = new Image();
            startSymb.src = WhichSymbol(startSymbNbr);
            startSymb.onload = () => {
              ctx.drawImage(startSymb, 500, 160);
              }
            }, 200);
          }, 400);
      }

let RemoveCardIndex;
let PreviousHiddenCard;
  //fetches the data from the fileLoc that is inputed and parse it into an array of objects
  async function getJsonText(filePath) {
    try{
      let myFile = await fetch(filePath);
      jsonText = await myFile.text();
  
      ArrayOfObjects = JSON.parse(jsonText);
      TurnJsonStringInToOrganizedLists();

      if(PreviousHiddenCard!= null && PreviousHiddenCard != undefined){
        document.getElementById("card"+PreviousHiddenCard).setAttribute("style", "display: inline-block;");
      }
    }
    catch{
      //alert("Tyvärr så gick det inte att hämta all data för den här platsen just nu.");
        document.getElementById("card"+RemoveCardIndex).setAttribute("style", "display: none");
        PreviousHiddenCard = RemoveCardIndex;
    }
  }

  function TurnJsonStringInToOrganizedLists() {

    //Clear the arrays
    days = [[]];
    //Here i loop through all the objects stored from the json file and then store it in
    //seperate arrays 
    var newDay = 0;
    var tempArr = [];
    for(let i = 1; i < ArrayOfObjects.timeSeries.length; i++){
      //if the new date do not match the old date it's a new day
      if(ArrayOfObjects.timeSeries[i].validTime.slice(0, 10) != ArrayOfObjects.timeSeries[i-1].validTime.slice(0, 10)){
        days[newDay] = tempArr;
        tempArr = [];
        newDay++;
      }
      
      tempArr.push(ArrayOfObjects.timeSeries[i]);
      }
      PutListDataIntoTables();
    }

    //This function puts data into the tables and the canvases in the cards
    function PutListDataIntoTables(){

    ClearTables();
    ClearCardCanvases();
    
    var MosteOccuringImageArray = new Array();

    var d = new Date();    
    var i;
    
    //Outer loop to go through all the "day arrays"
    for (i = 0; i < 10; i++){
      let table = document.getElementById("tBody" + i);
      
      //some vars to input to canvases when a complete array has gone through
      let dayTemp = new Array;
      let daySymbol = new Array;
      let minRain = 0;
      let maxRain = 0;

      let canv = document.getElementById("canvas" + i);
      let ctx = canv.getContext('2d');

      if(days[i] === null || days[i] === undefined){
        RemoveCardIndex = i;
        continue;
      }
      
        //Inner loop to take data from the current "day array" from the outer loop and show it in the corresponding cards canvases and tables
        for (let a = 0; a < days[i].length; a++){

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
                if(a!= days[i][a].length -1)
                dateHeaderText = "";
                dateHeaderText = days[i][a].validTime.toString().slice(0, 10);
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
            if(days[i][a].validTime.toString().slice(11, 13) == d.getHours() &&
            days[i][a].validTime.toString().split('T')[0] == d.toISOString().split('T')[0]
            ){
                cell0.innerHTML = "NU";
                row.setAttribute("class", "bg-success");
            }else{
                cell0.innerHTML = days[i][a].validTime.toString().slice(11, 13); 
              }

              //The rest of this loop is used to put data in to the tables in the cards
              //temp
              let temp = days[i][a].parameters[FindIndex(i, a, 't')].values[0];
              cell1.innerHTML = temp + " °C";
              dayTemp.push(temp);

              //pmin and pmax
              let pMin = days[i][a].parameters[FindIndex(i, a, 'pmin')].values[0];
              let pMax = days[i][a].parameters[FindIndex(i, a, 'pmax')].values[0];

              cell2.innerHTML = pMin + " - " + pMax + " mm";

              minRain += pMin;
              maxRain += pMax;

              //Wind Speed
              cell3.innerHTML = days[i][a].parameters[FindIndex(i, a, 'ws')].values[0] + " m/s";
              //Wind Direction
              cell4.innerHTML = WindDirection(days[i][a].parameters[FindIndex(i, a, 'wd')].values[0]);

              //WeatherSymbol
              var img = document.createElement('IMG');
              let symbolNumber = days[i][a].parameters[FindIndex(i, a, 'Wsymb2')].values[0];
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

          //saves the pictures to an array and load them when they are completed
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
            AnimateCanv();
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
      return days[day][number].parameters.findIndex((x) => x.name === name);
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
        return "weatherSymbols/Symbolsaknas.png"
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