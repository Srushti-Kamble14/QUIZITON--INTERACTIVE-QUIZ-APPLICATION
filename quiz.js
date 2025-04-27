const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const feedbackElement = document.getElementById('feedback');
const nextButton = document.getElementById('next-btn');
const resultContainer = document.getElementById('result');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
const totalQuestions = 5;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  resultContainer.classList.add('hide');
  nextButton.innerText = 'Next';
  fetchCodingQuestions();
}

async function fetchCodingQuestions() {
  try {
    const response = await fetch(`https://opentdb.com/api.php?amount=${totalQuestions}&category=18&type=multiple`);
    const data = await response.json();
    questions = data.results.map(q => ({
      question: decodeHTML(q.question),
      answers: shuffleArray([...q.incorrect_answers, q.correct_answer]).map(a => ({
        text: decodeHTML(a),
        correct: decodeHTML(a) === decodeHTML(q.correct_answer)
      }))
    }));
    showQuestion();
  } catch (error) {
    questionElement.innerText = '⚠️ Error loading coding questions.';
    console.error('Fetch error:', error);
  }
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    if (answer.correct) {
      button.dataset.correct = true;
    }
    button.addEventListener('click', selectAnswer);
    answerButtons.appendChild(button);
  });
}

function resetState() {
  feedbackElement.innerText = '';
  nextButton.classList.add('hide');
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const isCorrect = selectedButton.dataset.correct === "true";
  if (isCorrect) {
    feedbackElement.innerText = "✅ Correct!";
    feedbackElement.style.color = "#0e870e";
    score++;
  } else {
    feedbackElement.innerText = "❌ Incorrect.";
    feedbackElement.style.color = "red";
  }

  Array.from(answerButtons.children).forEach(button => {
    button.disabled = true;
  });

  nextButton.classList.remove('hide');
}

nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  questionElement.innerText = '';
  answerButtons.innerHTML = '';
  feedbackElement.innerText = '';
  resultContainer.classList.remove('hide');
  resultContainer.innerHTML = `<h2>Your Score: ${score} / ${questions.length}</h2>`;
  nextButton.innerText = 'Restart';
  nextButton.classList.remove('hide');
  nextButton.onclick = startQuiz;
}

startQuiz();


// var tl=gsap.timeline();
// tl.to(".nav",{
//     y:50,
//     duration: 0.5,
//     ease: "power1.out",
//     delay:0.2,
// })

// tl.from(".box",{
//   x:400,
//   duration:0.9,
//   ease:"power1.out",
//   delay:0.2,
//   opacity:0,
// })