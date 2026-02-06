// Main Application State
const AppState = {
    currentUser: null,
    currentCurriculum: null,
    currentFeature: null,
    quizQuestions: [],
    currentQuiz: null,
    symposiumGame: null,
    notes: [],
    subjects: [],
    examPapers: []
};

// Subject Images for Loading Screen
const subjectImages = [
    'Chemistry', 'Biology', 'Physics', 'English', 'Geography', 'Kiswahili',
    'Maths', 'Computer', 'Business', 'CRE', 'Agriculture', 'Woodwork',
    'Ironwork', 'Music', 'Spanish', 'French', 'German', 'History',
    'Chinese', 'Home Science', 'Pre-Technical', 'Creative Arts', 
    'Integrated Science', 'Life Skills'
];

// Sample Quiz Questions Database
const quizDatabase = {
    'Form 3': {
        'Mathematics': {
            'Algebra': [
                {
                    question: "Solve for x: 2x + 5 = 15",
                    answer: "5"
                },
                {
                    question: "Factorize: x² - 9",
                    answer: "(x+3)(x-3)"
                }
            ],
            'Geometry': [
                {
                    question: "What is the sum of interior angles of a triangle?",
                    answer: "180 degrees"
                }
            ]
        },
        'Biology': {
            'Cell Biology': [
                {
                    question: "Name the organelle responsible for protein synthesis",
                    answer: "Ribosome"
                }
            ]
        }
    },
    'Form 4': {
        'Chemistry': {
            'Organic Chemistry': [
                {
                    question: "What is the molecular formula of methane?",
                    answer: "CH4"
                }
            ]
        }
    }
};

// Sample Exam Papers
const examPapersData = [
    {
        id: 1,
        subject: 'Mathematics',
        form: 'Form 4',
        code: 'MAT/2024/1',
        title: 'KCSE Mathematics Paper 1 - 2024',
        questions: 25,
        duration: '2.5 hours',
        downloadUrl: '#'
    },
    {
        id: 2,
        subject: 'Biology',
        form: 'Form 4',
        code: 'BIO/2024/2',
        title: 'KCSE Biology Paper 2 - 2024',
        questions: 20,
        duration: '2 hours',
        downloadUrl: '#'
    }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeLoadingScreen();
    setupEventListeners();
    loadSubjects();
});

