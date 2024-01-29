const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Replace the quiz data with your own
const quizzes = [
    {
        name: 'Math Quiz',
        questions: [
            { question: '2 + 2 =', options: ['3', '4', '5'], correct_answer: '4' },
            { question: '6 * 8 =', options: ['48', '56', '64'], correct_answer: '48' },
        ]
    },
    // Add more quizzes
];

const userScores = {};

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/quiz/:quiz_id', (req, res) => {
    const quizId = req.params.quiz_id;
    const quiz = quizzes[quizId];
    userScores[quizId] = 0;
    res.sendFile(path.join(__dirname, 'quiz.html'));
});

app.post('/submit_answer/:quiz_id/:question_number', (req, res) => {
    const quizId = req.params.quiz_id;
    const questionNumber = parseInt(req.params.question_number);
    const selectedOption = req.body.option;
    const quiz = quizzes[quizId];
    const question = quiz.questions[questionNumber];

    if (selectedOption === question.correct_answer) {
        userScores[quizId]++;
    }

    const nextQuestionNumber = questionNumber + 1;

    if (nextQuestionNumber === quiz.questions.length) {
        res.redirect(`/result/${quizId}`);
    } else {
        res.redirect(`/quiz/${quizId}`);
    }
});

app.get('/result/:quiz_id', (req, res) => {
    const quizId = req.params.quiz_id;
    const score = userScores[quizId];
    delete userScores[quizId];
    res.sendFile(path.join(__dirname, 'result.html'));
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

