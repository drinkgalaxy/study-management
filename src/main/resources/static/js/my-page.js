document.addEventListener('DOMContentLoaded', async function () {

    const host = '43.200.176.218:8080';
    //const host = 'localhost:8080';

    let username;
    let consecutiveStudyDay;
    let introduce;
    let thisMonthLeave;
    let hours;
    let minutes;
    let seconds;

    // 서버에 로그인 한 유저 마이 페이지 정보 조회
    try {
        const response = await fetch("http://"+ host +"/api/users/my", {
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
            consecutiveStudyDay = data.consecutiveStudyDays;
            introduce = data.introduce;
            const thisMonth = formatDurationToString(data.thisMonthStudyTimes);
            hours = checkDigit(thisMonth.hours);
            minutes = checkDigit(thisMonth.minutes);
            seconds = checkDigit(thisMonth.seconds);
            thisMonthLeave = data.thisMonthLeave;
        } else if (response.status === 403) {
            alert("로그인 후 이용해주세요.");
            window.location.href = 'login.html';
        } else {
            console.error('마이 페이지 정보 조회 실패:', response.status);
            alert("서버 연결 중 오류가 발생했습니다.");
        }

    } catch (err) {
        console.error("마이 페이지 정보 조회 중 오류:", err);
        alert("서버 연결 중 오류가 발생했습니다.");
    }

    // 백엔드에서 유저네임 호출
    document.getElementById('username').textContent = username;

    // 백엔드에서 연속 학습 일자 호출
    document.getElementById('learning-day').textContent = consecutiveStudyDay;

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

    const textarea = document.getElementById("content");
    const maxLengthDisplay = document.getElementById("max-word-length");

    // 초기 글자 수 세팅
    textarea.value = introduce;
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
    document.querySelector('.reset-button').addEventListener('click', async () => {
        textarea.value = '';
        originalText = '';
        maxLengthDisplay.innerText = '';
        saveBefore.style.display = 'none';
        saveAfter.style.display = 'inline';
        saveButton.disabled = false;
    });

    // 저장 버튼 기능
    saveButton.addEventListener('click', async () => {
        const content = textarea.value;
        // 실제 서버로 변경 사항 전송
        try {
            const response = await fetch("http://"+ host +"/api/users/introduce", {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    introduce: content
                })
            });

            if (response.ok) {
                alert('변경사항이 저장되었습니다.');

                // 저장 완료 후 상태 초기화
                originalText = content;

                saveBefore.style.display = 'inline';
                saveAfter.style.display = 'none';
            } else {
                alert("자기소개 저장에 실패했습니다.");
            }
        } catch (err) {
            alert("서버 연결 중 오류가 발생했습니다.");
        }
    });

    // 백엔드에서 이번달 공부 시간 호출
    document.querySelector('.hours').textContent = hours;
    document.querySelector('.minutes').textContent = minutes;
    document.querySelector('.seconds').textContent = seconds;

    // 백엔드에서 이번달 남은 휴가 호출
    document.querySelector('.leave-day-real').textContent = thisMonthLeave;


    // 캘린더 기능 추가
    // 달력 관련 변수들
    let currentDate = new Date();
    let selectedDate = null;
    let attendanceData = {};
    async function fetchAttendanceData(year, month) {

        // 백엔드에서 해당 month 의 출석 데이터 불러오기
        try {
            const response = await fetch(`http://${host}/api/users/${month}/attendances`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const res = await response.json();
                const rawData = res.data;

                // 출석 배열을 Map 형식으로 변환
                const attendanceMap = {};
                for (const entry of rawData.attendances) {
                    attendanceMap[entry.date] = entry.status;
                }

                return {
                    thisMonthAttended: rawData.thisMonthAttended,
                    thisMonthAbsent: rawData.thisMonthAbsent,
                    thisMonthVacation: rawData.thisMonthVacation,
                    attendances: attendanceMap
                };
            } else {
                console.error('출석 데이터 조회 실패:', response.status);
            }

        } catch (err) {
            console.error("출석 데이터 조회 중 오류:", err);
            alert("서버 연결 중 오류가 발생했습니다.");
        }
        return {
            thisMonthAttended: 0,
            thisMonthAbsent: 0,
            thisMonthVacation: 0,
            attendances: {}
        };
    }

    async function createCalendar() {
        const calendarGrid = document.querySelector('.calendar-grid');
        const calendarTitle = document.getElementById('calendarTitle');

        // 기존 날짜 셀들 제거 (헤더는 유지)
        const existingDays = calendarGrid.querySelectorAll('.calendar-day');
        existingDays.forEach(day => day.remove());

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // 출석 데이터 불러오기
        attendanceData = await fetchAttendanceData(year, month + 1);

        // 출석 요약 정보 반영
        document.querySelector('.attendance-count-1').textContent = attendanceData.thisMonthAttended;
        document.querySelector('.attendance-count-2').textContent = attendanceData.thisMonthAbsent;
        document.querySelector('.attendance-count-3').textContent = attendanceData.thisMonthVacation;

        calendarTitle.textContent = `${year}년 ${month + 1}월`;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const statusToClassMap = {
            "ATTENDED": "attended",
            "NO_ATTENDED": "no_attended",
            "ABSENT": "absent",
            "VACATION": "vacation"
        };

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = date.getDate();

            if (date.getMonth() !== month) {
                dayElement.classList.add('other-month');
            }

            const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const attendanceStatus = attendanceData.attendances[dateKey];

            if (attendanceStatus) {
                const cssClass = statusToClassMap[attendanceStatus];
                if (cssClass) {
                    dayElement.classList.add(cssClass);
                }
            }

            dayElement.addEventListener('click', () => {
                document.querySelectorAll('.calendar-day.selected').forEach(el => {
                    el.classList.remove('selected');
                });

                dayElement.classList.add('selected');
                selectedDate = new Date(date);
            });

            calendarGrid.appendChild(dayElement);
        }
    }


    // 이전/다음 달 버튼 이벤트
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        createCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        createCalendar();
    });

    // 달력 초기화
    createCalendar();

    // 작은 캘린더 기능 추가
    class DatePicker {
        constructor(inputId) {
            this.input = document.getElementById(inputId);
            this.container = this.input.parentElement;
            this.popup = this.container.querySelector('.calendar-popup');
            this.overlay = this.container.querySelector('.calendar-overlay');
            this.calendarGrid = this.container.querySelector('.calendar-grid');
            this.calendarTitle = this.container.querySelector('#calendarTitle-sub');
            this.prevBtn = this.container.querySelector('#prevMonth-sub');
            this.nextBtn = this.container.querySelector('#nextMonth-sub');
            this.cancelBtn = this.container.querySelector('#cancelBtn');
            this.confirmBtn = this.container.querySelector('#confirmBtn');
            this.calendarIcon = this.container.querySelector('.calendar-icon');

            this.currentDate = new Date();
            this.selectedDate = null;
            this.tempSelectedDate = null;

            this.init();
        }

        init() {
            // 이벤트 리스너 등록
            this.calendarIcon.addEventListener('click', () => this.showCalendar());
            this.input.addEventListener('click', () => this.showCalendar());
            this.overlay.addEventListener('click', () => this.hideCalendar());
            this.prevBtn.addEventListener('click', () => this.prevMonth());
            this.nextBtn.addEventListener('click', () => this.nextMonth());
            this.cancelBtn.addEventListener('click', () => this.hideCalendar());
            this.confirmBtn.addEventListener('click', () => this.confirmSelection());

            // 초기 달력 생성
            this.createCalendar();
        }

        showCalendar() {
            this.popup.classList.add('show');
            this.overlay.classList.add('show');
            this.createCalendar();
        }

        hideCalendar() {
            this.popup.classList.remove('show');
            this.overlay.classList.remove('show');
            this.tempSelectedDate = null;
            this.confirmBtn.disabled = true;
            this.createCalendar();
        }

        prevMonth() {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.createCalendar();
        }

        nextMonth() {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.createCalendar();
        }

        createCalendar() {
            // 기존 날짜 셀들 제거 (헤더는 유지)
            const existingDays = this.calendarGrid.querySelectorAll('.calendar-day');
            existingDays.forEach(day => day.remove());

            // 현재 월/년 표시
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();
            this.calendarTitle.textContent = `${year}년 ${month + 1}월`;

            // 이번 달 1일
            const firstDay = new Date(year, month, 1);

            // 달력 시작 날짜 (이전 달 마지막 주 포함)
            const startDate = new Date(firstDay);
            startDate.setDate(startDate.getDate() - firstDay.getDay());

            // 42일 생성 (6주 × 7일)
            for (let i = 0; i < 42; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);

                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = date.getDate();

                // 다른 달 날짜 구분
                if (date.getMonth() !== month) {
                    dayElement.classList.add('other-month');
                }

                // 임시 선택된 날짜 표시
                if (this.tempSelectedDate && date.toDateString() === this.tempSelectedDate.toDateString()) {
                    dayElement.classList.add('selected');
                }

                // 클릭 이벤트
                dayElement.addEventListener('click', () => {
                    // 이전 선택 해제
                    this.calendarGrid.querySelectorAll('.calendar-day.selected').forEach(el => {
                        el.classList.remove('selected');
                    });

                    // 현재 선택
                    dayElement.classList.add('selected');
                    this.tempSelectedDate = new Date(date);
                    this.confirmBtn.disabled = false;
                });

                this.calendarGrid.appendChild(dayElement);
            }
        }

        confirmSelection() {
            if (this.tempSelectedDate) {
                this.selectedDate = new Date(this.tempSelectedDate);
                this.updateInput();
                this.hideCalendar();
            }
        }

        updateInput() {
            if (this.selectedDate) {
                const year = this.selectedDate.getFullYear();
                const month = String(this.selectedDate.getMonth() + 1).padStart(2, '0');
                const day = String(this.selectedDate.getDate()).padStart(2, '0');

                this.input.value = `${year}년 ${month}월 ${day}일`;
            }
        }

        getSelectedDate() {
            return this.selectedDate;
        }

        getFormattedDate(format = 'YYYY-MM-DD') {
            if (!this.selectedDate) return null;

            const year = this.selectedDate.getFullYear();
            const month = String(this.selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(this.selectedDate.getDate()).padStart(2, '0');

            switch (format) {
                case 'YYYY-MM-DD':
                    return `${year}-${month}-${day}`;
                case 'YYYY/MM/DD':
                    return `${year}/${month}/${day}`;
                case 'DD/MM/YYYY':
                    return `${day}/${month}/${year}`;
                default:
                    return `${year}-${month}-${day}`;
            }
        }
    }

    // 날짜 선택기 초기화
    const datePicker = new DatePicker('selectedDate');

    // 폼 제출 처리
    document.querySelector('.submit-btn').addEventListener('click', async (e) => {
        e.preventDefault();

        const selectedDate = datePicker.getSelectedDate();
        const formattedDate = datePicker.getFormattedDate();

        if (!selectedDate) {
            alert('날짜를 선택해주세요.');
            return;
        }

        if (thisMonthLeave < 1) {
            alert('잔여 휴가 일수를 초과했습니다.');
            return;
        }

        // 서버로 데이터 전송 (전송할 때 휴가도 --)
        try {
            const response = await fetch("http://"+ host +"/api/attendance/vacation", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    leaveRequestDay: formattedDate
                })
            });

            if (response.ok) {
                alert(formattedDate + ' 날짜에 휴가 신청이 완료되었습니다.')
                location.reload();
            } else if (response.status === 400) {
                const errorData = await response.json();
                alert(errorData.message);
            } else {
                console.log("휴가 신청 실패")
            }
        } catch (err) {
            alert("서버 연결 중 오류가 발생했습니다.");
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

    function checkDigit(number) {
        return number < 10 ? '0' + number : number.toString();
    }
});


