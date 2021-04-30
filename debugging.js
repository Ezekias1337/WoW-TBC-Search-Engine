'use strict';

let responseFromFetch;

fetch("https://us.api.blizzard.com/data/wow/search/creature?namespace=static-us&locale=en_US&name.en_US=Dragon&orderby=id&_page=1&access_token=USspHQ7WbOLP6Dx1gFffufjys8qcJd1wUW")
    .then(res => res.json())
    .then(data => responseFromFetch = data)


    /* This is the way I was able to retrieve the display ID
    
        responseFromFetch.results[0].data.creature_displays[0]
    
    */
       
/*  function getToolTipID() {
        let ID;
        let ID2;
        ID = (event.currentTarget.children[5].innerText.replace("ID: ", ""));
        ID2 = (event.currentTarget);
            console.log(ID);
            fetch(`https://us.api.blizzard.com/data/wow/item/${ID}?namespace=static-us&locale=en_US&access_token=${oAuthToken}`)
            .then(response => response.json())
            .then((user) => {
                console.log(user);
                let lineContent;
                let statsArray; 
                try {
                    statsArray = user.preview_item.stats[0]
                    console.log(statsArray)
                } catch (error) {
                    console.log(error)
                } 
                console.table(statsArray)
                const lines = [
                    `${user.name}`,
                    `${user.preview_item.level.value}`,
                    `${user.preview_item.binding.name}`, 
                    `${user.inventory_type.name}`,
                    `${user.item_subclass.name}`,
                    `${user.preview_item.weapon.damage.display_string}`,
                    `${user.preview_item.weapon.attack_speed.display_string}`,
                    `${user.preview_item.weapon.dps.display_string}`,
                    `${user.preview_item.stats[0].display.display_string}`, 
                    `${user.preview_item.durability.display_string}`,
                    `${user.required_level}`,
                    `${user.sell_price}`
                ] 
                lineContent = user.inventory_type.name;
                let node = document.createElement('tr');
                node.innerHTML = lines;
                
                document.getElementById("toolTipDisplay").appendChild(node);
            }); 

    } */


   /* SO FAR THIS WORKS OMG 
    function getToolTipID() {
        let responseFromFetch;
        let ID;
        let ID2;
        ID = (event.currentTarget.children[5].innerText.replace("ID: ", ""));
        ID2 = (event.currentTarget);
         fetch(`https://us.api.blizzard.com/data/wow/item/${ID}?namespace=static-us&locale=en_US&access_token=${oAuthToken}`)
             .then(response => response.json())
             .then(data => responseFromFetch = data)
             .then(newData => console.log(newData.preview_item.stats[0].display.display_string))
 
     } */

     /* 
     This is an alternate version of the function, wanting to save before trying
     Schiller's solution - me Apr 29th at midnight
     function getToolTipID() {
        let responseFromFetch;
        let ID;
        let ID2;
        ID = (event.currentTarget.children[5].innerText.replace("ID: ", ""));
        ID2 = (event.currentTarget);
         fetch(`https://us.api.blizzard.com/data/wow/item/${ID}?namespace=static-us&locale=en_US&access_token=${oAuthToken}`)
             .then(response => response.json())
             .then(data => responseFromFetch = data)
             .then(newData => 
                {console.log(Object.keys(newData.preview_item.stats).length);
                let itemStatsArrayLength;
                itemStatsArrayLength = Object.keys(newData.preview_item.stats).length;
                
                
                
            }
                     )}
     
     
     
     */