// Loading Screen with Slideshow
function initializeLoadingScreen() {
    const slideshow = document.getElementById('subject-slideshow');
    
    // Create slides for each subject
    subjectImages.forEach((subject, index) => {
        const slide = document.createElement('div');
        slide.className = `subject-slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `
            <div style="width: 100%; height: 100%; background: linear-gradient(45deg, #${Math.floor(Math.random()*16777215).toString(16)}, #${Math.floor(Math.random()*16777215).toString(16)}); 
                        display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; color: white;">
                ${subject}
            </div>
        `;
        slideshow.appendChild(slide);
    });
    
    // Animate slideshow
    let currentSlide = 0;
    const slides = document.querySelectorAll('.subject-slide');
    
    const slideInterval = setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 300); // 1/3 second per slide
    
    // Simulate loading completion
    setTimeout(() => {
        clearInterval(slideInterval);
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        showRegistrationModal();
    }, 3000);
}

// Show Registration Modal
function showRegistrationModal() {
    document.getElementById('registration-modal').style.display = 'flex';
    
    // Add event listeners to curriculum cards
    document.getElementById('curriculum-844').addEventListener('click', () => {
        selectCurriculum('8-4-4');
    });
    
    document.getElementById('curriculum-cbc').addEventListener('click', () => {
        selectCurriculum('CBC');
    });
}

// Curriculum Selection
function selectCurriculum(curriculum) {
    AppState.currentCurriculum = curriculum;
    document.getElementById('registration-modal').style.display = 'none';
    
    if (curriculum === '8-4-4') {
        document.getElementById('form-844').classList.remove('hidden');
        document.getElementById('form-cbc').classList.add('hidden');
    } else {
        document.getElementById('form-cbc').classList.remove('hidden');
        document.getElementById('form-844').classList.add('hidden');
    }
    
    // Set background based on curriculum
    const body = document.body;
    if (curriculum === '8-4-4') {
        body.style.background = 'linear-gradient(135deg, #f0f4ff, #fdf2f8)';
    } else {
        body.style.background = 'linear-gradient(135deg, #f5f3ff, #fefce8)';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Registration Forms
    document.getElementById('registerForm844').addEventListener('submit', function(e) {
        e.preventDefault();
        registerUser('8-4-4');
    });
    
    document.getElementById('registerFormCBC').addEventListener('submit', function(e) {
        e.preventDefault();
        registerUser('CBC');
    });
    
    // Navigation
    document.getElementById('home-btn').addEventListener('click', showDashboard);
    document.getElementById('logout-btn').addEventListener('click', logoutUser);
    
    // Feature Buttons
    document.getElementById('ai-btn').addEventListener('click', showAIInterface);
    document.getElementById('quiz-btn').addEventListener('click', showQuizInterface);
    document.getElementById('notepad-btn').addEventListener('click', showNotepadInterface);
    document.getElementById('exams-btn').addEventListener('click', showExamsInterface);
    document.getElementById('symposium-btn').addEventListener('click', showSymposiumInterface);
    document.getElementById('progress-btn').addEventListener('click', showProgressInterface);
    
    // Back Buttons
    document.getElementById('ai-back-btn').addEventListener('click', showDashboard);
    document.getElementById('quiz-back-btn').addEventListener('click', showDashboard);
    document.getElementById('notepad-back-btn').addEventListener('click', showDashboard);
    document.getElementById('exams-back-btn').addEventListener('click', showDashboard);
    document.getElementById('symposium-back-btn').addEventListener('click', showDashboard);
    
    // Quick Access
    document.getElementById('quick-quiz-btn').addEventListener('click', startQuickQuiz);
    document.getElementById('recent-papers-btn').addEventListener('click', showExamsInterface);
    
    // AI Interface
    document.getElementById('ai-send-btn').addEventListener('click', sendAIQuestion);
    document.getElementById('ai-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendAIQuestion();
        }
    });
    
    // Quiz Interface
    document.getElementById('start-quick-quiz').addEventListener('click', startQuickQuiz);
    document.getElementById('start-normal-quiz').addEventListener('click', startNormalQuiz);
    document.getElementById('quit-quiz-btn').addEventListener('click', showQuizInterface);
    document.getElementById('submit-answer-btn').addEventListener('click', submitQuizAnswer);
    
    // Notepad
    document.getElementById('new-note-btn').addEventListener('click', createNewNote);
    document.getElementById('save-note-btn').addEventListener('click', saveCurrentNote);
    document.getElementById('delete-note-btn').addEventListener('click', deleteCurrentNote);
    
    // Symposium
    document.getElementById('start-symposium-btn').addEventListener('click', startSymposiumGame);
    document.getElementById('pass-btn').addEventListener('click', passQuestion);
    document.getElementById('answer-btn').addEventListener('click', showAnswerInput);
    document.getElementById('submit-symposium-answer').addEventListener('click', submitSymposiumAnswer);
    
    // Exams
    document.getElementById('search-exams-btn').addEventListener('click', loadExamPapers);
}

// Register User
function registerUser(curriculumType) {
    let userData;
    
    if (curriculumType === '8-4-4') {
        userData = {
            name: document.getElementById('name844').value,
            form: document.getElementById('form844').value,
            class: document.getElementById('class844').value,
            stream: document.getElementById('stream844').value,
            school: document.getElementById('school844').value,
            adm: document.getElementById('adm844').value,
            curriculum: '8-4-4'
        };
        document.getElementById('form-844').classList.add('hidden');
    } else {
        userData = {
            name: document.getElementById('nameCBC').value,
            school: document.getElementById('schoolCBC').value,
            grade: document.getElementById('gradeCBC').value,
            stream: document.getElementById('streamCBC').value,
            adm: document.getElementById('admCBC').value,
            curriculum: 'CBC'
        };
        document.getElementById('form-cbc').classList.add('hidden');
    }
    
    AppState.currentUser = userData;
    
    // Update UI
    document.getElementById('user-name').textContent = userData.name.split(' ')[0];
    document.getElementById('display-name').textContent = userData.name;
    document.getElementById('display-curriculum').textContent = userData.curriculum;
    
    // Save to localStorage
    localStorage.setItem('wegem_user', JSON.stringify(userData));
    
    showDashboard();
    showNotification('Registration successful! Welcome to WEGEM Learning.');
    
    // Send registration data to admin (simulated)
    sendToAdmin('Registration', userData);
}

// Show Dashboard
function showDashboard() {
    hideAllInterfaces();
    document.getElementById('dashboard').classList.remove('hidden');
    AppState.currentFeature = 'dashboard';
}

// Show AI Interface
function showAIInterface() {
    hideAllInterfaces();
    document.getElementById('ai-interface').classList.remove('hidden');
    AppState.currentFeature = 'ai';
}

// Show Quiz Interface
function showQuizInterface() {
    hideAllInterfaces();
    document.getElementById('quiz-interface').classList.remove('hidden');
    AppState.currentFeature = 'quiz';
    populateQuizSelectors();
}

// Show Notepad Interface
function showNotepadInterface() {
    hideAllInterfaces();
    document.getElementById('notepad-interface').classList.remove('hidden');
    AppState.currentFeature = 'notepad';
    loadNotes();
    populateSubjectSelector();
}

// Show Exams Interface
function showExamsInterface() {
    hideAllInterfaces();
    document.getElementById('exams-interface').classList.remove('hidden');
    AppState.currentFeature = 'exams';
    loadExamPapers();
}

// Show Symposium Interface
function showSymposiumInterface() {
    hideAllInterfaces();
    document.getElementById('symposium-interface').classList.remove('hidden');
    AppState.currentFeature = 'symposium';
}

// Show Progress Interface
function showProgressInterface() {
    // Implementation for progress tracking
    showNotification('Progress tracking feature coming soon!');
}

// Hide All Interfaces
function hideAllInterfaces() {
    const interfaces = [
        'dashboard', 'ai-interface', 'quiz-interface', 'notepad-interface',
        'exams-interface', 'symposium-interface', 'quiz-taking'
    ];
    
    interfaces.forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
}

// Load Subjects
function loadSubjects() {
    // This would typically come from an API
    AppState.subjects = [
        'Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics',
        'Geography', 'History', 'CRE', 'Business', 'Agriculture', 'Computer',
        'Home Science', 'Music', 'Art & Design'
    ];
    
    // Populate subject selectors
    const subjectSelectors = [
        'quiz-subject', 'exam-subject', 'symposium-subject', 'note-subject'
    ];
    
    subjectSelectors.forEach(selectorId => {
        const select = document.getElementById(selectorId);
        if (select) {
            AppState.subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                select.appendChild(option);
            });
        }
    });
}

// Populate Quiz Selectors
function populateQuizSelectors() {
    const formSelect = document.getElementById('quiz-form');
    const topicSelect = document.getElementById('quiz-topic');
    
    // Clear existing options
    formSelect.innerHTML = '<option value="">Select Form/Grade</option>';
    topicSelect.innerHTML = '<option value="">Select Topic</option>';
    
    // Add curriculum-specific options
    if (AppState.currentCurriculum === '8-4-4') {
        for (let i = 1; i <= 4; i++) {
            const option = document.createElement('option');
            option.value = `Form ${i}`;
            option.textContent = `Form ${i}`;
            formSelect.appendChild(option);
        }
    } else {
        for (let i = 1; i <= 12; i++) {
            const option = document.createElement('option');
            option.value = `Grade ${i}`;
            option.textContent = `Grade ${i}`;
            formSelect.appendChild(option);
        }
    }
    
    // Update topics when subject changes
    document.getElementById('quiz-subject').addEventListener('change', function() {
        const subject = this.value;
        const form = formSelect.value;
        
        topicSelect.innerHTML = '<option value="">Select Topic</option>';
        
        if (subject && form && quizDatabase[form] && quizDatabase[form][subject]) {
            const topics = Object.keys(quizDatabase[form][subject]);
            topics.forEach(topic => {
                const option = document.createElement('option');
                option.value = topic;
                option.textContent = topic;
                topicSelect.appendChild(option);
            });
        }
    });
}

// Start Quick Quiz
function startQuickQuiz() {
    // Generate 30 random questions
    AppState.quizQuestions = generateRandomQuestions(30);
    AppState.currentQuiz = {
        currentQuestion: 0,
        score: 0,
        answers: [],
        startTime: Date.now()
    };
    
    startQuiz();
}

// Start Normal Quiz
function startNormalQuiz() {
    const form = document.getElementById('quiz-form').value;
    const subject = document.getElementById('quiz-subject').value;
    const topic = document.getElementById('quiz-topic').value;
    
    if (!form || !subject || !topic) {
        showNotification('Please select form, subject, and topic');
        return;
    }
    
    // Get questions from database
    const questions = quizDatabase[form]?.[subject]?.[topic] || [];
    
    if (questions.length === 0) {
        showNotification('No questions found for the selected topic');
        return;
    }
    
    AppState.quizQuestions = questions;
    AppState.currentQuiz = {
        currentQuestion: 0,
        score: 0,
        answers: [],
        startTime: Date.now()
    };
    
    startQuiz();
}

// Start Quiz Session
function startQuiz() {
    hideAllInterfaces();
    document.getElementById('quiz-taking').classList.remove('hidden');
    
    loadQuizQuestion();
    startQuizTimer();
}

// Load Quiz Question
function loadQuizQuestion() {
    const quiz = AppState.currentQuiz;
    const question = AppState.quizQuestions[quiz.currentQuestion];
    
    document.getElementById('current-question').textContent = quiz.currentQuestion + 1;
    document.getElementById('total-questions').textContent = AppState.quizQuestions.length;
    document.getElementById('quiz-question').textContent = question.question;
    document.getElementById('quiz-answer-input').value = '';
    document.getElementById('quiz-timer').textContent = '60';
    
    // Reset timer
    if (quiz.timer) clearInterval(quiz.timer);
    startQuizTimer();
}

// Start Quiz Timer
function startQuizTimer() {
    let timeLeft = 60;
    const timerElement = document.getElementById('quiz-timer');
    
    AppState.currentQuiz.timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(AppState.currentQuiz.timer);
            submitQuizAnswer(true); // Auto-submit when time runs out
        }
    }, 1000);
}

// Submit Quiz Answer
function submitQuizAnswer(timeout = false) {
    const quiz = AppState.currentQuiz;
    const answer = document.getElementById('quiz-answer-input').value.trim();
    const correctAnswer = AppState.quizQuestions[quiz.currentQuestion].answer;
    
    // Check answer
    const isCorrect = answer.toLowerCase() === correctAnswer.toLowerCase();
    
    if (!timeout && isCorrect) {
        quiz.score++;
    }
    
    // Store answer
    quiz.answers.push({
        question: AppState.quizQuestions[quiz.currentQuestion].question,
        userAnswer: answer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
        timeout: timeout
    });
    
    // Move to next question or finish
    quiz.currentQuestion++;
    
    if (quiz.currentQuestion < AppState.quizQuestions.length) {
        loadQuizQuestion();
    } else {
        finishQuiz();
    }
}

// Finish Quiz
function finishQuiz() {
    clearInterval(AppState.currentQuiz.timer);
    
    const quiz = AppState.currentQuiz;
    const percentage = (quiz.score / AppState.quizQuestions.length) * 100;
    
    // Show results
    let resultsHTML = `
        <div class="quiz-results">
            <h3>Quiz Completed!</h3>
            <div class="score-display">
                <h4>Your Score: ${quiz.score}/${AppState.quizQuestions.length}</h4>
                <div class="percentage">${percentage.toFixed(1)}%</div>
            </div>
            <div class="answers-review">
                <h4>Review Answers:</h4>
    `;
    
    quiz.answers.forEach((answer, index) => {
        resultsHTML += `
            <div class="answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}">
                <p><strong>Q${index + 1}:</strong> ${answer.question}</p>
                <p>Your Answer: ${answer.userAnswer || 'No answer'}</p>
                <p>Correct Answer: ${answer.correctAnswer}</p>
            </div>
        `;
    });
    
    resultsHTML += '</div></div>';
    
    document.getElementById('quiz-question').innerHTML = resultsHTML;
    
    // Send results to admin
    sendQuizResultsToAdmin(quiz);
    
    // Auto-return to quiz interface after 10 seconds
    setTimeout(() => {
        showQuizInterface();
    }, 10000);
}

// Send Quiz Results to Admin
function sendQuizResultsToAdmin(quiz) {
    const user = AppState.currentUser;
    const results = {
        user: user,
        quizResults: {
            score: quiz.score,
            total: AppState.quizQuestions.length,
            percentage: (quiz.score / AppState.quizQuestions.length * 100).toFixed(1),
            answers: quiz.answers,
            timestamp: new Date().toISOString()
        }
    };
    
    sendToAdmin('Quiz Results', results);
    showNotification('Quiz results have been sent to your teacher!');
}

// AI Chat Functionality
function sendAIQuestion() {
    const input = document.getElementById('ai-input');
    const question = input.value.trim();
    
    if (!question) return;
    
    // Add user message to chat
    addAIMessage('user', question);
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(question);
        addAIMessage('ai', response);
        
        // Send to admin
        sendToAdmin('AI Question', { user: AppState.currentUser?.name, question, response });
    }, 1000);
}

// Add AI Message to Chat
function addAIMessage(sender, message) {
    const chat = document.getElementById('ai-chat');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${sender}-message`;
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <strong>${sender === 'user' ? 'You' : 'WeGEM AI'}:</strong> ${message}
        </div>
    `;
    
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
}

// Generate AI Response
function generateAIResponse(question) {
    const responses = [
        "That's an excellent question! Based on the Kenyan curriculum, the answer is...",
        "I understand you're asking about this concept. Let me explain it in a way that's easy to understand.",
        "This is a common topic in KCSE exams. The key points to remember are...",
        "I've generated some practice questions for you based on your query. Try answering these:",
        "That concept relates to what you'll learn in Form 4. Here's a simplified explanation:"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           " For detailed explanations and personalized learning, continue using WEGEM AI!";
}

// Notepad Functionality
function loadNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    
    AppState.notes = JSON.parse(localStorage.getItem('wegem_notes') || '[]');
    
    AppState.notes.forEach((note, index) => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.dataset.index = index;
        noteItem.innerHTML = `
            <strong>${note.title || 'Untitled Note'}</strong>
            <small>${note.subject || 'General'} • ${new Date(note.date).toLocaleDateString()}</small>
        `;
        
        noteItem.addEventListener('click', () => loadNote(index));
        notesList.appendChild(noteItem);
    });
    
    if (AppState.notes.length > 0) {
        loadNote(0);
    }
}

function createNewNote() {
    AppState.notes.push({
        title: 'New Note',
        content: '',
        subject: '',
        date: new Date().toISOString()
    });
    
    saveNotes();
    loadNotes();
}

function loadNote(index) {
    const note = AppState.notes[index];
    document.getElementById('note-title').value = note.title;
    document.getElementById('note-content').value = note.content;
    document.getElementById('note-subject').value = note.subject;
    
    // Update active class
    document.querySelectorAll('.note-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.note-item[data-index="${index}"]`).classList.add('active');
}

function saveCurrentNote() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    const subject = document.getElementById('note-subject').value;
    
    const activeNote = document.querySelector('.note-item.active');
    if (activeNote) {
        const index = parseInt(activeNote.dataset.index);
        AppState.notes[index] = {
            ...AppState.notes[index],
            title,
            content,
            subject,
            date: new Date().toISOString()
        };
        
        saveNotes();
        loadNotes();
        showNotification('Note saved successfully!');
    }
}

