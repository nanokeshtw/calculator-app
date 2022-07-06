function findOccurrences(equation, val) {
  const occurrences = [];
  let i = -1;

  while ((i = equation.indexOf(val, i + 1)) !== -1) {
    occurrences.push(i);
  }
  return occurrences;
}

function removeCalculatedEquation(new_equation, indexOfEq) {
  for (let i = indexOfEq + 1; i >= -1; i--) {
    if (i === indexOfEq + 1 || i === indexOfEq - 1) {
      new_equation.splice(i, 1);
    }
  }
}

function solveEquation(equation) {
  const new_equation = [...equation];
  const result_element = document.getElementsByClassName("result").item(0);
  while (new_equation.includes("×")) {
    const multi = findOccurrences(new_equation, "×")[0];
    new_equation[multi] = new_equation[multi - 1] * new_equation[multi + 1];
    removeCalculatedEquation(new_equation, multi);
  }
  while (new_equation.includes("÷")) {
    const div = findOccurrences(new_equation, "÷")[0];
    new_equation[div] = new_equation[div - 1] / new_equation[div + 1];
    removeCalculatedEquation(new_equation, div);
  }
  while (new_equation.includes("+")) {
    const add = findOccurrences(new_equation, "+")[0];
    new_equation[add] =
      parseInt(new_equation[add - 1]) + parseInt(new_equation[add + 1]);
    removeCalculatedEquation(new_equation, add);
  }
  while (new_equation.includes("−")) {
    const sub = findOccurrences(new_equation, "−")[0];
    new_equation[sub] = new_equation[sub - 1] - new_equation[sub + 1];
    removeCalculatedEquation(new_equation, sub);
  }
  if (equation.length !== 0) {
    result_element.textContent = new_equation.toLocaleString("en-US");
  } else result_element.textContent = " ";
}

function flipNumberSign(equation, last) {
  if (last === "-") equation.pop();
  else if (last[0] !== "-" && !isNaN(parseInt(last)))
    equation[equation.length - 1] = `-${last}`;
  else if (isNaN(parseInt(last))) equation.push("-");
  else equation[equation.length - 1] = last.slice(1, last.length);
}

function handleDeleteLastCharacter(equation, last) {
  if (last.length <= 1) {
    equation.pop();
  } else {
    equation[equation.length - 1] = last.slice(0, -1);
  }
}

function handleAddChar(addedText) {
  let equation = JSON.parse(localStorage.getItem("eq"));
  const last = equation[equation.length - 1];
  const isLastAndInputSymbol =
    isNaN(parseInt(addedText)) && isNaN(parseInt(last));
  const isLastAndInputNumber =
    ((!isNaN(parseInt(addedText)) || addedText === ".") &&
      !isNaN(parseInt(last))) ||
    last === "-";

  if (addedText === "=") solveEquation(equation);
  else if (addedText === "C") handleDeleteLastCharacter(equation, last);
  else if (addedText === "AC") equation = [];
  else if (addedText === "±") flipNumberSign(equation, last);
  else if (isLastAndInputSymbol) equation[equation.length - 1] = addedText;
  else if (isLastAndInputNumber) {
    equation[equation.length - 1] = `${last}${addedText}`;
  } else equation.push(addedText.toString());

  localStorage.setItem("eq", JSON.stringify(equation));
  equationJsonToText();
}

function onButtonClick(e) {
  e.preventDefault();
  if (e.relatedTarget) {
    e.relatedTarget.focus();
  } else {
    e.currentTarget.blur();
  }
  const btn = e.target;
  btn.classList.add("active");
  setTimeout(function () {
    btn.classList.remove("active");
  }, 400);

  handleAddChar(btn.textContent);
}

function equationJsonToText() {
  const equation = JSON.parse(localStorage.getItem("eq"));
  const equation_element = document.getElementsByClassName("equation").item(0);
  if (equation.length !== 0) {
    equation_element.textContent = equation.join("");
  } else equation_element.textContent = " ";
}

function handleEquationTextEmpty() {
  const equation_element = document.getElementsByClassName("equation").item(0);
  setInterval(function () {
    if (localStorage.getItem("eq") === "[]") {
      if (equation_element.textContent === "|")
        equation_element.textContent = " ";
      else equation_element.textContent = "|";
    }
  }, 500);
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    if (!localStorage.getItem("eq")) {
      localStorage.setItem("eq", "[]");
    }
    handleEquationTextEmpty();
    equationJsonToText();
    solveEquation(JSON.parse(localStorage.getItem("eq")));
  },
  false
);

document.addEventListener("keydown", function (e) {
  console.log(e.code);
  if (e.code === "Backspace") handleAddChar("C");
  if (e.code === "Delete") handleAddChar("AC");
  else if (e.code === "Slash") handleAddChar("÷");
  else if (e.code === "Minus") handleAddChar("−");
  else if (e.code === "Equal" && e.shiftKey) handleAddChar("+");
  else if ((e.code === "Digit8" && e.shiftKey) || e.code === "KeyX")
    handleAddChar("×");
  else if (e.code.slice(0, 5) === "Digit" && !e.shiftKey)
    handleAddChar(e.code.slice(5, 6));
  else if (e.code === "Enter" || (e.code === "Equal" && !e.shiftKey))
    solveEquation(JSON.parse(localStorage.getItem("eq")));
});
