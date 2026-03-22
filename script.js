const mandalart = document.getElementById('mandalart');
const myVisionMandalart = document.getElementById('myVisionMandalart');
const exampleMandalart = document.getElementById('exampleMandalart');
const versesGrid = document.getElementById('versesGrid');
const currentTimeDisplay = document.getElementById('currentTime');
const deadlineInput = document.getElementById('deadlineDate');
const body = document.body;

// 1. 현재 시간 표시 기능
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

// 2. 데드라인 관리
const savedDeadline = localStorage.getItem('mandalartDeadline');
if (savedDeadline) deadlineInput.value = savedDeadline;
deadlineInput.addEventListener('change', (e) => localStorage.setItem('mandalartDeadline', e.target.value));

// 3. 공통 만다라트 생성 로직
function createMandalartGrid(container, storageKey, isEditable = true) {
    const savedData = JSON.parse(localStorage.getItem(storageKey)) || {};
    const defaultKeywords = storageKey === 'myVisionData' ? [
        "나는새로운피조물", "행복한가정과가족", "건강한라이프",
        "건강한공동체", "내잔이넘치는풍요", "개인의성장",
        "프로페셔널", "잠언31장의여인", "나를둘러싼환경"
    ] : null;

    for (let b = 0; b < 9; b++) {
        const block = document.createElement('div');
        block.classList.add('block', `block-${b}`);
        
        for (let c = 0; c < 9; c++) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('cell-wrapper');

            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.block = b;
            cell.dataset.cell = c;
            
            if (isEditable) cell.contentEditable = "true";
            
            const isCore = (b === 4 || c === 4);
            if (b === 4 && c === 4) cell.classList.add('main-goal');
            else if (isCore) cell.classList.add('sub-goal');

            // 데이터 불러오기
            const key = `${b}-${c}`;
            let cellValue = "";
            if (savedData[key]) {
                if (typeof savedData[key] === 'object') {
                    cellValue = savedData[key].text || "";
                    if (savedData[key].image) applyImageToCell(cell, savedData[key].image);
                } else cellValue = savedData[key];
            } else if (defaultKeywords) {
                if (b === 4) cellValue = defaultKeywords[c];
                else if (c === 4) cellValue = defaultKeywords[b];
            }

            cell.innerText = cellValue;

            if (isEditable) {
                cell.addEventListener('input', (e) => handleInput(e, container, storageKey));
            }

            if (isEditable && isCore) {
                const uploadBtn = document.createElement('button');
                uploadBtn.className = 'image-upload-btn';
                uploadBtn.innerHTML = '📷';
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'image-delete-btn';
                deleteBtn.innerHTML = '✖';
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*';
                fileInput.style.display = 'none';
                
                uploadBtn.addEventListener('click', (e) => { e.stopPropagation(); fileInput.click(); });
                fileInput.addEventListener('change', (e) => handleImageUpload(e, cell, container, storageKey));
                deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); handleImageDelete(cell, container, storageKey); });
                
                wrapper.appendChild(cell);
                wrapper.appendChild(uploadBtn);
                wrapper.appendChild(deleteBtn);
                wrapper.appendChild(fileInput);
            } else wrapper.appendChild(cell);

            block.appendChild(wrapper);
        }
        container.appendChild(block);
    }
}

// 4. 성경 구절 섹션 초기화 (소제목 제거)
function initVerseSection() {
    const savedVerses = JSON.parse(localStorage.getItem('mandalartData_verses')) || {};

    for (let i = 0; i < 9; i++) {
        const item = document.createElement('div');
        item.classList.add('verse-item');
        
        const input = document.createElement('input');
        input.classList.add('verse-input');
        input.placeholder = `핵심 목표 ${i + 1} 관련 말씀`;
        if (i === 4) input.placeholder = `최종 목표 관련 말씀`;
        
        input.value = savedVerses[i] || "";
        input.addEventListener('input', (e) => {
            const verses = JSON.parse(localStorage.getItem('mandalartData_verses')) || {};
            verses[i] = e.target.value;
            localStorage.setItem('mandalartData_verses', JSON.stringify(verses));
        });

        item.appendChild(input);
        versesGrid.appendChild(item);
    }
}

