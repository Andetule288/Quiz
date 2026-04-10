        // =============================================
        // Questions Data with Fun Facts
        // =============================================
        const QUESTIONS = [
            {
                question: "What is the closest star to Earth?",
                answers: ["The Sun", "Proxima Centauri", "Sirius", "Betelgeuse"],
                correct: 0,
                facts: [
                    "The Sun is about 93 million miles away from Earth. Light from the Sun takes about 8 minutes and 20 seconds to reach us!",
                    "The Sun is so massive that about 1.3 million Earths could fit inside it!",
                    "The Sun has been burning for about 4.6 billion years and has enough fuel for another 5 billion years!"
                ]
            },
            {
                question: "Which planet is known as the Red Planet?",
                answers: ["Venus", "Jupiter", "Mars", "Saturn"],
                correct: 2,
                facts: [
                    "Mars is red because its surface is covered in iron oxide, which is basically rust!",
                    "Mars has the tallest volcano in the solar system called Olympus Mons. It is about 13.6 miles high, nearly three times the height of Mount Everest!",
                    "A day on Mars is only about 37 minutes longer than a day on Earth!"
                ]
            },
            {
                question: "How many planets are in our solar system?",
                answers: ["6", "7", "8", "9"],
                correct: 2,
                facts: [
                    "Pluto used to be the 9th planet but was reclassified as a dwarf planet in 2006 by the International Astronomical Union!",
                    "All eight planets orbit the Sun in the same direction, and most also spin in that same direction!",
                    "The eight planets can be remembered with the mnemonic: My Very Educated Mother Just Served Us Noodles!"
                ]
            },
            {
                question: "What is the biggest planet in our solar system?",
                answers: ["Saturn", "Neptune", "Uranus", "Jupiter"],
                correct: 3,
                facts: [
                    "Jupiter is so big that all the other planets in the solar system could fit inside it!",
                    "Jupiter has a Great Red Spot, which is a storm that has been raging for at least 350 years!",
                    "Jupiter has at least 95 known moons, including the four largest discovered by Galileo in 1610!"
                ]
            },
            {
                question: "Which galaxy do we live in?",
                answers: ["Andromeda", "Milky Way", "Whirlpool", "Sombrero"],
                correct: 1,
                facts: [
                    "The Milky Way is about 100,000 light-years across and contains between 100 to 400 billion stars!",
                    "Our solar system is located about 26,000 light-years from the center of the Milky Way galaxy!",
                    "The Milky Way is on a collision course with the Andromeda galaxy, but it will not happen for about 4.5 billion years!"
                ]
            },
            {
                question: "What planet has the most moons?",
                answers: ["Jupiter", "Saturn", "Uranus", "Neptune"],
                correct: 1,
                facts: [
                    "Saturn has 146 confirmed moons! Its largest moon, Titan, is bigger than the planet Mercury!",
                    "Saturn's moon Enceladus has geysers that shoot water ice into space from an underground ocean!",
                    "If you could find a bathtub big enough, Saturn would actually float in water because it is less dense than water!"
                ]
            },
            {
                question: "What is a shooting star really?",
                answers: ["A star falling", "A meteor burning up", "A comet", "A satellite"],
                correct: 1,
                facts: [
                    "Shooting stars are tiny bits of space rock or dust that burn up in Earth's atmosphere, creating a streak of light!",
                    "The Perseid meteor shower happens every August when Earth passes through the debris trail of a comet called Swift-Tuttle!",
                    "About 48.5 tons of meteoroids fall to Earth every single day, but most are as small as grains of sand!"
                ]
            },
            {
                question: "Which planet is the hottest in our solar system?",
                answers: ["Mercury", "Venus", "Mars", "Jupiter"],
                correct: 1,
                facts: [
                    "Venus is hotter than Mercury even though it is farther from the Sun because its thick atmosphere traps heat like a blanket!",
                    "The surface of Venus is hot enough to melt lead at around 900 degrees Fahrenheit (475 degrees Celsius)!",
                    "Venus spins backwards compared to most other planets, so the Sun rises in the west and sets in the east!"
                ]
            },
            {
                question: "What do we call a group of stars that form a pattern?",
                answers: ["A solar system", "A nebula", "A constellation", "A galaxy cluster"],
                correct: 2,
                facts: [
                    "There are 88 officially recognized constellations in the sky, and many of them were named thousands of years ago by ancient civilizations!",
                    "The stars in a constellation may look close together, but they can actually be millions of miles apart from each other!",
                    "The most famous constellation is Orion, which is visible from both the Northern and Southern Hemispheres!"
                ]
            },
            {
                question: "Which planet has beautiful rings around it?",
                answers: ["Jupiter", "Uranus", "Neptune", "Saturn"],
                correct: 3,
                facts: [
                    "Saturn's rings are made of billions of pieces of ice and rock, some as small as a grain of sand and some as big as a house!",
                    "Saturn's rings extend up to 175,000 miles from the planet, but they are only about 30 feet thick!",
                    "All four gas giants have ring systems, but Saturn's are by far the most visible and spectacular!"
                ]
            }
        ];

        const QUESTION_TIME = 20;
        const MAX_POINTS_PER_QUESTION = 1000;

        // =============================================
        // Game State
        // =============================================
        let playerName = "Explorer";
        let currentQuestion = 0;
        let score = 0;
        let streak = 0;
        let bestStreak = 0;
        let correctCount = 0;
        let answerTimes = [];
        let timer = null;
        let timeLeft = QUESTION_TIME;
        let answered = false;
        let isSpeaking = false;

        // =============================================
        // Voice Recognition Setup
        // =============================================
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition = null;
        let isListening = false;

        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = true;
            recognition.continuous = false;
            
            recognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
                }
                const spokenText = finalTranscript || event.results[0][0].transcript;
                document.getElementById('micStatus').textContent = spokenText || "Listening...";
                matchSpokenToOption(spokenText);
            };

            recognition.onerror = () => { stopListening(); };
            recognition.onend = () => { stopListening(); };
        }

        function toggleListening() {
            if (!recognition) { 
                alert("Voice recognition not supported in this browser."); 
                return; 
            }
            if (isListening) { 
                stopListening(); 
            } else { 
                try {
                    recognition.start(); 
                    isListening = true; 
                    document.getElementById('micBtn').classList.add('listening');
                    document.getElementById('micStatus').textContent = "Listening...";
                } catch(e) {}
            }
        }

        function stopListening() {
            if (isListening && recognition) { 
                try { recognition.stop(); } catch(e){} 
            }
            isListening = false;
            document.getElementById('micBtn').classList.remove('listening');
            document.getElementById('micStatus').textContent = "Tap to speak an answer (e.g., 'A', or 'The Sun')";
        }

        function matchSpokenToOption(spoken) {
            if (!spoken || answered) return;
            const nSpoken = spoken.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
            const btns = Array.from(document.querySelectorAll('.answer-btn'));

            // 1. Direct Letter Match (e.g., "A", "Option B")
            const letterMatch = nSpoken.match(/^(option\s*)?([a-d1-4])$/);
            if (letterMatch) {
                let char = letterMatch[2];
                if (char === '1') char = 'a';
                if (char === '2') char = 'b';
                if (char === '3') char = 'c';
                if (char === '4') char = 'd';
                
                const matchedBtn = btns.find(b => b.dataset.letter.toLowerCase() === char);
                if (matchedBtn) { matchedBtn.click(); return; }
            }

            // 2. Text Content Match
            let bestBtn = null;
            let maxScore = 0;

            btns.forEach(btn => {
                const optText = btn.dataset.text.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

                if (nSpoken.includes(optText) || optText.includes(nSpoken)) {
                    maxScore = 100;
                    bestBtn = btn;
                } else {
                    const sW = nSpoken.split(' ');
                    const oW = optText.split(' ');
                    const common = sW.filter(w => oW.includes(w));
                    const score = common.length / oW.length;
                    if (score > 0.5 && score > maxScore) {
                        maxScore = score;
                        bestBtn = btn;
                    }
                }
            });

            if (bestBtn) {
                bestBtn.click();
            }
        }

        // =============================================
        // Stars Background
        // =============================================
        const canvas = document.getElementById('starsCanvas');
        const ctx = canvas.getContext('2d');
        let starsArray = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function createStars() {
            starsArray = [];
            const count = Math.floor((canvas.width * canvas.height) / 3000);
            for (let i = 0; i < count; i++) {
                starsArray.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 0.5,
                    alpha: Math.random(),
                    alphaSpeed: Math.random() * 0.02 + 0.005,
                    alphaDir: 1
                });
            }
        }

        function drawStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            starsArray.forEach(star => {
                star.alpha += star.alphaSpeed * star.alphaDir;
                if (star.alpha >= 1) star.alphaDir = -1;
                if (star.alpha <= 0.2) star.alphaDir = 1;

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.fill();
            });
            requestAnimationFrame(drawStars);
        }

        resizeCanvas();
        createStars();
        drawStars();
        window.addEventListener('resize', () => { resizeCanvas(); createStars(); });

        // =============================================
        // TTS Helper
        // =============================================
        function speak(text, onEnd) {
            if ('speechSynthesis' in window) {
                speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = "en-US";
                utterance.rate = 0.95;
                utterance.pitch = 1.1;
                utterance.onend = function() {
                    isSpeaking = false;
                    document.getElementById('speakingIndicator').style.display = 'none';
                    if (onEnd && typeof onEnd === 'function') {
                        setTimeout(onEnd, 400);
                    }
                };
                utterance.onerror = function() {
                    isSpeaking = false;
                    document.getElementById('speakingIndicator').style.display = 'none';
                    if (onEnd && typeof onEnd === 'function') {
                        setTimeout(onEnd, 400);
                    }
                };
                isSpeaking = true;
                document.getElementById('speakingIndicator').style.display = 'flex';
                speechSynthesis.speak(utterance);
            } else {
                if (onEnd && typeof onEnd === 'function') {
                    setTimeout(onEnd, 100);
                }
            }
        }

        // =============================================
        // Screen Management
        // =============================================
        function showScreen(screenId) {
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById(screenId).classList.add('active');
        }

        // =============================================
        // Start Quiz
        // =============================================
        function startQuiz() {
            const nameInput = document.getElementById('playerName');
            playerName = nameInput.value.trim() || "Explorer";
            document.getElementById('displayName').textContent = playerName;

            currentQuestion = 0;
            score = 0;
            streak = 0;
            bestStreak = 0;
            correctCount = 0;
            answerTimes = [];

            document.getElementById('totalQ').textContent = QUESTIONS.length;
            document.getElementById('liveScore').textContent = '0';

            showScreen('quizScreen');
            loadQuestion();
        }

        // =============================================
        // Load Question
        // =============================================
        function loadQuestion() {
            answered = false;
            timeLeft = QUESTION_TIME;
            stopListening(); // Reset voice listening when a new question loads

            const q = QUESTIONS[currentQuestion];

            document.getElementById('currentQ').textContent = currentQuestion + 1;
            document.getElementById('questionNumber').textContent = `Question ${currentQuestion + 1} of ${QUESTIONS.length}`;
            document.getElementById('questionText').textContent = q.question;
            document.getElementById('progressBar').style.width = `${((currentQuestion) / QUESTIONS.length) * 100}%`;

            const grid = document.getElementById('answersGrid');
            grid.innerHTML = '';

            let answerPool = q.answers.map((text, originalIdx) => ({
                text: text,
                isCorrect: originalIdx === q.correct
            }));

            for (let i = answerPool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [answerPool[i], answerPool[j]] = [answerPool[j], answerPool[i]];
            }

            answerPool.forEach((ans, displayIdx) => {
                const btn = document.createElement('button');
                btn.className = 'answer-btn';
                const label = String.fromCharCode(65 + displayIdx);
                btn.innerHTML = `<span class="answer-label">${label}</span> ${ans.text}`;
                
                // Store text and letter for voice recognition algorithm
                btn.dataset.correct = ans.isCorrect;
                btn.dataset.text = ans.text;
                btn.dataset.letter = label;
                
                btn.onclick = () => selectAnswer(btn);
                grid.appendChild(btn);
            });

            speak(q.question);
            startTimer();
        }

        // =============================================
        // Timer
        // =============================================
        function startTimer() {
            clearInterval(timer);
            const circumference = 2 * Math.PI * 36;
            const timerCircle = document.getElementById('timerCircle');
            const timerText = document.getElementById('timerText');

            timerCircle.style.strokeDasharray = circumference;
            timerCircle.style.strokeDashoffset = 0;
            timerCircle.classList.remove('warning', 'danger');

            const startTime = Date.now();

            timer = setInterval(() => {
                const elapsed = (Date.now() - startTime) / 1000;
                timeLeft = Math.max(0, QUESTION_TIME - elapsed);
                const fraction = timeLeft / QUESTION_TIME;

                timerCircle.style.strokeDashoffset = circumference * (1 - fraction);
                timerText.textContent = Math.ceil(timeLeft);

                if (timeLeft <= 5) {
                    timerCircle.classList.add('danger');
                    timerCircle.classList.remove('warning');
                } else if (timeLeft <= 10) {
                    timerCircle.classList.add('warning');
                    timerCircle.classList.remove('danger');
                } else {
                    timerCircle.classList.remove('warning', 'danger');
                }

                if (timeLeft <= 0) {
                    clearInterval(timer);
                    if (!answered) {
                        timeUp();
                    }
                }
            }, 50);
        }

        // =============================================
        // Select Answer
        // =============================================
        function selectAnswer(btn) {
            if (answered) return;
            answered = true;
            clearInterval(timer);
            stopListening(); // Disable voice listening once an answer is locked in

            const isCorrect = btn.dataset.correct === 'true';
            const timeUsed = QUESTION_TIME - timeLeft;
            answerTimes.push(timeUsed);

            const allBtns = document.querySelectorAll('.answer-btn');
            allBtns.forEach(b => b.classList.add('disabled'));

            const q = QUESTIONS[currentQuestion];
            const correctAnswerText = q.answers[q.correct];

            if (isCorrect) {
                btn.classList.add('correct');
                streak++;
                if (streak > bestStreak) bestStreak = streak;
                correctCount++;

                const timeFraction = timeLeft / QUESTION_TIME;
                const timeBonus = Math.round(timeFraction * MAX_POINTS_PER_QUESTION * 0.7);
                const basePoints = Math.round(MAX_POINTS_PER_QUESTION * 0.3);
                const streakMultiplier = getStreakMultiplier();
                const pointsEarned = Math.round((basePoints + timeBonus) * streakMultiplier);

                score += pointsEarned;
                document.getElementById('liveScore').textContent = score;

                showFeedback(true, pointsEarned, q);
            } else {
                btn.classList.add('wrong');
                allBtns.forEach(b => {
                    if (b.dataset.correct === 'true') b.classList.add('correct');
                });
                streak = 0;
                showFeedback(false, 0, q, correctAnswerText);
            }
        }

        // =============================================
        // Time Up
        // =============================================
        function timeUp() {
            answered = true;
            streak = 0;
            answerTimes.push(QUESTION_TIME);
            stopListening();

            const allBtns = document.querySelectorAll('.answer-btn');
            allBtns.forEach(b => {
                b.classList.add('disabled');
                if (b.dataset.correct === 'true') b.classList.add('correct');
            });

            const q = QUESTIONS[currentQuestion];
            const correctAnswerText = q.answers[q.correct];
            showFeedback(false, 0, q, correctAnswerText, true);
        }

        // =============================================
        // Streak Multiplier
        // =============================================
        function getStreakMultiplier() {
            if (streak >= 10) return 3;
            if (streak >= 7) return 2.5;
            if (streak >= 5) return 2;
            if (streak >= 3) return 1.5;
            return 1;
        }

        // =============================================
        // Feedback Overlay
        // =============================================
        function showFeedback(correct, points, questionData, correctAnswerText = null, isTimeout = false) {
            const overlay = document.getElementById('feedbackOverlay');
            const textEl = document.getElementById('feedbackText');
            const pointsEl = document.getElementById('pointsEarned');
            const streakEl = document.getElementById('streakBadge');
            const factBox = document.getElementById('funFactBox');
            const factText = document.getElementById('funFactText');

            overlay.className = 'feedback-overlay active ' + (correct ? 'correct-bg' : 'wrong-bg');

            let speechText = '';
            let displayText = '';

            if (correct) {
                const messages = ['Amazing!', 'Correct!', 'Brilliant!', 'Superb!', 'Fantastic!'];
                displayText = messages[Math.floor(Math.random() * messages.length)];
                pointsEl.textContent = `+${points} points!`;
                pointsEl.style.color = '#feca57';

                if (streak >= 3) {
                    streakEl.textContent = `${streak} streak! ×${getStreakMultiplier()} multiplier!`;
                    streakEl.style.color = '#ff9ff3';
                } else {
                    streakEl.textContent = '';
                }

                const randomFactIdx = Math.floor(Math.random() * questionData.facts.length);
                const randomFact = questionData.facts[randomFactIdx];
                factText.textContent = randomFact;
                factBox.style.display = 'block';

                speechText = `${displayText} The answer is indeed correct. Here is a fun fact: ${randomFact}`;
            } else {
                if (isTimeout) {
                    displayText = "Time's up!";
                } else {
                    displayText = 'Incorrect!';
                }
                pointsEl.textContent = 'No points this time';
                pointsEl.style.color = '#dfe6e9';
                streakEl.textContent = '';

                const correctAns = correctAnswerText || questionData.answers[questionData.correct];

                const randomFactIdx = Math.floor(Math.random() * questionData.facts.length);
                const randomFact = questionData.facts[randomFactIdx];
                factText.textContent = randomFact;
                factBox.style.display = 'block';

                speechText = `${displayText} The correct answer was ${correctAns}. Here is a fun fact: ${randomFact}`;
            }

            textEl.textContent = displayText;

            speak(speechText, () => {
                advanceToNext();
            });
        }

        function advanceToNext() {
            hideFeedback();
            currentQuestion++;
            if (currentQuestion < QUESTIONS.length) {
                loadQuestion();
            } else {
                showResults();
            }
        }

        function hideFeedback() {
            const overlay = document.getElementById('feedbackOverlay');
            overlay.classList.remove('active', 'correct-bg', 'wrong-bg');
            document.getElementById('speakingIndicator').style.display = 'none';
        }

        // =============================================
        // Results
        // =============================================
        function showResults() {
            showScreen('resultsScreen');

            const maxPossible = QUESTIONS.length * MAX_POINTS_PER_QUESTION * 3;
            const percentage = (score / maxPossible) * 100;

            document.getElementById('finalScore').textContent = score;
            document.getElementById('statCorrect').textContent = `${correctCount}/${QUESTIONS.length}`;
            document.getElementById('statStreak').textContent = bestStreak;

            const avgTime = answerTimes.length > 0
                ? (answerTimes.reduce((a, b) => a + b, 0) / answerTimes.length).toFixed(1)
                : 0;
            document.getElementById('statAvgTime').textContent = avgTime + 's';

            const stars = document.querySelectorAll('.star');
            stars.forEach(s => s.classList.remove('earned'));
            let starCount = 0;
            if (correctCount > QUESTIONS.length * 0.3) starCount = 1;
            if (correctCount > QUESTIONS.length * 0.6) starCount = 2;
            if (correctCount > QUESTIONS.length * 0.85) starCount = 3;

            for (let i = 0; i < starCount; i++) {
                stars[i].classList.add('earned');
            }

            const title = document.getElementById('resultsTitle');
            const trophy = document.getElementById('trophyIcon');
            if (percentage >= 70) {
                title.textContent = `Outstanding, ${playerName}!`;
                trophy.textContent = '🏆';
            } else if (percentage >= 40) {
                title.textContent = `Great Job, ${playerName}!`;
                trophy.textContent = '🥈';
            } else {
                title.textContent = `Keep Trying, ${playerName}!`;
                trophy.textContent = '🥉';
            }

            if (starCount >= 2) {
                launchConfetti();
            }
        }

        // =============================================
        // Confetti
        // =============================================
        function launchConfetti() {
            const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#55efc4', '#a29bfe', '#fd79a8'];
            for (let i = 0; i < 60; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
                confetti.style.width = (Math.random() * 10 + 6) + 'px';
                confetti.style.height = (Math.random() * 10 + 6) + 'px';
                confetti.style.animation = `confettiFall ${Math.random() * 2 + 2}s ease-out forwards`;
                confetti.style.animationDelay = Math.random() * 1.5 + 's';
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 5000);
            }
        }

        // =============================================
        // Restart / New Player
        // =============================================
        function restartQuiz() {
            speechSynthesis.cancel();
            isSpeaking = false;
            document.getElementById('speakingIndicator').style.display = 'none';
            currentQuestion = 0;
            score = 0;
            streak = 0;
            bestStreak = 0;
            correctCount = 0;
            answerTimes = [];
            document.getElementById('liveScore').textContent = '0';
            showScreen('quizScreen');
            loadQuestion();
        }

        function changePlayer() {
            speechSynthesis.cancel();
            isSpeaking = false;
            document.getElementById('speakingIndicator').style.display = 'none';
            document.getElementById('playerName').value = '';
            showScreen('welcomeScreen');
        }

        // =============================================
        // Event Listeners
        // =============================================
        document.getElementById('startBtn').addEventListener('click', startQuiz);
        document.getElementById('restartBtn').addEventListener('click', restartQuiz);
        document.getElementById('changePlayerBtn').addEventListener('click', changePlayer);

        document.getElementById('playerName').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') startQuiz();
        });