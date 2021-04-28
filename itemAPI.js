'use strict';

function fetchItems(searchTerm) {
    fetch(`https://us.api.blizzard.com/data/wow/search/item?namespace=static-us&locale=en_US&id=&name.en_US=${searchTerm}&orderby=id&_page=1&str=&access_token=${oAuthToken}`)
        .then(response => {
            if (!response.ok) {
                throw Error("ERROR");
            }
            return response.json();
        })
        .then(data => {
            const statsItems = document.getElementById('userSearchResults');
  
            Promise.all(data.results.map(user => {
                return fetch(`https://us.api.blizzard.com/data/wow/media/item/${user.data.id}?namespace=static-us&locale=en_US&access_token=${oAuthToken}`)
                    .then(innerRes => innerRes.json())
                    .then(innerResData => {
                        return {...user, ...innerResData}
                    })
                    .catch(() => {
                        // Catch CORS Error
                        return user
                    })
            }))
                .then(results => {
                    results.forEach((user) => {
                        const div = document.createElement('tr');
                        div.className = 'Items';
                        const lines = [
                            `${user.data.name.en_US}`,
                            `Item Level ${user.data.level}`,
                            `${user.data.inventory_type.name.en_US}`,
                            `${user.data.item_subclass.name.en_US}`,
                            `Item Class: ${user.data.item_class.name.en_US}`,
                            `ID: ${user.data.id}`
                        ];
                        for (let line of lines) {
                            const p = document.createElement('td');
                            p.innerText = line;
                            div.appendChild(p);
                        }
  
                        if (user.assets) {
                            for (let asset of user.assets) {
                                const i = document.createElement('img');
                                i.src = asset.value;
                                div.appendChild(i);
                            }
                        }
                        statsItems.appendChild(div);
                    });
                });
        })
        .catch(error => {
            console.error(error);
        });
  }

  

  function search(){
    let input = document.getElementById("searchBar").value 
    console.log(input);
        if (input.length > 1) {
            return input;
        }
        
    }
    
    
    function searchExecuteItems() {
        let test = search();
        fetchItems(test);
        console.log("Success");
        setTimeout(toolTipItems, 2000);
    }

    function searchExecuteSpells() {
        let test = search();
        fetchSpells(test);
        console.log("Success");
        setTimeout(toolTipSpells, 2000);
    }

    function searchExecuteNPCs() {
        let test = search();
        fetchNPCs(test);
        console.log("Success");
        setTimeout(toolTipNPCs, 2000);
    }
    
    /*function searchExecuteQuests() {
        let test = search();
        fetchQuests(test);
        console.log("Success");
        setTimeout(toolTip, 2000);
    }*/
    
    document.getElementById("searchBar").addEventListener("submit", searchExecuteItems);
    let urlItemString = window.location.search.slice(11);
    document.getElementById("searchBar").value = urlItemString;
    

    function determineSearchCategory(){
        return document.getElementById("filterChoice").value;
    }


  /*  function updateFormAction(){

        let logicKey = determineSearchCategory(); 

        if (logicKey === "Items"){
            document.getElementById("searchForm").setAttribute("action", "item-search-results.html");
        } 
        elseif (logicKey === "Spells"){
            document.getElementById("searchForm").setAttribute("action", "spells-search-results.html");
        } 
        elseif (logicKey === "NPCs"){
            document.getElementById("searchForm").setAttribute("action", "NPCs-search-results.html");
        } 
        
        else {
            document.getElementById("searchForm").setAttribute("action", "quests-search-results.html");
        }

    } */
    
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
            console.log("User didn't select category");
    }
}
    searchCategory = document.getElementById("filterChoice").addEventListener("change", updateFormAction);

    function successMessage () {
        console.log("function has been called!")
    }

    
    


    function addEventListenerToSearchBar(){
        document.getElementById("searchBar").addEventListener("keyup", function(event) {
            console.log("loop entered")
            var x = event.key;
            // Number 13 is the "Enter" key on the keyboard
            if (x === "Enter") {
    
              
              // Trigger the button element with a click
              
              document.getElementById("searchButtonItems").click();
            }
          });
    }




    function clearSearchItems(){
        document.getElementById("userSearchResults").innerHTML = "";
    }

    function toolTipItems() {document.querySelectorAll('.Items').forEach(item => {
        item.addEventListener('mouseover', event => {
          console.log(event.currentTarget.children[5].innerText.replace("ID: ", ""));
        })
      })}

      function toolTipSpells() {document.querySelectorAll('.Items').forEach(item => {
        item.addEventListener('mouseover', event => {
          console.log(event.currentTarget.children[1].innerText.replace("ID: ", ""));
        })
      })}

      function toolTipNPCs() {document.querySelectorAll('.Items').forEach(item => {
        item.addEventListener('mouseover', event => {
          console.log(event.currentTarget.children[2].innerText.replace("ID: ", ""));
        })
      })}