// 5. 오타니 쇼헤이 예시
function initOhtaniExample() {
    const data = {
        "4-4": "8구단 드래프트 1순위", "4-0": "몸만들기", "4-1": "제구", "4-2": "구위", "4-3": "스피드 160km/h", "4-5": "변화구", "4-6": "운", "4-7": "인간성", "4-8": "멘탈",
        "0-4": "몸만들기", "0-0": "영양제 먹기", "0-1": "FSQ 90kg", "0-2": "유연성", "0-3": "체력 유지", "0-5": "식사 7그릇", "0-6": "RSQ 130kg", "0-7": "근육량 증가", "0-8": "부상 방지",
        "6-4": "운", "6-0": "인사하기", "6-1": "쓰레기 줍기", "6-2": "심판을 대하는 태도", "6-3": "장비 소중히", "6-5": "플러스 사고", "6-6": "응원받는 사람", "6-7": "독서", "6-8": "방 청소"
    };
    const subGoals = ["몸만들기", "제구", "구위", "스피드 160km/h", "메인", "변화구", "운", "인간성", "멘탈"];
    subGoals.forEach((goal, i) => { if (i !== 4) data[`${i}-4`] = goal; });
    for (let b = 0; b < 9; b++) {
        const block = document.createElement('div');
        block.classList.add('block');
        for (let c = 0; c < 9; c++) {
            const div = document.createElement('div');
            div.classList.add('cell');
            if (b === 4 && c === 4) div.classList.add('main-goal');
            else if (c === 4 || b === 4) div.classList.add('sub-goal');
            div.innerText = data[`${b}-${c}`] || "";
            block.appendChild(div);
        }
        exampleMandalart.appendChild(block);
    }
}

// 6. 이벤트 핸들러
function handleInput(e, container, storageKey) {
    const b = parseInt(e.target.dataset.block), c = parseInt(e.target.dataset.cell), value = e.target.innerText;
    if (b === 4 && c !== 4) syncCell(container, c, 4, value);
    else if (b !== 4 && c === 4) syncCell(container, 4, b, value);
    saveData(container, storageKey);
}

function handleImageUpload(e, cell, container, storageKey) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const base64Image = event.target.result;
        applyImageToCell(cell, base64Image);
        const b = parseInt(cell.dataset.block), c = parseInt(cell.dataset.cell);
        if (b === 4 && c !== 4) syncCell(container, c, 4, null, base64Image);
        else if (b !== 4 && c === 4) syncCell(container, 4, b, null, base64Image);
        saveData(container, storageKey);
    };
    reader.readAsDataURL(file);
}

function handleImageDelete(cell, container, storageKey) {
    removeImageFromCell(cell);
    const b = parseInt(cell.dataset.block), c = parseInt(cell.dataset.cell);
    if (b === 4 && c !== 4) syncCell(container, c, 4, null, "DELETE");
    else if (b !== 4 && c === 4) syncCell(container, 4, b, null, "DELETE");
    saveData(container, storageKey);
}

function applyImageToCell(cell, imageUrl) {
    cell.classList.add('has-image');
    cell.style.backgroundImage = `url(${imageUrl})`;
    cell.dataset.image = imageUrl;
}

function removeImageFromCell(cell) {
    cell.classList.remove('has-image');
    cell.style.backgroundImage = '';
    delete cell.dataset.image;
}

function syncCell(container, b, c, text = null, imageUrl = null) {
    const target = container.querySelector(`.cell[data-block="${b}"][data-cell="${c}"]`);
    if (target) {
        if (text !== null) target.innerText = text;
        if (imageUrl !== null) {
            if (imageUrl === "DELETE") removeImageFromCell(target);
            else applyImageToCell(target, imageUrl);
        }
    }
}

function saveData(container, storageKey) {
    const data = {};
    container.querySelectorAll('.cell').forEach(cell => {
        const key = `${cell.dataset.block}-${cell.dataset.cell}`;
        data[key] = { text: cell.innerText, image: cell.dataset.image || null };
    });
    localStorage.setItem(storageKey, JSON.stringify(data));
}

createMandalartGrid(mandalart, 'mandalartData');
initVerseSection();
createMandalartGrid(myVisionMandalart, 'myVisionData');
initOhtaniExample();
