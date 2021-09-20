window.onload = getLocation();


    function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        } else { 
          document.getElementById("x").innerHTML = "Geolocation is not supported by this browser.";
        }
      }
      
      function showPosition(position) {
          document.getElementById("Longitude").value = position.coords.longitude;
          document.getElementById("Lattitude").value = position.coords.latitude;
      }
    

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

//This function finds the corect address to get the json file from.
function getData() {

    let lon = parseInt(document.getElementById("Longitude").value); //mellan 0 - 30
    let lat = parseInt(document.getElementById("Lattitude").value); //mellan 54 - 72

    //if the inputed numbers
    if (!isNaN(lon) && isFinite(lon) && !isNaN(lat) && isFinite(lat)) {
      getJsonText(
        "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/" +
          lon +
          "/lat/" +
          lat +
          "/data.json"
      );
    } else {
      alert("You must enter numbers in the cordinate fields");
    }
  }

  //fetches the data from the fileLoc that is inputed and parse it into an array of objects
  async function getJsonText(file) {
    let myObject = await fetch(file);
    jsonText = await myObject.text();

    ArrayOfObjects = JSON.parse(jsonText);
    TurnJsonStringInToOrganizedLists();
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

  function TurnJsonStringInToOrganizedLists() {

    var table = document.getElementById("tBody");

    ClearLists();

    //This is an ugly solution but i didn't find how to do a multidimensional array in js
    //to sort the data in to seperate arrays for each day.
    //So here i loop through all the objects stored from the json file and then store it in
    //seperate arrays 
    var newDay = 0;
    for(let i = 1; i < ArrayOfObjects.timeSeries.length; i++){

        //if the new date do not match the old date 
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
      PutListDataIntoTables();
    }

        //finds the index of where name is "t" witch is smhi's degres in C var
        function FindGrader(day, number) {
          return eval(day)[number].parameters.findIndex(
          (c) => c.name === "t"
      );
    }
    
        //finds the index of where name is "t" witch is smhi's degres in C var
        function FindPMin(day, number) {
          return eval(day)[number].parameters.findIndex(
          (pmi) => pmi.name === "pmin"
      );
    }

            //finds the index of where name is "t" witch is smhi's degres in C var
            function FindPMax(day, number) {
              return eval(day)[number].parameters.findIndex(
              (pma) => pma.name === "pmax"
          );
        }

      function FindSymbolNumber(day, number) {
        return eval(day)[number].parameters.findIndex(
        (s) => s.name === "Wsymb2"
      );
    }

    function PutListDataIntoTables(){

    ClearTables();

    var d = new Date();    
    var i;
    for (i = 0; i < 11; i++){
      let table = document.getElementById("tBody" + i);
      let day = "day" + i;
      
        for (let a = 0; a < eval(day).length; a++){


            if (i === 0) {
                document.getElementById("tableHeader" + i).innerHTML = "Idag";
            } else {
                if(a!= eval(day).length -1)
                document.getElementById("tableHeader" + i).innerHTML = eval(day)[a].validTime.toString().slice(0, 10);
            }

            var rowCount = table.rows.length;
                        
            let row = table.insertRow(rowCount);
            let cell0 = row.insertCell(0);
            let cell1 = row.insertCell(1);
            let cell2 = row.insertCell(2);
            let cell3 = row.insertCell(3);

            row.classList.add("row-fluid");
            cell0.classList.add("col-fluid");
            cell1.classList.add("col-fluid");
            cell2.classList.add("col-fluid");
            cell3.classList.add("col-fluid");

            //This if statement puts "NU" under time if it is now. Else it puts the hour stored in array; 
            if(eval(day)[a].validTime.toString().slice(11, 13) == d.getHours() &&
            eval(day)[a].validTime.toString().split('T')[0] == d.toISOString().split('T')[0]
            ){
                cell0.innerHTML = "NU";
                row.setAttribute("class", "bg-success");
            }else{
                cell0.innerHTML = eval(day)[a].validTime.toString().slice(11, 13); 
              }

              //puts degres into the table
              cell1.innerHTML = eval(day)[a].parameters[FindGrader(day, a)].values[0];

              //Add pmin to pmax
              cell2.innerHTML = eval(day)[a].parameters[FindPMin(day, a)].values[0] + 
              "(mm/h) - " + 
              eval(day)[a].parameters[FindPMax(day, a)].values[0] + "(mm/h)";

              //find and store weatherSymbol
              var img = document.createElement('IMG');
              let symbolNumber = eval(day)[a].parameters[FindSymbolNumber(day, a)].values[0];
              console.log(symbolNumber);
              let symbolName = WhichSymbol(symbolNumber);
              img.src = symbolName;
              img.height = "40";
              img.width = "40";

              //Extract a string from the img name to use as a description
              if(symbolName != null){
                let symbolDescription = symbolName.slice(15, symbolName.length -4);
  
                cell3.appendChild(img);
                cell3.innerHTML += " (" + symbolDescription + ")";
              }else{
                cell3.innerHTML = "The image could not be loaded";
              }


          }
      }
  }

  function WhichSymbol(int){
    switch(int){
      case 1:
        return "weatherSymbols/ClearSky.png"
      break;
      case 2:
        return "weatherSymbols/NearlyClearSky.png"
      break;
      case 3:
        return "weatherSymbols/VariableCloudiness.png"
      break;
      case 4:
        return "weatherSymbols/HalfClearSky.png"
      break;
      case 5:
        return "weatherSymbols/CloudySky.png"
      break;
      case 6:
        return "weatherSymbols/Overcast.png"
      break;
      case 7:
        return "weatherSymbols/Fog.png"
      break;
      case 8, 18:
        return "weatherSymbols/LightRainShowers.png"
      break;
      case 9, 19:
        return "weatherSymbols/ModerateRainShowers.png"
      break;
      case 10, 20:
        return "weatherSymbols/HeavyRainShowers.png"
      break;
      case 11, 21:
        return "weatherSymbols/Thunderstorm.png"
      break;
      case 12, 22:
        return "weatherSymbols/LightSleetShowers.png"
      break;
      case 13, 23:
        return "weatherSymbols/ModerateSleetShowers.png"
      break;
      case 14, 24:
        return "weatherSymbols/HeavySleetShowers.png"
      break;
      case 15, 25:
        return "weatherSymbols/LightSnowShowers.png"
      break;
      case 16, 26:
        return "weatherSymbols/ModerateSnowShowers.png"
      break;
      case 17, 27:
        return "weatherSymbols/HeavySnowShowers.png"
      break;
    }
    DisableDataTargetForCollapseingTable();
  } 

  function DisableDataTargetForCollapseingTable(){
    document.getElementById("getData").removeAttribute('data-target');
  }