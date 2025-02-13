const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');



let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];
fetch('https://opentdb.com/api.php?amount=50&category=9&difficulty=easy&type=multiple').then(res => {
    return res.json()
    // console.log(res);
  })
  .then(loadedQuestions =>{
    console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map(loadedQuestion =>{
        const formattedQuestion = {
            question: loadedQuestion.question
        };
        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
        answerChoices.splice(
            formattedQuestion.answer -1,0, loadedQuestion.correct_answer);

        answerChoices.forEach((choice,index) => {
            formattedQuestion['choice' + (index +1)] = choice;
        })
        return formattedQuestion;
    });
    startGame();
  })
  .catch(err =>{
    console.error(err);
  });
const correctBonus = 2;
const maxQuestions = 50;


startGame = () =>{
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    console.log(availableQuestions);
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};
getNewQuestion = () =>{
    if (availableQuestions.length === 0 || questionCounter > maxQuestions) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('/end.html');

    }
    questionCounter++;
    progressText.innerText =`Question:${questionCounter}/${maxQuestions}`;

    progressBarFull.style.width = `${(questionCounter / maxQuestions)*100}%` ;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;
    choices.forEach(choice =>{
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });
    availableQuestions.splice(questionIndex,1);
    acceptingAnswers = true;
};
choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers)return;
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        // const classToApply = 'incorrect';
        // if (selectedAnswer == currentQuestion.answer) {
        //     classToApply = 'correct'
        // }
        const classToApply = selectedAnswer == currentQuestion.answer ?
        'correct' :'incorrect';
        if (classToApply == 'incorrect') {
            const correctChoice = choices.find(choice => choice.dataset['number'] == currentQuestion.answer);
            correctChoice.parentElement.classList.add('correct');
        }
        if (classToApply == 'correct') {
            incrementScore(correctBonus);
        }
        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() =>{
            selectedChoice.parentElement.classList.remove(classToApply);
            choices.forEach(choice => choice.parentElement.classList.remove('correct'));
            getNewQuestion();
        },1000);
    });
});

incrementScore = num => {
    score +=num;
    scoreText.innerText = score;
}
// startGame();