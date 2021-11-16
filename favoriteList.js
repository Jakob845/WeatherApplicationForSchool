let favoritePlace = class{
    constructor(namn, long, latt) {
      this.namn = namn;
      this.long = long;
      this.latt = latt;
    }
  }

  var favoriteList = [];
  var selected;

  window.onload = LoadFavoriteList();

  function AddFavorite(){
    
    favName = cityName;

      if(favName != "" && favName != undefined){

        let duplicateExists = false;
        for(i=0; i<favoriteList.length; i++){
          if(favoriteList[i].namn == favName){
            duplicateExists = true;
          }
        }
      if(!duplicateExists){


      let long = newLong
      let latt = newLatt;
  
      //if the inputed cords are numbers
      if (!isNaN(long) && isFinite(long) && !isNaN(latt) && isFinite(latt)) {

          let favPlace = new favoritePlace(favoritePlace.namn = favName, favoritePlace.long = long, favoritePlace.latt = latt);
    
          favoriteList.push(favPlace);
    
          if (typeof(Storage) !== "undefined") {
            // Store
            localStorage.favL = JSON.stringify(favoriteList);
          } else {
            document.getElementById("result").innerHTML = "Tyvärr så stöder inte din webbläsare localStorage..";
          }

        LoadFavoriteList();
      }else{
        alert("Du måste ange siffror i kordinatfälten");
      }
    }else{
      alert("Sparade platser kan inte ha samma namn");
    }
    }else{
      alert("Namnet får inte vara tomt");
    }
  }

    function LoadFavoriteList(){

        favoriteList = JSON.parse(localStorage.favL);


      if(favoriteList !== null)
      {
     let list = document.getElementById("TheFavoriteList");
     
     while(list.lastElementChild){
       list.removeChild(list.lastElementChild);
     }

     for(let i = 0; i < favoriteList.length; i++){
       let item = document.createElement('li');
      item.appendChild(document.createTextNode(favoriteList[i].namn));
      item.name = favoriteList[i].namn;
      item.id = "li" + i.toString();
      item.setAttribute("onclick", "AddClickedFavoriteToInputFields(this.name); SelectedFavorite(this.id);");
      item.setAttribute("onmouseover", "");
      item.setAttribute("style", "cursor: pointer;");

      list.appendChild(item);
     }
    }
    else{return;}
    }
function AddClickedFavoriteToInputFields(place){
  //Find where name = place and alert those cordinates
  var index = favoriteList.findIndex((p) => p.namn.toString() === place.toString());
  //alert( "Longitude: " + favoriteList[index].long + " Lattitude: " + favoriteList[index].latt);
  if(index != undefined)
  {
  if(favoriteList[index].namn === "Här"){
    document.getElementById("city").value = "";
    getLocation();
  }else{
    document.getElementById("city").value = favoriteList[index].namn;
    newLatt = favoriteList[index].latt;
    newLong = favoriteList[index].long;
    CityCall();
  }
}
}

function SelectedFavorite(select){
  //Loops through all list items and set their bgc to white
  for(let i = 0; i < favoriteList.length; i++){
    document.getElementById("li" + i).style.backgroundColor = "white";
  }
  //selected = clicked item and set its bgc to lightblue for visual effect
  selected = document.getElementById(select);
  selected.setAttribute("style", "background-color: lightblue;");
}

function RemoveSelected(){
if(selected != null){
  selected.remove();
  var index = favoriteList.findIndex((p) => p.namn.toString() === selected.name.toString());
  favoriteList.splice(index, 1);
  localStorage.setItem("favL", JSON.stringify(favoriteList));

  LoadFavoriteList();
}
}