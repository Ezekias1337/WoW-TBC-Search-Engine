'use strict';

function updateFormAction (){
    let logicKey = determineSearchCategory();

    switch(logicKey){
        case "Items":
            document.getElementById("searchForm").setAttribute("action", "item-search-results.html");
            break;
        case "Spells":
            document.getElementById("searchForm").setAttribute("action", "spells-search-results.html");
            break;
        case "NPCs":
            document.getElementById("searchForm").setAttribute("action", "NPCs-search-results.html");
            break;
        case "Quests":
           document.getElementById("searchForm").setAttribute("action", "quests-search-results.html");
            break;
        default:
            break;
    }
}
    let searchCategory;
    searchCategory = document.getElementById("filterChoice").addEventListener("change", updateFormAction);

    function determineSearchCategory(){
        return document.getElementById("filterChoice").value;
    }