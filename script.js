/**
 * @fileoverview Basic calculator with support for arithmetic operations.
 * Buttons are dynamically generated from a configuration object.
 */

//--------------------------------------------------------------
//             G L O B A L       V A R I A B L E S
//--------------------------------------------------------------

/** @type {number} First operand of the operation */
let num1 = 0;

/** @type {number} Second operand of the operation */
let num2 = 0;

/** @type {string} Selected arithmetic operator (+, -, *, /) */
let operand = "";

/** @type {number} Result of the last operation */
let result = 0;

/** @type {boolean} Whether an operator button has been pressed */
let operandPressed = false;

/** @type {boolean} Whether a result has already been calculated with "=" */
let resultCalculated = false;

/** @type {boolean} Whether the current number on screen already has a decimal point */
let decimalPointInNumber = false;

/**
 * Lookup table mapping arithmetic operators to their corresponding functions.
 * @type {Object.<string, function(number, number): number>}
 */
const operations = {
    "+": add,
    "-": subtract,
    "/": divide,
    "*": multiply,
};

/**
 * Lookup table mapping special button symbols to their command functions.
 * @type {Object.<string, function(string): void>}
 */
const commands = {
    ".": decimalPoint,
    "=": equals,
    "clear": clear,
    "⌫": backspace
};

/**
 * Calculator button configuration.
 * Number buttons map display names to their numeric values.
 * Special buttons map display names to their symbol/text content.
 * @type {{ number: Object.<string, number>, special: Object.<string, string> }}
 */
const buttons = {
    number: {
        One: 1, Two: 2, Three: 3,
        Four: 4, Five: 5, Six: 6,
        Seven: 7, Eight: 8, Nine: 9,
        Zero: 0
    },
    special: {
        Add: "+",
        Subtract: "-",
        Multiply: "*",
        Divide: "/",
        DecimalPoint: ".",
        Equals: "=",
        Backspace: "⌫",
        Clear: "clear",
    }
};

const buttonsEntries = Object.entries(buttons);
const numberEntries = Object.entries(buttonsEntries[0][1]);
const specialEntries = Object.entries(buttonsEntries[1][1]);

/** @type {number} Number of buttons per row */
const buttonsPerRow = 4;

/** @type {number} Number of rows needed for numeric buttons */
const numberRows = Math.ceil(numberEntries.length / buttonsPerRow);

/** @type {number} Number of rows needed for special buttons */
const specialRows = Math.ceil(specialEntries.length / buttonsPerRow);


//--------------------------------------------------------------
//                " M A I N "      C O D E
//--------------------------------------------------------------

const calculator = document.querySelector("#calculator");
const screenResult = document.querySelector(".screenResult");

fillCalculatorButtons();

const btns = document.querySelectorAll("button");
const btnsArray = Array.from(btns);

addListenerToNumberBtns();
addListenerToSpecialBtns();

//--------------------------------------------------------------
//     F U N C T I O N S   F O R    C A L C U L A T O R
//--------------------------------------------------------------

/**
 * Attaches click event listeners to all special buttons (operators, commands).
 * - Commands (=, clear, ⌫, .): dispatched via the commands lookup table.
 * - Operators (+, -, *, /): store the operator and the first operand.
 */
function addListenerToSpecialBtns() {
    const specialBtns = btnsArray.slice(10);

    specialBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const btnTextContent = btn.textContent;
            const screenText = screenResult.textContent;

            if (btnTextContent in commands) {
                commands[btnTextContent](screenText);
            }
            else {
                operand = btnTextContent;
                if (!operandPressed) {
                    num1 = Number(screenText);
                    screenResult.textContent = "0";
                    operandPressed = true;
                }
            }
        });
    });
}

/**
 * Attaches click event listeners to all numeric buttons (0-9).
 * Resets the screen if a result was previously calculated before appending the new digit.
 */
