window.onload = CreateCard();

function CreateCard() {
    let cardDeck = document.getElementById("cardDeck");

for(i = 0; i < 10; i++){

    let card = document.createElement("div");
    card.classList.add("card-fluid", "bg-success", "my-3", "mx-3");
    card.id = "card" + i;

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "text-center");

    let canv = document.createElement("canvas");
    canv.id = "canvas" + i;
    canv.classList.add("my-3", "myCanvasCss");
    canv.width = 1600;
    canv.height = 800;

    let btn = document.createElement("button");
    btn.setAttribute("data-toggle", "collapse");
    btn.setAttribute("data-target", "#table"+i);
    btn.classList.add("btn", "btn-info", "mb-2", "myBtnCss");
    btn.innerHTML = "Mer Info";

    let tableContainer = document.createElement("div");
    tableContainer.classList.add("table-responsive");

    let table = document.createElement("table");
    table.id = "table" + i;
    table.classList.add("table-dark", "table-hover", "collapse", "myTableCss");
    let tHead = table.createTHead();
    let thRow = tHead.insertRow(0); 
    let thCell = thRow.insertCell(0);
    let thCel2 = thRow.insertCell(1);
    let thCel3 = thRow.insertCell(2);
    let thCel4 = thRow.insertCell(3);
    let thCel5 = thRow.insertCell(4);
    let thCel6 = thRow.insertCell(5);
    
    thCell.innerHTML = "<b>Tid</b>";
    thCel2.innerHTML = "<b>Temperatur</b>";
    thCel3.innerHTML = "<b>Min/Max nederbörd</b>";
    thCel4.innerHTML = "<b>Vind Styrka</b>";
    thCel5.innerHTML = "<b>Vind Riktning</b>";
    thCel6.innerHTML = "<b>Väder Symbol</b>";

    let tBody = table.createTBody();
    tBody.id = "tBody" +i;

    cardBody.appendChild(canv);
    cardBody.appendChild(document.createElement("br"));

    cardBody.appendChild(btn);
    cardBody.appendChild(document.createElement("br"));
    
    tableContainer.appendChild(table);
    cardBody.appendChild(tableContainer);
    card.appendChild(cardBody);
    cardDeck.appendChild(card);
}
}