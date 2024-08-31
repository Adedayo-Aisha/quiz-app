const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const max_high_scores = 5;

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
console.log(highScores);
// console.log(JSON.parse(localStorage.getItem('highScores')));
finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
 saveScoreBtn.disabled = !username.value;
});

saveHighScore = e =>{
    e.preventDefault();
    console.log('save');
    const score = {
        score: Math.floor(Math.random() * 100),
        name: username.value 
    };
    highScores.push(score);

    highScores.sort((a,b) => b.score - a.score)

    highScores.splice(5);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign('/');

    console.log(highScores);
};