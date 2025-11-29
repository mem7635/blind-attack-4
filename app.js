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
        // Draw an empty Connect 4 board for visual reference
        const emptyBoard = Array(6).fill(null).map(() => Array(7).fill(0));
        this.blindBoardRenderer.draw(emptyBoard);
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

    flashColumn(col) {
        // Flash the column button yellow to show it was clicked
        const button = document.querySelector(`[data-column="${col}"]`);
        if (button) {
            button.classList.remove('flash-column');
            // Force reflow
            void button.offsetWidth;
            button.classList.add('flash-column');
            
            // Remove class after animation completes
            setTimeout(() => {
                button.classList.remove('flash-column');
            }, 500);
        }
    }

    handlePlayerMove(col) {
        if (!this.game.isValidMove(col)) return;

        // Flash the column button for visual feedback
        this.flashColumn(col);

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

        // Get AI move
        const aiMove = this.game.getAIMove();
        this.lastAIMove = aiMove;
        
        if (aiMove !== null) {
            this.game.makeMove(aiMove, AI);
            
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
    }

    endGame(result) {
        // Update result display
        if (result === 'player') {
            this.resultTitle.textContent = '🎉 You Win!';
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

