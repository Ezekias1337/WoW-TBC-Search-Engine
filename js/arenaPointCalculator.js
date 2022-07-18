const calculatePoints2s = () => {
  const inputElement2 = document.getElementById("2s");
  const outputElement2 = document.getElementById("2s-output");

  let pointOutput2s;
  let points = inputElement2.value;

  if (points >= 150) {
    const exponent = -0.00412 * points;
    const resultFromExponentParse = Math.pow(2.71828, exponent);

    pointOutput2s = Math.floor(
      (1022 / (1 + 123 * resultFromExponentParse) + 580) * 0.76
    );

    outputElement2.value = pointOutput2s;
  } else if (points < 150 || inputElement2.value === "") {
    outputElement2.value = "";
  } else {
    outputElement2.value = 0;
  }
};

const calculatePoints3s = () => {
  const inputElement3 = document.getElementById("3s");
  const outputElement3 = document.getElementById("3s-output");

  let points;
  let pointOutput3s;
  points = inputElement3.value;

  if (points >= 150) {
    const exponent = -0.00412 * points;
    const resultFromExponentParse = Math.pow(2.71828, exponent);

    pointOutput3s = Math.ceil(
      (1022 / (1 + 123 * resultFromExponentParse) + 580) * 0.88
    );

    outputElement3.value = pointOutput3s;
  } else if (points < 150 || inputElement3.value === "") {
    outputElement3.value = "";
  } else {
    outputElement3.value = 0;
  }
};

const calculatePoints5s = () => {
  const inputElement5 = document.getElementById("5s");
  const outputElement5 = document.getElementById("5s-output");

  let points;
  let pointOutput5s;
  points = inputElement5.value;

  if (points >= 150) {
    const exponent = -0.00412 * points;
    const resultFromExponentParse = Math.pow(2.71828, exponent);

    pointOutput5s = Math.ceil(1022 / (1 + 123 * resultFromExponentParse) + 580);

    outputElement5.value = pointOutput5s;
  } else if (points < 150 || inputElement5.value === "") {
    outputElement5.value = "";
  } else {
    outputElement5.value = 0;
  }
};

const resetArenaCalculator = () => {
  document.getElementById("2s").value = "";
  document.getElementById("2s-output").value = "";
  document.getElementById("3s").value = "";
  document.getElementById("3s-output").value = "";
  document.getElementById("5s").value = "";
  document.getElementById("5s-output").value = "";
};

document.getElementById("2s").addEventListener("keyup", calculatePoints2s);
document.getElementById("3s").addEventListener("keyup", calculatePoints3s);
document.getElementById("5s").addEventListener("keyup", calculatePoints5s);

document
  .getElementById("resetArenaPoints")
  .addEventListener("click", resetArenaCalculator);
