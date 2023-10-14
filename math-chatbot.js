function parseInput(userInput) {
    userInput = userInput.replace(/ /g, '').toLowerCase();

    if (/[\+\-\*\/]/.test(userInput)) {
        return ['arithmetic', userInput];
    } else if (/%/.test(userInput) || /percent/.test(userInput)) {
        return ['percentage', userInput];
    } else if (/\^/.test(userInput) || /sqrt/.test(userInput) || /cubert/.test(userInput)) {
        return ['exponent_root', userInput];
    } else if (/sin|cos|tan|cot|sec|csc/.test(userInput)) {
        return ['trigonometry', userInput];
    } else if (/log|ln|exp/.test(userInput)) {
        return ['log_exp', userInput];
    } else {
        return ['unknown', userInput];
    }
}

function enhancedSolveArithmetic(expression) {
    function parseExpression(expr) {
        const operators = ['+', '-', '*', '/'];
        for (let op of operators) {
            if (expr.includes(op)) {
                const operands = expr.split(op);
                return [op, operands];
            }
        }
        return [null, null];
    }

    const [operation, operands] = parseExpression(expression);
    if (operation && operands) {
        const operand1 = parseFloat(operands[0]);
        const operand2 = parseFloat(operands[1]);
        
        let result;
        let explanation;

        switch (operation) {
            case '+':
                result = operand1 + operand2;
                explanation = `${operand1} + ${operand2} = ${result}`;
                break;
            case '-':
                result = operand1 - operand2;
                explanation = `${operand1} - ${operand2} = ${result}`;
                break;
            case '*':
                result = operand1 * operand2;
                explanation = `${operand1} × ${operand2} = ${result}`;
                break;
            case '/':
                if (operand2 === 0) {
                    return ["Division by zero is undefined", "You cannot divide a number by zero."];
                }
                result = operand1 / operand2;
                explanation = `${operand1} ÷ ${operand2} = ${result}`;
                break;
            default:
                return ["Unsupported operation", ""];
        }

        return [result, explanation];
    } else {
        return ["Invalid expression", ""];
    }
}

function enhancedSolvePercentage(expression) {
    try {
        // Extract the percentage and the base value from the expression
        const [percentStr, valueStr] = expression.split("of");
        const percent = parseFloat(percentStr.replace('%', '').trim());
        const value = parseFloat(valueStr.trim());
        
        // Calculate the result
        const result = (percent / 100) * value;
        
        // Provide an explanation
        const explanation = `${percent}% of ${value} is ${result}.`;
        
        return [result, explanation];
    } catch (e) {
        return [null, e.toString()];
    }
}

function enhancedSolveExponentRoot(expression) {
    try {
        // Handle exponentiation
        if (expression.includes('^')) {
            const [baseStr, exponentStr] = expression.split('^');
            const base = parseFloat(baseStr);
            const exponent = parseFloat(exponentStr);
            const result = Math.pow(base, exponent);
            const explanation = `Raising ${base} to the power of ${exponent} gives ${result}.`;
            return [result, explanation];
        
        // Handle square root
        } else if (expression.includes('sqrt')) {
            const number = parseFloat(expression.replace('sqrt(', '').replace(')', '').trim());
            const result = Math.sqrt(number);
            const explanation = `The square root of ${number} is ${result}.`;
            return [result, explanation];
        
        // Handle cube root
        } else if (expression.includes('cubert')) {
            const number = parseFloat(expression.replace('cubert(', '').replace(')', '').trim());
            const result = Math.cbrt(number);
            const explanation = `The cube root of ${number} is ${result}.`;
            return [result, explanation];
        
        } else {
            return [null, "Unsupported operation"];
        }
    } catch (e) {
        return [null, e.toString()];
    }
}

