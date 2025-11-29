// app.js - Application Logic and UI Control

class BlindAttack4App {
    constructor() {
        this.game = null;
        this.difficulty = 'medium';
        this.currentScreen = 'start';
        this.lastAIMove = null;
        
        // Replay state
        this.replayMoves = [];
        this.replayIndex = 0;
        this.replayInterval = null;
        this.isReplayPlaying = false;

        this.initializeElements();
        this.attachEventListeners();
        this.showScreen('start');
        this.displayVersion();
    }

    initializeElements() {
        // Screens
        this.screens = {
            start: document.getElementById('start-screen'),
            game: document.getElementById('game-screen'),
            result: document.getElementById('result-screen'),
            replay: document.getElementById('replay-screen')
        };

        // Start screen
        this.difficultyButtons = document.querySelectorAll('.difficulty-btn');
        this.startGameBtn = document.getElementById('start-game-btn');

        // Game screen
        this.columnButtons = document.querySelectorAll('.column-btn');
        this.botLastMoveDisplay = document.getElementById('bot-last-move');
        this.moveCountDisplay = document.getElementById('move-count');
        this.blunderCountDisplay = document.getElementById('blunder-count');
        this.quitBtn = document.getElementById('quit-btn');
        this.blindBoardCanvas = document.getElementById('blind-board-canvas');

        // Result screen
        this.resultTitle = document.getElementById('result-title');
        this.finalMoves = document.getElementById('final-moves');
        this.finalBlunders = document.getElementById('final-blunders');
        this.gameBoard = document.getElementById('game-board');
        this.replayBtn = document.getElementById('replay-btn');
        this.newGameBtn = document.getElementById('new-game-btn');

        // Replay screen
        this.replayBoard = document.getElementById('replay-board');
        this.replayMoveInfo = document.getElementById('replay-move-info');
        this.replayPrevBtn = document.getElementById('replay-prev');
        this.replayPlayPauseBtn = document.getElementById('replay-play-pause');
        this.replayNextBtn = document.getElementById('replay-next');
        this.replayBackBtn = document.getElementById('replay-back-btn');

        // Initialize renderers
        this.gameBoardRenderer = new BoardRenderer(this.gameBoard);
        this.replayBoardRenderer = new BoardRenderer(this.replayBoard);
        this.blindBoardRenderer = new BoardRenderer(this.blindBoardCanvas);
    }

