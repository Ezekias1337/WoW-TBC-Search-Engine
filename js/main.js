"use strict";

function search() {
  let input = document.getElementById("searchBar").value;
  if (input.length > 1) {
    return input;
  }
}

function addEventListenerToSearchBar() {
  document
    .getElementById("searchBar")
    .addEventListener("keyup", function (event) {
      var x = event.key;
      // Number 13 is the "Enter" key on the keyboard
      if (x === "Enter") {
        // Trigger the button element with a click

        document.getElementById("searchButtonItems").click();
      }
    });
}

function clearSearchItems() {
  document.getElementById("userSearchResults").innerHTML = "";
}

function clearToolTip() {
  let tooltipLinezArray;
  tooltipLinezArray = document.getElementsByClassName("tooltip-linez");
  let z;
  let tooltipLinezClassLength;
  tooltipLinezClassLength = Object.keys(tooltipLinezArray).length;

  if (document.getElementById("tooltipImageStyleNPC")) {
    document.getElementById("tooltipImageStyleNPC").remove();
  } else if (document.getElementById("tooltipImageStyleItem")) {
    document.getElementById("tooltipImageStyleItem").remove();
  } else if (document.getElementById("tooltipImageStyleSpell")) {
    document.getElementById("tooltipImageStyleSpell").remove();
  }

  for (z = 0; z < tooltipLinezClassLength; z++) {
    tooltipLinezArray[z].innerHTML = "";
  }
  document.querySelectorAll(".tooltip-linez").forEach((e) => e.remove());
}

let currentPage;
let rowLength;
let resultsHoistedScope;
let numberOfArrayChunksHoistedScope;

function addPaginationDOMAndEventListener() {
  let paginationButtons = document.getElementsByClassName("number-pagination");

  for (const item of paginationButtons) {
    item.addEventListener("click", changePagePagination);
  }

  const reverseButton = document.getElementById("reverse-page-pagination");
  const forwardButton = document.getElementById("forward-page-pagination");

  reverseButton.addEventListener("click", reverseOnePage);
  forwardButton.addEventListener("click", forwardOnePage);
}

function appendPaginationButtonsToDOM(numberOfArrayChunksHoistedScope) {
  if (
    numberOfArrayChunksHoistedScope <= 1 ||
    numberOfArrayChunksHoistedScope === undefined
  ) {
    removePaginationFromDOM();
    console.log("No need for pagination, 1 or less array chunks");
    return;
  }

  function applyAttributesToButton(button) {
    button.className = "btn btn-dark pagination-button";
  }

  function removePaginationFromDOM() {
    let arrayOfPaginationElements = document.getElementById(
      "pagination-container"
    ).children;
    arrayOfPaginationElements = Array.from(arrayOfPaginationElements);
    for (const item of arrayOfPaginationElements) {
      item.remove();
    }
  }

  removePaginationFromDOM();

  const paginationContainer = document.getElementById("pagination-container");
  const reversePagePagination = document.createElement("BUTTON");
  const forwardPagePagination = document.createElement("BUTTON");

  reversePagePagination.id = "reverse-page-pagination";
  forwardPagePagination.id = "forward-page-pagination";
  reversePagePagination.innerText = "<<";
  forwardPagePagination.innerText = ">>";
  applyAttributesToButton(reversePagePagination);
  applyAttributesToButton(forwardPagePagination);

  reversePagePagination.classList.add("mr-1");
  forwardPagePagination.classList.add("ml-1");

  paginationContainer.appendChild(reversePagePagination);

  for (let i = 0; i < numberOfArrayChunksHoistedScope; i++) {
    const numericalPaginationButton = document.createElement("BUTTON");

    applyAttributesToButton(numericalPaginationButton);
    numericalPaginationButton.classList.add("number-pagination");
    numericalPaginationButton.innerText = i + 1;
    if (i === 0) {
      numericalPaginationButton.classList.add("pagination-active");
    }
    paginationContainer.appendChild(numericalPaginationButton);
  }

  paginationContainer.appendChild(forwardPagePagination);
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
  renderResults(resultsHoistedScope, currentPage - 1);
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
    renderResults(resultsHoistedScope, currentPage - 1);
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
    renderResults(resultsHoistedScope, currentPage);
    currentPage = parseInt(currentPage) + 1;
    toolTipItems();
  }
}

function chunkResultsArray(results, numberOfArrayChunks, rowLength) {
  let masterArray = [];
  for (let i = 0; i < numberOfArrayChunks; i++) {
    const sliceFirstParameter = i * rowLength;
    const sliceSecondParameter = sliceFirstParameter + rowLength;
    const arrayChunk = results.slice(sliceFirstParameter, sliceSecondParameter);
    masterArray.push(arrayChunk);
  }
  return masterArray;
}
