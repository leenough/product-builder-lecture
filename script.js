const mandalart = document.getElementById('mandalart');
const exampleMandalart = document.getElementById('exampleMandalart');
const themeToggle = document.getElementById('themeToggle');
const currentTimeDisplay = document.getElementById('currentTime');
const deadlineInput = document.getElementById('deadlineDate');
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

// 2. 현재 시간 표시 기능
function updateClock() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    currentTimeDisplay.textContent = `현재 시각: ${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();

// 3. 데드라인 관리
const savedDeadline = localStorage.getItem('mandalartDeadline');
if (savedDeadline) {
    deadlineInput.value = savedDeadline;
}

deadlineInput.addEventListener('change', (e) => {
    localStorage.setItem('mandalartDeadline', e.target.value);
});

// 4. 만다라트 그리드 생성 (편집용)
function initMandalart() {
    const savedData = JSON.parse(localStorage.getItem('mandalartData')) || {};

    for (let b = 0; b < 9; b++) {
        const block = document.createElement('div');
        block.classList.add('block', `block-${b}`);
        
        for (let c = 0; c < 9; c++) {
            const input = document.createElement('textarea');
            input.classList.add('cell');
            input.dataset.block = b;
            input.dataset.cell = c;
            
            if (b === 4 && c === 4) {
                input.classList.add('main-goal');
                input.placeholder = '최종 목표';
            } else if (c === 4 || b === 4) {
                input.classList.add('sub-goal');
                if (b === 4) input.placeholder = `핵심 목표 ${c + 1}`;
                if (c === 4) input.placeholder = `핵심 목표 ${b + 1}`;
            }

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

// 5. 예시 만다라트 생성 (오타니 쇼헤이)
function initExampleMandalart() {
    const data = {
        "4-4": "8구단 드래프트 1순위",
        "4-0": "몸만들기", "4-1": "제구", "4-2": "구위",
        "4-3": "스피드 160km/h", "4-5": "변화구",
        "4-6": "운", "4-7": "인간성", "4-8": "멘탈",
        "0-4": "몸만들기",
        "0-0": "영양제 먹기", "0-1": "FSQ 90kg", "0-2": "유연성",
        "0-3": "체력 유지", "0-5": "식사 7그릇",
        "0-6": "RSQ 130kg", "0-7": "근육량 증가", "0-8": "부상 방지",
        "6-4": "운",
        "6-0": "인사하기", "6-1": "쓰레기 줍기", "6-2": "심판을 대하는 태도",
        "6-3": "장비 소중히", "6-5": "플러스 사고",
        "6-6": "응원받는 사람", "6-7": "독서", "6-8": "방 청소"
    };

    const subGoals = ["몸만들기", "제구", "구위", "스피드 160km/h", "메인", "변화구", "운", "인간성", "멘탈"];
    subGoals.forEach((goal, i) => {
        if (i !== 4) data[`${i}-4`] = goal;
    });

    for (let b = 0; b < 9; b++) {
        const block = document.createElement('div');
        block.classList.add('block');
        for (let c = 0; c < 9; c++) {
            const div = document.createElement('div');
            div.classList.add('cell');
            if (b === 4 && c === 4) div.classList.add('main-goal');
            else if (c === 4 || b === 4) div.classList.add('sub-goal');
            
            div.textContent = data[`${b}-${c}`] || "";
            block.appendChild(div);
        }
        exampleMandalart.appendChild(block);
    }
}

// 6. 동기화 및 저장 로직
function handleInput(e) {
    const b = parseInt(e.target.dataset.block);
    const c = parseInt(e.target.dataset.cell);
    const value = e.target.value;

    if (b === 4 && c !== 4) {
        updateCell(c, 4, value);
    } else if (b !== 4 && c === 4) {
        updateCell(4, b, value);
    }

    saveAllData();
}

function updateCell(b, c, value) {
    const target = document.querySelector(`#mandalart .cell[data-block="${b}"][data-cell="${c}"]`);
    if (target) {
        target.value = value;
    }
}

function saveAllData() {
    const data = {};
    document.querySelectorAll('#mandalart .cell').forEach(input => {
        const key = `${input.dataset.block}-${input.dataset.cell}`;
        if (input.value) {
            data[key] = input.value;
        }
    });
    localStorage.setItem('mandalartData', JSON.stringify(data));
}

initMandalart();
initExampleMandalart();
