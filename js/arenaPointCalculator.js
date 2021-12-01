function calculatePoints2s() {
  let points;
  let pointOutput2s;
  points = document.getElementById("2s").value;

  if (points >= 1500) {
    pointOutput2s = Math.floor(
      (1511.26 / (1 + 1639.28 * Math.pow(2.71828, -0.00412 * points))) * 0.76
    );

    document.getElementById("2s-output").value = pointOutput2s;
  } else if (points >= 200) {
    pointOutput2s = Math.floor(162 + (points - 200) * 0.0761538461538462);

    document.getElementById("2s-output").value = pointOutput2s;
  } else if (document.getElementById("2s").value === "") {
    document.getElementById("2s-output").value = "";
  } else {
    document.getElementById("2s-output").value = 0;
  }
}

function calculatePoints3s() {
  let points;
  let pointOutput3s;
  points = document.getElementById("3s").value;

  if (points >= 1500) {
    pointOutput3s = Math.floor(
      (1511.26 / (1 + 1639.28 * Math.pow(2.71828, -0.00412 * points))) * 0.88
    );

    document.getElementById("3s-output").value = pointOutput3s;
  } else if (points >= 200) {
    pointOutput3s = Math.floor(188 + (points - 200) * 0.0876923076923077);

    document.getElementById("3s-output").value = pointOutput3s;
  } else if (document.getElementById("3s").value === "") {
    document.getElementById("3s-output").value = "";
  } else {
    document.getElementById("3s-output").value = 0;
  }
}

function calculatePoints5s() {
  let points;
  let pointOutput5s;
  points = document.getElementById("5s").value;

  if (points >= 1500) {
    pointOutput5s = Math.floor(
      1511.26 / (1 + 1639.28 * Math.pow(2.71828, -0.00412 * points))
    );

    document.getElementById("5s-output").value = pointOutput5s;
  } else if (points >= 200) {
    pointOutput5s = Math.floor(214 + (points - 200) * 0.1);

    document.getElementById("5s-output").value = pointOutput5s;
  } else if (document.getElementById("5s").value === "") {
    document.getElementById("5s-output").value = "";
  } else {
    document.getElementById("5s-output").value = 0;
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

document.getElementById("2s").addEventListener("keyup", calculatePoints2s);
document.getElementById("3s").addEventListener("keyup", calculatePoints3s);
document.getElementById("5s").addEventListener("keyup", calculatePoints5s);

document.getElementById("2s").addEventListener("keyup", function (event) {
  var x = event.key;
  // Number 13 is the "Enter" key on the keyboard
  if (x === "Enter") {
    // Trigger the button element with a click

    calculatePoints2s();
  }
});

document.getElementById("3s").addEventListener("keyup", function (event) {
  var x = event.key;
  // Number 13 is the "Enter" key on the keyboard
  if (x === "Enter") {
    // Trigger the button element with a click

    calculatePoints3s();
  }
});

document.getElementById("5s").addEventListener("keyup", function (event) {
  var x = event.key;
  // Number 13 is the "Enter" key on the keyboard
  if (x === "Enter") {
    // Trigger the button element with a click

    calculatePoints5s();
  }
});

document
  .getElementById("resetArenaPoints")
  .addEventListener("click", resetArenaCalculator);
