'use strict';

function fetchSpells(searchTerm) {
    fetch(`https://us.api.blizzard.com/data/wow/search/spell?namespace=static-us&locale=en_US&name.en_US=${searchTerm}&orderby=id&_page=1&str=&access_token=${oAuthToken}`)
        .then(response => {
            if (!response.ok) {
                throw Error("ERROR");
            }
            return response.json();
        })
        .then(data => {
            const statsItems = document.getElementById('userSearchResults');
  
            Promise.all(data.results.map(user => {
                return fetch(`https://us.api.blizzard.com/data/wow/media/spell/${user.data.id}?namespace=static-us&locale=en_US&access_token=${oAuthToken}`)
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
                      /*  div.onclick="toolTip(this)"; */
                        const lines = [
                            `${user.data.name.en_US}`,
                            `ID: ${user.data.id}`
                        ];
                        for (let line of lines) {
                            const p = document.createElement('td');
                            p.style = "text-align:center vertical-align:center";
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

  function searchExecuteSpells() {
    let test = search();
    fetchSpells(test)
    .then((result) => {
        toolTipSpells();
    })
}

  function getToolTipSpells(){
    let responseFromFetch;
    let ID;
    let ID2;
    let tooltipImage;
    ID = (event.currentTarget.children[1].innerText.replace("ID: ", ""));
    ID2 = (event.currentTarget);
    tooltipImage = event.currentTarget.children[2].cloneNode(true);
    tooltipImage.id = "tooltipImageStyleSpell";
    console.log(ID, ID2);
    fetch(`https://us.api.blizzard.com/data/wow/spell/${ID}?namespace=static-us&locale=en_US&access_token=${oAuthToken}`)
    .then(response => response.json())
             .then(data => responseFromFetch = data)
             .then(newData => 
                {
                    const lines = [
                        `${newData.name}`,
                        `${newData.description}`
                    ]

                    document.getElementById("tooltip-row-1").appendChild(tooltipImage);

                    lines.forEach((cell) => {
                        let node = document.createElement('td');
                        node.innerHTML = cell; 
                        node.className = 'tooltip-linez'
                        if (cell === newData.name){
                            document.getElementById("tooltip-row-2").appendChild(node)
                        } else if(cell === newData.description){
                            document.getElementById("tooltip-row-3").appendChild(node)
                        }   else{
                            console.log("Failed to append")
                        }
                    })
                })}

    function toolTipSpells() {document.querySelectorAll('.Items').forEach(item => {
        item.addEventListener('click', getToolTipSpells) 
        item.addEventListener('mouseleave', clearToolTip) 
      })}

    document.getElementById("searchBar").addEventListener("submit", searchExecuteSpells);
    let urlItemString = window.location.search.slice(11);
    document.getElementById("searchBar").value = urlItemString;
    

    