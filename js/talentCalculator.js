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