let hunter = {
    spec1:{name:"Beast Mastery", bg: "url(./images/talents/Hunter/Background/BeastMastery.jpg)"}, 
    spec2:{name:"Marksmanship", bg: "url(./images/talents/Hunter/Background/Marksman.jpg)"}, 
    spec3:{name:"Survival", bg: "url(./images/talents/Hunter/Background/Survival.jpg)"}
};
let shaman = {
    spec1:{name:"Elemental", bg: "url(./images/talents/Shaman/Background/Elemental.jpg)"}, 
    spec2:{name:"Enhancement", bg: "url(./images/talents/Shaman/Background/Enhancement.jpg)"}, 
    spec3:{name:"Restoration", bg: "url(./images/talents/Shaman/Background/Restoration.jpg)"}
};
let warlock = {
    spec1:{name:"Affliction", bg: "url(./images/talents/Warlock/Background/Affliction.jpg)"}, 
    spec2:{name:"Demonology", bg: "url(./images/talents/Warlock/Background/Demonology.jpg)"}, 
    spec3:{name:"Destruction", bg: "url(./images/talents/Warlock/Background/Destruction.jpg)"}
};
let warrior = {
    spec1:{name:"Arms", bg: "url(./images/talents/Warrior/Background/Arms.jpg)"},
    spec2:{name:"Fury", bg: "url(./images/talents/Warrior/Background/Fury.jpg)"},
    spec3:{name:"Protection", bg: "url(./images/talents/Warrior/Background/Protection.jpg)"}
};
let rogue = {
    spec1:{name:"Assassination", bg: "url(./images/talents/Rogue/Background/Assassination.jpg)"}, 
    spec2:{name:"Combat", bg: "url(./images/talents/Rogue/Background/Combat.jpg)"}, 
    spec3:{name:"Subtlety", bg: "url(./images/talents/Rogue/Background/Subtlety.jpg)"}
};
let priest = {
    spec1:{name:"Discipline", bg: "url(./images/talents/Priest/Background/Discipline.jpg)"}, 
    spec2:{name:"Holy", bg: "url(./images/talents/Priest/Background/Holy.jpg)"}, 
    spec3:{name:"Shadow", bg: "url(./images/talents/Priest/Background/Shadow.jpg)"}
};
let paladin = {
    spec1:{name:"Holy", bg: "url(./images/talents/Paladin/Background/Holy.jpg)"}, 
    spec2:{name:"Protection", bg: "url(./images/talents/Paladin/Background/Protection.jpg)"}, 
    spec3:{name:"Retribution", bg: "url(./images/talents/Paladin/Background/Retribution.jpg)"}
};
let mage = {
    spec1:{name:"Arcane", bg: "url(./images/talents/Mage/Background/Arcane.jpg)"}, 
    spec2:{name:"Fire", bg: "url(./images/talents/Mage/Background/Fire.jpg)"}, 
    spec3:{name:"Frost", bg: "url(./images/talents/Mage/Background/Frost.jpg)"}
};
let druid = {
    spec1:{name:"Balance", bg: "url(./images/talents/Druid/Background/Balance.jpg)"}, 
    spec2:{name:"Feral Combat", bg: "url(./images/talents/Druid/Background/Feral Combat.jpg)"}, 
    spec3:{name:"Restoration", bg: "url(./images/talents/Druid/Background/Restoration.jpg)"}
};

function displayClassTalents(className){
    

    let specialization1 = document.getElementById("spec1");
    let specialization2 = document.getElementById("spec2");
    let specialization3 = document.getElementById("spec3");

    let spec1bg = className.spec1.bg;
    let spec2bg = className.spec2.bg;
    let spec3bg = className.spec3.bg;

    specialization1.innerText = className.spec1.name;
    specialization2.innerText = className.spec2.name;
    specialization3.innerText = className.spec3.name;

    document.getElementById("Col 1").style.backgroundImage = spec1bg;
    document.getElementById("Col 2").style.backgroundImage = spec2bg;
    document.getElementById("Col 3").style.backgroundImage = spec3bg;

    console.log("Successfully Updated Talents!");
    
}

function addEventListenersCalcIcons(){
    let talentsObj = [];
    let talentsArry = [];
    talentsObj = document.getElementsByClassName("talentButton");
    console.log(talentsObj);
    console.log(typeof(talentsObj));
    for(item of talentsObj){
        item.addEventListener("click", updateTalentPoints);
        item.addEventListener("click", updateCounter);
    }
}

