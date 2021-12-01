"use strict";

function renderResultsNPCs(results, indexToRender) {
  if (results.length === 0 || results === undefined) {
    const statsItems = document.getElementById("userSearchResults");
    const div = document.createElement("tr");
    div.className = "Items";
    div.innerText = "No results found";
    statsItems.appendChild(div);
    removePaginationFromDOM();
    document.getElementById("pagination-container").style = "display: none;";
    hideLoader();
  } else {
    const statsItems = document.getElementById("userSearchResults");
    const numberOfArrayChunks = Math.ceil(results.length / rowLength);
    numberOfArrayChunksHoistedScope = numberOfArrayChunks;
    const chunkedArray = chunkResultsArray(
      results,
      numberOfArrayChunks,
      rowLength
    );
    let chunkedArrayIndexToDisplay = chunkedArray[indexToRender];
    document.getElementById("pagination-container").style = "";
    chunkedArrayIndexToDisplay.forEach((user) => {
      const div = document.createElement("tr");
      div.className = "Items";
      div.setAttribute("data-toggle", "modal");
      div.setAttribute("data-target", "#toolTipModal");
      const lines = [`${user.data.name.en_US}`, `ID: ${user.data.id}`];
      for (let line of lines) {
        const p = document.createElement("td");
        p.innerText = line;
        p.style = "vertical-align: middle;";
        div.appendChild(p);
      }

      if (user.assets) {
        for (let asset of user.assets) {
          const i = document.createElement("img");

          i.src = asset.value;
          i.className = "npcImage";

          const p = document.createElement("td");
          p.style = "vertical-align: middle; padding: 0px;";
          div.appendChild(p);

          p.appendChild(i);
        }
      }
      statsItems.appendChild(div);
    });
    toolTipNPCs();
    hideLoader();
  }
}

function changePagePagination() {
  clearSearchItems();
  currentPage = event.currentTarget.innerText;

  document
    .getElementsByClassName("pagination-active")[0]
    .classList.remove("pagination-active");
  document
    .getElementsByClassName("number-pagination")
    [currentPage - 1].classList.add("pagination-active");
  renderResultsNPCs(resultsHoistedScope, currentPage - 1);

  getToolTipNPCs();
}

function reverseOnePage() {
  currentPage = currentPage - 1;
  if (currentPage < 1) {
    console.log("Can't go back a page, already at page one");
  } else {
    clearSearchItems();
    document
      .getElementsByClassName("pagination-active")[0]
      .classList.remove("pagination-active");
    document
      .getElementsByClassName("number-pagination")
      [currentPage - 1].classList.add("pagination-active");
    renderResultsNPCs(resultsHoistedScope, currentPage - 1);
    getToolTipNPCs();
  }
}

function forwardOnePage() {
  if (parseInt(currentPage) === Math.round(numberOfArrayChunksHoistedScope)) {
    console.log(`Can't go forward a page, already at page ${currentPage}`);
    return;
  } else {
    clearSearchItems();
    document
      .getElementsByClassName("pagination-active")[0]
      .classList.remove("pagination-active");
    document
      .getElementsByClassName("number-pagination")
      [currentPage].classList.add("pagination-active");
    console.log("okay");
    renderResultsNPCs(resultsHoistedScope, currentPage);
    currentPage = parseInt(currentPage) + 1;
    getToolTipNPCs();
  }
}

function fetchNPCs(searchTerm) {
  currentPage = 1;
  rowLength = 10;

  fetch(
    `https://us.api.blizzard.com/data/wow/search/creature?namespace=static-us&locale=en_US&name.en_US=${searchTerm}&orderby=id&_page=1&str=&access_token=${oAuthToken}`
  )
    .then((response) => {
      if (!response.ok) {
        throw Error("ERROR");
      }
      showLoader();
      return response.json();
    })
    .then((data) => {
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
      )
        .then((results) => {
          renderResultsNPCs(results, 0);
          appendPaginationButtonsToDOM(numberOfArrayChunksHoistedScope);
          addPaginationDOMAndEventListener();
          resultsHoistedScope = results;
        })
        .then(() => {
          getToolTipNPCs();
          hideLoader();
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
  tooltipImage = event.currentTarget.children[2].children[0].cloneNode(true);
  tooltipImage.id = "tooltipImageStyleNPC";
  tooltipImage.className = "d-block";
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
      //decide number of tooltip Lines
      let numOfLines = 1;
      if (newData.name) {
        numOfLines = numOfLines + 1;
      }
      if (newData.type && newData.type.name) {
        numOfLines = numOfLines + 1;
      }
      if (newData.family && newData.family.name) {
        numOfLines = numOfLines + 1;
      }

      /* Now that the number of rows has been determined, start 
            creating TR/TD Elements to later add data to*/

      for (let i = 1; i < numOfLines + 1; i++) {
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
          cellToBeChanged.className = cellToBeChanged.className + " durability";

          counter = counter + 1;
        }

        if (newData.type && newData.type.name) {
          let familyDecider = "";

          if (newData.type.name === "Beast") {
            familyDecider = "Beast";
          }
          if (newData.type.name === "Dragonkin") {
            familyDecider = "Dragonkin";
          }
          if (newData.type.name === "Demon") {
            familyDecider = "Demon";
          }
          if (newData.type.name === "Elemental") {
            familyDecider = "Elemental";
          }
          if (newData.type.name === "Giant") {
            familyDecider = "Giant";
          }
          if (newData.type.name === "Undead") {
            familyDecider = "Undead";
          }
          if (newData.type.name === "Humanoid") {
            familyDecider = "Humanoid";
          }
          if (newData.type.name === "Critter") {
            familyDecider = "Critter";
          }
          if (newData.type.name === "Mechanical") {
            familyDecider = "Mechanical";
          }
          if (newData.type.name === "Not specified") {
            familyDecider = "Not-specified";
          }
          if (newData.type.name === "Totem") {
            familyDecider = "Totem";
          }
          if (newData.type.name === "Non-combat Pet") {
            familyDecider = "Non-combat-Pet";
          }
          if (newData.type.name === "Gas Cloud") {
            familyDecider = "Gas-Cloud";
          }
          if (newData.type.name === "Wild Pet") {
            familyDecider = "Wild-Pet";
          }

          let cellToBeChanged = document.getElementById(
            "tooltip-row-" + counter.toString()
          ).children[0];
          cellToBeChanged.innerText = newData.type.name;
          cellToBeChanged.className =
            cellToBeChanged.className + " " + familyDecider;

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

        function capitalizeFirstLetter(string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
        }

        if (newData.is_tameable) {
          let cellToBeChanged = document.getElementById(
            "tooltip-row-" + counter.toString()
          ).children[0];

          let capitalizedBoolean = capitalizeFirstLetter(
            newData.is_tameable.toString()
          );
          cellToBeChanged.innerText = "Tameable: " + capitalizedBoolean;
          cellToBeChanged.className = cellToBeChanged.className + " item-level";

          counter = counter + 1;
        } else {
          let cellToBeChanged = document.getElementById(
            "tooltip-row-" + counter.toString()
          ).children[0];
          let capitalizedBoolean = "False";
          cellToBeChanged.innerText = "Tameable: " + capitalizedBoolean;
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
  const searchBarInnerText = document.getElementById("searchBar").value;
  if (searchBarInnerText === "") {
  } else {
    fetchNPCs(test);
  }
}

document
  .getElementById("searchBar")
  .addEventListener("submit", searchExecuteNPCs);
let urlItemString = window.location.search.slice(11);
document.getElementById("searchBar").value = urlItemString;