function deleteCurrentNote() {
    const activeNote = document.querySelector('.note-item.active');
    if (activeNote) {
        const index = parseInt(activeNote.dataset.index);
        AppState.notes.splice(index, 1);
        saveNotes();
        loadNotes();
        showNotification('Note deleted!');
    }
}

function saveNotes() {
    localStorage.setItem('wegem_notes', JSON.stringify(AppState.notes));
}

function populateSubjectSelector() {
    const select = document.getElementById('note-subject');
    select.innerHTML = '<option value="">All Subjects</option>';
    
    AppState.subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        select.appendChild(option);
    });
}

// Exams Functionality
function loadExamPapers() {
    const subject = document.getElementById('exam-subject').value;
    const form = document.getElementById('exam-form').value;
    
    const grid = document.getElementById('exams-grid');
    grid.innerHTML = '';
    
    const filteredPapers = examPapersData.filter(paper => {
        return (!subject || paper.subject === subject) && 
               (!form || paper.form === form);
    });
    
    if (filteredPapers.length === 0) {
        grid.innerHTML = '<p class="no-papers">No exam papers found. Check back daily for updates!</p>';
        return;
    }
    
    filteredPapers.forEach(paper => {
        const card = document.createElement('div');
        card.className = 'exam-card';
        card.innerHTML = `
            <h4>${paper.title}</h4>
            <p><strong>Code:</strong> ${paper.code}</p>
            <p><strong>Questions:</strong> ${paper.questions}</p>
            <p><strong>Duration:</strong> ${paper.duration}</p>
            <button class="download-btn" onclick="downloadExamPaper(${paper.id})">
                <i class="fas fa-download"></i> Download PDF
            </button>
            <button class="download-btn" style="background: #3B82F6; margin-top: 0.5rem;" 
                    onclick="takeExamOnline(${paper.id})">
                <i class="fas fa-play-circle"></i> Take Online
            </button>
        `;
        grid.appendChild(card);
    });
}

