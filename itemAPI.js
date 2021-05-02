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
                        div.dataset.toggle = "tooltip";
                        div.dataset.placement = "auto left"; 
                        div.setAttribute("title", "");
                        div.dataset.html = true;
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

    function clearToolTip(){
        let tooltipLinezArray;
        tooltipLinezArray = document.getElementsByClassName("tooltip-linez");
        let z;
        let tooltipLinezClassLength;
        tooltipLinezClassLength = Object.keys(tooltipLinezArray).length;
        for (z = 0; z < tooltipLinezClassLength; z++){
            tooltipLinezArray[z].innerHTML = "";
            
        }
       document.querySelectorAll('.tooltip-linez').forEach(e => e.remove());

        
     /*   document.getElementById("fullToolTip").style.display = "none"; */
        
        console.log("Cleared tooltip of data!")
    }
    
    function toolTipItems() {document.querySelectorAll('.Items').forEach(item => {
        item.addEventListener('mouseenter', getToolTipID) 
        item.addEventListener('mouseleave', clearToolTip) 
      })}

    

    function moveToolTipWMouse(y_pos){
        let g;
        let xCoord;
        let yCoord;
        g = document.getElementById("fullToolTip");
        window.addEventListener('mousemove', function(e) {
        xCoord = e.x;
        yCoord = e.pageY - 100;
        g.style.top = yCoord +'px';
    })}

      function getToolTipID() {
        moveToolTipWMouse();
        document.getElementById("fullToolTip").style.display = "table"
        let responseFromFetch;
        let ID;
        let ID2;
        ID = (event.currentTarget.children[5].innerText.replace("ID: ", ""));
        ID2 = (event.currentTarget);
         fetch(`https://us.api.blizzard.com/data/wow/item/${ID}?namespace=static-us&locale=en_US&access_token=${oAuthToken}`)
             .then(response => response.json())
             .then(data => responseFromFetch = data)
             .then(newData => 
                {
                if (newData.preview_item.stats == null){
                    console.log("Item has no stats");
                    const lines = [
                        `${newData.name}`,
                        `${newData.preview_item.level.value}`,

                      /* I need to add error handling here for Items with  no bind type*/
                      /*  `${newData.preview_item.binding.name}`, */
                        `${newData.inventory_type.name}`,
                        `${newData.item_subclass.name}`,
                        `${newData.preview_item.weapon.damage.display_string}`,
                        `${newData.preview_item.weapon.attack_speed.display_string}`,
                        `${newData.preview_item.weapon.dps.display_string}`,
                        `${newData.preview_item.durability.display_string}`,
                        `${newData.required_level}`,
                        `${newData.sell_price}`
                    ]
                    console.table(lines)
                    let node = document.createElement('tr');
                    node.innerHTML = lines;
                
                document.getElementById("toolTipDisplay").appendChild(node);
                } else {
                let itemStatsArrayLength;
                let i;
                let itemStatsArray = [];
                itemStatsArrayLength = Object.keys(newData.preview_item.stats).length;
                
                for (i = 0; i < itemStatsArrayLength; i++){
                    itemStatsArray.push(newData.preview_item.stats[i].display.display_string)
                    console.log(itemStatsArray)
                }
                let itemStatsArrayDisplay;
                itemStatsArrayDisplay = itemStatsArray.toString();
                
                let sellPriceArray = [];
                let sellPriceArraydisplay;
                let sellPriceArraydisplayFinal;
                sellPriceArray.push(newData.preview_item.sell_price.display_strings.header);
                if (newData.preview_item.sell_price.display_strings.gold > 0){
                    sellPriceArray.push(newData.preview_item.sell_price.display_strings.gold + " Gold");
                } if (newData.preview_item.sell_price.display_strings.silver > 0){
                    sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.silver + " Silver ");
                } if (newData.preview_item.sell_price.display_strings.copper > 0){
                    sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.copper + " Copper ");
                } else {
                    console.log("Atleast one demonination of currency null")
                }
                sellPriceArraydisplay = sellPriceArray.toString();
                sellPriceArraydisplayFinal = sellPriceArraydisplay.replace("Sell Price:,", "Sell Price: ")

                const lines = [
                    `${newData.name}`,
                    `${newData.preview_item.level.display_string}`,
                    `${newData.preview_item.binding.name}`, 
                    `${newData.inventory_type.name}`,
                    `${newData.item_subclass.name}`,
                    `${newData.preview_item.weapon.damage.display_string}`,
                    `${newData.preview_item.weapon.attack_speed.display_string}`,
                    `${newData.preview_item.weapon.dps.display_string}`,
                    `${itemStatsArrayDisplay}`, 
                    `${newData.preview_item.durability.display_string}`,
                    `${newData.preview_item.requirements.level.display_string}`,
                    `${sellPriceArraydisplayFinal}`
                ]   
                  
                    lines.forEach((cell) => {
                    let node = document.createElement('td');
                    node.innerHTML = cell; 
                    node.className = 'tooltip-linez'
                    if (cell === newData.name){
                        document.getElementById("item-name").appendChild(node)
                    } else if(cell === newData.preview_item.level.display_string){
                        document.getElementById("ilvl").appendChild(node)
                    } else if(cell === newData.preview_item.binding.name){
                        document.getElementById("bind-type").appendChild(node)
                    } else if(cell === newData.inventory_type.name){
                        document.getElementById("inv-type").appendChild(node)
                    } else if(cell === newData.item_subclass.name){
                        document.getElementById("inv-type").appendChild(node)
                    } else if(cell === newData.preview_item.weapon.damage.display_string){
                        document.getElementById("damage").appendChild(node)
                    } else if(cell === newData.preview_item.weapon.attack_speed.display_string){
                        document.getElementById("speed").appendChild(node)
                    } else if(cell === newData.preview_item.weapon.dps.display_string){
                        document.getElementById("dps").appendChild(node)
                    } else if(cell === itemStatsArrayDisplay){
                        document.getElementById("stats").appendChild(node)
                    } 
                    else if(cell === newData.preview_item.durability.display_string){
                        document.getElementById("durability").appendChild(node)
                    } else if(cell === newData.preview_item.requirements.level.display_string){
                        document.getElementById("req-lvl").appendChild(node)
                    } else if(cell === sellPriceArraydisplayFinal){
                        document.getElementById("sell-price").appendChild(node)
                    }  
                    else{
                        console.log("Failed to append")
                    }
                    
                     

                }) 
                   console.table(lines) 
                   console.log(typeof(newData.required_level))
              }
            })}
    function appendToolTipDataItemsWithStats (){
        let node = document.createElement('td');
        node.innerHTML = cell;
        if (cell === newData.name){
            document.getElementById("item-name").appendChild(node)
        }
    }

    function test() {
       let responseFromFetch;
        fetch(`https://us.api.blizzard.com/data/wow/item/3039?namespace=static-us&locale=en_US&access_token=${oAuthToken}`)
            .then(response => response.json())
            .then(data => responseFromFetch = data)
            .then(newData => console.log(newData.preview_item.stats[0].display.display_string, newData.preview_item.binding.name))

    }



    /* 
    
    user.name  (name of item) row 1
    user.preview_item.level.value (ilvl of item) row 2
    user.preview_item.binding.name       (bind on pickup or equip) row 3
    user.inventory_type.name       (inventory type (aka ranged, 1h sword)) row 4
    user.item_subclass.name       (item subclass (aka bow, sword, polearm))
    user.preview_item.weapon.damage.display_string  (damage range (aka 31-42 damage)) row 5
    user.preview_item.weapon.attack_speed.display_string (weapon speed (aka Speed 3.00))
    user.preview_item.weapon.dps.display_string (DPS (aka 12.2 damage per second)) row 6
    user.preview_item.stats[0] *this will be hard to implement* (stats (aka +16 agility)) row 7
    user.preview_item.durability.display_string       (durability) row 8
    user.required_level       (required level to use) row 9
    user.sell_price       (sell price) row 10
    
    */

  /*  function fetchToolTipData () {
        toolTipItems();
        fetch(`https://us.api.blizzard.com/data/wow/item/${ID}?namespace=static-us&locale=en_US&access_token=${oAuthToken}`).then(response => response.json())
          .then (user => {
              const lines = [
                  `${user.data.name.en_US}`,
                  `Item Level ${user.data.level}`,
                  `${user.data.inventory_type.name.en_US}`,
                  `${user.data.item_subclass.name.en_US}`,
                  `Item Class: ${user.data.item_class.name.en_US}`,
                  `ID: ${user.data.id}`
              ];
          event.currentTarget.dataset.title = lines;
    }) */
      

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

/*    function getCoordinates(){
        let xCoord;
        let yCoord;
        
        window.addEventListener('mousemove', function(e) {
            xCoord = e.x;
            yCoord = e.y;
        console.log(`x: ${e.x} | y: ${e.y}`); 
    })} */

    