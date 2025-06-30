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

    textarea.value = '안녕하세요.'
    maxLengthDisplay.innerText = `${textarea.value.length}/60`

    // 글자 수 표시 갱신
    textarea.addEventListener('input', () => {
        if (textarea.value.length > 60) {
            alert('최대 60글자만 작성가능합니다.');
        } else {
            maxLengthDisplay.innerText = `${textarea.value.length}/60`;
        }
    });

    // 리셋 버튼 기능
    document.querySelector('.reset-button').addEventListener('click', () => {
        textarea.value = '';
        maxLengthDisplay.innerText = '0/60';
    });

    // 저장 버튼 기능
    document.querySelector('.save-button').addEventListener('click', () => {
        const content = textarea.value;
        // todo 실제 서버에 저장
        alert('변경사항이 저장되었습니다.');
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