setTimeout(addEventListenersCalcIcons, 200)

let i = 0;
let tracker;
let index;
let pointChecker;
let pointsObj;

function updateCounter(){
    i = i+1
    console.log("Talent Points Spent: " + i)
    document.getElementById("total-points").innerText = i;
    let classChecker; 
    let classFinisher;
    

    if(i >= pointChecker){
        if(i >= 40){
            pointsObj = document.getElementsByClassName("req-40-s1");
            for(item of pointsObj){
                classChecker = item.previousSibling.previousSibling.className;
                classFinisher = classChecker.replace("inactive-talent", "active-talent");
                classChecker = classFinisher.replace("req-inactive", "req-active")
                item.previousSibling.previousSibling.className = classChecker
            }   
        } else if(i >= 35){
            pointsObj = document.getElementsByClassName("req-35-s1");
            for(item of pointsObj){
                classChecker = item.previousSibling.previousSibling.className;
                classFinisher = classChecker.replace("inactive-talent", "active-talent");
                classChecker = classFinisher.replace("req-inactive", "req-active")
                item.previousSibling.previousSibling.className = classChecker;
            }  
        } else if(i >= 30){
            pointsObj = document.getElementsByClassName("req-30-s1");
            for(item of pointsObj){
                classChecker = item.previousSibling.previousSibling.className;
                classFinisher = classChecker.replace("inactive-talent", "active-talent");
                classChecker = classFinisher.replace("req-inactive", "req-active")
                item.previousSibling.previousSibling.className = classChecker;
            }   
        } else if(i >= 25){
            pointsObj = document.getElementsByClassName("req-25-s1");
            for(item of pointsObj){
                classChecker = item.previousSibling.previousSibling.className;
                classFinisher = classChecker.replace("inactive-talent", "active-talent");
                classChecker = classFinisher.replace("req-inactive", "req-active")
                item.previousSibling.previousSibling.className = classChecker;
            }   
        } else if(i >= 20){
            pointsObj = document.getElementsByClassName("req-20-s1");
            for(item of pointsObj){
                classChecker = item.previousSibling.previousSibling.className;
                classFinisher = classChecker.replace("inactive-talent", "active-talent");
                classChecker = classFinisher.replace("req-inactive", "req-active")
                item.previousSibling.previousSibling.className = classChecker;
            }  
        } else if(i >= 15){
            pointsObj = document.getElementsByClassName("req-15-s1");
            for(item of pointsObj){
                classChecker = item.previousSibling.previousSibling.className;
                classFinisher = classChecker.replace("inactive-talent", "active-talent");
                classChecker = classFinisher.replace("req-inactive", "req-active")
                item.previousSibling.previousSibling.className = classChecker;
            }  
        } else if(i >= 10){
            pointsObj = document.getElementsByClassName("req-10-s1");
            
            for(item of pointsObj){
                classChecker = item.previousSibling.previousSibling.className;
                classFinisher = classChecker.replace("inactive-talent", "active-talent");
                classChecker = classFinisher.replace("req-inactive", "req-active")
                item.previousSibling.previousSibling.className = classChecker;
            }  
        }   else if(i >= 5){
            pointsObj = document.getElementsByClassName("req-05-s1");
            for(item of pointsObj){
                classChecker = item.previousSibling.previousSibling.className;
                classFinisher = classChecker.replace("inactive-talent", "active-talent");
                classChecker = classFinisher.replace("req-inactive", "req-active")
                item.previousSibling.previousSibling.className = classChecker;
            }   
        }  
    
    }
}

