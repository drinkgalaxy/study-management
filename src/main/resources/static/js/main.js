document.addEventListener('DOMContentLoaded', async function () {

    const host = '43.200.176.218:8080';

    let username;
    let introduce;
    let hour;
    let minute;
    let second;
    let hours;
    let minutes;
    let seconds;
    let userDataList;

    // 서버에 로그인 한 유저 홈 정보 조회 요청
    try {
        const response = await fetch("http://"+ host +"/api/users/home", {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const res = await response.json();
            const data = res.data;
            username = data.name;

            const thisWeek = formatDurationToString(data.thisWeekStudyTimes);
            const thisMonth = formatDurationToString(data.thisMonthStudyTimes);

            hour = checkDigit(thisWeek.hours)
            minute = checkDigit(thisWeek.minutes)
            second = checkDigit(thisWeek.seconds)

            hours = checkDigit(thisMonth.hours)
            minutes = checkDigit(thisMonth.minutes)
            seconds = checkDigit(thisMonth.seconds)


        } else if (response.status === 403) {
            alert("로그인 후 이용해주세요.");
            window.location.href = 'login.html';
        } else {
            console.error('홈 정보 조회 실패:', response.status);
        }

    } catch (err) {
        console.error("홈 정보 조회 중 오류:", err);
        alert("서버 연결 중 오류가 발생했습니다.");
    }



    // 백엔드에서 유저네임 호출
    document.getElementById('username').textContent = username;

    // 백엔드에서 이번주 공부 시간 호출
    document.getElementById('hour').textContent = hour;
    document.getElementById('minute').textContent = minute;
    document.getElementById('second').textContent = second;

    // 백엔드에서 이번달 공부 시간 호출
    document.querySelector('.hours').textContent = hours;
    document.querySelector('.minutes').textContent = minutes;
    document.querySelector('.seconds').textContent = seconds;

    const localKeyPrefix = `user_${username}_`;
    // 오늘 날짜가 아닐 경우 자동으로 로컬 스토리지 데이터 초기화
    const todayDate = new Date().toISOString().slice(0, 10);  // 현재 날짜: "YYYY-MM-DD"
    const savedDate = localStorage.getItem(localKeyPrefix + 'studyTimerDate');
    if (savedDate !== todayDate) {
        // 날짜가 다르면 localStorage 초기화
        localStorage.removeItem(localKeyPrefix + 'studyTimerDate');
    }


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

    // 전체 유저 정보 조회
    try {
        const response = await fetch("http://"+ host +"/api/users", {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const res = await response.json();
            const data = res.data;

            userDataList = data.map(user => ({
                name: user.name,
                time: formatDurationToString(user.thisMonthStudyTimes),
                email: user.email,
                introduce: user.introduce || '',
                status: mapAttendanceStatus(user.todayAttendanceStatus)
            }));


        } else {
            console.error('전체 유저 정보 조회 실패:', response.status);
        }

    } catch (err) {
        console.error("전체 유저 정보 조회 중 오류:", err);
        alert("서버 연결 중 오류가 발생했습니다.");
    }

    // 참석한 사람들 count 호출
    let attendanceTrue;

    try {
        const response = await fetch("http://"+ host +"/api/users/count/attending", {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const res = await response.json();
            const data = res.data;

            attendanceTrue = data.count;

        } else {
            console.error('참석한 사람들 조회 실패:', response.status);
        }

    } catch (err) {
        console.error("참석한 사람들 조회 중 오류:", err);
        alert("서버 연결 중 오류가 발생했습니다.");

    }

    let attendanceAll = userDataList.length;
    document.getElementById('attendance-status-true').textContent = attendanceTrue;
    document.getElementById('attendance-all').textContent = attendanceAll;

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
        } else if (user.status === 'vacation') {
            statusDiv.classList.add('vacation');
            statusDiv.textContent = '휴가';
        }

        // userDiv에 이름과 상태 박스 추가
        userDiv.appendChild(nameSpan);
        userDiv.appendChild(statusDiv);

        // 최종 컨테이너에 userDiv 추가
        container.appendChild(userDiv);
    });

    // 공부중인 멤버 정보 가져오기
    let studyingMemberList = [];

    try {
        const response = await fetch("http://"+ host +"/api/users/count/studying", {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const res = await response.json();
            studyingMemberList = res.data;
        } else {
            console.error('공부 중인 멤버 조회 실패:', response.status);
        }

    } catch (err) {
        console.error("공부 중인 멤버 조회 중 오류:", err);
        alert("서버 연결 중 오류가 발생했습니다.");
    }

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

    // 이번 달 랭킹

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
        time.textContent = checkDigit(user.time.hours) + ':' + checkDigit(user.time.minutes) + ':' + checkDigit(user.time.seconds);

        item.appendChild(rank);
        item.appendChild(name);
        item.appendChild(time);

        rankingContainer.appendChild(item);
    });

    // 타이머 및 버튼 제어 로직 종료 후 데이터 서버로 전송
    let timerInterval;
    let totalSeconds = 0;
    let isPaused = false;

    const savedTime = localStorage.getItem(localKeyPrefix + 'studyTimer');
    const savedIsPaused = localStorage.getItem(localKeyPrefix + 'isPaused');
    const savedIsRunning = localStorage.getItem(localKeyPrefix + 'isRunning');

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
                localStorage.setItem(localKeyPrefix + 'studyTimer', totalSeconds);
            }, 1000);
        }
    } else {
        setTimerButtonsState(false, false);
    }

    startButton.addEventListener('click', async () => {
        // 출석 완료
        try {
            const response = await fetch("http://"+ host +"/api/attendance/attended", {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                isPaused = false;
                setTimerButtonsState(true, false);
                localStorage.removeItem(localKeyPrefix + 'studyTimer');
                localStorage.setItem(localKeyPrefix + 'studyTimerDate', new Date().toISOString().slice(0, 10));
                localStorage.setItem(localKeyPrefix + 'isRunning', 'true');
                localStorage.setItem(localKeyPrefix + 'isPaused', 'false');

                timerInterval = setInterval(() => {
                    totalSeconds++;
                    updateTimerDisplay();
                    localStorage.setItem(localKeyPrefix + 'studyTimer', totalSeconds);
                }, 1000);
            } else {
                alert("시작 요청이 실패했습니다.");
            }
        } catch (err) {
            alert("서버 연결 중 오류가 발생했습니다.");
        }

        // 공부 중
        try {
            const response = await fetch("http://"+ host +"/api/attendance/study/studying", {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                location.reload();
            } else {
                alert("시작 요청이 실패했습니다.");
            }
        } catch (err) {
            alert("서버 연결 중 오류가 발생했습니다.");
        }
    });

    stopButton.addEventListener('click', async () => {
        if (isPaused) {
            // 공부 중
            try {
                const response = await fetch("http://"+ host +"/api/attendance/study/studying", {
                    method: "PATCH",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    isPaused = false;
                    stopButton.textContent = '중단';
                    setTimerButtonsState(true, false);
                    localStorage.setItem(localKeyPrefix + 'isPaused', 'false');

                    timerInterval = setInterval(() => {
                        totalSeconds++;
                        updateTimerDisplay();
                        localStorage.setItem(localKeyPrefix + 'studyTimer', totalSeconds);
                    }, 1000);
                    location.reload();
                } else {
                    alert("시작 요청이 실패했습니다.");
                }
            } catch (err) {
                alert("서버 연결 중 오류가 발생했습니다.");
            }
        } else {
            // 공부 중단
            try {
                const response = await fetch("http://"+ host +"/api/attendance/study/paused", {
                    method: "PATCH",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    clearInterval(timerInterval);
                    isPaused = true;
                    stopButton.textContent = '재개';
                    setTimerButtonsState(true, true);
                    localStorage.setItem(localKeyPrefix + 'isPaused', 'true');
                    location.reload();
                } else {
                    alert("중단 요청이 실패했습니다.");
                }
            } catch (err) {
                alert("서버 연결 중 오류가 발생했습니다.");
            }
        }
    });

    endButton.addEventListener('click', async () => {
        // 그 날의 타이머 데이터 저장
        // 공부 종료
        try {
            const response = await fetch("http://"+ host +"/api/attendance/study/finished", {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
            } else {
                alert("중단 요청이 실패했습니다.");
            }
        } catch (err) {
            alert("서버 연결 중 오류가 발생했습니다.");
        }

        // 시간 저장
        try {
            const response = await fetch("http://"+ host +"/api/attendance/time", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    thisDayStudyTimes: formatSecondsToString(totalSeconds)
                })
            });

            console.log("thisDayStudyTimes = "+ formatSecondsToString(totalSeconds))

            if (response.ok) {
                alert('오늘의 공부 시간이 저장되었습니다.');
                clearInterval(timerInterval);
                setTimerButtonsState(false, false);
                // localStorage.removeItem(localKeyPrefix + 'studyTimer'); //
                localStorage.removeItem(localKeyPrefix + 'isRunning');
                localStorage.removeItem(localKeyPrefix + 'isPaused');
                updateTimerDisplay();
                location.reload();
            } else {
                alert("오늘의 공부 시간 저장에 실패했습니다.");
            }
        } catch (err) {
            alert("서버 연결 중 오류가 발생했습니다.");
        }

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
        modalIntro.textContent = user.introduce || '소개 정보 없음';
        modalStudyTime.textContent = checkDigit(user.time.hours) + ':' + checkDigit(user.time.minutes) + ':' + checkDigit(user.time.seconds) || '00 : 00 : 00';

        modalOverlay.style.display = 'flex';
        memberModal.style.display = 'block';
    }

    // 모달 닫기 함수
    function closeMemberModal() {
        modalOverlay.style.display = 'none';
        memberModal.style.display = 'none';
    }

    // 출석 현황 이름 클릭 이벤트 추가
    const attendanceContainerClick = document.querySelector('.attendance-container');

    attendanceContainerClick.addEventListener('click', function (e) {
        if (e.target.classList.contains('attendance-user-name')) {
            openMemberModal(e.target.textContent);
        }
    });


    // 공부 중인 멤버 이름 클릭 이벤트 추가
    const studyingContainerClick = document.querySelector('.studying-container');

    studyingContainerClick.addEventListener('click', function (e) {
        if (e.target.classList.contains('studying-user-name')) {
            openMemberModal(e.target.textContent);
        }
    });

    // 이번 달 랭킹 이름 클릭 이벤트 추가
    const rankingContainerClick = document.querySelector('.ranking-container');

    rankingContainerClick.addEventListener('click', function (e) {
        if (e.target.classList.contains('ranking-name')) {
            openMemberModal(e.target.textContent);
        }
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

    // 로그아웃
    const logoutBtn = document.querySelector('.header-logout');
    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch("http://"+ host +"/api/logout", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                // 버튼 상태 초기화
                alert("로그아웃 되었습니다. 로그인 화면으로 이동합니다.")
                window.location.href='login.html'
            } else {
                alert("중단 요청이 실패했습니다.");
            }
        } catch (err) {
            alert("서버 연결 중 오류가 발생했습니다.");
        }
    })

    // 확인 후 초기화 -> alert -> 모달 닫기
    confirmBtn.addEventListener('click', async () => {

        // 공부 중단
        try {
            const response = await fetch("http://"+ host +"/api/attendance/study/paused", {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
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

                setTimerButtonsState(false, false);
                localStorage.removeItem(localKeyPrefix + 'studyTimer');
                localStorage.removeItem(localKeyPrefix + 'isRunning');
                localStorage.removeItem(localKeyPrefix + 'isPaused');

                alert('타이머가 초기화되었습니다.');

                closeResetModal();
                location.reload();
            } else {
                alert("서버 연결 중 오류가 발생했습니다.");
            }
        } catch (err) {

        }
    });

    function formatDurationToString(durationStr) {
        // 예: "PT10H10M30S", "PT10H10S", "PT5M", "PT45S"
        const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
        const matches = durationStr.match(regex);

        return {
            hours: matches[1] ? parseInt(matches[1], 10) : 0,
            minutes: matches[2] ? parseInt(matches[2], 10) : 0,
            seconds: matches[3] ? parseInt(matches[3], 10) : 0,
        };
    }

    function formatSecondsToString(totalSeconds) {
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${hours}-${minutes}-${seconds}`;
    }

    function mapAttendanceStatus(statusStr) {
        switch (statusStr) {
            case 'ATTENDED': return 'attended';
            case 'NO_ATTENDED': return 'not-attended';
            case 'ON_LEAVE': return 'on-leave';
            default: return 'not-attended';
        }
    }

    function checkDigit(number) {
        return number < 10 ? '0' + number : number.toString();
    }
});
