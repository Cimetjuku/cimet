document.addEventListener('DOMContentLoaded', function() {
    // Check for code in URL parameters and auto-fill
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get('code');
    if (codeFromUrl) {
        document.getElementById('exam-code').value = codeFromUrl;
    }

    // Mock data (replace with backend calls later)
    const mockCodes = JSON.parse(localStorage.getItem('codes')) || [
        { code: 'ABC123', subjects: ['Mathematics'], duration: 60, used: 0 }
    ];
    const mockQuestions = JSON.parse(localStorage.getItem('questions')) || [
        { id: 1, text: 'What is 2+2?', options: ['3', '4', '5', '6'], correct: 1, subject: 'Mathematics' },
        { id: 2, text: 'What is 3+3?', options: ['5', '6', '7', '8'], correct: 1, subject: 'Mathematics' }
    ];
    const unlimitedCodes = [
        'EXAM2025A', 'K8LQW2Z9', 'MNRB7TXC', 'P2VJ9KEL', 'QZ5HSR3N', 'TXYB6WQJ', 'L3MNO8PV', 'G7RTS2KX', 'B9QWERTY', 'ZXCVBNM1',
        'ASDFGHJ2', 'QWERTYU3', 'POIUYTRE', 'LKJHGFDS', 'MNBVCXZ1', 'QAZXSWED', 'CVFRTGBN', 'HYKLUOIP', 'JEDCRFVT', 'GBNHYJUM',
        'KIOLPZXD', 'Q1W2E3R4', 'T5Y6U7I8', 'O9P0LKMN', 'BVCXZSDF', 'GHJKLQAZ', 'WSXEDCRF', 'VTGBYHNU', 'JMKIOLP9', 'N8B7V6C5',
        'X4Z3A2S1', 'DGFHJKLM', 'QAZWSXED', 'CRFVTGBY', 'HNUJMIKO', 'LPPOIUYT', 'R5E4W3Q2', 'Z1X2C3V4', 'B5N6M7A8', 'S9D8F7G6',
        'H5J4K3L2', 'QWERTY12', 'ASDFGH34', 'ZXCVBN56', 'POIUYT78', 'MNBVCX12', 'QAZXSW34', 'EDCRFV56', 'TGBYHN78',
        'UJMIKO90', 'LPOKMIJN', 'BHYGVTFD', 'RDCESWAX', 'ZSEXDRCT', 'FVTGBYHN', 'UJMIKOLP', 'Q1W2E3R4', 'T5Y6U7I8', 'O9P0A1S2',
        'D3F4G5H6', 'J7K8L9Z0', 'X1C2V3B4', 'N5M6Q7W8', 'E9R0T1Y2', 'A7S8D9F0', 'G1H2J3K4', 'L5Z6X7C8', 'ADMIN8080'
    ];

    let currentCode = null;
    let timerInterval = null;
    let timeRemaining = 0;
    let studentEmail = '';

    // Code entry
    document.getElementById('start-exam-btn').addEventListener('click', function() {
        const code = document.getElementById('exam-code').value.trim();
        const email = document.getElementById('student-email').value.trim();
        if (!email) {
            alert('Please enter your email.');
            return;
        }
        studentEmail = email;

        let validCode = null;
        if (code === 'ADMIN8080') {
            // Special admin code: allow access all the time, use all subjects
            const allSubjects = JSON.parse(localStorage.getItem('subjects')) || [];
            const subjectNames = allSubjects.map(s => s.name);
            validCode = { code: 'ADMIN8080', subjects: subjectNames, duration: 180, used: 0 };
        } else {
            validCode = mockCodes.find(c => c.code === code && c.used < 1); // Mock validation
            if (validCode) {
                validCode.used++; // Mark as used
                localStorage.setItem('codes', JSON.stringify(mockCodes));
            }
        }

        if (validCode) {
            currentCode = validCode;
            document.getElementById('code-entry').style.display = 'none';
            document.getElementById('exam-content').style.display = 'block';
            loadQuestions();
            startTimer(validCode.duration * 60); // Convert minutes to seconds
            enableAntiMalpractice();
        } else {
            alert('Invalid or used exam code.');
        }
    });

    // Load questions grouped by subject
    async function loadQuestions() {
        try {
            const response = await fetch('http://localhost:5000/api/questions');
            mockQuestions = await response.json();
        } catch (error) {
            console.error('Error loading questions:', error);
            mockQuestions = JSON.parse(localStorage.getItem('questions')) || [
                { id: 1, text: 'What is 2+2?', options: ['3', '4', '5', '6'], correct: 1, subject: 'Mathematics' },
                { id: 2, text: 'What is 3+3?', options: ['5', '6', '7', '8'], correct: 1, subject: 'Mathematics' }
            ];
        }

        const container = document.getElementById('questions-container');
        container.innerHTML = '';
        const grouped = {};
        mockQuestions.forEach(q => {
            if (currentCode.subjects.includes(q.subject)) {
                if (!grouped[q.subject]) grouped[q.subject] = [];
                grouped[q.subject].push(q);
            }
        });
        Object.keys(grouped).forEach((subject, index) => {
            if (index > 0) {
                const barrier = document.createElement('hr');
                barrier.style.borderTop = '3px solid #007bff';
                container.appendChild(barrier);
            }
            let subjectNum = 1;
            grouped[subject].forEach(q => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question fade-in';
                questionDiv.innerHTML = `
                    <h3>${subject} ${subjectNum}. ${q.text}</h3>
                    ${q.options.map((opt, i) => `
                        <label>
                            <input type="radio" name="q${q._id || q.id}" value="${i}" required>
                            ${opt}
                        </label>
                    `).join('<br>')}
                `;
                container.appendChild(questionDiv);
                subjectNum++;
            });
        });
    }

    // Timer
    function startTimer(seconds) {
        timeRemaining = seconds;
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                submitExam();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        document.getElementById('time-remaining').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Anti-malpractice
    function enableAntiMalpractice() {
        document.addEventListener('contextmenu', e => e.preventDefault()); // Disable right-click
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) alert('Warning: Do not switch tabs during the exam!');
        });
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) alert('Warning: Stay in fullscreen mode!');
        });
    }

    // Submit exam
    document.getElementById('exam-form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitExam();
    });

    function submitExam() {
        clearInterval(timerInterval);
        const formData = new FormData(document.getElementById('exam-form'));
        let correctAnswers = 0;
        let totalQuestions = 0;
        const breakdown = {};

        mockQuestions.forEach(q => {
            if (currentCode.subjects.includes(q.subject)) {
                totalQuestions++;
                const answer = formData.get(`q${q.id}`);
                if (parseInt(answer) === q.correct) correctAnswers++;
                if (!breakdown[q.subject]) breakdown[q.subject] = { correct: 0, total: 0 };
                breakdown[q.subject].total++;
                if (parseInt(answer) === q.correct) breakdown[q.subject].correct++;
            }
        });

        const overallScore = Math.round((correctAnswers / totalQuestions) * 100);
        const breakdownStr = Object.keys(breakdown).map(subject =>
            `${subject}: ${breakdown[subject].correct}/${breakdown[subject].total}`
        ).join(', ');

        // Save result to localStorage
        const results = JSON.parse(localStorage.getItem('results')) || [];
        results.push({
            id: Date.now(),
            student: studentEmail,
            overallScore: overallScore,
            breakdown: breakdownStr
        });
        localStorage.setItem('results', JSON.stringify(results));

        document.getElementById('overall-score').textContent = overallScore;
        const breakdownDiv = document.getElementById('breakdown');
        breakdownDiv.innerHTML = breakdownStr.replace(/, /g, '<br>');

        document.getElementById('exam-content').style.display = 'none';
        document.getElementById('results').style.display = 'block';
    }

    // Retake
    document.getElementById('retake-btn').addEventListener('click', function() {
        location.reload(); // Reset the page
    });
});