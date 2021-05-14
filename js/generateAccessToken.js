   
   
   var url = "https://us.battle.net/oauth/token";

   var xhr = new XMLHttpRequest();
   xhr.open("POST", url);

   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
   xhr.setRequestHeader("Authorization", "Basic ZTViNzRiMjBlNzRmNDhmYThmMDVhNmQ5YmJmZjEyMjY6UkZPMlFVTUtSMzU2TVV2eEdpVWJNVUIxazhKTlB1VXg=");

   xhr.onreadystatechange = function () {
      
      if (xhr.readyState === 4) {
      /*   cc_color(xhr.status, "orange");
         cc_color(xhr.responseText, "green"); */
         blizzardResponse = xhr.responseText
         oAuthTokenFullString = blizzardResponse;
         oAuthToken = oAuthTokenFullString.slice(17,51);
         if ( document.URL.includes("item-search-results.html") ) {
               searchExecuteItems(); 
               return xhr.responseText;
        } else if ( document.URL.includes("spells-search-results.html") ) {
               searchExecuteSpells();
               return xhr.responseText;
     }   else if ( document.URL.includes("NPCs-search-results.html") ) {
               searchExecuteNPCs();
               return xhr.responseText;
  }     /* else if ( document.URL.includes("quests-search-results.html") ) {
               searchExecuteQuests(); 
               return xhr.responseText;
} */

         

         
      }};

   var data = "grant_type=client_credentials";

   xhr.send(data);
   
   

   
   

