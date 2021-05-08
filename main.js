'use strict';

function search(){
    let input = document.getElementById("searchBar").value 
        if (input.length > 1) {
            return input;
        }
        
    }

    function addEventListenerToSearchBar(){
        document.getElementById("searchBar").addEventListener("keyup", function(event) {
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

    }
    
    


      function testJSONData() {
        let responseFromFetch;
         fetch(`https://us.api.blizzard.com/data/wow/creature/${ID}?namespace=static-us&locale=en_US&access_token=${oAuthToken}`)
         .then(response => response.json())
             .then(data => responseFromFetch = data)
             .then(newData => console.log(newData))
     }

     function displayModal () {
        document.getElementById("loginModal").modal("show");
    }
    
    function loginModalListener() {
        let el = document.getElementById("loginButton");
        if(el){
            el.addEventListener("click", displayModal);
        }
        
    }
    setTimeout(loginModalListener, 1000);

    