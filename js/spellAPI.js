"use strict";

function fetchSpells(searchTerm) {
  fetch(
    `https://us.api.blizzard.com/data/wow/search/spell?namespace=static-us&locale=en_US&name.en_US=${searchTerm}&orderby=id&_page=1&str=&access_token=${oAuthToken}`
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
            `https://us.api.blizzard.com/data/wow/media/spell/${user.data.id}?namespace=static-us&locale=en_US&access_token=${oAuthToken}`
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
          /*  div.onclick="toolTip(this)"; */
          const lines = [`${user.data.name.en_US}`, `ID: ${user.data.id}`];
          for (let line of lines) {
            const p = document.createElement("td");
            p.style = "text-align:center vertical-align:center";
            p.innerText = line;
            div.appendChild(p);
          }

          if (user.assets) {
            for (let asset of user.assets) {
              const i = document.createElement("img");
              i.src = asset.value;
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

function searchExecuteSpells() {
  let test = search();
  fetchSpells(test);
  setTimeout(toolTipSpells, 1000);
}

function getToolTipSpells() {
  let responseFromFetch;
  let ID;
  let ID2;
  let tooltipImage;
  ID = event.currentTarget.children[1].innerText.replace("ID: ", "");
  ID2 = event.currentTarget;
  tooltipImage = event.currentTarget.children[2].cloneNode(true);
  tooltipImage.id = "tooltipImageStyleSpell";
  tooltipImage.style.verticalAlign = "top"
  fetch(
    `https://us.api.blizzard.com/data/wow/spell/${ID}?namespace=static-us&locale=en_US&access_token=${oAuthToken}`
  )
    .then((response) => response.json())
    .then((data) => (responseFromFetch = data))
    .then((newData) => {
        //First wipe the slate clean by removing old tooltip
        let elementsToDeleteLength =
          document.getElementById("toolTipDisplay").children.length;

        for (let i = 0; i < elementsToDeleteLength; i++) {
          let rowToDeleteID = "tooltip-row-" + (i + 1).toString();
          document.getElementById(rowToDeleteID).remove();
        }

        // start logic of new tooltip
        let numOfLines = 2;

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
              cellToBeChanged.className + " unique-equip";

            counter = counter + 1;
          }

          if (newData.description) {
            let cellToBeChanged = document.getElementById(
              "tooltip-row-" + counter.toString()
            ).children[0];
            cellToBeChanged.innerText = newData.description;
            cellToBeChanged.className =
              cellToBeChanged.className + " item-level";

            counter = counter + 1;
          }

        }

        appendDataToRows();

        let tooltipHeader = document.getElementById("element-to-append-image");

        document
          .getElementById("element-to-append-image")
          .insertBefore(tooltipImage, tooltipHeader.childNodes[0]);
    });
}

function toolTipSpells() {
  document.querySelectorAll(".Items").forEach((item) => {
    item.addEventListener("click", getToolTipSpells);
    item.addEventListener("mouseleave", clearToolTip);
  });
}

document
  .getElementById("searchBar")
  .addEventListener("submit", searchExecuteSpells);
let urlItemString = window.location.search.slice(11);
document.getElementById("searchBar").value = urlItemString;