function downloadExamPaper(paperId) {
    showNotification('Downloading exam paper... This would download a PDF in a real implementation.');
    // In a real app, this would trigger a PDF download
}

function takeExamOnline(paperId) {
    showNotification('Online exam feature coming soon!');
    // This would launch an online exam interface
}

// Symposium Game
function startSymposiumGame() {
    const group1 = document.getElementById('group1-name').value || 'Group Alpha';
    const group2 = document.getElementById('group2-name').value || 'Group Beta';
    const subject = document.getElementById('symposium-subject').value;
    const questionCount = parseInt(document.getElementById('question-count').value) || 10;
    
    if (!subject) {
        showNotification('Please select a subject for the symposium');
        return;
    }
    
    // Generate questions
    const questions = generateSymposiumQuestions(subject, questionCount);
    
    AppState.symposiumGame = {
        group1: { name: group1, score: 0 },
        group2: { name: group2, score: 0 },
        questions: questions,
        currentQuestion: 0,
        currentGroup: 1, // Group 1 starts
        timer: null,
        timeLeft: 90
    };
    
    // Update display
    document.getElementById('group1-display').textContent = group1;
    document.getElementById('group2-display').textContent = group2;
    document.getElementById('group1-score').querySelector('.score').textContent = '0';
    document.getElementById('group2-score').querySelector('.score').textContent = '0';
    
    // Show game interface
    document.querySelector('.symposium-setup').classList.add('hidden');
    document.getElementById('symposium-game').classList.remove('hidden');
    
    startSymposiumQuestion();
}

