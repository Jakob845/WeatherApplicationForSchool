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
    ManipulateJsonStringInToOrganizedLists();
  }

  function ManipulateJsonStringInToOrganizedLists() {

    //finds the index of where name is "t" witch is smhi's degres in C var
      function FindGrader(day, number) {
          return eval(day)[number].parameters.findIndex(
          (x) => x.name === "t"
      );
    }

    var table = document.getElementById("tBody");

    //This is an ugly solution but i didn't find how to do a multidimensional array in js
    //to sort the data in to seperate arrays for each day.
    var newDay = 0;
    for(let i = 1; i < ArrayOfObjects.timeSeries.length; i++){
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

        if(ArrayOfObjects.timeSeries[i].validTime.slice(0, 10) != ArrayOfObjects.timeSeries[i-1].validTime.slice(0, 10)){
            newDay++;
        }
    }

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

        //This if statement puts "NU" under time if it is now. Else it puts the hour stored in array; 
         if(eval(day)[a].validTime.toString().slice(11, 13) == d.getHours() &&
         eval(day)[a].validTime.toString().split('T')[0] == d.toISOString().split('T')[0]
         ){
             cell0.innerHTML = "NU";
         }else{
             cell0.innerHTML = eval(day)[a].validTime.toString().slice(11, 13); 
           }

          cell1.innerHTML = eval(day)[a].parameters[FindGrader(day, a)].values[0];
        }
      }
      alert(d.getDate());
  }