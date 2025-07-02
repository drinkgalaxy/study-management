document.addEventListener('DOMContentLoaded', async function () {

    function parseDuration(durationStr) {
        // 예: "PT10H10M30S", "PT10H10S", "PT5M", "PT45S"
        const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
        const matches = durationStr.match(regex);

        return {
            hours: matches[1] ? parseInt(matches[1], 10) : 0,
            minutes: matches[2] ? parseInt(matches[2], 10) : 0,
            seconds: matches[3] ? parseInt(matches[3], 10) : 0,
        };
    }

    let username = '이현진';
    let hour;
    let minute;
    let second;
    let hours;
    let minutes;
    let seconds;

    // 서버에 로그인 한 유저 홈 정보 조회 요청
    try {
        const response = await fetch("http://localhost:8080/api/users/home", {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const res = await response.json();
            const data = res.data;
            console.log('data = '+ data);
            // 여기서 화면에 출력 등 처리
            username = data.name;

            const thisWeek = parseDuration(data.thisWeekStudyTimes);
            const thisMonth = parseDuration(data.thisMonthStudyTimes);

            hour = thisWeek.hours;
            minute = thisWeek.minutes;
            second = thisWeek.seconds;

            hours = thisMonth.hours;
            minutes = thisMonth.minutes;
            seconds = thisMonth.seconds;


        } else {
            console.log('헤더 정보 =========',response.headers)
            console.log('status 정보 =========',response.status)
            console.log('json 정보 =========',response.json)
            console.error('홈 정보 조회 실패:', response.status);
        }

    } catch (err) {
        console.error("홈 정보 조회 중 오류:", err);
        alert("서버 오류가 발생했습니다.");
    }



    // todo 백엔드에서 유저네임 호출
    document.getElementById('username').textContent = username;

    // todo 백엔드에서 이번주 공부 시간 호출
    document.getElementById('hour').textContent = hour;
    document.getElementById('minute').textContent = minute;
    document.getElementById('second').textContent = second;

    // todo 백엔드에서 이번달 공부 시간 호출
    document.querySelector('.hours').textContent = hours;
    document.querySelector('.minutes').textContent = minutes;
    document.querySelector('.seconds').textContent = seconds;

    // 오늘의 날짜 가져오기
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const week = days[today.getDay()];

    document.getElementById('year').textContent = year;
    document.getElementById('month').textContent = month;
    document.getElementById('day').textContent = day;
    document.getElementById('week').textContent = week;

    const nowHour = '00';
    const nowMinute = '00';
    const nowSecond = '00';
    document.getElementById('nowHour').textContent = nowHour;
    document.getElementById('nowMinute').textContent = nowMinute;
    document.getElementById('nowSecond').textContent = nowSecond;

    // todo 참석한 사람들 / 전체 인원 수 데이터 가져와야 함
    let attendanceTrue = 2;
    let attendanceAll = 6;
    document.getElementById('attendance-status-true').textContent = attendanceTrue;
    document.getElementById('attendance-all').textContent = attendanceAll;

    // todo 전체 유저 출석 현황 조회
    const userDataList = [
        {
            name: '김일등',
            time: '104 : 20 : 02',
            email: 'first@study.com',
            intro: '열심히 공부하는 김일등입니다!',
            status: 'attended'
        },
        {
            name: '김이등',
            time: '64 : 10 : 02',
            email: 'second@study.com',
            intro: '매일 조금씩 성장하는 김이등입니다.',
            status: 'attended'
        },
        {
            name: '김삼등',
            time: '57 : 50 : 02',
            email: 'third@study.com',
            intro: '성실함이 무기인 김삼등입니다.',
            status: 'not-attended'
        },
        {
            name: '김사등',
            time: '43 : 20 : 02',
            email: 'fourth@study.com',
            intro: '',
            status: 'not-attended'
        },
        {
            name: '김오등',
            time: '37 : 16 : 02',
            email: 'fifth@study.com',
            intro: '아직 갈 길이 멀지만 열심히 하는 김오등입니다.',
            status: 'on-leave'
        },
        {
            name: '김육등',
            time: '25 : 02 : 02',
            email: 'sixth@study.com',
            intro: '조용히 실력을 쌓는 김육등입니다.',
            status: 'on-leave'
        }
    ];

    // 출석 박스가 들어갈 부모 요소
    const container = document.querySelector('.attendance-container');

    // 스타일 클래스 추가 (flex-wrap 적용 위해)
    container.classList.add('attendance-container');

    container.innerHTML = ''; // 기존 내용 초기화

    userDataList.forEach(user => {
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
        {name: '김일등', status: 'attended'},
        {name: '김이등', status: 'attended'}
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

    // todo 이번 달 랭킹 및 데이터 가져오기

    const rankingContainer = document.querySelector('.ranking-container');
    rankingContainer.innerHTML = ''; // 기존 초기화

    userDataList.forEach((user, index) => {
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

    const savedTime = localStorage.getItem('studyTimer');
    const savedIsPaused = localStorage.getItem('isPaused');
    const savedIsRunning = localStorage.getItem('isRunning');

    if (savedTime !== null) {
        totalSeconds = parseInt(savedTime);
        isPaused = savedIsPaused === 'true';
        updateTimerDisplay();
    }

    const startButton = document.querySelector('.start-button');
    const stopButton = document.querySelector('.stop-button');
    const endButton = document.querySelector('.end-button');

    function updateTimerDisplay() {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        document.getElementById('nowHour').textContent = String(hours).padStart(2, '0');
        document.getElementById('nowMinute').textContent = String(minutes).padStart(2, '0');
        document.getElementById('nowSecond').textContent = String(seconds).padStart(2, '0');
    }

    function setTimerButtonsState(running, paused) {
        if (running) {
            startButton.disabled = true;
            startButton.classList.add('button-disabled');
            startButton.classList.remove('button-enabled-blue');

            stopButton.disabled = false;
            stopButton.textContent = paused ? '재개' : '중단';
            stopButton.classList.remove('button-disabled', 'button-enabled-blue', 'button-enabled-yellow');
            stopButton.classList.add('button-enabled-yellow');

            endButton.disabled = false;
            endButton.classList.remove('button-disabled');
            endButton.classList.add('button-enabled-blue');
        } else {
            startButton.disabled = false;
            startButton.classList.remove('button-disabled');
            startButton.classList.add('button-enabled-blue');

            stopButton.disabled = true;
            stopButton.textContent = '중단';
            stopButton.classList.remove('button-enabled-yellow', 'button-enabled-blue');
            stopButton.classList.add('button-disabled');

            endButton.disabled = true;
            endButton.classList.remove('button-enabled-blue');
            endButton.classList.add('button-disabled');
        }
    }


    if (savedIsRunning === 'true') {
        setTimerButtonsState(true, isPaused);
        if (!isPaused) {
            timerInterval = setInterval(() => {
                totalSeconds++;
                updateTimerDisplay();
                localStorage.setItem('studyTimer', totalSeconds);
            }, 1000);
        }
    } else {
        setTimerButtonsState(false, false);
    }

    startButton.addEventListener('click', () => {
        isPaused = false;
        setTimerButtonsState(true, false);
        localStorage.setItem('isRunning', 'true');
        localStorage.setItem('isPaused', 'false');

        timerInterval = setInterval(() => {
            totalSeconds++;
            updateTimerDisplay();
            localStorage.setItem('studyTimer', totalSeconds);
        }, 1000);
    });

    stopButton.addEventListener('click', () => {
        if (isPaused) {
            // 재개 시 타이머 다시 시작
            isPaused = false;
            stopButton.textContent = '중단';
            setTimerButtonsState(true, false);
            localStorage.setItem('isPaused', 'false');

            timerInterval = setInterval(() => {
                totalSeconds++;
                updateTimerDisplay();
                localStorage.setItem('studyTimer', totalSeconds);
            }, 1000);
        } else {
            // 중단
            clearInterval(timerInterval);
            isPaused = true;
            stopButton.textContent = '재개';
            setTimerButtonsState(true, true);
            localStorage.setItem('isPaused', 'true');
        }
    });

    endButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        setTimerButtonsState(false, false);
        localStorage.removeItem('studyTimer');
        localStorage.removeItem('isRunning');
        localStorage.removeItem('isPaused');
        alert('오늘의 공부 시간이 저장되었습니다.');
        updateTimerDisplay();
    });

    // 특정 멤버 선택 모달창 열고 닫기

    const modalOverlay = document.getElementById('modal-overlay');
    const memberModal = document.getElementById('member-modal');
    const closeMemberModalBtn = document.getElementById('close-member-modal');

    // 모달 내 요소
    const modalName = memberModal.querySelector('.member-name-text');
    const modalEmail = memberModal.querySelector('.member-email');
    const modalIntro = memberModal.querySelector('.member-intro');
    const modalStudyTime = memberModal.querySelector('.member-study-time .blue-text');

    // 모달 열기 함수 (userDataList에서 멤버 데이터 찾아서 모달에 세팅)
    function openMemberModal(name) {
        const user = userDataList.find(u => u.name === name);
        if (!user) return;

        modalName.textContent = user.name;
        modalEmail.textContent = user.email || '이메일 정보 없음';
        modalIntro.textContent = user.intro || '소개 정보 없음';
        modalStudyTime.textContent = user.time || '00 : 00 : 00';

        modalOverlay.style.display = 'flex';
        memberModal.style.display = 'block';
    }

    // 모달 닫기 함수
    function closeMemberModal() {
        modalOverlay.style.display = 'none';
        memberModal.style.display = 'none';
    }

    // 출석 현황 이름 클릭 이벤트 추가
    document.querySelectorAll('.attendance-user-name').forEach(el => {
        el.addEventListener('click', () => {
            openMemberModal(el.textContent);
        });
    });

    // 공부 중인 멤버 이름 클릭 이벤트 추가
    document.querySelectorAll('.studying-user-name').forEach(el => {
        el.addEventListener('click', () => {
            openMemberModal(el.textContent);
        });
    });

    // 이번 달 랭킹 이름 클릭 이벤트 추가
    document.querySelectorAll('.ranking-name').forEach(el => {
        el.addEventListener('click', () => {
            openMemberModal(el.textContent);
        });
    });

    // 모달 닫기 버튼 클릭 시 닫기
    closeMemberModalBtn.addEventListener('click', closeMemberModal);

    // 오버레이 클릭 시 닫기
    modalOverlay.addEventListener('click', closeMemberModal);

    // 초기화 모달창 열고 닫기
    const resetModal = document.getElementById('reset-modal');
    const resetText = document.querySelector('.reset-text');
    const cancelBtn = document.querySelector('.reset-cancel');
    const confirmBtn = document.getElementById('reset-confirm');

    function openResetModal() {
        modalOverlay.style.display = 'flex';
        resetModal.style.display = 'block';
    }

    function closeResetModal() {
        modalOverlay.style.display = 'none';
        resetModal.style.display = 'none';
    }

    // 모달 열기
    resetText.addEventListener('click', openResetModal);

    // 취소 모달 닫기
    cancelBtn.addEventListener('click', closeResetModal);

    // 오버레이 모달 닫기
    modalOverlay.addEventListener('click', closeResetModal);

    // 확인 후 초기화 -> alert -> 모달 닫기
    confirmBtn.addEventListener('click', () => {
        // 버튼 상태 초기화
        document.getElementById('nowHour').textContent = '00';
        document.getElementById('nowMinute').textContent = '00';
        document.getElementById('nowSecond').textContent = '00';

        totalSeconds = 0;
        clearInterval(timerInterval);

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

        localStorage.removeItem('studyTimer');

        alert('타이머가 초기화되었습니다.');

        closeResetModal();
    });

});
