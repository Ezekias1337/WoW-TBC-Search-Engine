"use strict";

function fetchItems(searchTerm) {
  fetch(
    `https://us.api.blizzard.com/data/wow/search/item?namespace=static-us&locale=en_US&id=&name.en_US=${searchTerm}&orderby=id&_page=1&str=&access_token=${oAuthToken}`
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
            `https://us.api.blizzard.com/data/wow/media/item/${user.data.id}?namespace=static-us&locale=en_US&access_token=${oAuthToken}`
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
          const lines = [
            `${user.data.name.en_US}`,
            `Item Class: ${user.data.item_class.name.en_US}`,
            `ID: ${user.data.id}`,
          ];
          for (let line of lines) {
            const p = document.createElement("td");
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

function toolTipItems() {
  document.querySelectorAll(".Items").forEach((item) => {
    item.addEventListener("click", getToolTipItems);
    item.addEventListener("mouseleave", clearToolTip);
  });
}

function searchExecuteItems() {
  let test = search();
  fetchItems(test);
  setTimeout(toolTipItems, 1000);
}

document
  .getElementById("searchBar")
  .addEventListener("submit", searchExecuteItems);
let urlItemString = window.location.search.slice(11);
document.getElementById("searchBar").value = urlItemString;

function getToolTipItems() {
  document.getElementById("fullToolTip").style.display = "table";
  let responseFromFetch;
  let ID;
  let ID2;
  let tooltipImage;

  tooltipImage = event.currentTarget.children[3].cloneNode(true);
  tooltipImage.id = "tooltipImageStyleItem";
  tooltipImage.style.verticalAlign = "top";
  tooltipImage.style.display = "inline-block";
  tooltipImage.style.marginLeft = "5px";
  tooltipImage.style.marginRight = "5px";

  ID = event.currentTarget.children[2].innerText.replace("ID: ", "");
  ID2 = event.currentTarget;
  fetch(
    `https://us.api.blizzard.com/data/wow/item/${ID}?namespace=static-classic-us&locale=en_US&access_token=${oAuthToken}`
  )
    .then((response) => response.json())
    .then((data) => (responseFromFetch = data))
    .then((newData) => {
      function styleItemName() {
        let poor;
        let common;
        let uncommon;
        let rare;
        let epic;
        let legendary;
        let tooltipTitle;

        poor = "#9d9d9d";
        common = "#ffffff";
        uncommon = "#1eff00";
        rare = "#0070dd";
        epic = "#a335ee";
        legendary = "#ff8000";

        console.log(newData.quality.name, "newData.quality.name");

        tooltipTitle = document.getElementById("tooltip-row-1");
        if (newData.quality.name === "Poor") {
          tooltipTitle.style.color = poor;
        } else if (newData.quality.name === "Common") {
          tooltipTitle.style.color = common;
        } else if (newData.quality.name === "Uncommon") {
          tooltipTitle.style.color = uncommon;
        } else if (newData.quality.name === "Rare") {
          tooltipTitle.style.color = rare;
        } else if (newData.quality.name === "Epic") {
          tooltipTitle.style.color = epic;
        } else if (newData.quality.name === "Legendary") {
          tooltipTitle.style.color = legendary;
        }
      }
      /* Start of Weapon Parsing */
      if (newData.item_class.name === "Weapon") {
        /* NEED TO ADD ERROR HANDLING FOR ARMOR WITH NO ARMOR, EG ITEM 19138 SULFURAS BAND */
        /* This else if statement is for Weapons with no stats, no bind type and no required attribute*/

        if (newData.sell_price != null) {
          
          //First wipe the slate clean by removing old tooltip
          let elementsToDeleteLength = document.getElementById("toolTipDisplay").children.length;
          
          for (let i = 0; i < elementsToDeleteLength; i++) {

            let rowToDeleteID = "tooltip-row-" + (i + 1).toString();
            document.getElementById(rowToDeleteID).remove();
        
        }

          // start logic of new tooltip
          let numOfLines = 0;
          let numOfStats = 0;
          let numOfEquipEffects = 0;
          let rowNumberRightHandCell1;
          let rowNumberRightHandCell2;

          /* Below series of if statements determines number of 
                rows the tooltip needs to have*/
          if (newData.preview_item.name) {
            numOfLines = numOfLines + 1;
          }
          if (newData.level) {
            numOfLines = numOfLines + 1;
          }
          if (newData.preview_item.binding) {
            numOfLines = numOfLines + 1;
          }
          if (newData.preview_item.unique_equipped) {
            numOfLines = numOfLines + 1;
          }

          if (newData.preview_item.inventory_type.name) {
            numOfLines = numOfLines + 1;
          }
          if (newData.preview_item.item_subclass.name) {
            rowNumberRightHandCell1 = numOfLines;
          }

          if (newData.preview_item.weapon.damage.display_string) {
            numOfLines = numOfLines + 1;
          }
          if (newData.preview_item.weapon.attack_speed.display_string) {
            rowNumberRightHandCell2 = numOfLines;
          }
          if (newData.preview_item.weapon.dps.display_string) {
            numOfLines = numOfLines + 1;
          }
          if (newData.preview_item.stats) {
            numOfLines = numOfLines + newData.preview_item.stats.length;
          }
          if (newData.preview_item.durability.display_string) {
            numOfLines = numOfLines + 1;
          }

          if (newData.preview_item.spells) {
            numOfLines = numOfLines + newData.preview_item.spells.length;
          }
          if (newData.preview_item.sell_price.display_strings) {
            numOfLines = numOfLines + 1;
            /*newData.preview_item.sell_price.display_strings.header
                    newData.preview_item.sell_price.display_strings.gold
                    newData.preview_item.sell_price.display_strings.silver
                    newData.preview_item.sell_price.display_strings.copper*/
          }

          console.log(numOfLines);

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
            tooltipTD.className =
              "tooltip-row-td " + "row-" + secondHalfIDString;

            document.getElementById("toolTipDisplay").appendChild(tooltipRow);
            document.getElementById(tooltipID).appendChild(tooltipTD);

            if (i === rowNumberRightHandCell1) {
              let tooltipTD2 = document.createElement("TD");
              tooltipTD2.style.paddingLeft = "0.3rem";
              tooltipTD2.style.paddingRight = "0.3rem";
              tooltipTD2.style.paddingBottom = "0.1rem";
              tooltipTD2.style.paddingTop = "0.1rem";
              tooltipTD2.style.borderTop = "0px solid #343a40";
              tooltipTD2.className =
                "tooltip-row-td " + "row-" + secondHalfIDString;

              document.getElementById(tooltipID).appendChild(tooltipTD2);
            }

            if (i === rowNumberRightHandCell2) {
              let tooltipTD3 = document.createElement("TD");
              tooltipTD3.style.paddingLeft = "0.3rem";
              tooltipTD3.style.paddingRight = "0.3rem";
              tooltipTD3.style.paddingBottom = "0.1rem";
              tooltipTD3.style.paddingTop = "0.1rem";
              tooltipTD3.style.borderTop = "0px solid #343a40";
              tooltipTD3.className =
                "tooltip-row-td " + "row-" + secondHalfIDString;

              document.getElementById(tooltipID).appendChild(tooltipTD3);
            }

            if(i === numOfLines + 1 && newData.preview_item.sell_price){
                
              let sellPriceElement = document.getElementById(tooltipID);
              sellPriceElement.innerText = "  Sell Price: ";
              sellPriceElement.style.paddingLeft = "3px"
              console.log(sellPriceElement);

              let goldSpan = document.createElement("SPAN");
              goldSpan.className = "gold";
              goldSpan.innerText = "0";

              let silverSpan = document.createElement("SPAN");
              silverSpan.className = "silver";
              silverSpan.innerText = "0";

              let copperSpan = document.createElement("SPAN");
              copperSpan.className = "copper";
              copperSpan.innerText = "0";

              sellPriceElement.appendChild(goldSpan);
              sellPriceElement.appendChild(silverSpan);
              sellPriceElement.appendChild(copperSpan);
              console.log("Money amounts added to cell!!")
            }
            

          }



          

          function appendDataToRows() {
            // Determine number of rows dedicates to stats/on-equip bonuses
            if (newData.preview_item.stats) {
              numOfStats = newData.preview_item.stats.length;
            }
            if (newData.preview_item.spells) {
              numOfEquipEffects = newData.preview_item.spells.length;
            }
            //Variable keeps track of row
            let counter = 1;

            if (newData.preview_item.name) {
              let cellToBeChanged = document.getElementById(
                "tooltip-row-" + counter.toString()
              ).children[0];
              cellToBeChanged.innerText = newData.preview_item.name;

              let itemQuality = newData.preview_item.quality.name;
              cellToBeChanged.className =
                cellToBeChanged.className + " item-name-" + itemQuality;

              counter = counter + 1;
            }
            if (newData.level) {
              let cellToBeChanged = document.getElementById(
                "tooltip-row-" + counter.toString()
              ).children[0];
              cellToBeChanged.innerText = "Item Level " + newData.level;
              cellToBeChanged.className =
                cellToBeChanged.className + " item-level";

              counter = counter + 1;
            }
            if (newData.preview_item.binding) {
              let cellToBeChanged = document.getElementById(
                "tooltip-row-" + counter.toString()
              ).children[0];

              cellToBeChanged.innerText = newData.preview_item.binding.name;
              cellToBeChanged.className =
                cellToBeChanged.className + " bind-type";
              counter = counter + 1;
            }
            if (newData.preview_item.unique_equipped) {
              let cellToBeChanged = document.getElementById(
                "tooltip-row-" + counter.toString()
              ).children[0];

              cellToBeChanged.innerText = newData.preview_item.unique_equipped;
              cellToBeChanged.className =
                cellToBeChanged.className + " unique-equip";
              counter = counter + 1;
            }
            if (newData.preview_item.inventory_type.name) {
              let cellToBeChanged = document.getElementById(
                "tooltip-row-" + counter.toString()
              ).children[0];

              cellToBeChanged.innerText = newData.preview_item.inventory_type.name;
              cellToBeChanged.className =
                cellToBeChanged.className + " inventory-type";
            }
            if (newData.preview_item.item_subclass.name) {
              let cellToBeChanged = document.getElementById(
                "tooltip-row-" + counter.toString()
              ).children[1];

              cellToBeChanged.innerText = newData.preview_item.item_subclass.name;
              cellToBeChanged.className =
                cellToBeChanged.className + " subclass-name";
              cellToBeChanged.style.position = "absolute";
              cellToBeChanged.style.right = "15%";
                
              counter = counter + 1;
            }
            if (newData.preview_item.weapon.damage.display_string) {
              let cellToBeChanged = document.getElementById(
                "tooltip-row-" + counter.toString()
              ).children[0];

              cellToBeChanged.innerText = newData.preview_item.weapon.damage.display_string;
              cellToBeChanged.className =
                cellToBeChanged.className + " damage-range";
            }
            if (newData.preview_item.weapon.attack_speed.display_string) {
              let cellToBeChanged = document.getElementById(
                "tooltip-row-" + counter.toString()
              ).children[1];

              cellToBeChanged.innerText = newData.preview_item.weapon.attack_speed.display_string;
              cellToBeChanged.className =
                cellToBeChanged.className + " weapon-speed";
              cellToBeChanged.style.position = "absolute";
              cellToBeChanged.style.right = "15%";
                
              counter = counter + 1;
            }
            if (newData.preview_item.weapon.dps.display_string) {
              let cellToBeChanged = document.getElementById(
                "tooltip-row-" + counter.toString()
              ).children[0];

              cellToBeChanged.innerText = newData.preview_item.weapon.dps.display_string;
              cellToBeChanged.className =
                cellToBeChanged.className + " DPS";

              counter = counter + 1;
            }
            if (numOfStats > 0) {
              for (let i = 0; i < numOfStats; i++) {
                let cellToBeChanged = document.getElementById(
                  "tooltip-row-" + counter.toString()
                ).children[0];
  
                cellToBeChanged.innerText = newData.preview_item.stats[i].display.display_string;
                cellToBeChanged.className =
                  cellToBeChanged.className + " stat";

                counter = counter + 1;
              }
            }

            if (newData.preview_item.durability.display_string) {
              let cellToBeChanged = document.getElementById(
                "tooltip-row-" + counter.toString()
              ).children[0];

              cellToBeChanged.innerText = newData.preview_item.durability.display_string;
              cellToBeChanged.className =
                cellToBeChanged.className + " durability";

              counter = counter + 1;
            }

            if (newData.required_level) {
              let cellToBeChanged = document.getElementById(
                "tooltip-row-" + counter.toString()
              ).children[0];

              cellToBeChanged.innerText = "Requires Level " + newData.required_level;
              cellToBeChanged.className =
                cellToBeChanged.className + " required-level";

              counter = counter + 1;
            }

            if (numOfEquipEffects > 0) {
              for (let i = 0; i < numOfEquipEffects; i++) {
                let cellToBeChanged = document.getElementById(
                  "tooltip-row-" + counter.toString()
                ).children[0];
  
                cellToBeChanged.innerText = newData.preview_item.spells[i].description;
                cellToBeChanged.className =
                  cellToBeChanged.className + " equip-spell";

                counter = counter + 1;
              }
            }

            if (newData.preview_item.sell_price) {

              let cellToBeChanged1 = document.getElementsByClassName("gold")[0];
              let cellToBeChanged2 = document.getElementsByClassName("silver")[0];
              let cellToBeChanged3 = document.getElementsByClassName("copper")[0];

              cellToBeChanged1.innerText = newData.preview_item.sell_price.display_strings.gold;
              cellToBeChanged2.innerText = newData.preview_item.sell_price.display_strings.silver;
              cellToBeChanged3.innerText = newData.preview_item.sell_price.display_strings.copper;

              //newData.preview_item.sell_price.display_strings.gold
            }



          }

          appendDataToRows();

          //let lines = [];

          //Here determine number of rows dedicated to stats/on-equip bonuses

          /*if (newData.preview_item.stats) {
            numOfStats = newData.preview_item.stats.length;
          }

          if (newData.preview_item.spells) {
            numOfEquipEffects = newData.preview_item.spells.length;
          }

          //Here Building array called lines, to subsequently loop through

          if (newData.preview_item.name) {
            lines.push(newData.preview_item.name);
          }
          if (newData.level) {
            lines.push(newData.level);
          }
          if (newData.preview_item.binding.name) {
            lines.push(newData.preview_item.binding.name);
          }
          if (newData.preview_item.unique_equipped) {
            lines.push(newData.preview_item.unique_equipped);
          }
          if (newData.preview_item.inventory_type.name) {
            lines.push(newData.preview_item.inventory_type.name);
          }
          if (newData.preview_item.item_subclass.name) {
            lines.push(newData.preview_item.item_subclass.name);
          }
          if (newData.preview_item.weapon.damage.display_string) {
            lines.push(newData.preview_item.weapon.damage.display_string);
          }
          if (newData.preview_item.weapon.attack_speed.display_string) {
            lines.push(newData.preview_item.weapon.attack_speed.display_string);
          }
          if (newData.preview_item.weapon.dps.display_string) {
            lines.push(newData.preview_item.weapon.dps.display_string);
          }

          //Here push all stat elements to array

          for (let i = 0; i < numOfStats; i++) {
            lines.push(newData.preview_item.stats[i].display.display_string);
          }

          if (newData.preview_item.durability.display_string) {
            lines.push(newData.preview_item.durability.display_string);
          }

          for (let i = 0; i < numOfEquipEffects; i++) {
            lines.push(newData.preview_item.spells[i].description);
          }

          if (newData.preview_item.sell_price.display_strings) {
            //lines.push();
            newData.preview_item.sell_price.display_strings.header
                    newData.preview_item.sell_price.display_strings.gold
                    newData.preview_item.sell_price.display_strings.silver
                    newData.preview_item.sell_price.display_strings.copper
          } 

          console.log(lines);

          for (let i = 0; i < lines.length + 1; i++) {
            
            if(){
              document.getElementsByClassName("tooltip-row-td")[i].innerText = lines[i];
            } else if(lines[i] === "Axe" || lines[i] === "Bow" || lines[i] === "Crossbow" || lines[i] === "Dagger" || lines[i] === "Fishing Pole" || lines[i] === "Fist Weapon" || lines[i] === "Gun" || lines[i] === "Mace" || lines[i] === "Polearm" || lines[i] === "Stave" || lines[i] === "Sword" || lines[i] === "Thrown" || lines[i] === "Wand"){
              document.getElementsByClassName("tooltip-row-td")[i - 1].innerText = lines[i];
            }
            


          }*/

          let tooltipHeader = document.getElementById("fullToolTip");

          document
            .getElementById("fullToolTip")
            .insertBefore(tooltipImage, tooltipHeader.childNodes[0]);

          /*const lines = [
                    `${newData.name}`,
                    `${newData.level}`, 
                    `${newData.inventory_type.name}`,
                    `${newData.item_subclass.name}`,
                    `${newData.preview_item.weapon.damage.display_string}`,
                    `${newData.preview_item.weapon.attack_speed.display_string}`,
                    `${newData.preview_item.weapon.dps.display_string}`,
                    `${newData.preview_item.durability.display_string}`,
                    `${sellPriceArraydisplayFinal}`
                ]*/

          //document.getElementById("tooltip-row-1").appendChild(tooltipImage)

          /*lines.forEach((cell) => {
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
            }) */
          //styleItemName();
        } else if (
          newData.preview_item.binding == null &&
          newData.preview_item.stats == null
        ) {
          console.log("Item has no bind-type");
          let sellPriceArray = [];
          let sellPriceArraydisplay;
          let sellPriceArraydisplayFinal;

          sellPriceArray.push(
            newData.preview_item.sell_price.display_strings.header
          );
          if (newData.preview_item.sell_price.display_strings.gold > 0) {
            sellPriceArray.push(
              newData.preview_item.sell_price.display_strings.gold + " Gold"
            );
          }
          if (newData.preview_item.sell_price.display_strings.silver > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.silver +
                " Silver"
            );
          }
          if (newData.preview_item.sell_price.display_strings.copper > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.copper +
                " Copper"
            );
          } else {
            console.log("Atleast one demonination of currency null");
          }
          sellPriceArraydisplay = sellPriceArray.join();
          sellPriceArraydisplayFinal = sellPriceArraydisplay.replace(
            "Sell Price:,",
            "Sell Price: "
          );

          if (newData.preview_item.requirements.level.display_string === null) {
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
              `${sellPriceArraydisplayFinal}`,
            ];
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
            `${sellPriceArraydisplayFinal}`,
          ];

          document.getElementById("tooltip-row-1").appendChild(tooltipImage);

          lines.forEach((cell) => {
            let node = document.createElement("td");
            node.innerHTML = cell;
            node.className = "tooltip-linez";
            if (cell === newData.name) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.preview_item.level.display_string) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.inventory_type.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (cell === newData.item_subclass.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (
              cell === newData.preview_item.weapon.damage.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.weapon.attack_speed.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.weapon.dps.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.durability.display_string
            ) {
              document.getElementById("tooltip-row-4").appendChild(node);
            } else if (
              cell === newData.preview_item.requirements.level.display_string
            ) {
              document.getElementById("tooltip-row-4").appendChild(node);
            } else if (cell === sellPriceArraydisplayFinal) {
              document.getElementById("tooltip-row-4").appendChild(node);
            } else {
              console.log("Failed to append");
            }
          });
          //styleItemName();
        } else if (newData.preview_item.stats == null) {
          /* ------------------------------------------------------------------------------- */

          /* This else if statement is for Weapons with no stats, no required level but with a bind type */
          console.log("Item has no stats");
          let sellPriceArray = [];
          let sellPriceArraydisplay;
          let sellPriceArraydisplayFinal;

          sellPriceArray.push(
            newData.preview_item.sell_price.display_strings.header
          );
          if (newData.preview_item.sell_price.display_strings.gold > 0) {
            sellPriceArray.push(
              newData.preview_item.sell_price.display_strings.gold + " Gold"
            );
          }
          if (newData.preview_item.sell_price.display_strings.silver > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.silver +
                " Silver"
            );
          }
          if (newData.preview_item.sell_price.display_strings.copper > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.copper +
                " Copper"
            );
          } else {
            console.log("Atleast one demonination of currency null");
          }
          sellPriceArraydisplay = sellPriceArray.join();
          sellPriceArraydisplayFinal = sellPriceArraydisplay.replace(
            "Sell Price:,",
            "Sell Price: "
          );

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
            `${sellPriceArraydisplayFinal}`,
          ];

          document.getElementById("tooltip-row-1").appendChild(tooltipImage);

          lines.forEach((cell) => {
            let node = document.createElement("td");
            node.innerHTML = cell;
            node.className = "tooltip-linez";
            if (cell === newData.name) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.preview_item.level.display_string) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.preview_item.binding.name) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.inventory_type.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (cell === newData.item_subclass.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (
              cell === newData.preview_item.weapon.damage.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.weapon.attack_speed.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.weapon.dps.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.durability.display_string
            ) {
              document.getElementById("tooltip-row-4").appendChild(node);
            } else if (cell === sellPriceArraydisplayFinal) {
              document.getElementById("tooltip-row-4").appendChild(node);
            } else {
              console.log("Failed to append");
            }
          });
          //styleItemName();
        } else if (newData.preview_item.stats == null) {
          /* -------------------------------------------------------------------------------- */

          /* This else if statement is for Weapons with no stats, but with a bind type */
          console.log("Item has no stats");
          let sellPriceArray = [];
          let sellPriceArraydisplay;
          let sellPriceArraydisplayFinal;

          sellPriceArray.push(
            newData.preview_item.sell_price.display_strings.header
          );
          if (newData.preview_item.sell_price.display_strings.gold > 0) {
            sellPriceArray.push(
              newData.preview_item.sell_price.display_strings.gold + " Gold"
            );
          }
          if (newData.preview_item.sell_price.display_strings.silver > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.silver +
                " Silver"
            );
          }
          if (newData.preview_item.sell_price.display_strings.copper > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.copper +
                " Copper"
            );
          } else {
            console.log("Atleast one demonination of currency null");
          }
          sellPriceArraydisplay = sellPriceArray.join();
          sellPriceArraydisplayFinal = sellPriceArraydisplay.replace(
            "Sell Price:,",
            "Sell Price: "
          );

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
            `${sellPriceArraydisplayFinal}`,
          ];
          document.getElementById("tooltip-row-1").appendChild(tooltipImage);

          lines.forEach((cell) => {
            let node = document.createElement("td");
            node.innerHTML = cell;
            node.className = "tooltip-linez";
            if (cell === newData.name) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.preview_item.level.display_string) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.preview_item.binding.name) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.inventory_type.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (cell === newData.item_subclass.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (
              cell === newData.preview_item.weapon.damage.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.weapon.attack_speed.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.weapon.dps.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.durability.display_string
            ) {
              document.getElementById("tooltip-row-4").appendChild(node);
            } else if (
              cell === newData.preview_item.requirements.level.display_string
            ) {
              document.getElementById("tooltip-row-4").appendChild(node);
            } else if (cell === sellPriceArraydisplayFinal) {
              document.getElementById("tooltip-row-4").appendChild(node);
            } else {
              console.log("Failed to append");
            }
          });
          //styleItemName();
        } else if (newData.preview_item.requirements == null) {
          /* This else if statement is for weapons with no required level */
          let itemStatsArrayLength;
          let i;
          let itemStatsArray = [];
          itemStatsArrayLength = Object.keys(newData.preview_item.stats).length;

          for (i = 0; i < itemStatsArrayLength; i++) {
            itemStatsArray.push(
              newData.preview_item.stats[i].display.display_string
            );
          }
          let itemStatsArrayDisplay;
          itemStatsArrayDisplay = itemStatsArray.toString();

          let sellPriceArray = [];
          let sellPriceArraydisplay;
          let sellPriceArraydisplayFinal;

          sellPriceArray.push(
            newData.preview_item.sell_price.display_strings.header
          );
          if (newData.preview_item.sell_price.display_strings.gold > 0) {
            sellPriceArray.push(
              newData.preview_item.sell_price.display_strings.gold + " Gold"
            );
          }
          if (newData.preview_item.sell_price.display_strings.silver > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.silver +
                " Silver"
            );
          }
          if (newData.preview_item.sell_price.display_strings.copper > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.copper +
                " Copper"
            );
          } else {
            console.log("Atleast one demonination of currency null");
          }
          sellPriceArraydisplay = sellPriceArray.join();
          sellPriceArraydisplayFinal = sellPriceArraydisplay.replace(
            "Sell Price:,",
            "Sell Price: "
          );

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
            `${sellPriceArraydisplayFinal}`,
          ];

          document.getElementById("tooltip-row-1").appendChild(tooltipImage);

          lines.forEach((cell) => {
            let node = document.createElement("td");
            node.innerHTML = cell;
            node.className = "tooltip-linez";
            if (cell === newData.name) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.preview_item.level.display_string) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.preview_item.binding.name) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.inventory_type.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (cell === newData.item_subclass.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (
              cell === newData.preview_item.weapon.damage.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.weapon.attack_speed.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.weapon.dps.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (cell === itemStatsArrayDisplay) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (
              cell === newData.preview_item.durability.display_string
            ) {
              document.getElementById("tooltip-row-4").appendChild(node);
            } else if (cell === sellPriceArraydisplayFinal) {
              document.getElementById("tooltip-row-4").appendChild(node);
            } else {
              console.log("Failed to append");
            }
          });
          //styleItemName();
        } else {
          /* This else statement is for Weapons with stats and bind type */
          let itemStatsArrayLength;
          let i;
          let itemStatsArray = [];
          itemStatsArrayLength = Object.keys(newData.preview_item.stats).length;

          for (i = 0; i < itemStatsArrayLength; i++) {
            itemStatsArray.push(
              newData.preview_item.stats[i].display.display_string
            );
          }
          let itemStatsArrayDisplay;
          itemStatsArrayDisplay = itemStatsArray.toString();

          let sellPriceArray = [];
          let sellPriceArraydisplay;
          let sellPriceArraydisplayFinal;

          sellPriceArray.push(
            newData.preview_item.sell_price.display_strings.header
          );
          if (newData.preview_item.sell_price.display_strings.gold > 0) {
            sellPriceArray.push(
              newData.preview_item.sell_price.display_strings.gold + " Gold"
            );
          }
          if (newData.preview_item.sell_price.display_strings.silver > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.silver +
                " Silver"
            );
          }
          if (newData.preview_item.sell_price.display_strings.copper > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.copper +
                " Copper"
            );
          } else {
            console.log("Atleast one demonination of currency null");
          }
          sellPriceArraydisplay = sellPriceArray.join();
          sellPriceArraydisplayFinal = sellPriceArraydisplay.replace(
            "Sell Price:,",
            "Sell Price: "
          );

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
            `${sellPriceArraydisplayFinal}`,
          ];

          document.getElementById("tooltip-row-1").appendChild(tooltipImage);

          lines.forEach((cell) => {
            let node = document.createElement("td");
            node.innerHTML = cell;
            node.className = "tooltip-linez";
            if (cell === newData.name) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.preview_item.level.display_string) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.preview_item.binding.name) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.inventory_type.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (cell === newData.item_subclass.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (
              cell === newData.preview_item.weapon.damage.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.weapon.attack_speed.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.weapon.dps.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (cell === itemStatsArrayDisplay) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (
              cell === newData.preview_item.durability.display_string
            ) {
              document.getElementById("tooltip-row-4").appendChild(node);
            } else if (
              cell === newData.preview_item.requirements.level.display_string
            ) {
              document.getElementById("tooltip-row-4").appendChild(node);
            } else if (cell === sellPriceArraydisplayFinal) {
              document.getElementById("tooltip-row-4").appendChild(node);
            } else {
              console.log("Failed to append");
            }
          });
        }
        //styleItemName();
      } /* End of Weapon Parsing */ else if (
        /*Start of Armour Parsing */
        newData.preview_item.item_class.name === "Armor"
      ) {
        /* This if statement is for low level Armour, with no stats or bind type */
        if (newData.preview_item.binding == null) {
          console.log("Item has no bind-type");
          let sellPriceArray = [];
          let sellPriceArraydisplay;
          let sellPriceArraydisplayFinal;

          sellPriceArray.push(
            newData.preview_item.sell_price.display_strings.header
          );
          if (newData.preview_item.sell_price.display_strings.gold > 0) {
            sellPriceArray.push(
              newData.preview_item.sell_price.display_strings.gold + " Gold"
            );
          }
          if (newData.preview_item.sell_price.display_strings.silver > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.silver +
                " Silver"
            );
          }
          if (newData.preview_item.sell_price.display_strings.copper > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.copper +
                " Copper"
            );
          } else {
            console.log("Atleast one demonination of currency null");
          }
          sellPriceArraydisplay = sellPriceArray.join();
          sellPriceArraydisplayFinal = sellPriceArraydisplay.replace(
            "Sell Price:,",
            "Sell Price: "
          );

          const lines = [
            `${newData.name}`,
            `${newData.preview_item.level.display_string}`,
            `${newData.inventory_type.name}`,
            `${newData.item_subclass.name}`,
            `${newData.preview_item.armor.display.display_string}`,
            `${newData.preview_item.durability.display_string}`,
            `${newData.preview_item.requirements.level.display_string}`,
            `${sellPriceArraydisplayFinal}`,
          ];

          document.getElementById("tooltip-row-1").appendChild(tooltipImage);

          lines.forEach((cell) => {
            let node = document.createElement("td");
            node.innerHTML = cell;
            node.className = "tooltip-linez";
            if (cell === newData.name) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.preview_item.level.display_string) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.inventory_type.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (cell === newData.item_subclass.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (
              cell === newData.preview_item.armor.display.display_string
            ) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (
              cell === newData.preview_item.durability.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.requirements.level.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (cell === sellPriceArraydisplayFinal) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else {
              console.log("Failed to append");
            }
          });

          //styleItemName();
        } else if (newData.preview_item.stats == null) {
          /* This else if statement is for Armour with no stats, but with a bind type */
          console.log("Item has no stats");
          let sellPriceArray = [];
          let sellPriceArraydisplay;
          let sellPriceArraydisplayFinal;

          sellPriceArray.push(
            newData.preview_item.sell_price.display_strings.header
          );
          if (newData.preview_item.sell_price.display_strings.gold > 0) {
            sellPriceArray.push(
              newData.preview_item.sell_price.display_strings.gold + " Gold"
            );
          }
          if (newData.preview_item.sell_price.display_strings.silver > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.silver +
                " Silver"
            );
          }
          if (newData.preview_item.sell_price.display_strings.copper > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.copper +
                " Copper"
            );
          } else {
            console.log("Atleast one demonination of currency null");
          }
          sellPriceArraydisplay = sellPriceArray.join();
          sellPriceArraydisplayFinal = sellPriceArraydisplay.replace(
            "Sell Price:,",
            "Sell Price: "
          );

          const lines = [
            `${newData.name}`,
            `${newData.preview_item.level.display_string}`,
            `${newData.preview_item.binding.name}`,
            `${newData.inventory_type.name}`,
            `${newData.item_subclass.name}`,
            `${newData.preview_item.armor.display.display_string}`,
            `${newData.preview_item.durability.display_string}`,
            `${newData.preview_item.requirements.level.display_string}`,
            `${sellPriceArraydisplayFinal}`,
          ];

          document.getElementById("tooltip-row-1").appendChild(tooltipImage);

          lines.forEach((cell) => {
            let node = document.createElement("td");
            node.innerHTML = cell;
            node.className = "tooltip-linez";
            if (cell === newData.name) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.preview_item.level.display_string) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.preview_item.binding.name) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.inventory_type.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (cell === newData.item_subclass.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (
              cell === newData.preview_item.armor.display.display_string
            ) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (
              cell === newData.preview_item.durability.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.requirements.level.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (cell === sellPriceArraydisplayFinal) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else {
              console.log("Failed to append");
            }
          });
          //styleItemName();
        } else if (newData.preview_item.requirements == null) {
          /* This else if statement is for Armour with no required level */
          let itemStatsArrayLength;
          let i;
          let itemStatsArray = [];
          itemStatsArrayLength = Object.keys(newData.preview_item.stats).length;

          for (i = 0; i < itemStatsArrayLength; i++) {
            itemStatsArray.push(
              newData.preview_item.stats[i].display.display_string
            );
          }
          let itemStatsArrayDisplay;
          itemStatsArrayDisplay = itemStatsArray.toString();

          let sellPriceArray = [];
          let sellPriceArraydisplay;
          let sellPriceArraydisplayFinal;

          sellPriceArray.push(
            newData.preview_item.sell_price.display_strings.header
          );
          if (newData.preview_item.sell_price.display_strings.gold > 0) {
            sellPriceArray.push(
              newData.preview_item.sell_price.display_strings.gold + " Gold"
            );
          }
          if (newData.preview_item.sell_price.display_strings.silver > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.silver +
                " Silver"
            );
          }
          if (newData.preview_item.sell_price.display_strings.copper > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.copper +
                " Copper"
            );
          } else {
            console.log("Atleast one demonination of currency null");
          }
          sellPriceArraydisplay = sellPriceArray.join();
          sellPriceArraydisplayFinal = sellPriceArraydisplay.replace(
            "Sell Price:,",
            "Sell Price: "
          );

          const lines = [
            `${newData.name}`,
            `${newData.preview_item.level.display_string}`,
            `${newData.preview_item.binding.name}`,
            `${newData.inventory_type.name}`,
            `${newData.item_subclass.name}`,
            `${newData.preview_item.armor.display.display_string}`,
            `${itemStatsArrayDisplay}`,
            `${newData.preview_item.durability.display_string}`,
            `${sellPriceArraydisplayFinal}`,
          ];

          document.getElementById("tooltip-row-1").appendChild(tooltipImage);

          lines.forEach((cell) => {
            let node = document.createElement("td");
            node.innerHTML = cell;
            node.className = "tooltip-linez";
            if (cell === newData.name) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.preview_item.level.display_string) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.preview_item.binding.name) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.inventory_type.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (cell === newData.item_subclass.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (
              cell === newData.preview_item.armor.display.display_string
            ) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (cell === itemStatsArrayDisplay) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.durability.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (cell === sellPriceArraydisplayFinal) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else {
              console.log("Failed to append");
            }
          });

          //styleItemName();
        } else {
          /* This else statement is for Armour with stats and bind type */
          let itemStatsArrayLength;
          let i;
          let itemStatsArray = [];
          itemStatsArrayLength = Object.keys(newData.preview_item.stats).length;

          for (i = 0; i < itemStatsArrayLength; i++) {
            itemStatsArray.push(
              newData.preview_item.stats[i].display.display_string
            );
          }
          let itemStatsArrayDisplay;
          itemStatsArrayDisplay = itemStatsArray.toString();

          let sellPriceArray = [];
          let sellPriceArraydisplay;
          let sellPriceArraydisplayFinal;

          sellPriceArray.push(
            newData.preview_item.sell_price.display_strings.header
          );
          if (newData.preview_item.sell_price.display_strings.gold > 0) {
            sellPriceArray.push(
              newData.preview_item.sell_price.display_strings.gold + " Gold"
            );
          }
          if (newData.preview_item.sell_price.display_strings.silver > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.silver +
                " Silver"
            );
          }
          if (newData.preview_item.sell_price.display_strings.copper > 0) {
            sellPriceArray.push(
              " " +
                newData.preview_item.sell_price.display_strings.copper +
                " Copper"
            );
          } else {
            console.log("Atleast one demonination of currency null");
          }
          sellPriceArraydisplay = sellPriceArray.join();
          sellPriceArraydisplayFinal = sellPriceArraydisplay.replace(
            "Sell Price:,",
            "Sell Price: "
          );

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
            `${sellPriceArraydisplayFinal}`,
          ];

          document.getElementById("tooltip-row-1").appendChild(tooltipImage);

          lines.forEach((cell) => {
            let node = document.createElement("td");
            node.innerHTML = cell;
            node.className = "tooltip-linez";
            if (cell === newData.name) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.preview_item.level.display_string) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.preview_item.binding.name) {
              document.getElementById("tooltip-row-1").appendChild(node);
            } else if (cell === newData.inventory_type.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (cell === newData.item_subclass.name) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (
              cell === newData.preview_item.armor.display.display_string
            ) {
              document.getElementById("tooltip-row-2").appendChild(node);
            } else if (cell === itemStatsArrayDisplay) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.durability.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (
              cell === newData.preview_item.requirements.level.display_string
            ) {
              document.getElementById("tooltip-row-3").appendChild(node);
            } else if (cell === sellPriceArraydisplayFinal) {
              document.getElementById("tooltip-row-4").appendChild(node);
            } else {
              console.log("Failed to append");
            }
          });
          //styleItemName();
        }
      } /* End of Armour Parsing */ else if (
        /* Start of Quest Parsing */
        newData.preview_item.item_class.name === "Quest"
      ) {
        const lines = [
          `${newData.name}`,
          `${newData.item_class.name}`,
          `${newData.level}`,
        ];
        document.getElementById("tooltip-row-1").appendChild(tooltipImage);

        lines.forEach((cell) => {
          let node = document.createElement("td");
          node.innerHTML = cell;
          node.className = "tooltip-linez";
          if (cell === newData.name) {
            document.getElementById("tooltip-row-1").appendChild(node);
          } else if (cell === newData.item_class.name) {
            document.getElementById("tooltip-row-2").appendChild(node);
          } else if (cell === newData.level) {
            document.getElementById("tooltip-row-2").appendChild(node);
          } else {
            console.log("Failed to append");
          }
        });

        //styleItemName();
      } /* End of Quest Parsing */ else if (
        /* Start of Tradeskill, Consumable, & Recipe Parsing */
        newData.preview_item.item_class.name === "Tradeskill" ||
        "Consumable" ||
        "Recipe"
      ) {
        console.log("Item has no bind-type");
        let sellPriceArray = [];
        let sellPriceArraydisplay;
        let sellPriceArraydisplayFinal;

        sellPriceArray.push(
          newData.preview_item.sell_price.display_strings.header
        );
        if (newData.preview_item.sell_price.display_strings.gold > 0) {
          sellPriceArray.push(
            newData.preview_item.sell_price.display_strings.gold + " Gold"
          );
        }
        if (newData.preview_item.sell_price.display_strings.silver > 0) {
          sellPriceArray.push(
            " " +
              newData.preview_item.sell_price.display_strings.silver +
              " Silver"
          );
        }
        if (newData.preview_item.sell_price.display_strings.copper > 0) {
          sellPriceArray.push(
            " " +
              newData.preview_item.sell_price.display_strings.copper +
              " Copper"
          );
        } else {
          console.log("Atleast one demonination of currency null");
        }
        sellPriceArraydisplay = sellPriceArray.join();
        sellPriceArraydisplayFinal = sellPriceArraydisplay.replace(
          "Sell Price:,",
          "Sell Price: "
        );

        const lines = [
          `${newData.name}`,
          `${newData.item_class.name}`,
          `${newData.preview_item.crafting_reagent}`,
          `${newData.item_subclass.name}`,
          `${newData.level}`,
          `${sellPriceArraydisplayFinal}`,
        ];
        document.getElementById("tooltip-row-1").appendChild(tooltipImage);

        lines.forEach((cell) => {
          let node = document.createElement("td");
          node.innerHTML = cell;
          node.className = "tooltip-linez";
          if (cell === newData.name) {
            document.getElementById("tooltip-row-1").appendChild(node);
          } else if (cell === newData.item_class.name) {
            document.getElementById("tooltip-row-2").appendChild(node);
          } else if (cell === newData.preview_item.crafting_reagent) {
            document.getElementById("tooltip-row-2").appendChild(node);
          } else if (cell === newData.item_subclass.name) {
            document.getElementById("tooltip-row-1").appendChild(node);
          } else if (cell === newData.level) {
            document.getElementById("tooltip-row-3").appendChild(node);
          } else if (cell === sellPriceArraydisplayFinal) {
            document.getElementById("tooltip-row-2").appendChild(node);
          } else {
            console.log("Failed to append");
          }
        });

        //styleItemName();
      } /* End of Tradeskill, Consumable, & Recipe Parsing */
    });
}
