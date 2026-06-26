let num1 = 0;
let num2 = 0;
let operand = "";
let result = 0;
let operandPressed = false;
let resultCalculated = false;

const calculator = document.querySelector("#calculator");
const screen = document.querySelector(".screen");

fillCalculatorButtons();

const btns = document.querySelectorAll("button");
const btnsArray = Array.from(btns);

addListenerToNumberBtns();
addListenerToSpecialBtns();



//--------------------------------------------------------------
//     F U N C T I O N S   F O R    C A L C U L A T O R
//--------------------------------------------------------------


function addListenerToSpecialBtns(){
    const specialBtns = btnsArray.slice(10);

    specialBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const content = btn.textContent;
            const screenText = screen.textContent;

            if(content === "clear") {
                screen.textContent = "0"; 
                num1 = 0; num2 = 0; operand = ""; operandPressed = false;
            }
            else if(content === "=") {
                if(!resultCalculated){
                    num2 = Number(screenText);
                    result = operate(num1, num2, operand);
                    resultCalculated = true;
                    operandPressed = false;
                    num2 = 0; operand = "";
                    screen.textContent = result;
                }
            }
            else {
                operand = content;
                if(!operandPressed){
                    num1 = Number(screenText);
                    screen.textContent = "0";
                    operandPressed = true;
                }
            }
        });
    });
};


function addListenerToNumberBtns(){
    
    const numberBtns = btnsArray.slice(0,10);

    numberBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if(resultCalculated){screen.textContent = "0"; resultCalculated = false;}
            let screenText = screen.textContent;
            const btnText = btn.textContent;
            if(screenText === "0") screen.textContent = btnText;
            else screen.textContent += btnText;
        });   
    })
}


function fillCalculatorButtons(){

    const specialButtons = {
                             Zero:"0", 
                             Add:"+", 
                             Subtract:"-", 
                             Multiply:"*", 
                             Divide:"/", 
                             Equals:"=",
                             Clear:"clear"
                            };
    const specialButtonsKeys = Object.keys(specialButtons);

    for(let row = 1; row < 4; row++){
        const numButtonsRow = document.createElement("div");
        numButtonsRow.setAttribute("class", `row${row}`);

        for(let col = 1; col < 4; col++){
            const numberButton = document.createElement("button");
            numberButton.textContent = (row-1)*3 + col;
            numberButton.setAttribute("class", `button number${col}`);
            numButtonsRow.appendChild(numberButton);    
        }
        calculator.appendChild(numButtonsRow);
    }

    for(let row = 1; row < 4; row++){
        const numButtonsRow = document.createElement("div");
        numButtonsRow.setAttribute("class", `row${row+4}`);

        for(const specialButton of specialButtonsKeys.slice((row-1)*3, 3*row)){
            const numberButton = document.createElement("button");
            numberButton.textContent = specialButtons[specialButton];
            numberButton.setAttribute("class", `button specialChar${specialButton}`);
            numButtonsRow.appendChild(numberButton); 
        }
        calculator.appendChild(numButtonsRow);
    }
}

//--------------------------------------------------------------
//       F U N C T I O N S      F O R      O P E R A T E
//--------------------------------------------------------------

function operate(a, b, operand){
    switch(operand){
        case '+':
            return add(a,b);
        case '-':
            return subtract(a,b);
        case '*':
            return multiply(a,b);
        case '/':
            return divide(a,b);
        default:
            return b;
    }
}

function add(a, b){
    return a+b;
}

function subtract(a, b){
    return a-b;
}

function multiply(a, b){
    return a*b;
}

function divide(a, b){
    if(b === 0){
        alert("Cannot divide by zero");
        return 0;
    }
    return a/b;
}