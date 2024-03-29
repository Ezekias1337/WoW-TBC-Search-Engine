"use strict";

function renderResultsSpells(results, indexToRender) {
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
      /*  div.onclick="toolTip(this)"; */
      const lines = [`${user.data.name.en_US}`, `ID: ${user.data.id}`];
      for (let line of lines) {
        const p = document.createElement("td");
        p.style = "text-align:center vertical-align:center";
        p.innerText = line;
        p.style = "vertical-align: middle; padding: 0px;";
        div.appendChild(p);
      }

      if (user.assets) {
        for (let asset of user.assets) {
          const i = document.createElement("img");
          i.src = asset.value;

          const p = document.createElement("td");
          p.style = "padding: 0px";

          div.appendChild(p);
          p.appendChild(i);
        }
      }
      statsItems.appendChild(div);
    });
    toolTipSpells();
    hideLoader();
  }
  const statsItems = document.getElementById("userSearchResults");
  const numberOfArrayChunks = Math.ceil(results.length / rowLength);
  numberOfArrayChunksHoistedScope = numberOfArrayChunks;
  const chunkedArray = chunkResultsArray(
    results,
    numberOfArrayChunks,
    rowLength
  );
  let chunkedArrayIndexToDisplay = chunkedArray[indexToRender];

  chunkedArrayIndexToDisplay.forEach((user) => {
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
      p.style = "vertical-align: middle;";
      div.appendChild(p);
    }

    if (user.assets) {
      for (let asset of user.assets) {
        const i = document.createElement("img");
        i.src = asset.value;

        const p = document.createElement("td");
        p.style = "padding: 0px";

        div.appendChild(p);
        p.appendChild(i);
      }
    }
    statsItems.appendChild(div);
  });
  toolTipSpells();
  hideLoader();
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
  renderResultsSpells(resultsHoistedScope, currentPage - 1);
  toolTipItems();
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
    renderResultsSpells(resultsHoistedScope, currentPage - 1);
    toolTipItems();
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

    renderResultsSpells(resultsHoistedScope, currentPage);
    currentPage = parseInt(currentPage) + 1;
    toolTipItems();
  }
}

function fetchSpells(searchTerm) {
  currentPage = 1;
  rowLength = 10;

  fetch(
    `https://us.api.blizzard.com/data/wow/search/spell?namespace=static-us&locale=en_US&name.en_US=${searchTerm}&orderby=id&_page=1&str=&access_token=${oAuthToken}`
  )
    .then((response) => {
      if (!response.ok) {
        throw Error("ERROR");
      }
      showLoader();
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
      )
        .then((results) => {
          renderResultsSpells(results, 0);
          appendPaginationButtonsToDOM(numberOfArrayChunksHoistedScope);
          addPaginationDOMAndEventListener();
          resultsHoistedScope = results;
        })
        .then(() => {
          toolTipSpells();
        });
    })
    .catch((error) => {
      console.error(error);
    });
}

function searchExecuteSpells() {
  let test = search();
  const searchBarInnerText = document.getElementById("searchBar").value;
  if (searchBarInnerText === "") {
  } else {
    fetchSpells(test);
  }
}

function getToolTipSpells() {
  let responseFromFetch;
  let ID;
  let ID2;
  let tooltipImage;
  ID = event.currentTarget.children[1].innerText.replace("ID: ", "");
  ID2 = event.currentTarget;
  tooltipImage = event.currentTarget.children[2].children[0].cloneNode(true);
  tooltipImage.id = "tooltipImageStyleSpell";
  tooltipImage.style.verticalAlign = "top";
  tooltipImage.style.marginBottom = "5px";
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
          cellToBeChanged.className = cellToBeChanged.className + " item-level";

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
