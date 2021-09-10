"use strict";

function fetchNPCs(searchTerm) {
  fetch(
    `https://us.api.blizzard.com/data/wow/search/creature?namespace=static-us&locale=en_US&name.en_US=${searchTerm}&orderby=id&_page=1&str=&access_token=${oAuthToken}`
  )
    .then((response) => {
      if (!response.ok) {
        throw Error("ERROR");
      }

      return response.json();
    })
    .then((data) => {
      const statsItems = document.getElementById("userSearchResults");

      Promise.all(
        data.results.map((user) => {
          return fetch(
            `https://us.api.blizzard.com/data/wow/media/creature-display/${user.data.creature_displays[0].id}?namespace=static-us&locale=en_US&access_token=${oAuthToken}`
          )
            .then((innerRes) => innerRes.json())
            .then((innerResData) => {
              return { ...user, ...innerResData };
            })
            .catch(() => {
              // Catch CORS Error
              return user;
            });
        })
      ).then((results) => {
        results.forEach((user) => {
          const div = document.createElement("tr");
          div.className = "Items";
          div.setAttribute("data-toggle", "modal");
          div.setAttribute("data-target", "#toolTipModal");
          const lines = [`${user.data.name.en_US}`, `ID: ${user.data.id}`];
          for (let line of lines) {
            const p = document.createElement("td");
            p.innerText = line;
            div.appendChild(p);
          }

          if (user.assets) {
            for (let asset of user.assets) {
              const i = document.createElement("img");
              i.src = asset.value;
              i.className = "npcImage";
              div.appendChild(i);
            }
          }
          statsItems.appendChild(div);
        });
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

function getToolTipNPCs() {
  let responseFromFetch;
  let ID;
  let ID2;
  let tooltipImage;
  ID = event.currentTarget.children[1].innerText.replace("ID: ", "");
  ID2 = event.currentTarget;
  tooltipImage = event.currentTarget.children[2].cloneNode(true);
  tooltipImage.id = "tooltipImageStyleNPC";
  tooltipImage.className = "d-block";
  console.log(ID, ID2);
  fetch(
    `https://us.api.blizzard.com/data/wow/creature/${ID}?namespace=static-us&locale=en_US&access_token=${oAuthToken}`
  )
    .then((response) => response.json())
    .then((data) => (responseFromFetch = data))
    .then((newData) => {
      /* 
        Creature types:
        
        Beast
        Dragonkin
        Demon
        Elemental
        Giant
        Undead
        Humanoid
        Critter
        Mechanical
        Not specified
        Totem
        Non-combat Pet
        Gas Cloud
      */

      /*
        Family types:

        Wolf
        Cat
        Spider
        Bear
        Boar
        Crocolisk
        Carrion Bird
        Crab
        Gorilla
        Raptor
        Tallstrider
        Felhunter
        Voidwalker
        Succubus
        Doomguard
        Scorpid
        Turtle
        Imp
        Bat
        Hyena
        Owl
        Wind Serpent
        Remote Control
        Felguard
        Dragonhawk
        Ravager
        Warp Stalker
        Sporebat
        Nether Ray
        Serpent
        Sea Lion
      */

      //First wipe the slate clean by removing old tooltip
      let elementsToDeleteLength =
        document.getElementById("toolTipDisplay").children.length;

      for (let i = 0; i < elementsToDeleteLength; i++) {
        let rowToDeleteID = "tooltip-row-" + (i + 1).toString();
        document.getElementById(rowToDeleteID).remove();
      }

      // start logic of new tooltip
      let numOfLines = 3;

      if(newData.is_tameable) {
        numOfLines = 4;
      }

      /* Now that the number of rows has been determined, start 
            creating TR/TD Elements to later add data to*/

      for (let i = 1; i < numOfLines + 2; i++) {
        let firstHalfIDString = "tooltip-row-";
        let secondHalfIDString = i.toString();
        let tooltipID = firstHalfIDString.concat(secondHalfIDString);
        let tooltipRow = document.createElement("TR");
        let tooltipTD = document.createElement("TD");

        tooltipRow.id = tooltipID;
        tooltipRow.style.height = "10px";
        tooltipRow.style.minWidth = "100%";

        tooltipTD.style.paddingLeft = "0.3rem";
        tooltipTD.style.paddingRight = "0.3rem";
        tooltipTD.style.paddingBottom = "0.1rem";
        tooltipTD.style.paddingTop = "0.1rem";
        tooltipTD.style.borderTop = "0px solid #343a40";
        tooltipTD.className = "tooltip-row-td " + "row-" + secondHalfIDString;

        document.getElementById("toolTipDisplay").appendChild(tooltipRow);
        document.getElementById(tooltipID).appendChild(tooltipTD);
      }

      function appendDataToRows() {
        //Variable keeps track of row
        let counter = 1;

        if (newData.name) {
          let cellToBeChanged = document.getElementById(
            "tooltip-row-" + counter.toString()
          ).children[0];
          cellToBeChanged.innerText = newData.name;
          cellToBeChanged.className =
            cellToBeChanged.className + " durability";

          counter = counter + 1;
        }

        if (newData.type && newData.type.name) {
          
            let familyDecider = "";
  
          if (newData.type.name === "Beast") {
              familyDecider = "Beast";
          } if (newData.type.name === "Dragonkin") {
              familyDecider = "Dragonkin";
          } if (newData.type.name === "Demon") {
              familyDecider = "Demon";
          } if (newData.type.name === "Elemental") {
              familyDecider = "Elemental"; 
          } if (newData.type.name === "Giant") {
              familyDecider = "Giant";
          } if (newData.type.name === "Undead") {
              familyDecider = "Undead";
          } if (newData.type.name === "Humanoid") {
              familyDecider = "Humanoid";
          } if (newData.type.name === "Critter") {
              familyDecider = "Critter";
          } if (newData.type.name === "Mechanical") {
              familyDecider = "Mechanical";
          } if (newData.type.name === "Not specified") {
              familyDecider = "Not-specified";
          } if (newData.type.name === "Totem") {
              familyDecider = "Totem";
          } if (newData.type.name === "Non-combat Pet") {
              familyDecider = "Non-combat-Pet";
          } if (newData.type.name === "Gas Cloud") {
              familyDecider = "Gas-Cloud";
          }
  
              let cellToBeChanged = document.getElementById(
              "tooltip-row-" + counter.toString()
            ).children[0];
            cellToBeChanged.innerText = newData.type.name;
            cellToBeChanged.className = cellToBeChanged.className + " " +  familyDecider;
  
            counter = counter + 1;
          }

        if (newData.family && newData.family.name) {
            let cellToBeChanged = document.getElementById(
              "tooltip-row-" + counter.toString()
            ).children[0];
            cellToBeChanged.innerText = newData.family.name;
            cellToBeChanged.className = cellToBeChanged.className + " durability";
  
            counter = counter + 1;
          }

        

        //////////////////////////////////////////

        

        if (newData.is_tameable) {
          let cellToBeChanged = document.getElementById(
            "tooltip-row-" + counter.toString()
          ).children[0];
          cellToBeChanged.innerText = "Tameable: " + newData.is_tameable;
          cellToBeChanged.className = cellToBeChanged.className + " item-level";

          counter = counter + 1;
        }

        /////////////////////////////////////////
      }

      appendDataToRows();

      let tooltipHeader = document.getElementById("element-to-append-image");

      document
        .getElementById("element-to-append-image")
        .insertBefore(tooltipImage, tooltipHeader.childNodes[0]);
    });
}

function toolTipNPCs() {
  document.querySelectorAll(".Items").forEach((item) => {
    item.addEventListener("click", getToolTipNPCs);
    item.addEventListener("mouseleave", clearToolTip);
  });
}

function searchExecuteNPCs() {
  let test = search();
  fetchNPCs(test);
  setTimeout(toolTipNPCs, 1000);
}

document
  .getElementById("searchBar")
  .addEventListener("submit", searchExecuteNPCs);
let urlItemString = window.location.search.slice(11);
document.getElementById("searchBar").value = urlItemString;
