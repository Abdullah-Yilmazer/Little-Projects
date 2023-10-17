// Kelimenin asıl hali ve tahmin edilen harf sayısı
var secretWord = "";
let displayWord = "";
let wordLength = Math.floor(6 + (4 * Math.random()));
let remainingAttempts = 6;
const guessedLetters = new Set();
for (let i = 0; i < wordLength; i++) {
   displayWord += "_";
}


// Oyunu başlatma işlemini async bir işlev içinde tanımlayın
async function startHangmanGame() {
   try {
      const response = await fetch(`https://random-word-api.herokuapp.com/word?length=${wordLength}`);
      const todos = await response.json();
      secretWord = todos[0];
      // console.log(todos[0]);
      // console.log("Kelime:", secretWord);
      // console.log("uzunluk:", wordLength);
      wordDisplay.textContent = displayWord; // Kelimeyi görüntüleme
   } catch (error) {
      console.error("Hata oluştu:", error);
   }
}


// HTML elementlerini seçme
const wordDisplay = document.querySelector(".word");
const messageDisplay = document.querySelector(".message");
const hangmanParts = document.querySelectorAll(".hangman > .man > div");

// Kelimeyi görüntüleme
wordDisplay.textContent = displayWord;

// Tahmin fonksiyonu
function guessLetter(letter) {
   if (guessedLetters.has(letter)) {
      messageDisplay.textContent = "Bu harfi zaten tahmin ettiniz.";
      return;
   }

   guessedLetters.add(letter);

   if (secretWord.includes(letter)) {
      updateDisplayWord(letter);
   } else {
      remainingAttempts--;
      updateHangman();
   }

   checkGameStatus();
}

// Kelimenin görüntülenen halini güncelleme
function updateDisplayWord(letter) {
   let newDisplayWord = "";
   for (let i = 0; i < secretWord.length; i++) {
      if (secretWord[i] === letter || displayWord[i] !== "_") {
         newDisplayWord += secretWord[i];
      } else {
         newDisplayWord += "_";
      }
   }
   displayWord = newDisplayWord;
   wordDisplay.textContent = displayWord;
   checkGameStatus();
}

// Asılan adamı güncelleme
function updateHangman() {
   const incorrectGuesses = Array.from(guessedLetters).filter(letter => !secretWord.includes(letter)).length;
   const hangmanPartIndex = hangmanParts.length - incorrectGuesses;

   if (hangmanPartIndex >= 0) {
      hangmanParts[hangmanPartIndex].style.display = "block";
   }
}

// Oyun durumunu kontrol etme
function checkGameStatus() {
   if (displayWord === secretWord) {
      messageDisplay.textContent = "Tebrikler, kazandınız!";
   } else if (remainingAttempts === 0) {
      messageDisplay.textContent = "Oyun bitti. Doğru kelime: " + secretWord;
   }
}

// Harf tahminlerini dinleme
document.addEventListener("keyup", function (event) {
   const letter = event.key.toLowerCase();
   if (/^[a-z]$/.test(letter)) {
      guessLetter(letter);
   }
});
startHangmanGame();
