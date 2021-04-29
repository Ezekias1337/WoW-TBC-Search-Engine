'use strict';

let responseFromFetch;

fetch("https://us.api.blizzard.com/data/wow/search/creature?namespace=static-us&locale=en_US&name.en_US=Dragon&orderby=id&_page=1&access_token=USspHQ7WbOLP6Dx1gFffufjys8qcJd1wUW")
    .then(res => res.json())
    .then(data => responseFromFetch = data)


    /* This is the way I was able to retrieve the display ID
    
        responseFromFetch.results[0].data.creature_displays[0]
    
    */
       