function startSymposiumQuestion() {
    const game = AppState.symposiumGame;
    const question = game.questions[game.currentQuestion];
    
    document.getElementById('game-question-num').textContent = game.currentQuestion + 1;
    document.getElementById('game-question-text').textContent = question.question;
    document.getElementById('symposium-timer').textContent = '90';
    
    // Hide answer section
    document.getElementById('answer-section').classList.add('hidden');
    
    // Start timer
    game.timeLeft = 90;
    if (game.timer) clearInterval(game.timer);
    
    game.timer = setInterval(() => {
        game.timeLeft--;
        document.getElementById('symposium-timer').textContent = game.timeLeft;
        
        if (game.timeLeft <= 0) {
            clearInterval(game.timer);
            passQuestion(); // Auto-pass when time runs out
        }
    }, 1000);
}

function passQuestion() {
    const game = AppState.symposiumGame;
    clearInterval(game.timer);
    
    // Switch to other group
    game.currentGroup = game.currentGroup === 1 ? 2 : 1;
    
    // Move to next question
    game.currentQuestion++;
    
    if (game.currentQuestion >= game.questions.length) {
        endSymposiumGame();
    } else {
        startSymposiumQuestion();
    }
}

function showAnswerInput() {
    clearInterval(AppState.symposiumGame.timer);
    document.getElementById('answer-section').classList.remove('hidden');
}