    attachEventListeners() {
        // Difficulty selection
        this.difficultyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.difficultyButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.difficulty = btn.dataset.difficulty;
            });
        });

        // Start game
        this.startGameBtn.addEventListener('click', () => this.startNewGame());

        // Column buttons
        this.columnButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const col = parseInt(btn.dataset.column);
                this.handlePlayerMove(col);
            });
        });

        // Quit game
        this.quitBtn.addEventListener('click', () => this.showScreen('start'));

        // Result screen buttons
        this.replayBtn.addEventListener('click', () => this.startReplay());
        this.newGameBtn.addEventListener('click', () => this.showScreen('start'));

        // Replay controls
        this.replayPrevBtn.addEventListener('click', () => this.replayPrevMove());
        this.replayPlayPauseBtn.addEventListener('click', () => this.toggleReplayPlayback());
        this.replayNextBtn.addEventListener('click', () => this.replayNextMove());
        this.replayBackBtn.addEventListener('click', () => this.showScreen('result'));
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => screen.classList.remove('active'));
        this.screens[screenName].classList.add('active');
        this.currentScreen = screenName;
    }

    displayVersion() {
        const versionElement = document.getElementById('version-number');
        if (versionElement && typeof VERSION !== 'undefined') {
            versionElement.textContent = VERSION;
        }
    }

    startNewGame() {
        this.game = new Connect4Game(this.difficulty);
        this.lastAIMove = null;
        this.drawEmptyBoard();
        this.updateGameUI();
        this.showScreen('game');
    }

    drawEmptyBoard() {
        // Draw an empty Connect 4 board for visual reference with numbers
        const emptyBoard = Array(6).fill(null).map(() => Array(7).fill(0));
        this.blindBoardRenderer.draw(emptyBoard, true);
    }

    updateGameUI(animateBotMove = false) {
        // Update move count
        this.moveCountDisplay.textContent = `Move: ${this.game.moveHistory.length}`;
        
        // Update blunder count
        this.blunderCountDisplay.textContent = `Blunders: ${this.game.blunders}`;
        
        // Update bot's last move
        if (this.lastAIMove !== null) {
            const moveNumber = (this.lastAIMove + 1).toString();
            this.botLastMoveDisplay.textContent = moveNumber;
            
            // Animate and speak if requested
            if (animateBotMove) {
                this.animateAndSpeakBotMove(moveNumber);
            }
        } else {
            this.botLastMoveDisplay.textContent = '-';
        }

        // Update column buttons (disable full columns)
        this.columnButtons.forEach(btn => {
            const col = parseInt(btn.dataset.column);
            btn.disabled = !this.game.isValidMove(col);
        });
    }

    animateAndSpeakBotMove(moveNumber) {
        // Add animation class
        this.botLastMoveDisplay.classList.remove('animate-move');
        // Force reflow to restart animation
        void this.botLastMoveDisplay.offsetWidth;
        this.botLastMoveDisplay.classList.add('animate-move');
        
        // Remove animation class after it completes
        setTimeout(() => {
            this.botLastMoveDisplay.classList.remove('animate-move');
        }, 600);
        
        // Speak the number after 0.5 seconds
        setTimeout(() => {
            this.speakNumber(moveNumber);
        }, 500);
    }

    speakNumber(number) {
        // Use Web Speech API if available
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(number);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            utterance.lang = 'en-US';
            
            window.speechSynthesis.speak(utterance);
        }
    }

    flashColumn(col, isPlayerMove = true) {
        // Determine flash behavior based on difficulty
        let shouldFlash = false;
        let flashColor = '#fbbf24'; // yellow
        let flashIntensity = 1.0;
        
        if (this.difficulty === 'easy') {
            // Easy: Full flash for both player (yellow) and AI (red)
            shouldFlash = true;
            flashColor = isPlayerMove ? '#fbbf24' : '#ef4444'; // yellow for player, red for AI
            flashIntensity = 1.0;
        } else if (this.difficulty === 'medium' && isPlayerMove) {
            // Medium: Faint yellow flash for player only
            shouldFlash = true;
            flashColor = '#fbbf24';
            flashIntensity = 0.3; // faint
        }
        // Hard and Very Hard: no flash (shouldFlash stays false)
        
        if (!shouldFlash) return;
        
        // Flash the entire column on the canvas
        const emptyBoard = Array(6).fill(null).map(() => Array(7).fill(0));
        
        // Set the flashing column with color and intensity
        this.blindBoardRenderer.flashColumn(col, flashColor, flashIntensity);
        this.blindBoardRenderer.draw(emptyBoard, true);
        
        // Clear flash after animation
        setTimeout(() => {
            this.blindBoardRenderer.clearFlash();
            this.blindBoardRenderer.draw(emptyBoard, true);
        }, 500);
        
        // Also flash the button for player moves only
        if (isPlayerMove) {
            const button = document.querySelector(`[data-column="${col}"]`);
            if (button) {
                button.classList.remove('flash-column');
                void button.offsetWidth;
                button.classList.add('flash-column');
                
                setTimeout(() => {
                    button.classList.remove('flash-column');
                }, 500);
            }
        }
    }

    handlePlayerMove(col) {
        if (!this.game.isValidMove(col)) return;

        // Disable buttons during move processing
        this.columnButtons.forEach(btn => btn.disabled = true);

        // Flash the column for visual feedback (player move)
        this.flashColumn(col, true);

        // Check for blunder before making the move
        this.game.detectBlunder(col);

        // Make player move
        this.game.makeMove(col, PLAYER);
        
        // Check if game ended
        let winner = this.game.checkWinner();
        if (winner === PLAYER) {
            this.endGame('player');
            return;
        }

        if (this.game.isDraw()) {
            this.endGame('draw');
            return;
        }

        // Delay AI move by 1 second to show player's flash clearly
        setTimeout(() => {
            // Get AI move
            const aiMove = this.game.getAIMove();
            this.lastAIMove = aiMove;
            
            if (aiMove !== null) {
                this.game.makeMove(aiMove, AI);
                
                // Flash AI's column (only on easy mode - red)
                this.flashColumn(aiMove, false);
                
                // Check if AI won
                winner = this.game.checkWinner();
                if (winner === AI) {
                    this.endGame('ai');
                    return;
                }

                if (this.game.isDraw()) {
                    this.endGame('draw');
                    return;
                }
            }

            // Update UI with animation and speech for bot move
            this.updateGameUI(true);
        }, 1000); // 1 second delay
    }

    endGame(result) {
        // Update result display
        if (result === 'player') {
            this.resultTitle.textContent = '🎉 You Win!';
            // Launch confetti for player win!
            this.launchConfetti();
        } else if (result === 'ai') {
            this.resultTitle.textContent = '🤖 AI Wins!';
        } else {
            this.resultTitle.textContent = '🤝 Draw!';
        }

        this.finalMoves.textContent = this.game.moveHistory.length;
        this.finalBlunders.textContent = this.game.blunders;

        // Draw final board
        this.gameBoardRenderer.draw(this.game.board);

        // Store moves for replay
        this.replayMoves = [...this.game.moveHistory];

        this.showScreen('result');
    }

    launchConfetti() {
        const colors = ['#fbbf24', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];
        const confettiCount = 80;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                this.createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
            }, i * 20); // Stagger the confetti
        }
    }

    createConfettiPiece(color) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = color;
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-20px';
        confetti.style.opacity = '1';
        confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '10000';
        confetti.style.borderRadius = '50%';
        
        document.body.appendChild(confetti);
        
        // Animate falling
        const duration = 2000 + Math.random() * 1000;
        const angle = Math.random() * 360;
        const distance = 50 + Math.random() * 100;
        
        confetti.animate([
            { 
                transform: `translate(0, 0) rotate(0deg)`,
                opacity: 1
            },
            { 
                transform: `translate(${Math.cos(angle) * distance}px, ${window.innerHeight + 20}px) rotate(${360 + Math.random() * 360}deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        // Remove element after animation
        setTimeout(() => {
            confetti.remove();
        }, duration);
    }

    startReplay() {
        this.replayIndex = 0;
        this.isReplayPlaying = false;
        this.showScreen('replay');
        this.drawReplayState();
    }

    drawReplayState() {
        // Create a temporary game to replay moves
        const tempGame = new Connect4Game(this.difficulty);
        
        // Replay moves up to current index
        for (let i = 0; i < this.replayIndex; i++) {
            const move = this.replayMoves[i];
            tempGame.makeMove(move.col, move.player);
        }

        // Draw the board
        this.replayBoardRenderer.draw(tempGame.board);

        // Update info
        this.replayMoveInfo.textContent = `Move ${this.replayIndex} of ${this.replayMoves.length}`;

        // Update button states
        this.replayPrevBtn.disabled = this.replayIndex === 0;
        this.replayNextBtn.disabled = this.replayIndex === this.replayMoves.length;
    }

    replayPrevMove() {
        if (this.replayIndex > 0) {
            this.replayIndex--;
            this.drawReplayState();
        }
    }

    replayNextMove() {
        if (this.replayIndex < this.replayMoves.length) {
            this.replayIndex++;
            this.drawReplayState();
        }
    }

    toggleReplayPlayback() {
        if (this.isReplayPlaying) {
            // Pause
            this.isReplayPlaying = false;
            clearInterval(this.replayInterval);
            this.replayPlayPauseBtn.textContent = '▶️ Play';
        } else {
            // Play
            if (this.replayIndex >= this.replayMoves.length) {
                this.replayIndex = 0;
            }

            this.isReplayPlaying = true;
            this.replayPlayPauseBtn.textContent = '⏸️ Pause';

            this.replayInterval = setInterval(() => {
                if (this.replayIndex < this.replayMoves.length) {
                    this.replayIndex++;
                    this.drawReplayState();
                } else {
                    // Finished playback
                    this.isReplayPlaying = false;
                    clearInterval(this.replayInterval);
                    this.replayPlayPauseBtn.textContent = '▶️ Play';
                }
            }, 800); // 800ms between moves
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BlindAttack4App();
});

