const mandalart = document.getElementById('mandalart');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// 1. 테마 관리
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('theme', theme);
});

// 2. 만다라트 그리드 생성
function initMandalart() {
    const savedData = JSON.parse(localStorage.getItem('mandalartData')) || {};

    // 9개 블록 생성 (0-8)
    for (let b = 0; b < 9; b++) {
        const block = document.createElement('div');
        block.classList.add('block', `block-${b}`);
        
        // 각 블록 내 9개 셀 생성 (0-8)
        for (let c = 0; c < 9; c++) {
            const input = document.createElement('textarea');
            input.classList.add('cell');
            input.dataset.block = b;
            input.dataset.cell = c;
            
            // 중앙 블록(4번 블록)
            if (b === 4) {
                if (c === 4) {
                    input.classList.add('main-goal');
                    input.placeholder = '최종 목표';
                } else {
                    input.classList.add('sub-goal');
                    input.placeholder = `핵심 목표 ${c + 1}`;
                }
            } 
            // 주변 블록 (0,1,2,3,5,6,7,8번 블록)
            else {
                if (c === 4) {
                    input.classList.add('sub-goal');
                    input.placeholder = `핵심 목표 ${b + 1}`;
                } else {
                    input.placeholder = `세부 실행`;
                }
            }

            // 데이터 불러오기
            const key = `${b}-${c}`;
            if (savedData[key]) {
                input.value = savedData[key];
            }

            input.addEventListener('input', (e) => handleInput(e));
            block.appendChild(input);
        }
        mandalart.appendChild(block);
    }
}

// 3. 동기화 및 저장 로직
function handleInput(e) {
    const b = parseInt(e.target.dataset.block);
    const c = parseInt(e.target.dataset.cell);
    const value = e.target.value;

    // 동기화 규칙:
    // 1. 중앙 블록(4)의 주변 셀(c != 4) 입력 시 -> 해당 인덱스의 블록(c)의 중심 셀(4) 동기화
    if (b === 4 && c !== 4) {
        updateCell(c, 4, value);
    } 
    // 2. 주변 블록(b != 4)의 중심 셀(4) 입력 시 -> 중앙 블록(4)의 해당 인덱스 셀(b) 동기화
    else if (b !== 4 && c === 4) {
        updateCell(4, b, value);
    }

    saveAllData();
}

function updateCell(b, c, value) {
    const target = document.querySelector(`.cell[data-block="${b}"][data-cell="${c}"]`);
    if (target) {
        target.value = value;
    }
}

function saveAllData() {
    const data = {};
    document.querySelectorAll('.cell').forEach(input => {
        const key = `${input.dataset.block}-${input.dataset.cell}`;
        if (input.value) {
            data[key] = input.value;
        }
    });
    localStorage.setItem('mandalartData', JSON.stringify(data));
}

initMandalart();