function submitSymposiumAnswer() {
    const game = AppState.symposiumGame;
    const answer = document.getElementById('symposium-answer').value.trim();
    const correctAnswer = game.questions[game.currentQuestion].answer;
    
    // Check answer
    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
        // Correct answer
        if (game.currentGroup === 1) {
            game.group1.score++;
            document.getElementById('group1-score').querySelector('.score').textContent = game.group1.score;
        } else {
            game.group2.score++;
            document.getElementById('group2-score').querySelector('.score').textContent = game.group2.score;
        }
        
        showNotification('Correct answer! Points awarded.');
    } else {
        showNotification('Incorrect answer. The correct answer was: ' + correctAnswer);
    }
    
    // Clear answer input
    document.getElementById('symposium-answer').value = '';
    
    // Move to next question
    game.currentQuestion++;
    game.currentGroup = game.currentQuestion % 2 === 0 ? 2 : 1;
    
    if (game.currentQuestion >= game.questions.length) {
        endSymposiumGame();
    } else {
        startSymposiumQuestion();
    }
}

function endSymposiumGame() {
    const game = AppState.symposiumGame;
    
    let winner;
    if (game.group1.score > game.group2.score) {
        winner = game.group1.name;
    } else if (game.group2.score > game.group1.score) {
        winner = game.group2.name;
    } else {
        winner = 'Both groups (Tie!)';
    }
    
    const percentage1 = (game.group1.score / game.questions.length * 100).toFixed(1);
    const percentage2 = (game.group2.score / game.questions.length * 100).toFixed(1);
    
    // Show results
    document.getElementById('game-question-text').innerHTML = `
        <div class="symposium-results">
            <h3>Symposium Complete!</h3>
            <div class="winner">Winner: ${winner}</div>
            <div class="scores">
                <div class="group-result">
                    <h4>${game.group1.name}</h4>
                    <div class="score">${game.group1.score} points</div>
                    <div class="percentage">${percentage1}%</div>
                </div>
                <div class="group-result">
                    <h4>${game.group2.name}</h4>
                    <div class="score">${game.group2.score} points</div>
                    <div class="percentage">${percentage2}%</div>
                </div>
            </div>
        </div>
    `;
    
    // Send results to admin
    sendSymposiumResultsToAdmin(game);
    
    // Reset after 10 seconds
    setTimeout(() => {
        document.getElementById('symposium-game').classList.add('hidden');
        document.querySelector('.symposium-setup').classList.remove('hidden');
    }, 10000);
}

