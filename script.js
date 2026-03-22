const resultDiv = document.getElementById('result');
const drawBtn = document.getElementById('drawBtn');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// 테마 관리 로직
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    let theme = 'light';
    if (body.classList.contains('dark-mode')) {
        theme = 'dark';
        themeToggle.textContent = '🌙';
    } else {
        themeToggle.textContent = '☀️';
    }
    localStorage.setItem('theme', theme);
});

// 로또 번호 생성 함수
function generateLottoNumbers() {
    const numbers = [];
    while (numbers.length < 6) {
        const num = Math.floor(Math.random() * 45) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    // 오름차순 정렬
    return numbers.sort((a, b) => a - b);
}

// 색상 클래스 반환 함수
function getColorClass(num) {
    if (num <= 10) return 'yellow';
    if (num <= 20) return 'blue';
    if (num <= 30) return 'red';
    if (num <= 40) return 'gray';
    return 'green';
}

// 버튼 클릭 이벤트
drawBtn.addEventListener('click', () => {
    const winningNumbers = generateLottoNumbers();
    
    // 결과 영역 초기화
    resultDiv.innerHTML = '';

    // 공 하나씩 생성 (약간의 시간차를 두고)
    winningNumbers.forEach((num, index) => {
        setTimeout(() => {
            const ball = document.createElement('div');
            ball.classList.add('ball', getColorClass(num));
            ball.textContent = num;
            resultDiv.appendChild(ball);
        }, index * 200); // 0.2초 간격으로 등장
    });
});
