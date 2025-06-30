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
    let leaveDayReal = 3; // 임시데이터
    document.querySelector('.leave-day-real').textContent = leaveDayReal;


    // 캘린더 기능 추가

    // 달력 관련 변수들
    let currentDate = new Date();
    let selectedDate = null;

    // 샘플 출석 데이터 (실제로는 서버에서 가져와야 함)
    // todo 백엔드에서 출석 데이터 호출
    const attendanceData = {
        '2025-06-01': 'attended',
        '2025-06-02': 'attended',
        '2025-06-03': 'absent',
        '2025-06-04': 'attended',
        '2025-06-05': 'vacation',
        '2025-06-06': 'attended',
        '2025-06-07': 'attended',
        '2025-06-08': 'attended',
        '2025-06-09': 'attended',
        '2025-06-10': 'absent'
    };

    function createCalendar() {
        const calendarGrid = document.querySelector('.calendar-grid');
        const calendarTitle = document.getElementById('calendarTitle');

        // 기존 날짜 셀들 제거 (헤더는 유지)
        const existingDays = calendarGrid.querySelectorAll('.calendar-day');
        existingDays.forEach(day => day.remove());

        // 현재 월/년 표시
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        calendarTitle.textContent = `${year}년 ${month + 1}월`;

        // 이번 달 1일과 마지막 날
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

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

            // 오늘 날짜 표시
            const today = new Date();
            if (date.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }

            // 출석 데이터 적용
            const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            if (attendanceData[dateKey]) {
                dayElement.classList.add(attendanceData[dateKey]);
            }

            // 클릭 이벤트
            dayElement.addEventListener('click', () => {
                // 이전 선택 해제
                document.querySelectorAll('.calendar-day.selected').forEach(el => {
                    el.classList.remove('selected');
                });

                // 현재 선택
                dayElement.classList.add('selected');
                selectedDate = new Date(date);

                // 선택된 날짜 정보 업데이트
                updateSelectedDateInfo(date);
            });

            calendarGrid.appendChild(dayElement);
        }
    }

    function updateSelectedDateInfo(date) {
        const selectedDateInfo = document.getElementById('selectedDateInfo');

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const dateString = `${year}-${month}-${day}`;
        const koreanDate = `${year}년 ${month}월 ${day}일`;

        // 출석 상태 확인
        let statusText = '';
        if (attendanceData[dateString]) {
            switch(attendanceData[dateString]) {
                case 'attended':
                    statusText = ' (출석 완료)';
                    break;
                case 'absent':
                    statusText = ' (결석)';
                    break;
                case 'vacation':
                    statusText = ' (휴가)';
                    break;
            }
        }

        selectedDateInfo.textContent = `선택된 날짜: ${koreanDate}${statusText}`;
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

                // 오늘 날짜 표시
                const today = new Date();
                if (date.toDateString() === today.toDateString()) {
                    dayElement.classList.add('today');
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
    document.querySelector('.submit-btn').addEventListener('click', () => {
        const selectedDate = datePicker.getSelectedDate();
        const formattedDate = datePicker.getFormattedDate();

        if (!selectedDate) {
            alert('날짜를 선택해주세요.');
            return;
        }

        if (leaveDayReal < 1) {
            alert('잔여 휴가 일수를 초과했습니다.');
            return;
        }

        // todo 서버로 데이터 전송 (전송할 때 휴가도 --)
        //alert(formattedDate + " => 전송된 데이터");
        alert(formattedDate + ' 날짜에 휴가 신청이 완료되었습니다.')
    });
});