function enhancedSolveTrigonometry(expression) {
    try {
        // Extract the angle value from the expression
        const angle = parseFloat(expression.split('(')[1].split(')')[0]);
        
        // Convert the angle to radians
        const radianAngle = angle * (Math.PI / 180);
        
        let result;
        let explanation;

        // Handle each trigonometric function and provide an explanation
        if (expression.includes('sin')) {
            result = Math.sin(radianAngle);
            explanation = `The sine of ${angle} degrees is ${result}.`;
        } else if (expression.includes('cos')) {
            result = Math.cos(radianAngle);
            explanation = `The cosine of ${angle} degrees is ${result}.`;
        } else if (expression.includes('tan')) {
            result = Math.tan(radianAngle);
            explanation = `The tangent of ${angle} degrees is ${result}.`;
        } // ... similarly for other trigonometric functions
        
        // Add special explanations for well-known angles
        if ([0, 90, 180, 270, 360].includes(angle)) {
            explanation += ` Note: The sine of ${angle} degrees is a standard trigonometric value.`;
        }
        
        return [result, explanation];
    } catch (e) {
        return [null, e.toString()];
    }
}

function enhancedSolveLogExp(expression) {
    try {
        let result;
        let explanation;

        // Handle natural logarithm
        if (expression.includes('ln')) {
            const number = parseFloat(expression.replace('ln(', '').replace(')', '').trim());
            result = Math.log(number);
            explanation = `The natural logarithm (base e) of ${number} is ${result}.`;
        
        // Handle logarithm (base 10)
        } else if (expression.includes('log')) {
            const number = parseFloat(expression.replace('log(', '').replace(')', '').trim());
            result = Math.log10(number);
            explanation = `The logarithm (base 10) of ${number} is ${result}.`;
        
        // Handle exponential
        } else if (expression.includes('exp')) {
            const number = parseFloat(expression.replace('exp(', '').replace(')', '').trim());
            result = Math.exp(number);
            explanation = `The exponential of ${number} (i.e., e^${number}) is ${result}.`;
        
        } else {
            return [null, "Unsupported operation"];
        }
        
        return [result, explanation];
    } catch (e) {
        return [null, e.toString()];
    }
}

function mathChatbot(userInput) {
    const [questionType, parsedInput] = parseInput(userInput);
    switch (questionType) {
        case 'arithmetic':
            return enhancedSolveArithmetic(parsedInput);
        case 'percentage':
            return enhancedSolvePercentage(parsedInput);
        case 'exponent_root':
            return enhancedSolveExponentRoot(parsedInput);
        case 'trigonometry':
            return enhancedSolveTrigonometry(parsedInput);
        case 'log_exp':
            return enhancedSolveLogExp(parsedInput);
        default:
            return "Sorry, I couldn't understand the question.";
    }
}

        
function evaluateExpression(expression) {
    // Handle custom functions
    expression = expression.replace(/\^/g, '**');
    expression = expression.replace(/sqrt\(([^)]+)\)/g, (match, p1) => Math.sqrt(evaluateExpression(p1)));

    // Handle Parentheses
    while (/\([^()]+\)/.test(expression)) {
        let insideParentheses = expression.match(/\([^()]+\)/)[0];
        let resultInside = evaluateExpression(insideParentheses.slice(1, -1));  // Slice to remove the parentheses
        expression = expression.replace(insideParentheses, resultInside);
    }

    // Handle basic arithmetic respecting PEMDAS
    return eval(expression);
}

function mathChatbot(userInput) {
    const [questionType, parsedInput] = parseInput(userInput);
    switch (questionType) {
        case 'arithmetic':
            return evaluateExpression(parsedInput);
        case 'percentage':
            return enhancedSolvePercentage(parsedInput);
        case 'exponent_root':
            return enhancedSolveExponentRoot(parsedInput);
        case 'trigonometry':
            return enhancedSolveTrigonometry(parsedInput);
        case 'log_exp':
            return enhancedSolveLogExp(parsedInput);
        default:
            return "Sorry, I couldn't understand the question.";
    }
}


function appendMessage(message, type) {
    const chatArea = document.getElementById("chatArea");
    const messageDiv = document.createElement("div");
    messageDiv.className = type;
    messageDiv.innerText = message;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function askQuestion() {
    const question = document.getElementById("userInput").value;
    appendMessage(question, "user-message");
    const answer = mathChatbot(question);
    appendMessage(answer, "bot-message");
    document.getElementById("userInput").value = "";
}