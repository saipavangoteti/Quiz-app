from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Replace the quiz data with your own
quizzes = [
    {
        "name": "Math Quiz",
        "questions": [
            {"question": "2 + 2 =", "options": ["3", "4", "5"], "correct_answer": "4"},
            {"question": "6 * 8 =", "options": ["48", "56", "64"], "correct_answer": "48"},
        ]
    },
    # Add more quizzes
]

user_scores = {}

@app.route('/')
def home():
    return render_template('home.html', quizzes=quizzes)

@app.route('/quiz/<quiz_id>')
def start_quiz(quiz_id):
    quiz = quizzes[int(quiz_id)]
    user_scores[quiz_id] = 0
    return render_template('quiz.html', quiz=quiz, question_number=0)

@app.route('/submit_answer/<quiz_id>/<question_number>', methods=['POST'])
def submit_answer(quiz_id, question_number):
    selected_option = request.form.get('option')
    quiz = quizzes[int(quiz_id)]
    question = quiz['questions'][int(question_number)]

    if selected_option == question['correct_answer']:
        user_scores[quiz_id] += 1

    next_question_number = int(question_number) + 1

    if next_question_number == len(quiz['questions']):
        return redirect(url_for('result', quiz_id=quiz_id))
    else:
        return render_template('quiz.html', quiz=quiz, question_number=next_question_number)

@app.route('/result/<quiz_id>')
def result(quiz_id):
    score = user_scores[quiz_id]
    del user_scores[quiz_id]
    return render_template('result.html', score=score)

if __name__ == '__main__':
    app.run(debug=True)

