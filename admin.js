document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin JS loaded'); // Debug

    
    // Load data from localStorage
    let students = JSON.parse(localStorage.getItem('students')) || [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'pending', payment: 'pending' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'approved', payment: 'verified' }
    ];
    let subjects = JSON.parse(localStorage.getItem('subjects')) || [
        { id: 1, name: 'Mathematics', duration: 2, questions: 50 },
        { id: 2, name: 'Science', duration: 2, questions: 50 },
        { id: 3, name: 'Art', duration: 2, questions: 50 },
        { id: 4, name: 'Commercial', duration: 2, questions: 50 }
    ];
    let questions = JSON.parse(localStorage.getItem('questions')) || [
        { id: 1, text: 'What is 2+2?', options: ['3', '4', '5', '6'], correct: 1, subject: 'Mathematics' }
    ];
    let codes = JSON.parse(localStorage.getItem('codes')) || [];
    const preCodes = [
        'EXAM2025A', 'K8LQW2Z9', 'MNRB7TXC', 'P2VJ9KEL', 'QZ5HSR3N', 'TXYB6WQJ', 'L3MNO8PV', 'G7RTS2KX', 'B9QWERTY', 'ZXCVBNM1',
        'ASDFGHJ2', 'QWERTYU3', 'POIUYTRE', 'LKJHGFDS', 'MNBVCXZ1', 'QAZXSWED', 'CVFRTGBN', 'HYKLUOIP', 'JEDCRFVT', 'GBNHYJUM',
        'KIOLPZXD', 'Q1W2E3R4', 'T5Y6U7I8', 'O9P0LKMN', 'BVCXZSDF', 'GHJKLQAZ', 'WSXEDCRF', 'VTGBYHNU', 'JMKIOLP9', 'N8B7V6C5',
        'X4Z3A2S1', 'DGFHJKLM', 'QAZWSXED', 'CRFVTGBY', 'HNUJMIKO', 'LPPOIUYT', 'R5E4W3Q2', 'Z1X2C3V4', 'B5N6M7A8', 'S9D8F7G6',
        'H5J4K3L2', 'QWERTY12', 'ASDFGH34', 'ZXCVBN56', 'POIUYT78', 'LKJHGF90', 'MNBVCX12', 'QAZXSW34', 'EDCRFV56', 'TGBYHN78',
        'UJMIKO90', 'LPOKMIJN', 'BHYGVTFD', 'RDCESWAX', 'ZSEXDRCT', 'FVTGBYHN', 'UJMIKOLP', 'Q1W2E3R4', 'T5Y6U7I8', 'O9P0A1S2',
        'D3F4G5H6', 'J7K8L9Z0', 'X1C2V3B4', 'N5M6Q7W8', 'E9R0T1Y2', 'U3I4O5P6', 'A7S8D9F0', 'G1H2J3K4', 'L5Z6X7C8'
    ];
    preCodes.forEach(codeStr => {
        if (!codes.some(c => c.code === codeStr)) {
            codes.push({ id: Date.now() + Math.random(), code: codeStr, subjects: ['Mathematics'], maxStudents: 1, duration: 60, used: 0 });
        }
    });
    localStorage.setItem('codes', JSON.stringify(codes));
    let results = JSON.parse(localStorage.getItem('results')) || [
        { id: 1, student: 'john@example.com', overallScore: 85, breakdown: 'Mathematics: 40/50' }
    ];

    console.log('Initial codes:', codes); // Debug

    // Login
    const loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (email === 'cimetedu19@gmail.com' && password === 'Cimet@19global') {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            loadAllData();
        } else {
            alert('Invalid credentials');
        }
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
                content.classList.remove('fade-in');
            });
            const activeTab = document.getElementById(this.dataset.tab + '-tab');
            activeTab.style.display = 'block';
            setTimeout(() => activeTab.classList.add('fade-in'), 10);
        });
    });

    // Load all data
    function loadAllData() {
        loadStudents();
        loadSubjects();
        loadQuestions();
        loadCodes();
        loadResults();
    }

    // API base URL
    const API_BASE = 'http://localhost:5000/api';

    let editingQuestionId = null;

    // Students - Added add student form
    document.getElementById('add-student-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('student-name').value;
        const email = document.getElementById('student-email').value;
        const status = document.getElementById('student-status').value;
        const payment = document.getElementById('student-payment').value;
        students.push({ id: Date.now(), name, email, status, payment });
        loadStudents();
        this.reset();
    });

    function loadStudents() {
        document.getElementById('total-students').textContent = students.length;
        const tbody = document.querySelector('#students-table tbody');
        tbody.innerHTML = '';
        students.forEach(student => {
            const row = `<tr>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.status}</td>
                <td>${student.payment}</td>
                <td>
                    <button onclick="approveStudent(${student.id})">Approve</button>
                    <button onclick="declineStudent(${student.id})">Decline</button>
                    <button onclick="resetAttempt(${student.id})">Reset Attempt</button>
                    <button onclick="deleteStudent(${student.id})">Delete</button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
        localStorage.setItem('students', JSON.stringify(students));
    }

    window.approveStudent = function(id) {
        const student = students.find(s => s.id === id);
        student.status = 'approved';
        loadStudents();
    };

    window.declineStudent = function(id) {
        const student = students.find(s => s.id === id);
        student.status = 'rejected';
        loadStudents();
    };

    window.resetAttempt = function(id) {
        alert('Attempt reset for student ID ' + id);
    };

    window.deleteStudent = function(id) {
        students = students.filter(s => s.id !== id);
        loadStudents();
    };

    // Subjects - Updated to handle both text input and dropdown
    document.getElementById('add-subject-form').addEventListener('submit', function(e) {
        e.preventDefault();
        let name = document.getElementById('subject-name').value.trim();
        if (!name) {
            name = document.getElementById('subject-dropdown').value;
        }
        if (!name) {
            alert('Please enter or select a subject name.');
            return;
        }
        const duration = document.getElementById('subject-duration').value;
        const questionsCount = document.getElementById('subject-questions').value;
        subjects.push({ id: Date.now(), name, duration: parseInt(duration), questions: parseInt(questionsCount) });
        loadSubjects();
        this.reset();
    });

    function loadSubjects() {
        const tbody = document.querySelector('#subjects-table tbody');
        tbody.innerHTML = '';
        subjects.forEach(subject => {
            const row = `<tr>
                <td>${subject.name}</td>
                <td>${subject.duration}h</td>
                <td>${subject.questions}</td>
                <td><button onclick="deleteSubject(${subject.id})">Delete</button></td>
            </tr>`;
            tbody.innerHTML += row;
        });
        updateSubjectOptions();
        loadSubjectCheckboxes();
        localStorage.setItem('subjects', JSON.stringify(subjects));
    }

    window.deleteSubject = function(id) {
        subjects = subjects.filter(s => s.id !== id);
        loadSubjects();
    };

    // Questions
    document.getElementById('add-question-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const text = document.getElementById('question-text').value;
        const options = [
            document.getElementById('option1').value,
            document.getElementById('option2').value,
            document.getElementById('option3').value,
            document.getElementById('option4').value
        ];
        const correct = parseInt(document.getElementById('correct-answer').value);
        const subject = document.getElementById('question-subject').value;

        const questionData = { text, options, correct, subject };

        try {
            if (editingQuestionId) {
                // Update existing question
                await fetch(`${API_BASE}/questions/${editingQuestionId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(questionData)
                });
                editingQuestionId = null;
                document.getElementById('submit-question-btn').textContent = 'Add Question';
                document.getElementById('cancel-edit-btn').style.display = 'none';
            } else {
                // Add new question
                await fetch(`${API_BASE}/questions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(questionData)
                });
            }
            loadQuestions();
            this.reset();
        } catch (error) {
            console.error('Error saving question:', error);
            alert('Error saving question');
        }
    });

    document.getElementById('cancel-edit-btn').addEventListener('click', function() {
        editingQuestionId = null;
        document.getElementById('submit-question-btn').textContent = 'Add Question';
        document.getElementById('cancel-edit-btn').style.display = 'none';
        document.getElementById('add-question-form').reset();
    });

    document.getElementById('upload-csv-btn').addEventListener('click', function() {
        alert('CSV upload simulated - questions would be added here.');
    });

    async function loadQuestions() {
        try {
            const response = await fetch(`${API_BASE}/questions`);
            questions = await response.json();
            const tbody = document.querySelector('#questions-table tbody');
            tbody.innerHTML = '';
            const grouped = {};
            questions.forEach(q => {
                if (!grouped[q.subject]) grouped[q.subject] = [];
                grouped[q.subject].push(q);
            });
            Object.keys(grouped).forEach((subject, index) => {
                if (index > 0) {
                    const barrier = `<tr><td colspan="6" style="border-top: 3px solid #007bff; height: 10px;"></td></tr>`;
                    tbody.innerHTML += barrier;
                }
                let subjectNum = 1;
                grouped[subject].forEach(q => {
                    const row = `<tr>
                        <td>${subject}</td>
                        <td>${subjectNum}.</td>
                        <td>${q.text}</td>
                        <td>${q.options.join(', ')}</td>
                        <td>${q.options[q.correct]}</td>
                        <td><button onclick="editQuestion('${q._id}')">Edit</button> <button onclick="deleteQuestion('${q._id}')">Delete</button></td>
                    </tr>`;
                    tbody.innerHTML += row;
                    subjectNum++;
                });
            });
            updateSubjectOptions();
        } catch (error) {
            console.error('Error loading questions:', error);
        }
    }

    window.editQuestion = function(id) {
        const question = questions.find(q => q._id === id);
        if (question) {
            document.getElementById('question-text').value = question.text;
            document.getElementById('option1').value = question.options[0];
            document.getElementById('option2').value = question.options[1];
            document.getElementById('option3').value = question.options[2];
            document.getElementById('option4').value = question.options[3];
            document.getElementById('correct-answer').value = question.correct;
            document.getElementById('question-subject').value = question.subject;
            editingQuestionId = id;
            document.getElementById('submit-question-btn').textContent = 'Update Question';
            document.getElementById('cancel-edit-btn').style.display = 'inline';
        }
    };

    window.deleteQuestion = async function(id) {
        if (confirm('Are you sure you want to delete this question?')) {
            try {
                await fetch(`${API_BASE}/questions/${id}`, { method: 'DELETE' });
                loadQuestions();
            } catch (error) {
                console.error('Error deleting question:', error);
                alert('Error deleting question');
            }
        }
    };

    // Codes - Reverted to basic generation
    let selectedSubjects = [];
    function generateUniqueCode() {
        let code;
        do {
            code = '';
            for (let i = 0; i < 9; i++) {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
        } while (codes.some(c => c.code === code));
        return code;
    }
    function loadSubjectCheckboxes() {
        const container = document.getElementById('subject-checkboxes');
        container.innerHTML = '';
        subjects.forEach(subject => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = subject.name;
            checkbox.onchange = () => updateSelectedSubjects();
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + subject.name));
            container.appendChild(label);
            container.appendChild(document.createElement('br'));
        });
    }

    function updateSelectedSubjects() {
        selectedSubjects = Array.from(document.querySelectorAll('#subject-checkboxes input:checked')).map(cb => cb.value);
        document.getElementById('selected-count').textContent = selectedSubjects.length;
        document.getElementById('selected-subjects').textContent = selectedSubjects.join(', ');
        console.log('Selected subjects:', selectedSubjects); // Debug
    }

    document.getElementById('generate-code-form').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Generate code form submitted'); // Debug
        const duration = document.getElementById('exam-duration').value;
        const durationNum = parseInt(duration);
        console.log('Duration:', duration, 'Selected subjects:', selectedSubjects); // Debug

        if (selectedSubjects.length === 0) {
            alert('Please select at least one subject.');
            return;
        }
        if (!duration || durationNum <= 0) {
            alert('Please enter a positive exam duration.');
            return;
        }

        const code = generateUniqueCode();
        console.log('Generated code:', code); // Debug
        codes.push({ id: Date.now(), code, subjects: selectedSubjects, maxStudents: 1, duration: durationNum, used: 0 });
        console.log('Codes array after push:', codes); // Debug
        loadCodes();
        alert(`Code generated: ${code}. Students can use this to access the exam with subjects: ${selectedSubjects.join(', ')} and ${duration} minutes overall timer.`);
        this.reset();
        selectedSubjects = [];
        document.querySelectorAll('#subject-checkboxes input').forEach(cb => cb.checked = false);
        document.getElementById('selected-count').textContent = '0';
        document.getElementById('selected-subjects').textContent = '';
    });

    function loadCodes() {
        console.log('Loading codes:', codes); // Debug
        const tbody = document.querySelector('#codes-table tbody');
        tbody.innerHTML = '';
        codes.forEach(code => {
            const row = `<tr>
                <td>${code.code}</td>
                <td>${code.subjects.join(', ')}</td>
                <td>${code.duration} min</td>
                <td>${code.used}</td>
                <td><button onclick="accessExamLocally('${code.code}')">Access Exam Locally</button></td>
            </tr>`;
            tbody.innerHTML += row;
        });
        console.log('Codes table updated'); // Debug
        localStorage.setItem('codes', JSON.stringify(codes));
    }

    window.accessExamLocally = function(code) {
        window.open(`exam.html?code=${code}`, '_blank');
    };

    // Results - Overall score with per-subject breakdown
    function loadResults() {
        const tbody = document.querySelector('#results-table tbody');
        tbody.innerHTML = '';
        results.forEach(result => {
            const row = `<tr>
                <td>${result.student}</td>
                <td>${result.overallScore}%</td>
                <td>${result.breakdown}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
        updateSubjectOptions();
        localStorage.setItem('results', JSON.stringify(results));
    }

    document.getElementById('export-csv-btn').addEventListener('click', function() {
        const csv = 'Student,Overall Score,Subject Breakdown\n' + results.map(r => `${r.student},${r.overallScore},${r.breakdown}`).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'results.csv';
        a.click();
    });

    // Helper to update subject options in selects
    function updateSubjectOptions() {
        const selects = ['question-subject', 'filter-subject'];
        selects.forEach(id => {
            const select = document.getElementById(id);
            select.innerHTML = '<option value="">Select Subject</option>';
            subjects.forEach(subject => {
                select.innerHTML += `<option value="${subject.name}">${subject.name}</option>`;
            });
        });
    }
});