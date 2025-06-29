
document.addEventListener('DOMContentLoaded', function () {
    // todo 백엔드에서 유저네임 호출
    const username = "이유림";
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
    let nowHour = 0;
    let nowMinute = 0;
    let nowSecond = 0;
    document.getElementById('nowHour').textContent = nowHour;
    document.getElementById('nowMinute').textContent = nowMinute;
    document.getElementById('nowSecond').textContent = nowSecond;
});