function sendSymposiumResultsToAdmin(game) {
    const results = {
        group1: game.group1,
        group2: game.group2,
        totalQuestions: game.questions.length,
        timestamp: new Date().toISOString()
    };
    
    sendToAdmin('Symposium Results', results);
}

// Generate Random Questions
function generateRandomQuestions(count) {
    const questions = [];
    const allQuestions = [];
    
    // Collect all questions from database
    for (const form in quizDatabase) {
        for (const subject in quizDatabase[form]) {
            for (const topic in quizDatabase[form][subject]) {
                allQuestions.push(...quizDatabase[form][subject][topic]);
            }
        }
    }
    
    // Select random questions
    for (let i = 0; i < Math.min(count, allQuestions.length); i++) {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        questions.push(allQuestions[randomIndex]);
    }
    
    return questions;
}

// Generate Symposium Questions
function generateSymposiumQuestions(subject, count) {
    const questions = [];
    
    // Get questions for the selected subject
    for (const form in quizDatabase) {
        if (quizDatabase[form][subject]) {
            for (const topic in quizDatabase[form][subject]) {
                questions.push(...quizDatabase[form][subject][topic]);
            }
        }
    }
    
    // Shuffle and select
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
}

// Send Data to Admin
function sendToAdmin(type, data) {
    // In a real implementation, this would send data to the admin email
    // For now, we'll log it to console
    console.log(`Sending to admin (${type}):`, data);
    
    // Simulate sending email
    const adminEmail = 'eddie.gucci.05@gmail.com';
    const subject = `WEGEM Learning - ${type}`;
    const body = JSON.stringify(data, null, 2);
    
    // In a real app, you would use EmailJS or a backend service
    // For GitHub Pages demo, we'll just show a notification
    showNotification(`Data sent to admin (${type})`);
}

// Show Notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    const messageEl = document.getElementById('notification-message');
    
    messageEl.textContent = message;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Logout User
function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        AppState.currentUser = null;
        localStorage.removeItem('wegem_user');
        showRegistrationModal();
        showNotification('Logged out successfully');
    }
}

// Check for existing user on load
window.addEventListener('load', function() {
    const savedUser = localStorage.getItem('wegem_user');
    if (savedUser) {
        AppState.currentUser = JSON.parse(savedUser);
        AppState.currentCurriculum = AppState.currentUser.curriculum;
        
        document.getElementById('user-name').textContent = AppState.currentUser.name.split(' ')[0];
        document.getElementById('display-name').textContent = AppState.currentUser.name;
        document.getElementById('display-curriculum').textContent = AppState.currentUser.curriculum;
        
        showDashboard();
    }
});