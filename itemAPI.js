function fetchData(searchTerm) {
    fetch(`https://us.api.blizzard.com/data/wow/search/item?namespace=static-us&locale=en_US&name.en_US=${searchTerm}&orderby=id&_page=1&str=&access_token=${oAuthToken}`)
        .then(response => {
            if (!response.ok) {
                throw Error("ERROR");
            }
            return response.json();
        })
        .then(data => {
            const stats = document.getElementById('weaponArmourResults');
  
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
                            `Item Subclass: ${user.data.item_subclass.name.en_US}`,
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
                        stats.appendChild(div);
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

    function searchExecute() {
        let test = search();
        fetchData(test);
        console.log("Success")
    }
    
    document.getElementById("searchBar").addEventListener("submit", searchExecute);

    let urlItemString = window.location.search.slice(11);
    document.getElementById("searchBar").value = urlItemString;
    

    function successMessage () {
        console.log("function has been called!")
    }

    var testMia = document.getElementById("searchBar");

    testMia.addEventListener("keyup", function(event) {
        var x = event.key;
        // Number 13 is the "Enter" key on the keyboard
        if (x === "Enter") {

          
          // Trigger the button element with a click
          
          document.getElementById("searchButtonItems").click();
        }
      });

    function refreshPage(){
        location.reload();
    }