/*let input = document.getElementById('searchbar').value
    input = input.toLowerCase();*/

function fetchData(searchTerm) {
    fetch(`https://us.api.blizzard.com/data/wow/search/item?namespace=static-us&locale=en_US&name.en_US=${searchTerm}&orderby=id&_page=1&str=&access_token=USqf51VLP30OeT4M0bCGyJ95IISemvZ55t`)
        .then(response => {
            if (!response.ok) {
                throw Error("ERROR");
            }
            return response.json();
        })
        .then(data => {
            const stats = document.getElementById('weaponArmourResults');
  
            Promise.all(data.results.map(user => {
                return fetch(`https://us.api.blizzard.com/data/wow/media/item/${user.data.id}?namespace=static-us&locale=en_US&access_token=USqf51VLP30OeT4M0bCGyJ95IISemvZ55t`,)
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

  fetchData(input);