function updateTalentPoints(){
    let valueString;
    
    let onePointArray = ["0/1", "1/1"];
    let twoPointArray = ["0/2", "1/2", "2/2"];
    let threePointArray = ["0/3", "1/3", "2/3", "3/3"];
    let fourPointArray = ["0/4", "1/4", "2/4", "3/4", "4/4"];
    let fivePointArray = ["0/5", "1/5", "2/5", "3/5", "4/5", "5/5"];

    valueString = event.currentTarget.nextElementSibling.innerText;
    pointChecker = event.currentTarget.nextElementSibling.className.substring(17, 19);
    console.log(pointChecker);
    let insufficientPointWarning = `You need to spend ${pointChecker - i} more points in this tree first!`;

    if(valueString[2] === "1"){
        if(i >= pointChecker){
            /*event.currentTarget.className = "talentButton active req-active";*/
            if(valueString === onePointArray[0]){
                event.currentTarget.nextElementSibling.innerText = onePointArray[1];
                event.currentTarget.className = "talentButton maxeds req-active";
            } else if(valueString === onePointArray[1]){
                i = i-1;
                event.currentTarget.className /*"talentButton maxeds req-active";*/
                console.log("You've maxed out this talent already!");
            }
            } else{
                i = i-1;
                console.log(insufficientPointWarning);
        }
    }
    
    if(valueString[2] === "2"){   
        if(i >= pointChecker){
            
            if(valueString === twoPointArray[0]){
                event.currentTarget.nextElementSibling.innerText = twoPointArray[1];
                event.currentTarget.className = "talentButton active-talent req-active";
            } else if(valueString === twoPointArray[1]){
                event.currentTarget.nextElementSibling.innerText = twoPointArray[2];
                event.currentTarget.className = "talentButton maxeds req-active";
            } else if(valueString === twoPointArray[2]){
                i = i-1;
                event.currentTarget.className = "talentButton maxeds req-active";
                console.log("You've maxed out this talent already!");
            }
        } else{
            i = i-1;
            console.log(insufficientPointWarning);
        }
    }
    
    if(valueString[2] === "3"){  
        if(i >= pointChecker){
            
            if(valueString === threePointArray[0]){
                event.currentTarget.nextElementSibling.innerText = threePointArray[1];
                event.currentTarget.className = "talentButton active-talent req-active";;
            } else if(valueString === threePointArray[1]){
                event.currentTarget.nextElementSibling.innerText = threePointArray[2];
            } else if(valueString === threePointArray[2]){
                event.currentTarget.nextElementSibling.innerText = threePointArray[3];
                event.currentTarget.className = "talentButton maxeds req-active";
            } else if(valueString === threePointArray[3]){
                i = i-1;
                event.currentTarget.className = "talentButton maxeds req-active";
                console.log("You've maxed out this talent already!");
            } 
        } else{
            i = i-1;
            console.log(insufficientPointWarning);
        }
    }
    
    if(valueString[2] === "4"){ 
        if(i >= pointChecker){
            
            if(valueString === fourPointArray[0]){
                event.currentTarget.nextElementSibling.innerText = fourPointArray[1];
                event.currentTarget.className = "talentButton active-talent req-active";
            } else if(valueString === fourPointArray[1]){
                event.currentTarget.nextElementSibling.innerText = fourPointArray[2];
            } else if(valueString === fourPointArray[2]){
                event.currentTarget.nextElementSibling.innerText = fourPointArray[3];
            } else if(valueString === fourPointArray[3]){
                event.currentTarget.nextElementSibling.innerText = fourPointArray[4];
                event.currentTarget.className = "talentButton maxeds req-active";
            } else if(valueString === fourPointArray[4]){
                i = i-1;
                event.currentTarget.className = "talentButton maxeds req-active";
                console.log("You've maxed out this talent already!");
            }
        }else{
            i = i-1;
            console.log(insufficientPointWarning);
        }
    }

    if(valueString[2] === "5"){  
        if(i >= pointChecker){
            
            if(valueString === fivePointArray[0]){
                event.currentTarget.nextElementSibling.innerText = fivePointArray[1];
                event.currentTarget.className = "talentButton active-talent req-active";
                console.log("Function entered")
            } else if(valueString === fivePointArray[1]){
                event.currentTarget.nextElementSibling.innerText = fivePointArray[2];
            } else if(valueString === fivePointArray[2]){
                event.currentTarget.nextElementSibling.innerText = fivePointArray[3];
            } else if(valueString === fivePointArray[3]){
                event.currentTarget.nextElementSibling.innerText = fivePointArray[4];
            } else if(valueString === fivePointArray[4]){
                event.currentTarget.nextElementSibling.innerText = fivePointArray[5];
                event.currentTarget.className = "talentButton maxeds req-active";
            } else if(valueString === fivePointArray[5]){
                i = i-1;
                event.currentTarget.className = "talentButton maxeds req-active";
                console.log("You've maxed out this talent already!");
            }
        } else{
            i = i-1;
            console.log(insufficientPointWarning);
        }
    }
}