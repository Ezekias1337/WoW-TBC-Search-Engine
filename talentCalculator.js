let hunter = {
    spec1:"Beast Mastery", spec2:"Marksmanship", spec3:"Survival"
};
let shaman = {
    spec1:"Elemental", spec2:"Enhancement", spec3:"Restoration"
};
let warlock = {
    spec1:"Affliction", spec2:"Demonology", spec3:"Destruction"
};
let warrior = {
    spec1:"Arms", spec2:"Fury", spec3:"Protection"
};
let rogue = {
    spec1:"Assassination", spec2:"Combat", spec3:"Subtlety"
};
let priest = {
    spec1:"Discipline", spec2:"Holy", spec3:"Shadow"
};
let paladin = {
    spec1:"Holy", spec2:"Protection", spec3:"Retribution"
};
let mage = {
    spec1:"Arcane", spec2:"Fire", spec3:"Frost"
};
let druid = {
    spec1:"Balance", spec2:"Feral Combat", spec3:"Restoration"
};

function displayClassTalents(className){
    let specialization1 = document.getElementById("spec1");
    let specialization2 = document.getElementById("spec2");
    let specialization3 = document.getElementById("spec3");

    specialization1.innerText = className.spec1;
    specialization2.innerText = className.spec2;
    specialization3.innerText = className.spec3;

    console.log("Successfully Updated Talents!");
}
