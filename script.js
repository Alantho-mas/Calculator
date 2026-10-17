const display = document.getElementById('result');

function insert(char) {
    display.value += char;
}

function clearScreen() {
    display.value = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// Safe expression evaluator (no eval()).
// Supports + - * / % , decimals, parentheses, and unary minus.
function evaluate(expr) {
    const clean = expr.replace(/\s+/g, '');
    if (clean === '' || !/^[0-9+\-*/%().]+$/.test(clean)) {
        throw new Error('Invalid expression');
    }
    const raw = clean.match(/(\d+\.?\d*|\.\d+|[+\-*/%()])/g);
    if (!raw || raw.join('') !== clean) {
        throw new Error('Invalid expression');
    }

    // Merge a unary minus with the number that follows it, e.g. "-5" or "3*-2".
    const tokens = [];
    for (let i = 0; i < raw.length; i++) {
        const t = raw[i];
        if (t === '-' && (i === 0 || raw[i - 1] === '(' || '+-*/%'.includes(raw[i - 1]))) {
            const next = raw[i + 1];
            if (next !== undefined && !isNaN(next)) {
                tokens.push('-' + next);
                i++;
                continue;
            }
            throw new Error('Invalid expression');
        }
        tokens.push(t);
    }

    const prec = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2 };
    const values = [];
    const ops = [];

    const applyOp = () => {
        const op = ops.pop();
        const b = values.pop();
        const a = values.pop();
        if (a === undefined || b === undefined) throw new Error('Invalid expression');
        let r;
        switch (op) {
            case '+': r = a + b; break;
            case '-': r = a - b; break;
            case '*': r = a * b; break;
            case '/':
                if (b === 0) throw new Error('Division by zero');
                r = a / b;
                break;
            case '%': r = a % b; break;
            default: throw new Error('Invalid expression');
        }
        values.push(r);
    };

    for (const t of tokens) {
        if (!isNaN(t)) {
            values.push(parseFloat(t));
        } else if (t === '(') {
            ops.push(t);
        } else if (t === ')') {
            while (ops.length && ops[ops.length - 1] !== '(') applyOp();
            if (!ops.length) throw new Error('Invalid expression');
            ops.pop();
        } else {
            while (ops.length && ops[ops.length - 1] !== '(' && prec[ops[ops.length - 1]] >= prec[t]) {
                applyOp();
            }
            ops.push(t);
        }
    }
    while (ops.length) {
        if (ops[ops.length - 1] === '(') throw new Error('Invalid expression');
        applyOp();
    }
    if (values.length !== 1) throw new Error('Invalid expression');
    return values[0];
}

function calculate() {
    try {
        const value = evaluate(display.value);
        if (!Number.isFinite(value)) throw new Error('Invalid expression');
        // Round off floating-point noise, e.g. 0.1 + 0.2
        display.value = String(parseFloat(value.toPrecision(12)));
    } catch (e) {
        display.value = 'Error';
    }
}

// Keyboard support: type to enter, Enter/= to calculate,
// Backspace to delete, Esc to clear.
document.addEventListener('keydown', (e) => {
    if (/^[0-9+\-*/.()%]$/.test(e.key)) {
        insert(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace') {
        deleteLast();
    } else if (e.key === 'Escape') {
        clearScreen();
    }
});
