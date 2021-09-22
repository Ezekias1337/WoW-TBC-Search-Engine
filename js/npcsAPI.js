'use strict';

function fetchNPCs(searchTerm) {
    fetch(`https://us.api.blizzard.com/data/wow/search/creature?namespace=static-us&locale=en_US&name.en_US=${searchTerm}&orderby=id&_page=1&str=&access_token=${oAuthToken}`)
        .then(response => {
            if (!response.ok) {
                throw Error("ERROR");
            }
            
            return response.json();
        })
        .then(data => {
            const statsItems = document.getElementById('userSearchResults');
  
            Promise.all(data.results.map(user => {
                return fetch(`https://us.api.blizzard.com/data/wow/media/creature-display/${user.data.creature_displays[0].id}?namespace=static-us&locale=en_US&access_token=${oAuthToken}`)
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
                                i.className = "npcImage"
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

  function getToolTipNPCs(){
    let responseFromFetch;
    let ID;
    let ID2;
    let tooltipImage;
    ID = (event.currentTarget.children[1].innerText.replace("ID: ", ""));
    ID2 = (event.currentTarget);
    tooltipImage = event.currentTarget.children[2].cloneNode(true);
    tooltipImage.id = "tooltipImageStyleNPC";
    tooltipImage.className = "d-block";
    console.log(ID, ID2);
    fetch(`https://us.api.blizzard.com/data/wow/creature/${ID}?namespace=static-us&locale=en_US&access_token=${oAuthToken}`)
    .then(response => response.json())
             .then(data => responseFromFetch = data)
             .then(newData => 
                {
                    function is_tameableBooleanParser(){
                        let is_tameable_string;
                        if(newData.is_tameable === true){
                            is_tameable_string = "Is Tameable"
                        } else {
                            is_tameable_string = "Not Tameable"
                        }
                        return is_tameable_string;
                    }
                    let tameableString
                    tameableString = is_tameableBooleanParser();
                    if (newData.family == null){
                        const lines = [
                            `${newData.name}`,
                            `${tameableString}`,
                            `${newData.type.name}`
                        ]
                        document.getElementById("tooltip-row-1").appendChild(tooltipImage)
                        lines.forEach((cell) => {
                            let node = document.createElement('td');
                            node.innerHTML = cell; 
                            node.className = 'tooltip-linez'
                            if (cell === newData.name){
                                document.getElementById("tooltip-row-1").appendChild(node)
                            } else if(cell === tameableString){
                                document.getElementById("tooltip-row-2").appendChild(node)
                            } else if(cell === newData.type.name){
                                document.getElementById("tooltip-row-2").appendChild(node)
                            }  else {
                                console.log("Failed to append")
                            }
                        })

                       /* document.getElementById("tooltip-row-1").appendChild(tooltipImage) */
                    }

                    else {const lines = [
                        `${newData.name}`,
                        `${newData.family.name}`,
                        /* Need to add error handling for npcs with family.name error */
                        `${tameableString}`,
                        `${newData.type.name}`
                    ]
                    document.getElementById("tooltip-row-1").appendChild(tooltipImage);
                    lines.forEach((cell) => {
                        let node = document.createElement('td');
                        node.innerHTML = cell; 
                        node.className = 'tooltip-linez'
                        if (cell === newData.name){
                            document.getElementById("tooltip-row-1").appendChild(node)
                        } else if(cell === newData.family.name){
                            document.getElementById("tooltip-row-1").appendChild(node)
                        } else if(cell === tameableString){
                            document.getElementById("tooltip-row-2").appendChild(node)
                        } else if(cell === newData.type.name){
                            document.getElementById("tooltip-row-2").appendChild(node)
                        }  else {
                            console.log("Failed to append")
                        }
                    })
                    /*document.getElementById("tooltip-row-1").appendChild(tooltipImage)*/
                }
                })}

    function toolTipNPCs() {document.querySelectorAll('.Items').forEach(item => {
        item.addEventListener('click', getToolTipNPCs) 
        item.addEventListener('mouseleave', clearToolTip) 
      })}
    
    function searchExecuteNPCs() {
        let test = search();
        fetchNPCs(test)
        .then((result) => {
            toolTipNPCs();
        })
    }

    document.getElementById("searchBar").addEventListener("submit", searchExecuteNPCs);
    let urlItemString = window.location.search.slice(11);
    document.getElementById("searchBar").value = urlItemString;
   
    