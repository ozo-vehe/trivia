const selectInputField = document.querySelector("#quizCategory");
const startButton = document.querySelector(".getStarted");
const nextQuestionButton = document.querySelector(".next");
const finishQuestionButton = document.querySelector(".finish");
const triviaHome = document.querySelector(".triviaHome");
const questionsContainer = document.querySelector(".questionsContainer");
const resultContainer = document.querySelector(".resultContainer");

// trivia questions variable
let triviaQuestions = [];
// trivia answers variable
let triviaAnswers = [];
// trivia score variable
let triviaScore = 0;
// trivia wrong answers variable
let triviaWrongAnswers = 0;
// trivia unanswered variable
let triviaUnanswered = 0;
// trivia total questions variable
let triviaTotalQuestions = 20;
// trivia correct answers variable
let triviaCorrectAnswers = 0;
// Current question count
let currentQuestion = 0;

const getCategories = async () => {
  const data = await fetch("https://opentdb.com/api_category.php");
  const res = await data.json();
  const categories = res.trivia_categories;

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    selectInputField.appendChild(option);
  });
};
getCategories();

// Get the trivia questions
const getTriviaQuestions = async (url) => {
  const data = await fetch(url);
  const res = await data.json();
  const questions = res.results;

  questions.map((question, index) => {
    question.id = index;
    triviaQuestions.push(question);
  });
  displayQuestions();
};

// Save the trivia answers
const saveTriviaAnswers = () => {
}

// Question template
const questionTemplate = (question) => {
  return `
    <div class="question">
      <h3>Category: <span class="questionCategory">${question.category}</span></h3>
      <p>${question.id + 1}. ${question.question}</p>
      <div class="answers">
        ${question.incorrect_answers.map((answer) => {
          return `
            <div class="options">
              <input class="questionAnswer" id="${answer}" type="radio" name="${question.id}" value="${answer}">
              <label for="${answer}">${answer}</label>
            </div>
          `;
        }).join('')}
        <div class="options">
          <input class="questionAnswer" id="${question.correct_answer}" type="radio" name="${question.id}" value="${question.correct_answer}">
          <label for="${question.correct_answer}">${question.correct_answer}</label>
        </div>
      </div>
    </div>
  `;
};


// Display the trivia questions
const displayQuestions = async () => {
  const triviaContainer = document.querySelector(".questions");
  triviaContainer.innerHTML = "";
  triviaContainer.innerHTML = questionTemplate(
    triviaQuestions[currentQuestion]
  );
};

// Start the quiz
startButton.addEventListener("click", async(e) => {
  e.preventDefault();
  const selectedCategory = document.querySelector("#quizCategory").value;
  const selectedDifficulty = document.querySelector("#difficulty").value;
  const selectedType = document.querySelector("#triviType").value;
  // Define the url variable
  let url = `https://opentdb.com/api.php?amount=20&category=${selectedCategory}`;

  if (selectedDifficulty !== "any") {
    url += `&difficulty=${selectedDifficulty}`;
  }
  if (selectedType !== "any") {
    url += `&type=${selectedType}`;
  }

  await getTriviaQuestions(url);
  triviaHome.classList.add("hide");
  questionsContainer.classList.remove("hide");
});

// Next question
nextQuestionButton.addEventListener("click", function (e) {
  e.preventDefault();
  const selectedAnswer = document.querySelectorAll('.questionAnswer');

  // Check if the answer is correct or wrong or unanswered
  selectedAnswer.forEach((answer) => {
    if (answer.checked) {
      const questionId = triviaQuestions[currentQuestion].id;
      const userAnswer = {
        questionId,
        answer: answer.value
      }

      triviaAnswers.push(userAnswer);

      if (userAnswer.answer === triviaQuestions[currentQuestion].correct_answer) {
        triviaScore++;
        triviaCorrectAnswers++;
      } else {
        triviaWrongAnswers++;
      }
    } else {
      triviaUnanswered = triviaTotalQuestions - triviaCorrectAnswers - triviaWrongAnswers;
    }
  });

  const triviaContainer = document.querySelector(".questions");
  triviaContainer.innerHTML = "";
  currentQuestion++;
  if (currentQuestion < triviaQuestions.length) {
    triviaContainer.innerHTML = questionTemplate(
      triviaQuestions[currentQuestion]
    );
  }
  if (currentQuestion >= triviaQuestions.length - 1) {
    triviaContainer.innerHTML = questionTemplate(
      triviaQuestions[currentQuestion]
    );
    nextQuestionButton.classList.add("hide");
    finishQuestionButton.classList.remove("hide");
  }
});

// Finish the quiz
finishQuestionButton.addEventListener("click", function (e) {
  e.preventDefault();
  const totalQuestionsContainer = document.querySelector(".totalQuestions");
  const correctAnswersContainer = document.querySelector(".correct");
  const wrongAnswersContainer = document.querySelector(".wrong");
  const scorePercentageContainer = document.querySelector(".percentage");
  const unansweredQuestionContainer = document.querySelector(".unanswered");

  const triviaScorePercentage =  (100 * triviaScore) / triviaTotalQuestions;
  triviaAnswers = {
    ...triviaAnswers,
    triviaScorePercentage,
    triviaWrongAnswers,
    triviaUnanswered,
    triviaTotalQuestions,
    triviaCorrectAnswers,
  };
  
  totalQuestionsContainer.textContent = triviaTotalQuestions;
  correctAnswersContainer.textContent = triviaCorrectAnswers;
  wrongAnswersContainer.textContent = triviaWrongAnswers;
  unansweredQuestionContainer.textContent = triviaUnanswered;
  scorePercentageContainer.textContent = `${triviaScorePercentage}%`;

  questionsContainer.classList.add("hide");
  resultContainer.classList.remove("hide");
});
