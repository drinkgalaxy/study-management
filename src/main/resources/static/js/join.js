document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('join-form');

    //const host = '43.200.176.218:8080';
    const host = 'localhost:8080';

    const idCheckBtn = document.querySelector('.id-duplication');
    const emailCheckBtn = document.querySelector('.email-duplication');
    const emailCodeWrapper = document.querySelector('.email-code-wrapper');
    const emailCodeOkBtn = document.querySelector('.code-ok');

    let isIdChecked = false; // 아이디 중복확인 여부 체크
    let isEmailVerified = false; // 이메일 인증 여부 체크

    // 아이디 중복확인
    idCheckBtn.addEventListener('click', async function () {
        const id = document.getElementById('loginId').value.trim();

        if (!/^[A-Za-z0-9]{5,10}$/.test(id)) {
            alert('아이디는 5자 이상 10자 이하로 입력해주세요.');
            return;
        }

        // 중복확인 상태 백엔드 호출
        try {
            const response = await fetch("http://"+ host +"/api/users/loginId", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({loginId: id})
            });

            if (response.ok) {
                isIdChecked = true;
                alert("사용 가능한 아이디입니다.");
            } else {
                isIdChecked = false;
                alert("중복되는 아이디입니다.");
            }
        } catch (err) {
            console.error("아이디 중복 확인 중 오류:", err);
            alert("서버 오류가 발생했습니다.");
        }
    });

    // 이메일 인증
    emailCheckBtn.addEventListener('click', function () {
        const email = document.getElementById('email').value.trim();

        // 이메일 인증코드 입력창 보여주기
        emailCodeWrapper.style.display = 'block';
        isEmailVerified = false; // 새로 인증 요청 시 인증 상태 초기화

        // todo 인증 메일 전송 백엔드 호출 - fetch
        alert("인증 메일을 전송했습니다. 이메일을 확인해주세요."); // 예시
    });

    // 이메일 인증 확인 버튼 클릭 시
    emailCodeOkBtn.addEventListener('click', function () {
        const code = document.getElementById('email-code').value.trim();

        if (code === '') {
            alert("인증번호를 입력해주세요.");
            return;
        }

        // todo 실제 백엔드 검증이 필요함 (여기선 1111 이 유효한 인증코드라고 가정)
        if (code === '1111') {
            isEmailVerified = true;
            alert("이메일 인증이 완료되었습니다.");
        } else {
            alert("잘못된 인증 번호입니다.");
        }
    });

    // 폼 제출
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        if (!isIdChecked) {
            alert('아이디 중복확인을 해주세요.');
            idInput.focus();
            return;
        }

        if (!isEmailVerified) {
            alert('이메일 인증을 완료해주세요.');
            return;
        }

        const nameInput = document.getElementById('name');
        const idInput = document.getElementById('loginId');
        const passwordInput = document.getElementById('password');
        const email = document.getElementById('email').value;

        const name = nameInput.value.trim();
        const id = idInput.value.trim();
        const password = passwordInput.value;

        // 이름 검사
        if (name.length < 2 || name.length > 10) {
            alert('이름은 2글자 이상 10글자 이하로 입력해주세요.');
            nameInput.focus();
            return;
        }

        // 비밀번호 검사
        const pwLengthCheck = password.length >= 8 && password.length <= 20;
        const pwLetter = /[A-Za-z]/.test(password);
        const pwNumber = /[0-9]/.test(password);
        const pwSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!(pwLengthCheck && pwLetter && pwNumber && pwSpecial)) {
            alert('비밀번호는 8자 이상 20자 이하이며, 영문자, 숫자, 특수문자를 모두 포함해야 합니다.');
            passwordInput.focus();
            return;
        }

        // 서버에 회원가입 요청
        try {
            const response = await fetch("http://"+ host +"/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    loginId: id,
                    password: password,
                    email: email
                })
            });

            if (response.ok) {
                alert('회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.');
                window.location.href = 'login.html';
            } else {
                alert("회원가입에 실패했습니다.");
            }
        } catch (err) {
            console.error("회원가입 중 오류:", err);
            alert("서버 오류가 발생했습니다.");
        }
    });
});
