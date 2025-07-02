document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // 폼 제출 기본 동작 막기

    const loginId = document.getElementById("loginId").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                loginId: loginId,
                password: password
            })
        });

        if (response.ok) {
            // 로그인 성공 처리
            alert("로그인이 완료되었습니다. 홈 화면으로 이동합니다.");
            window.location.href = "main.html";
        } else {
            // 실패 시 오류 메시지 처리
            const error = await response.json();
            alert("로그인 실패: " + (error.message || response.statusText));
        }
    } catch (err) {
        console.error("로그인 중 오류:", err);
        alert("서버 오류가 발생했습니다.");
    }
});