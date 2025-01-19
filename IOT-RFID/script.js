document.getElementById('switch').addEventListener('change', function () {
    const userTypeLabel = document.getElementById('user-type-label');
    if (this.checked) {
        userTypeLabel.textContent = 'Teacher';
    } else {
        userTypeLabel.textContent = 'Student';
    }
});

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const isTeacher = document.getElementById('switch').checked;
    if (isTeacher) {
        window.location.href = 'teacher.html';
    } else {
        window.location.href = 'student.html';
    }
});
