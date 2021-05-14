'use strict';

function searchExecuteQuests() {
    let test = search();
    fetchQuests(test);
    setTimeout(toolTip, 1000);
}

document.getElementById("searchBar").addEventListener("submit", searchExecuteQuests);
    let urlItemString = window.location.search.slice(11);
    document.getElementById("searchBar").value = urlItemString;