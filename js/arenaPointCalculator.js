function calculatePoints2s () {
    let points;
    let pointOutput2s;
    points = document.getElementById("2s").value;

    if (points >= 1500) {
        pointOutput2s = ((1511.26/(1+1639.28*Math.pow(2.71828, -0.00412*points))) * 0.76)
        console.log(pointOutput2s);
        document.getElementById("2s-output").value = pointOutput2s;
    } else if (points >= 200) {
        pointOutput2s = (162 + ((points-200) * 0.0761538461538462))
        console.log(pointOutput2s);
        document.getElementById("2s-output").value = pointOutput2s;
    } else {
        console.log("Enter a rating higher than 200!")
    }
}

function calculatePoints3s () {
    let points;
    let pointOutput3s;
    points = document.getElementById("3s").value;

    if (points >= 1500) {
        pointOutput3s = ((1511.26/(1+1639.28*Math.pow(2.71828, -0.00412*points))) * 0.88)
        console.log(pointOutput3s);
        document.getElementById("3s-output").value = pointOutput3s;
    } else if (points >= 200) {
        pointOutput3s = (188 + ((points-200) * 0.0876923076923077))
        console.log(pointOutput3s);
        document.getElementById("3s-output").value = pointOutput3s;
    } else {
        console.log("Enter a rating higher than 200!")
    }
}

function calculatePoints5s () {
    let points;
    let pointOutput5s;
    points = document.getElementById("5s").value;

    if (points >= 1500) {
        pointOutput5s = (1511.26/(1+1639.28*Math.pow(2.71828, -0.00412*points)))
        console.log(pointOutput5s);
        document.getElementById("5s-output").value = pointOutput5s;
    } else if (points >= 200) {
        pointOutput5s = (214 + ((points-200) * 0.1))
        console.log(pointOutput5s);
        document.getElementById("5s-output").value = pointOutput5s;
    } else {
        console.log("Enter a rating higher than 200!")
    }
}

function submitAll(){
    let twos;
    let threes;
    let fives;

    twos = document.getElementById("2s").value;
    threes = document.getElementById("3s").value;
    fives = document.getElementById("5s").value;
    
    if (twos === "" && threes === "" && fives === ""){
        alert("Enter a rating into one of the fields");
    } if (!(twos === "")) {
        calculatePoints2s();
    } if (!(threes === "")) {
        calculatePoints3s();
    } if (!(fives === "")) {
        calculatePoints5s();
    }
}

function resetArenaCalculator() {
    document.getElementById("2s").value = "";
    document.getElementById("2s-output").value = "";
    document.getElementById("3s").value = "";
    document.getElementById("3s-output").value = "";
    document.getElementById("5s").value = "";
    document.getElementById("5s-output").value = "";
}

document.getElementById("submitArenaPoints").addEventListener("click", submitAll);

document.getElementById("resetArenaPoints").addEventListener("click", resetArenaCalculator);