function addListenerToNumberBtns() {
    const numberBtns = btnsArray.slice(0, 10);

    numberBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (resultCalculated) { screenResult.textContent = "0"; resultCalculated = false; }
            let screenText = screenResult.textContent;
            const btnText = btn.textContent;
            if (screenText === "0") screenResult.textContent = btnText;
            else screenResult.textContent += btnText;
        });
    });
}

/**
 * Creates a row of buttons and appends it to the calculator DOM element.
 * @param {number} row - Zero-based row index, used to assign the CSS class.
 * @param {Array.<[string, string|number]>} classEntries - Array of [className, textContent] pairs for each button.
 */
function createRow(row, classEntries) {
    const numButtonsRow = document.createElement("div");
    numButtonsRow.setAttribute("class", `row row${row + 1}`);

    for (const [btnClass, btnTextContent] of classEntries) {
        const numberButton = document.createElement("button");
        numberButton.textContent = btnTextContent;
        numberButton.setAttribute("class", `button button${btnClass}`);
        numButtonsRow.appendChild(numberButton);
    }
    calculator.appendChild(numButtonsRow);
}

/**
 * Dynamically generates all calculator buttons in the DOM.
 * First renders numeric button rows, then special button rows.
 */
function fillCalculatorButtons() {
    for (let row = 0; row < numberRows; row++) {
        createRow(row, numberEntries.slice(row * buttonsPerRow, row * buttonsPerRow + buttonsPerRow));
    }

    for (let row = 0; row < specialRows; row++) {
        createRow(row + (numberRows + 1), specialEntries.slice(row * buttonsPerRow, row * buttonsPerRow + buttonsPerRow));
    }
}


//--------------------------------------------------------------------------------------
//   F U N C T I O N S      F O R      O P E R A T E      A N D      C O M M A N D S
//--------------------------------------------------------------------------------------

/**
 * Dispatches the arithmetic operation corresponding to the given operator.
 * Returns `b` as a fallback if no operator is set.
 * @param {number} a - First operand.
 * @param {number} b - Second operand.
 * @param {string} operand - Arithmetic operator (+, -, *, /).
 * @returns {number} Result of the operation.
 */
function operate(a, b, operand) {
    if (operand) {
        return operations[operand](a, b);
    }
    return b;
}

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a, b) { return a + b; }

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function subtract(a, b) { return a - b; }

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function multiply(a, b) { return a * b; }

/**
 * Divides `a` by `b`. Shows an alert and returns 0 if `b` is zero.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function divide(a, b) {
    if (b === 0) {
        alert("Cannot divide by zero");
        return 0;
    }
    return a / b;
}

/**
 * Resets the calculator to its initial state.
 */
function clear() {
    screenResult.textContent = "0";
    num1 = 0; num2 = 0; operand = ""; operandPressed = false;
}

/**
 * Calculates the result of the pending operation and displays it on screen.
 * Does nothing if a result has already been calculated.
 * @param {string} screenText - Current text content of the screen.
 */
function equals(screenText) {
    if (!resultCalculated) {
        num2 = Number(screenText);
        result = operate(num1, num2, operand);
        resultCalculated = true;
        operandPressed = false;
        num2 = 0; operand = "";
        screenResult.textContent = result;
    }
}

/**
 * Removes the last character from the screen.
 * Resets to "0" if only one character remains.
 * Clears the decimal point flag if the removed character was ".".
 * Does nothing if a result has already been calculated.
 * @param {string} screenText - Current text content of the screen.
 */
function backspace(screenText) {
    if (!resultCalculated) {
        if (screenText.at(-1) === ".") { decimalPointInNumber = false; }
        if (!(screenText.length - 1)) { screenResult.textContent = "0"; }
        else { screenResult.textContent = screenText.slice(0, -1); }
    }
}

/**
 * Appends a decimal point to the current number on screen.
 * Does nothing if a result has already been calculated or a decimal point is already present.
 */
function decimalPoint() {
    if (!resultCalculated && !decimalPointInNumber) {
        decimalPointInNumber = true;
        screenResult.textContent += ".";
    }
}