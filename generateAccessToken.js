   var url = "https://us.battle.net/oauth/token";

   var xhr = new XMLHttpRequest();
   xhr.open("POST", url);

   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
   xhr.setRequestHeader("Authorization", "Basic ZTViNzRiMjBlNzRmNDhmYThmMDVhNmQ5YmJmZjEyMjY6UkZPMlFVTUtSMzU2TVV2eEdpVWJNVUIxazhKTlB1VXg=");

   xhr.onreadystatechange = function () {
      
      if (xhr.readyState === 4) {
         console.log(xhr.status);
         console.log(xhr.responseText);
         blizzardResponse = xhr.responseText
         oAuthTokenFullString = blizzardResponse;
         oAuthToken = oAuthTokenFullString.slice(17,51);
         return xhr.responseText;
      }};

   var data = "grant_type=client_credentials";

   xhr.send(data);
   
   

   
   

