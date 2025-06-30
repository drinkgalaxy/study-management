document.addEventListener('DOMContentLoaded', function () {

    // todo 백엔드에서 유저네임 호출
    const username = "이현진";
    document.getElementById('username').textContent = username;

    // todo 백엔드에서 연속 학습 일자 호출
    const learning = 1;
    document.getElementById('learning-day').textContent = learning;

    const textarea = document.getElementById("content");
    const maxLengthDisplay = document.getElementById("max-word-length");

    // todo 서버에서 기존 자기소개 호출
    // fetch('/api/my-intro') // 백엔드에서 이 엔드포인트에서 JSON 리턴한다고 가정
    //     .then(response => response.json())
    //     .then(data => {
    //         textarea.value = data.intro || ''; // intro 필드가 없으면 빈 문자열
    //         maxLengthDisplay.innerText = `${textarea.value.length}/60`;
    //     });

    // 초기 글자 수 세팅
    textarea.value = '안녕하세요.';
    maxLengthDisplay.innerHTML = `<span class="max-word-length-bold">${textarea.value.length}</span>/60`;
    let originalText = textarea.value;

    // 저장 버튼 이미지 관련 요소
    const saveBefore = document.querySelector('.save-before');
    const saveAfter = document.querySelector('.save-after');
    const saveButton = document.querySelector('.save-button');

    // 초기 이미지 상태 설정
    saveBefore.style.display = 'inline';
    saveAfter.style.display = 'none';
    saveButton.disabled = true;

    // input 이벤트 내부 수정
    textarea.addEventListener('input', () => {
        if (textarea.value.length > 60) {
            alert('최대 60글자만 작성가능합니다.');
            textarea.value = textarea.value.substring(0, 60);
        }

        maxLengthDisplay.innerHTML = `<span class="max-word-length-bold">${textarea.value.length}</span>/60`;

        if (textarea.value !== originalText) {
            saveBefore.style.display = 'none';
            saveAfter.style.display = 'inline';
            saveButton.disabled = false;
        } else {
            saveBefore.style.display = 'inline';
            saveAfter.style.display = 'none';
            saveButton.disabled = true;
        }
    });

    // 리셋 버튼 기능
    document.querySelector('.reset-button').addEventListener('click', () => {
        textarea.value = '';
        maxLengthDisplay.innerText = '';
        saveBefore.style.display = 'none';
        saveAfter.style.display = 'inline';
    });

    // 저장 버튼 기능
    saveButton.addEventListener('click', () => {
        const content = textarea.value;
        // todo 실제 서버로 변경 사항 전송
        alert('변경사항이 저장되었습니다.');

        // 저장 완료 후 상태 초기화
        originalText = content;

        saveBefore.style.display = 'inline';
        saveAfter.style.display = 'none';
    });

    // todo 백엔드에서 이번달 공부 시간 호출
    let hours = 13;
    let minutes = 10;
    let seconds = 15;
    document.querySelector('.hours').textContent = hours;
    document.querySelector('.minutes').textContent = minutes;
    document.querySelector('.seconds').textContent = seconds;

    // todo 백엔드에서 이번달 남은 휴가 호출
    let leaveDayReal = 3;
    document.querySelector('.leave-day-real').textContent = leaveDayReal;
});