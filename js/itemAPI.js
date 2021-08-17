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
                        div.setAttribute("data-toggle", "modal");
                        div.setAttribute("data-target", "#toolTipModal");
                        const lines = [
                            `${user.data.name.en_US}`,
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
 
  function toolTipItems() {document.querySelectorAll('.Items').forEach(item => {
    item.addEventListener('click', getToolTipItems) 
    item.addEventListener('mouseleave', clearToolTip) 
  })}

    function searchExecuteItems() {
        let test = search();
        fetchItems(test);
        setTimeout(toolTipItems, 1000);
    }
    
    document.getElementById("searchBar").addEventListener("submit", searchExecuteItems);
    let urlItemString = window.location.search.slice(11);
    document.getElementById("searchBar").value = urlItemString;

      function getToolTipItems() {
        document.getElementById("fullToolTip").style.display = "table"
        let responseFromFetch;
        let ID;
        let ID2;
        let tooltipImage;
        tooltipImage = event.currentTarget.children[3].cloneNode(true);
        tooltipImage.id = "tooltipImageStyleItem";
        tooltipImage.className = "d-block";
        ID = (event.currentTarget.children[2].innerText.replace("ID: ", ""));
        ID2 = (event.currentTarget);
         fetch(`https://us.api.blizzard.com/data/wow/item/${ID}?namespace=static-classic-us&locale=en_US&access_token=${oAuthToken}`)      
             .then(response => response.json())
             .then(data => responseFromFetch = data)
             .then(newData => 
                {
                    function styleItemName(){
                        let poor;
                        let common;
                        let uncommon;
                        let rare;
                        let epic;
                        let legendary;
                        let m;
                
                        poor = "#9d9d9d";
                        common = "#ffffff";
                        uncommon = "#1eff00";
                        rare = "#0070dd";
                        epic = "#a335ee";
                        legendary = "#ff8000";
                    
                        m = document.getElementById('tooltip-row-1');
                        if (newData.quality.name === "Poor"){
                            m.style.color = poor;
                        } else if (newData.quality.name === "Common"){
                            m.style.color = common;
                        } else if (newData.quality.name === "Uncommon"){
                            m.style.color = uncommon;
                        } else if (newData.quality.name === "Rare"){
                            m.style.color = rare;
                        } else if (newData.quality.name === "Epic"){
                            m.style.color = epic;
                        } else if (newData.quality.name === "Legendary"){
                            m.style.color = legendary;
                        }
                        
                    }
                  /* Start of Weapon Parsing */
                  if (newData.item_class.name === "Weapon"){
                    /* NEED TO ADD ERROR HANDLING FOR ARMOR WITH NO ARMOR, EG ITEM 19138 SULFURAS BAND */
                    /* This else if statement is for Weapons with no stats, no bind type and no required attribute*/
            
            if (newData.sell_price != null){
                
                console.log("Item has no stats");
                let sellPriceArray = [];
                let sellPriceArraydisplay;
                let sellPriceArraydisplayFinal;

                sellPriceArray.push(newData.preview_item.sell_price.display_strings.header);
                if (newData.preview_item.sell_price.display_strings.gold > 0){
                    sellPriceArray.push(newData.preview_item.sell_price.display_strings.gold + " Gold");
                } if (newData.preview_item.sell_price.display_strings.silver > 0){
                    sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.silver + " Silver");
                } if (newData.preview_item.sell_price.display_strings.copper > 0){
                    sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.copper + " Copper");
                } else {
                    console.log("Atleast one demonination of currency null")
                }
                sellPriceArraydisplay = sellPriceArray.join(); 
                sellPriceArraydisplayFinal = sellPriceArraydisplay.replace("Sell Price:,", "Sell Price: ")

                const lines = [
                    `${newData.name}`,
                    `${newData.level}`, 
                    `${newData.inventory_type.name}`,
                    `${newData.item_subclass.name}`,
                    `${newData.preview_item.weapon.damage.display_string}`,
                    `${newData.preview_item.weapon.attack_speed.display_string}`,
                    `${newData.preview_item.weapon.dps.display_string}`,
                    `${newData.preview_item.durability.display_string}`,
                    `${sellPriceArraydisplayFinal}`
                ]

                document.getElementById("tooltip-row-1").appendChild(tooltipImage)

                lines.forEach((cell) => {
                let node = document.createElement('td');
                node.innerHTML = cell; 
                node.className = 'tooltip-linez'
                if (cell === newData.name){
                    document.getElementById("tooltip-row-1").appendChild(node)
                } else if(cell === newData.preview_item.level.display_string){
                    document.getElementById("tooltip-row-1").appendChild(node)
                } else if(cell === newData.inventory_type.name){
                    document.getElementById("tooltip-row-2").appendChild(node)
                } else if(cell === newData.item_subclass.name){
                    document.getElementById("tooltip-row-2").appendChild(node)
                } else if(cell === newData.preview_item.weapon.damage.display_string){
                    document.getElementById("tooltip-row-3").appendChild(node)
                } else if(cell === newData.preview_item.weapon.attack_speed.display_string){
                    document.getElementById("tooltip-row-3").appendChild(node)
                } else if(cell === newData.preview_item.weapon.dps.display_string){
                    document.getElementById("tooltip-row-3").appendChild(node)
                }  else if(cell === newData.preview_item.durability.display_string){
                    document.getElementById("tooltip-row-4").appendChild(node)
                } else if(cell === sellPriceArraydisplayFinal){
                    document.getElementById("tooltip-row-4").appendChild(node)
                }  
                else{
                    console.log("Failed to append")
                }
            })
            styleItemName();
        }


                    else if (newData.preview_item.binding == null && newData.preview_item.stats == null){
                    console.log("Item has no bind-type");
                    let sellPriceArray = [];
                    let sellPriceArraydisplay;
                    let sellPriceArraydisplayFinal;
    
                    sellPriceArray.push(newData.preview_item.sell_price.display_strings.header);
                    if (newData.preview_item.sell_price.display_strings.gold > 0){
                        sellPriceArray.push(newData.preview_item.sell_price.display_strings.gold + " Gold");
                    } if (newData.preview_item.sell_price.display_strings.silver > 0){
                        sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.silver + " Silver");
                    } if (newData.preview_item.sell_price.display_strings.copper > 0){
                        sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.copper + " Copper");
                    } else {
                        console.log("Atleast one demonination of currency null")
                    }
                    sellPriceArraydisplay = sellPriceArray.join(); 
                    sellPriceArraydisplayFinal = sellPriceArraydisplay.replace("Sell Price:,", "Sell Price: ")

                    if (newData.preview_item.requirements.level.display_string === null){
                        const lines = [
                            `${newData.name}`,
                            `${newData.preview_item.level.display_string}`,
                            `${newData.inventory_type.name}`,
                            `${newData.item_subclass.name}`,
                            `${newData.preview_item.weapon.damage.display_string}`,
                            `${newData.preview_item.weapon.attack_speed.display_string}`,
                            `${newData.preview_item.weapon.dps.display_string}`,
                            `${newData.preview_item.durability.display_string}`,
                            `${newData.preview_item.requirements.level.display_string}`,
                            `${sellPriceArraydisplayFinal}`
                        ]
                    }

                    const lines = [
                        `${newData.name}`,
                        `${newData.preview_item.level.display_string}`,
                        `${newData.inventory_type.name}`,
                        `${newData.item_subclass.name}`,
                        `${newData.preview_item.weapon.damage.display_string}`,
                        `${newData.preview_item.weapon.attack_speed.display_string}`,
                        `${newData.preview_item.weapon.dps.display_string}`,
                        `${newData.preview_item.durability.display_string}`,
                        `${newData.preview_item.requirements.level.display_string}`,
                        `${sellPriceArraydisplayFinal}`
                    ]

                    document.getElementById("tooltip-row-1").appendChild(tooltipImage)

                    lines.forEach((cell) => {
                    let node = document.createElement('td');
                    node.innerHTML = cell; 
                    node.className = 'tooltip-linez'
                    if (cell === newData.name){
                        document.getElementById("tooltip-row-1").appendChild(node)
                    } else if(cell === newData.preview_item.level.display_string){
                        document.getElementById("tooltip-row-1").appendChild(node)
                    } else if(cell === newData.inventory_type.name){
                        document.getElementById("tooltip-row-2").appendChild(node)
                    } else if(cell === newData.item_subclass.name){
                        document.getElementById("tooltip-row-2").appendChild(node)
                    } else if(cell === newData.preview_item.weapon.damage.display_string){
                        document.getElementById("tooltip-row-3").appendChild(node)
                    } else if(cell === newData.preview_item.weapon.attack_speed.display_string){
                        document.getElementById("tooltip-row-3").appendChild(node)
                    } else if(cell === newData.preview_item.weapon.dps.display_string){
                        document.getElementById("tooltip-row-3").appendChild(node)
                    }  else if(cell === newData.preview_item.durability.display_string){
                        document.getElementById("tooltip-row-4").appendChild(node)
                    } else if(cell === newData.preview_item.requirements.level.display_string){
                        document.getElementById("tooltip-row-4").appendChild(node)
                    } else if(cell === sellPriceArraydisplayFinal){
                        document.getElementById("tooltip-row-4").appendChild(node)
                    }  
                    else{
                        console.log("Failed to append")
                    }
                })
                styleItemName();
            } 


            /* ------------------------------------------------------------------------------- */
            
            /* This else if statement is for Weapons with no stats, no required level but with a bind type */
            
            else if (newData.preview_item.stats == null){
                
                console.log("Item has no stats");
                let sellPriceArray = [];
                let sellPriceArraydisplay;
                let sellPriceArraydisplayFinal;

                sellPriceArray.push(newData.preview_item.sell_price.display_strings.header);
                if (newData.preview_item.sell_price.display_strings.gold > 0){
                    sellPriceArray.push(newData.preview_item.sell_price.display_strings.gold + " Gold");
                } if (newData.preview_item.sell_price.display_strings.silver > 0){
                    sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.silver + " Silver");
                } if (newData.preview_item.sell_price.display_strings.copper > 0){
                    sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.copper + " Copper");
                } else {
                    console.log("Atleast one demonination of currency null")
                }
                sellPriceArraydisplay = sellPriceArray.join(); 
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
                    `${newData.preview_item.durability.display_string}`,
                    `${sellPriceArraydisplayFinal}`
                ]

                document.getElementById("tooltip-row-1").appendChild(tooltipImage)

                lines.forEach((cell) => {
                let node = document.createElement('td');
                node.innerHTML = cell; 
                node.className = 'tooltip-linez'
                if (cell === newData.name){
                    document.getElementById("tooltip-row-1").appendChild(node)
                } else if(cell === newData.preview_item.level.display_string){
                    document.getElementById("tooltip-row-1").appendChild(node)
                } else if(cell === newData.preview_item.binding.name){
                    document.getElementById("tooltip-row-1").appendChild(node)
                } else if(cell === newData.inventory_type.name){
                    document.getElementById("tooltip-row-2").appendChild(node)
                } else if(cell === newData.item_subclass.name){
                    document.getElementById("tooltip-row-2").appendChild(node)
                } else if(cell === newData.preview_item.weapon.damage.display_string){
                    document.getElementById("tooltip-row-3").appendChild(node)
                } else if(cell === newData.preview_item.weapon.attack_speed.display_string){
                    document.getElementById("tooltip-row-3").appendChild(node)
                } else if(cell === newData.preview_item.weapon.dps.display_string){
                    document.getElementById("tooltip-row-3").appendChild(node)
                }  else if(cell === newData.preview_item.durability.display_string){
                    document.getElementById("tooltip-row-4").appendChild(node)
                } else if(cell === sellPriceArraydisplayFinal){
                    document.getElementById("tooltip-row-4").appendChild(node)
                }  
                else{
                    console.log("Failed to append")
                }
            })
            styleItemName();
        }
            
            /* -------------------------------------------------------------------------------- */
            
            /* This else if statement is for Weapons with no stats, but with a bind type */
            
            else if (newData.preview_item.stats == null){
                
                console.log("Item has no stats");
                let sellPriceArray = [];
                let sellPriceArraydisplay;
                let sellPriceArraydisplayFinal;

                sellPriceArray.push(newData.preview_item.sell_price.display_strings.header);
                if (newData.preview_item.sell_price.display_strings.gold > 0){
                    sellPriceArray.push(newData.preview_item.sell_price.display_strings.gold + " Gold");
                } if (newData.preview_item.sell_price.display_strings.silver > 0){
                    sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.silver + " Silver");
                } if (newData.preview_item.sell_price.display_strings.copper > 0){
                    sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.copper + " Copper");
                } else {
                    console.log("Atleast one demonination of currency null")
                }
                sellPriceArraydisplay = sellPriceArray.join(); 
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
                    `${newData.preview_item.durability.display_string}`,
                    `${newData.preview_item.requirements.level.display_string}`,
                    `${sellPriceArraydisplayFinal}`
                ]
                document.getElementById("tooltip-row-1").appendChild(tooltipImage)

                lines.forEach((cell) => {
                let node = document.createElement('td');
                node.innerHTML = cell; 
                node.className = 'tooltip-linez'
                if (cell === newData.name){
                    document.getElementById("tooltip-row-1").appendChild(node)
                } else if(cell === newData.preview_item.level.display_string){
                    document.getElementById("tooltip-row-1").appendChild(node)
                } else if(cell === newData.preview_item.binding.name){
                    document.getElementById("tooltip-row-1").appendChild(node)
                } else if(cell === newData.inventory_type.name){
                    document.getElementById("tooltip-row-2").appendChild(node)
                } else if(cell === newData.item_subclass.name){
                    document.getElementById("tooltip-row-2").appendChild(node)
                } else if(cell === newData.preview_item.weapon.damage.display_string){
                    document.getElementById("tooltip-row-3").appendChild(node)
                } else if(cell === newData.preview_item.weapon.attack_speed.display_string){
                    document.getElementById("tooltip-row-3").appendChild(node)
                } else if(cell === newData.preview_item.weapon.dps.display_string){
                    document.getElementById("tooltip-row-3").appendChild(node)
                }  else if(cell === newData.preview_item.durability.display_string){
                    document.getElementById("tooltip-row-4").appendChild(node)
                } else if(cell === newData.preview_item.requirements.level.display_string){
                    document.getElementById("tooltip-row-4").appendChild(node)
                } else if(cell === sellPriceArraydisplayFinal){
                    document.getElementById("tooltip-row-4").appendChild(node)
                }  
                else{
                    console.log("Failed to append")
                }
            })
            styleItemName();
        } 

        /* This else if statement is for weapons with no required level */
        
        else if (newData.preview_item.requirements == null){
            
            let itemStatsArrayLength;
            let i;
            let itemStatsArray = [];
            itemStatsArrayLength = Object.keys(newData.preview_item.stats).length;
            
            for (i = 0; i < itemStatsArrayLength; i++){
                itemStatsArray.push(newData.preview_item.stats[i].display.display_string)
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
                sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.silver + " Silver");
            } if (newData.preview_item.sell_price.display_strings.copper > 0){
                sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.copper + " Copper");
            } else {
                console.log("Atleast one demonination of currency null")
            }
            sellPriceArraydisplay = sellPriceArray.join(); 
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
                `${sellPriceArraydisplayFinal}`
            ]   
            
            document.getElementById("tooltip-row-1").appendChild(tooltipImage)

                lines.forEach((cell) => {
                let node = document.createElement('td');
                node.innerHTML = cell; 
                node.className = 'tooltip-linez'
                if (cell === newData.name){
                    document.getElementById("tooltip-row-1").appendChild(node)
                } else if(cell === newData.preview_item.level.display_string){
                    document.getElementById("tooltip-row-1").appendChild(node)
                } else if(cell === newData.preview_item.binding.name){
                    document.getElementById("tooltip-row-1").appendChild(node)
                } else if(cell === newData.inventory_type.name){
                    document.getElementById("tooltip-row-2").appendChild(node)
                } else if(cell === newData.item_subclass.name){
                    document.getElementById("tooltip-row-2").appendChild(node)
                } else if(cell === newData.preview_item.weapon.damage.display_string){
                    document.getElementById("tooltip-row-3").appendChild(node)
                } else if(cell === newData.preview_item.weapon.attack_speed.display_string){
                    document.getElementById("tooltip-row-3").appendChild(node)
                } else if(cell === newData.preview_item.weapon.dps.display_string){
                    document.getElementById("tooltip-row-3").appendChild(node)
                } else if(cell === itemStatsArrayDisplay){
                    document.getElementById("tooltip-row-2").appendChild(node)
                } 
                else if(cell === newData.preview_item.durability.display_string){
                    document.getElementById("tooltip-row-4").appendChild(node)
                } else if(cell === sellPriceArraydisplayFinal){
                    document.getElementById("tooltip-row-4").appendChild(node)
                }  
                else{
                    console.log("Failed to append")
                }
                
                

            }) 
            styleItemName();
        }


            /* This else statement is for Weapons with stats and bind type */
                else {
                    
                    let itemStatsArrayLength;
                    let i;
                    let itemStatsArray = [];
                    itemStatsArrayLength = Object.keys(newData.preview_item.stats).length;
                    
                    for (i = 0; i < itemStatsArrayLength; i++){
                        itemStatsArray.push(newData.preview_item.stats[i].display.display_string)
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
                        sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.silver + " Silver");
                    } if (newData.preview_item.sell_price.display_strings.copper > 0){
                        sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.copper + " Copper");
                    } else {
                        console.log("Atleast one demonination of currency null")
                    }
                    sellPriceArraydisplay = sellPriceArray.join(); 
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
                    
                    document.getElementById("tooltip-row-1").appendChild(tooltipImage)

                        lines.forEach((cell) => {
                        let node = document.createElement('td');
                        node.innerHTML = cell; 
                        node.className = 'tooltip-linez'
                        if (cell === newData.name){
                            document.getElementById("tooltip-row-1").appendChild(node)
                        } else if(cell === newData.preview_item.level.display_string){
                            document.getElementById("tooltip-row-1").appendChild(node)
                        } else if(cell === newData.preview_item.binding.name){
                            document.getElementById("tooltip-row-1").appendChild(node)
                        } else if(cell === newData.inventory_type.name){
                            document.getElementById("tooltip-row-2").appendChild(node)
                        } else if(cell === newData.item_subclass.name){
                            document.getElementById("tooltip-row-2").appendChild(node)
                        } else if(cell === newData.preview_item.weapon.damage.display_string){
                            document.getElementById("tooltip-row-3").appendChild(node)
                        } else if(cell === newData.preview_item.weapon.attack_speed.display_string){
                            document.getElementById("tooltip-row-3").appendChild(node)
                        } else if(cell === newData.preview_item.weapon.dps.display_string){
                            document.getElementById("tooltip-row-3").appendChild(node)
                        } else if(cell === itemStatsArrayDisplay){
                            document.getElementById("tooltip-row-2").appendChild(node)
                        } 
                        else if(cell === newData.preview_item.durability.display_string){
                            document.getElementById("tooltip-row-4").appendChild(node)
                        } else if(cell === newData.preview_item.requirements.level.display_string){
                            document.getElementById("tooltip-row-4").appendChild(node)
                        } else if(cell === sellPriceArraydisplayFinal){
                            document.getElementById("tooltip-row-4").appendChild(node)
                        }  
                        else{
                            console.log("Failed to append")
                        }
                        
                        

                    }) 
                }
                styleItemName();
            } /* End of Weapon Parsing */
            
            /*Start of Armour Parsing */
            else if (newData.preview_item.item_class.name === "Armor"){
            /* This if statement is for low level Armour, with no stats or bind type */
                if (newData.preview_item.binding == null){
                    console.log("Item has no bind-type");
                    let sellPriceArray = [];
                    let sellPriceArraydisplay;
                    let sellPriceArraydisplayFinal;
    
                    sellPriceArray.push(newData.preview_item.sell_price.display_strings.header);
                    if (newData.preview_item.sell_price.display_strings.gold > 0){
                        sellPriceArray.push(newData.preview_item.sell_price.display_strings.gold + " Gold");
                    } if (newData.preview_item.sell_price.display_strings.silver > 0){
                        sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.silver + " Silver");
                    } if (newData.preview_item.sell_price.display_strings.copper > 0){
                        sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.copper + " Copper");
                    } else {
                        console.log("Atleast one demonination of currency null")
                    }
                    sellPriceArraydisplay = sellPriceArray.join(); 
                    sellPriceArraydisplayFinal = sellPriceArraydisplay.replace("Sell Price:,", "Sell Price: ")

                    const lines = [
                        `${newData.name}`,
                        `${newData.preview_item.level.display_string}`,
                        `${newData.inventory_type.name}`,
                        `${newData.item_subclass.name}`,
                        `${newData.preview_item.armor.display.display_string}`,
                        `${newData.preview_item.durability.display_string}`,
                        `${newData.preview_item.requirements.level.display_string}`,
                        `${sellPriceArraydisplayFinal}`
                    ]

                    document.getElementById("tooltip-row-1").appendChild(tooltipImage)

                    lines.forEach((cell) => {
                    let node = document.createElement('td');
                    node.innerHTML = cell; 
                    node.className = 'tooltip-linez'
                    if (cell === newData.name){
                        document.getElementById("tooltip-row-1").appendChild(node)
                    } else if(cell === newData.preview_item.level.display_string){
                        document.getElementById("tooltip-row-1").appendChild(node)
                    } else if(cell === newData.inventory_type.name){
                        document.getElementById("tooltip-row-2").appendChild(node)
                    } else if(cell === newData.item_subclass.name){
                        document.getElementById("tooltip-row-2").appendChild(node)
                    } else if(cell === newData.preview_item.armor.display.display_string){
                        document.getElementById("tooltip-row-1").appendChild(node)
                    } else if(cell === newData.preview_item.durability.display_string){
                        document.getElementById("tooltip-row-3").appendChild(node)
                    } else if(cell === newData.preview_item.requirements.level.display_string){
                        document.getElementById("tooltip-row-3").appendChild(node)
                    } else if(cell === sellPriceArraydisplayFinal){
                        document.getElementById("tooltip-row-3").appendChild(node)
                    }  
                    else{
                        console.log("Failed to append")
                    }
                })
                    
                    styleItemName();

                }
            /* This else if statement is for Armour with no stats, but with a bind type */
                else if (newData.preview_item.stats == null){
                    console.log("Item has no stats");
                let sellPriceArray = [];
                let sellPriceArraydisplay;
                let sellPriceArraydisplayFinal;

                sellPriceArray.push(newData.preview_item.sell_price.display_strings.header);
                if (newData.preview_item.sell_price.display_strings.gold > 0){
                    sellPriceArray.push(newData.preview_item.sell_price.display_strings.gold + " Gold");
                } if (newData.preview_item.sell_price.display_strings.silver > 0){
                    sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.silver + " Silver");
                } if (newData.preview_item.sell_price.display_strings.copper > 0){
                    sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.copper + " Copper");
                } else {
                    console.log("Atleast one demonination of currency null")
                }
                sellPriceArraydisplay = sellPriceArray.join(); 
                sellPriceArraydisplayFinal = sellPriceArraydisplay.replace("Sell Price:,", "Sell Price: ")

                const lines = [
                    `${newData.name}`,
                    `${newData.preview_item.level.display_string}`,
                    `${newData.preview_item.binding.name}`, 
                    `${newData.inventory_type.name}`,
                    `${newData.item_subclass.name}`,
                    `${newData.preview_item.armor.display.display_string}`,
                    `${newData.preview_item.durability.display_string}`,
                    `${newData.preview_item.requirements.level.display_string}`,
                    `${sellPriceArraydisplayFinal}`
                ]

                document.getElementById("tooltip-row-1").appendChild(tooltipImage)

                lines.forEach((cell) => {
                let node = document.createElement('td');
                node.innerHTML = cell; 
                node.className = 'tooltip-linez'
                if (cell === newData.name){
                    document.getElementById("tooltip-row-1").appendChild(node)
                } else if(cell === newData.preview_item.level.display_string){
                    document.getElementById("tooltip-row-1").appendChild(node)
                } else if(cell === newData.preview_item.binding.name){
                    document.getElementById("tooltip-row-1").appendChild(node)
                } else if(cell === newData.inventory_type.name){
                    document.getElementById("tooltip-row-2").appendChild(node)
                } else if(cell === newData.item_subclass.name){
                    document.getElementById("tooltip-row-2").appendChild(node)
                } else if(cell === newData.preview_item.armor.display.display_string){
                    document.getElementById("tooltip-row-2").appendChild(node)
                } else if(cell === newData.preview_item.durability.display_string){
                    document.getElementById("tooltip-row-3").appendChild(node)
                } else if(cell === newData.preview_item.requirements.level.display_string){
                    document.getElementById("tooltip-row-3").appendChild(node)
                } else if(cell === sellPriceArraydisplayFinal){
                    document.getElementById("tooltip-row-3").appendChild(node)
                }  
                else{
                    console.log("Failed to append")
                }
            })
                    styleItemName();
            }
            /* This else if statement is for Armour with no required level */
                else if (newData.preview_item.requirements == null){
                    let itemStatsArrayLength;
            let i;
            let itemStatsArray = [];
            itemStatsArrayLength = Object.keys(newData.preview_item.stats).length;
            
            for (i = 0; i < itemStatsArrayLength; i++){
                itemStatsArray.push(newData.preview_item.stats[i].display.display_string)
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
                sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.silver + " Silver");
            } if (newData.preview_item.sell_price.display_strings.copper > 0){
                sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.copper + " Copper");
            } else {
                console.log("Atleast one demonination of currency null")
            }
            sellPriceArraydisplay = sellPriceArray.join(); 
            sellPriceArraydisplayFinal = sellPriceArraydisplay.replace("Sell Price:,", "Sell Price: ")

            const lines = [
                `${newData.name}`,
                `${newData.preview_item.level.display_string}`,
                `${newData.preview_item.binding.name}`, 
                `${newData.inventory_type.name}`,
                `${newData.item_subclass.name}`,
                `${newData.preview_item.armor.display.display_string}`,
                `${itemStatsArrayDisplay}`, 
                `${newData.preview_item.durability.display_string}`,
                `${sellPriceArraydisplayFinal}`
            ]   

            document.getElementById("tooltip-row-1").appendChild(tooltipImage)
            
                lines.forEach((cell) => {
                let node = document.createElement('td');
                node.innerHTML = cell; 
                node.className = 'tooltip-linez'
                if (cell === newData.name){
                    document.getElementById("tooltip-row-1").appendChild(node)
                } else if(cell === newData.preview_item.level.display_string){
                    document.getElementById("tooltip-row-1").appendChild(node)
                } else if(cell === newData.preview_item.binding.name){
                    document.getElementById("tooltip-row-1").appendChild(node)
                } else if(cell === newData.inventory_type.name){
                    document.getElementById("tooltip-row-2").appendChild(node)
                } else if(cell === newData.item_subclass.name){
                    document.getElementById("tooltip-row-2").appendChild(node)
                } else if(cell === newData.preview_item.armor.display.display_string){
                    document.getElementById("tooltip-row-2").appendChild(node)
                } else if(cell === itemStatsArrayDisplay){
                    document.getElementById("tooltip-row-3").appendChild(node)
                } else if(cell === newData.preview_item.durability.display_string){
                    document.getElementById("tooltip-row-3").appendChild(node)
                } else if(cell === sellPriceArraydisplayFinal){
                    document.getElementById("tooltip-row-3").appendChild(node)
                }  
                else{
                    console.log("Failed to append")
                }
                
            })
                    
                    styleItemName();
            }
            /* This else statement is for Armour with stats and bind type */
                else {
                    let itemStatsArrayLength;
                    let i;
                    let itemStatsArray = [];
                    itemStatsArrayLength = Object.keys(newData.preview_item.stats).length;
                    
                    for (i = 0; i < itemStatsArrayLength; i++){
                        itemStatsArray.push(newData.preview_item.stats[i].display.display_string)
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
                        sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.silver + " Silver");
                    } if (newData.preview_item.sell_price.display_strings.copper > 0){
                        sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.copper + " Copper");
                    } else {
                        console.log("Atleast one demonination of currency null")
                    }
                    sellPriceArraydisplay = sellPriceArray.join(); 
                    sellPriceArraydisplayFinal = sellPriceArraydisplay.replace("Sell Price:,", "Sell Price: ")

                    const lines = [
                        `${newData.name}`,
                        `${newData.preview_item.level.display_string}`,
                        `${newData.preview_item.binding.name}`, 
                        `${newData.inventory_type.name}`,
                        `${newData.item_subclass.name}`,
                        `${newData.preview_item.armor.display.display_string}`,
                        `${itemStatsArrayDisplay}`, 
                        `${newData.preview_item.durability.display_string}`,
                        `${newData.preview_item.requirements.level.display_string}`,
                        `${sellPriceArraydisplayFinal}`
                    ]   
                    
                    document.getElementById("tooltip-row-1").appendChild(tooltipImage)

                        lines.forEach((cell) => {
                        let node = document.createElement('td');
                        node.innerHTML = cell; 
                        node.className = 'tooltip-linez'
                        if (cell === newData.name){
                            document.getElementById("tooltip-row-1").appendChild(node)
                        } else if(cell === newData.preview_item.level.display_string){
                            document.getElementById("tooltip-row-1").appendChild(node)
                        } else if(cell === newData.preview_item.binding.name){
                            document.getElementById("tooltip-row-1").appendChild(node)
                        } else if(cell === newData.inventory_type.name){
                            document.getElementById("tooltip-row-2").appendChild(node)
                        } else if(cell === newData.item_subclass.name){
                            document.getElementById("tooltip-row-2").appendChild(node)
                        } else if(cell === newData.preview_item.armor.display.display_string){
                            document.getElementById("tooltip-row-2").appendChild(node)
                        } else if(cell === itemStatsArrayDisplay){
                            document.getElementById("tooltip-row-3").appendChild(node)
                        } else if(cell === newData.preview_item.durability.display_string){
                            document.getElementById("tooltip-row-3").appendChild(node)
                        } else if(cell === newData.preview_item.requirements.level.display_string){
                            document.getElementById("tooltip-row-3").appendChild(node)
                        } else if(cell === sellPriceArraydisplayFinal){
                            document.getElementById("tooltip-row-4").appendChild(node)
                        }  
                        else{
                            console.log("Failed to append")
                        }
                    })
                    styleItemName();
            }

            
            } /* End of Armour Parsing */
            
            /* Start of Quest Parsing */
            else if(newData.preview_item.item_class.name === "Quest"){
                

                    const lines = [
                        `${newData.name}`,
                        `${newData.item_class.name}`,
                        `${newData.level}`,
                    ]
                    document.getElementById("tooltip-row-1").appendChild(tooltipImage)

                    lines.forEach((cell) => {
                    let node = document.createElement('td');
                    node.innerHTML = cell; 
                    node.className = 'tooltip-linez'
                    if (cell === newData.name){
                        document.getElementById("tooltip-row-1").appendChild(node)
                    } else if(cell === newData.item_class.name){
                        document.getElementById("tooltip-row-2").appendChild(node)
                    } else if(cell === newData.level){
                        document.getElementById("tooltip-row-2").appendChild(node)
                    } 
                    else{
                        console.log("Failed to append")
                    }
                })
                
                styleItemName();
            } /* End of Quest Parsing */
            
            /* Start of Tradeskill, Consumable, & Recipe Parsing */
            else if(newData.preview_item.item_class.name === "Tradeskill" || "Consumable" || "Recipe"){
                console.log("Item has no bind-type");
                    let sellPriceArray = [];
                    let sellPriceArraydisplay;
                    let sellPriceArraydisplayFinal;
    
                    sellPriceArray.push(newData.preview_item.sell_price.display_strings.header);
                    if (newData.preview_item.sell_price.display_strings.gold > 0){
                        sellPriceArray.push(newData.preview_item.sell_price.display_strings.gold + " Gold");
                    } if (newData.preview_item.sell_price.display_strings.silver > 0){
                        sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.silver + " Silver");
                    } if (newData.preview_item.sell_price.display_strings.copper > 0){
                        sellPriceArray.push(" " + newData.preview_item.sell_price.display_strings.copper + " Copper");
                    } else {
                        console.log("Atleast one demonination of currency null")
                    }
                    sellPriceArraydisplay = sellPriceArray.join(); 
                    sellPriceArraydisplayFinal = sellPriceArraydisplay.replace("Sell Price:,", "Sell Price: ")

                    const lines = [
                        `${newData.name}`,
                        `${newData.item_class.name}`,
                        `${newData.preview_item.crafting_reagent}`,
                        `${newData.item_subclass.name}`,
                        `${newData.level}`,
                        `${sellPriceArraydisplayFinal}`
                    ]
                    document.getElementById("tooltip-row-1").appendChild(tooltipImage)

                    lines.forEach((cell) => {
                    let node = document.createElement('td');
                    node.innerHTML = cell; 
                    node.className = 'tooltip-linez'
                    if (cell === newData.name){
                        document.getElementById("tooltip-row-1").appendChild(node)
                    } else if(cell === newData.item_class.name){
                        document.getElementById("tooltip-row-2").appendChild(node)
                    } else if(cell === newData.preview_item.crafting_reagent){
                        document.getElementById("tooltip-row-2").appendChild(node)
                    } else if(cell === newData.item_subclass.name){
                        document.getElementById("tooltip-row-1").appendChild(node)
                    } else if(cell === newData.level){
                        document.getElementById("tooltip-row-3").appendChild(node)
                    } else if(cell === sellPriceArraydisplayFinal){
                        document.getElementById("tooltip-row-2").appendChild(node)
                    }   
                    else{
                        console.log("Failed to append")
                    }
                })

                styleItemName();
            } /* End of Tradeskill, Consumable, & Recipe Parsing */
          }       
        )}