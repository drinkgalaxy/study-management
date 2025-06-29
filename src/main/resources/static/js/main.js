
document.addEventListener('DOMContentLoaded', function () {
    // todo 백엔드에서 유저네임 호출
    const username = "이현진";
    document.getElementById('username').textContent = username;

    // todo 백엔드에서 이번주 공부 시간 호출
    let hour = 13;
    let minute = 10;
    let second = 15;
    document.getElementById('hour').textContent = hour;
    document.getElementById('minute').textContent = minute;
    document.getElementById('second').textContent = second;

    // todo 백엔드에서 이번주 공부 시간 호출
    let hours = 13;
    let minutes = 10;
    let seconds = 15;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;

    // todo 백엔드에서 오늘의 날짜 호출
    let year = 2025;
    let month = 6;
    let day = 30;
    const week = '월';

    document.getElementById('year').textContent = year;
    document.getElementById('month').textContent = month;
    document.getElementById('day').textContent = day;
    document.getElementById('week').textContent = week;

    // todo 타임 블럭 시간 가는 기능 넣어야 함
    const nowHour = '00';
    const nowMinute = '00';
    const nowSecond = '00';
    document.getElementById('nowHour').textContent = nowHour;
    document.getElementById('nowMinute').textContent = nowMinute;
    document.getElementById('nowSecond').textContent = nowSecond;

    // todo 참석한 사람들 / 전체 인원 수 데이터 가져와야 함
    let attendanceTrue = 3;
    let attendanceAll = 6;
    document.getElementById('attendance-status-true').textContent = attendanceTrue;
    document.getElementById('attendance-all').textContent = attendanceAll;

    // todo 전체 유저 각 이름, 참석 상태 박스 데이터 가져오기
    // 출석 정보 예시
    const attendanceList = [
        { name: '이현진', status: 'attended' },
        { name: '이유림', status: 'attended' },
        { name: '이스딧', status: 'not-attended' },
        { name: '이이름', status: 'not-attended' },
        { name: '이름름', status: 'on-leave' }
    ];

    // 출석 박스가 들어갈 부모 요소
    const container = document.querySelector('.attendance-container');

    // 스타일 클래스 추가 (flex-wrap 적용 위해)
    container.classList.add('attendance-container');

    container.innerHTML = ''; // 기존 내용 초기화

    attendanceList.forEach(user => {
        // 사용자 한 명의 출석 상태 묶음 div 생성
        const userDiv = document.createElement('div');
        userDiv.classList.add('attendance-item');

        // 이름 span 생성
        const nameSpan = document.createElement('span');
        nameSpan.classList.add('attendance-user-name');
        nameSpan.textContent = user.name;

        // 상태 박스 div 생성
        const statusDiv = document.createElement('div');
        statusDiv.classList.add('attendance-user-box');

        // 상태에 따른 클래스 및 텍스트 설정
        if (user.status === 'attended') {
            statusDiv.classList.add('attended');
            statusDiv.textContent = '출석 완료';
        } else if (user.status === 'not-attended') {
            statusDiv.classList.add('not-attended');
            statusDiv.textContent = '출석 전';
        } else if (user.status === 'on-leave') {
            statusDiv.classList.add('on-leave');
            statusDiv.textContent = '휴가';
        }

        // userDiv에 이름과 상태 박스 추가
        userDiv.appendChild(nameSpan);
        userDiv.appendChild(statusDiv);

        // 최종 컨테이너에 userDiv 추가
        container.appendChild(userDiv);
    });

    // todo 지금 공부 중인 멤버 수, 멤버 가져오기
    // 공부중인 멤버 정보 예시
    const studyingMemberList = [
        { name: '이현진', status: 'attended' },
        { name: '이유림', status: 'attended' }
    ];

    // 멤버 수 추가
    document.getElementById('studying-user-count').textContent = studyingMemberList.length;

    // 출석 박스가 들어갈 부모 요소
    const studyingContainer = document.querySelector('.studying-container');
    studyingContainer.innerHTML = ''; // 기존 초기화

    studyingMemberList.forEach(user => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('studying-item');

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('studying-user-name');
        nameSpan.textContent = user.name;

        itemDiv.appendChild(nameSpan);
        studyingContainer.appendChild(itemDiv);
    });

    // todo 이번 달 랭킹 가져오기
    const rankingList = [
        { name: '김일등', time: '104 : 20 : 02' },
        { name: '김이등', time: '64 : 10 : 02' },
        { name: '김삼등', time: '57 : 50 : 02' },
        { name: '김사등', time: '43 : 20 : 02' },
        { name: '김오등', time: '37 : 16 : 02' },
        { name: '김육등', time: '25 : 02 : 02' }
    ];

    const rankingContainer = document.querySelector('.ranking-container');
    rankingContainer.innerHTML = ''; // 기존 초기화

    rankingList.forEach((user, index) => {
        const item = document.createElement('div');
        item.classList.add('ranking-item');

        const rank = document.createElement('div');
        rank.classList.add('ranking-rank');
        rank.textContent = index + 1;

        const name = document.createElement('div');
        name.classList.add('ranking-name');
        name.textContent = user.name;

        const time = document.createElement('div');
        time.classList.add('ranking-time');
        time.textContent = user.time;

        item.appendChild(rank);
        item.appendChild(name);
        item.appendChild(time);

        rankingContainer.appendChild(item);
    });

    // 타이머 및 버튼 제어 로직 추가
    // todo 종료 후 데이터 서버로 전송해야 함
    let timerInterval;
    let totalSeconds = 0;
    let isPaused = false;

    const startButton = document.querySelector('.start-button');
    const stopButton = document.querySelector('.stop-button');
    const endButton = document.querySelector('.end-button');

    // 초기 버튼 상태 설정
    stopButton.disabled = true;
    endButton.disabled = true;

    function updateTimerDisplay() {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        document.getElementById('nowHour').textContent = String(hours).padStart(2, '0');
        document.getElementById('nowMinute').textContent = String(minutes).padStart(2, '0');
        document.getElementById('nowSecond').textContent = String(seconds).padStart(2, '0');
    }

    startButton.addEventListener('click', () => {
        if (isPaused) {
            isPaused = false;
        }

        startButton.disabled = true;
        startButton.classList.add('button-disabled');
        startButton.classList.remove('button-enabled-blue');

        stopButton.disabled = false;
        stopButton.classList.add('button-enabled-yellow');
        stopButton.classList.remove('button-disabled');

        endButton.disabled = false;
        endButton.classList.add('button-enabled-blue');
        endButton.classList.remove('button-disabled');


        timerInterval = setInterval(() => {
            totalSeconds++;
            updateTimerDisplay();
        }, 1000);
    });

    stopButton.addEventListener('click', () => {
        if (!isPaused) {
            // 중단
            clearInterval(timerInterval);
            isPaused = true;
            stopButton.textContent = '재개';
        } else {
            // 재개
            isPaused = false;
            stopButton.textContent = '중단';
            stopButton.classList.add('button-enabled-yellow');
            stopButton.classList.remove('button-enabled-blue');

            timerInterval = setInterval(() => {
                totalSeconds++;
                updateTimerDisplay();
            }, 1000);
        }
    });

    endButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        updateTimerDisplay();

        // 버튼 상태 초기화
        startButton.disabled = false;
        startButton.classList.remove('button-disabled');
        startButton.classList.add('button-enabled-blue');

        stopButton.disabled = true;
        stopButton.textContent = '중단';
        stopButton.classList.remove('button-enabled-yellow');
        stopButton.classList.remove('button-enabled-blue');
        stopButton.classList.add('button-disabled');

        endButton.disabled = true;
        endButton.classList.remove('button-enabled-blue');
        endButton.classList.add('button-disabled');

        // 서버로 전송할 시간 데이터
        let hour = Math.floor(totalSeconds / 3600);
        let minute = Math.floor((totalSeconds % 3600) / 60);
        let second = totalSeconds % 60;

        console.log('서버 전송:', { hour, minute, second });

        // fetch로 서버에 전송 (API 경로 수정 필요)
        // fetch('/api/study-time', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ hour, minute, second, username })
        // });

        // 성공 후 시간 데이터 초기화
        document.getElementById('nowHour').textContent = '00';
        document.getElementById('nowMinute').textContent = '00';
        document.getElementById('nowSecond').textContent = '00';

        totalSeconds = 0;
    });

});