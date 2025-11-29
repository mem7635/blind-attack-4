// game.js - Connect 4 Game Logic with AI
// Version 1.1.0

const VERSION = '1.1.0';

const ROWS = 6;
const COLS = 7;
const EMPTY = 0;
const PLAYER = 1;
const AI = 2;

// Difficulty settings (minimax depth)
const DIFFICULTY_LEVELS = {
    'easy': 2,
    'medium': 4,
    'hard': 6,
    'very-hard': 8
};

// AI strategy mix - what percentage of moves use minimax vs random
const DIFFICULTY_STRATEGY = {
    'easy': { minimax: 0.33, random: 0.67 },        // 1/3 smart, 2/3 random
    'medium': { minimax: 0.60, random: 0.40 },      // 60% smart, 40% random
    'hard': { minimax: 0.85, random: 0.15 },        // 85% smart, 15% random
    'very-hard': { minimax: 0.95, random: 0.05 }    // 95% smart, 5% random
};

class Connect4Game {
    constructor(difficulty = 'medium') {
        this.board = this.createEmptyBoard();
        this.moveHistory = [];
        this.difficulty = difficulty;
        this.aiDepth = DIFFICULTY_LEVELS[difficulty];
        this.blunders = 0;
        this.gameOver = false;
        this.winner = null;
        this.aiMoveCount = 0;
    }

    createEmptyBoard() {
        return Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY));
    }

    isValidMove(col) {
        return col >= 0 && col < COLS && this.board[ROWS - 1][col] === EMPTY;
    }

    getValidMoves() {
        return Array.from({ length: COLS }, (_, i) => i).filter(col => this.isValidMove(col));
    }

    getNextRow(col) {
        for (let row = 0; row < ROWS; row++) {
            if (this.board[row][col] === EMPTY) {
                return row;
            }
        }
        return -1;
    }

    makeMove(col, player) {
        if (!this.isValidMove(col)) return false;

        const row = this.getNextRow(col);
        this.board[row][col] = player;
        this.moveHistory.push({ col, player, row });
        
        return true;
    }

    undoMove() {
        if (this.moveHistory.length === 0) return;
        
        const lastMove = this.moveHistory.pop();
        this.board[lastMove.row][lastMove.col] = EMPTY;
    }

    checkWinner() {
        // Check horizontal
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                const piece = this.board[row][col];
                if (piece !== EMPTY &&
                    piece === this.board[row][col + 1] &&
                    piece === this.board[row][col + 2] &&
                    piece === this.board[row][col + 3]) {
                    return piece;
                }
            }
        }

        // Check vertical
        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS - 3; row++) {
                const piece = this.board[row][col];
                if (piece !== EMPTY &&
                    piece === this.board[row + 1][col] &&
                    piece === this.board[row + 2][col] &&
                    piece === this.board[row + 3][col]) {
                    return piece;
                }
            }
        }

        // Check diagonal (positive slope)
        for (let row = 0; row < ROWS - 3; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                const piece = this.board[row][col];
                if (piece !== EMPTY &&
                    piece === this.board[row + 1][col + 1] &&
                    piece === this.board[row + 2][col + 2] &&
                    piece === this.board[row + 3][col + 3]) {
                    return piece;
                }
            }
        }

        // Check diagonal (negative slope)
        for (let row = 3; row < ROWS; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                const piece = this.board[row][col];
                if (piece !== EMPTY &&
                    piece === this.board[row - 1][col + 1] &&
                    piece === this.board[row - 2][col + 2] &&
                    piece === this.board[row - 3][col + 3]) {
                    return piece;
                }
            }
        }

        return null;
    }

    isDraw() {
        return this.getValidMoves().length === 0 && this.checkWinner() === null;
    }

    // Check if a player can win in one move
    canWinInOneMove(player) {
        const validMoves = this.getValidMoves();
        
        for (const col of validMoves) {
            this.makeMove(col, player);
            const winner = this.checkWinner();
            this.undoMove();
            
            if (winner === player) {
                return col;
            }
        }
        
        return null;
    }

    // Detect if player made a blunder (missed a winning move)
    detectBlunder(playerMove) {
        const winningMove = this.canWinInOneMove(PLAYER);
        
        if (winningMove !== null && winningMove !== playerMove) {
            this.blunders++;
            return true;
        }
        
        return false;
    }

    // Evaluate board position for minimax
    evaluateBoard(player) {
        const opponent = player === PLAYER ? AI : PLAYER;
        let score = 0;

        // Center column preference
        const centerArray = Array(ROWS).fill(null).map((_, i) => this.board[i][Math.floor(COLS / 2)]);
        const centerCount = centerArray.filter(p => p === player).length;
        score += centerCount * 3;

        // Evaluate all possible windows
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                // Horizontal
                if (col < COLS - 3) {
                    const window = [
                        this.board[row][col],
                        this.board[row][col + 1],
                        this.board[row][col + 2],
                        this.board[row][col + 3]
                    ];
                    score += this.scoreWindow(window, player, opponent);
                }

                // Vertical
                if (row < ROWS - 3) {
                    const window = [
                        this.board[row][col],
                        this.board[row + 1][col],
                        this.board[row + 2][col],
                        this.board[row + 3][col]
                    ];
                    score += this.scoreWindow(window, player, opponent);
                }

                // Positive diagonal
                if (row < ROWS - 3 && col < COLS - 3) {
                    const window = [
                        this.board[row][col],
                        this.board[row + 1][col + 1],
                        this.board[row + 2][col + 2],
                        this.board[row + 3][col + 3]
                    ];
                    score += this.scoreWindow(window, player, opponent);
                }

                // Negative diagonal
                if (row >= 3 && col < COLS - 3) {
                    const window = [
                        this.board[row][col],
                        this.board[row - 1][col + 1],
                        this.board[row - 2][col + 2],
                        this.board[row - 3][col + 3]
                    ];
                    score += this.scoreWindow(window, player, opponent);
                }
            }
        }

        return score;
    }

    scoreWindow(window, player, opponent) {
        let score = 0;
        const playerCount = window.filter(p => p === player).length;
        const opponentCount = window.filter(p => p === opponent).length;
        const emptyCount = window.filter(p => p === EMPTY).length;

        if (playerCount === 4) score += 100;
        else if (playerCount === 3 && emptyCount === 1) score += 5;
        else if (playerCount === 2 && emptyCount === 2) score += 2;

        if (opponentCount === 3 && emptyCount === 1) score -= 4;

        return score;
    }

    // Minimax algorithm with alpha-beta pruning
    minimax(depth, alpha, beta, maximizingPlayer) {
        const validMoves = this.getValidMoves();
        const winner = this.checkWinner();
        const isTerminal = winner !== null || this.isDraw();

        if (depth === 0 || isTerminal) {
            if (isTerminal) {
                if (winner === AI) return [null, 10000000];
                else if (winner === PLAYER) return [null, -10000000];
                else return [null, 0]; // Draw
            } else {
                return [null, this.evaluateBoard(AI)];
            }
        }

        if (maximizingPlayer) {
            let maxEval = -Infinity;
            let bestMove = validMoves[Math.floor(Math.random() * validMoves.length)];

            for (const col of validMoves) {
                this.makeMove(col, AI);
                const [, evalScore] = this.minimax(depth - 1, alpha, beta, false);
                this.undoMove();

                if (evalScore > maxEval) {
                    maxEval = evalScore;
                    bestMove = col;
                }

                alpha = Math.max(alpha, evalScore);
                if (beta <= alpha) break;
            }

            return [bestMove, maxEval];
        } else {
            let minEval = Infinity;
            let bestMove = validMoves[Math.floor(Math.random() * validMoves.length)];

            for (const col of validMoves) {
                this.makeMove(col, PLAYER);
                const [, evalScore] = this.minimax(depth - 1, alpha, beta, true);
                this.undoMove();

                if (evalScore < minEval) {
                    minEval = evalScore;
                    bestMove = col;
                }

                beta = Math.min(beta, evalScore);
                if (beta <= alpha) break;
            }

            return [bestMove, minEval];
        }
    }

    getAIMove() {
        this.aiMoveCount++;
        
        const strategy = DIFFICULTY_STRATEGY[this.difficulty];
        const useRandomMove = Math.random() < strategy.random;
        
        // Always check if AI can win (don't miss obvious wins on any difficulty)
        const winningMove = this.canWinInOneMove(AI);
        if (winningMove !== null) return winningMove;

        // Always check if player can win and block (critical defensive move)
        const blockMove = this.canWinInOneMove(PLAYER);
        if (blockMove !== null) return blockMove;

        // Decide between random and strategic move based on difficulty
        if (useRandomMove) {
            // Make a random move (easier difficulties do this more often)
            const validMoves = this.getValidMoves();
            return validMoves[Math.floor(Math.random() * validMoves.length)];
        } else {
            // Use minimax for strategic move
            const [bestMove] = this.minimax(this.aiDepth, -Infinity, Infinity, true);
            return bestMove;
        }
    }

    copyBoard() {
        return this.board.map(row => [...row]);
    }
}

// Board rendering
class BoardRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cellSize = 50;
        this.padding = 10;
    }

    draw(board) {
        const ctx = this.ctx;
        const cellSize = this.cellSize;
        const padding = this.padding;

        // Clear canvas
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw cells
        for (let row = ROWS - 1; row >= 0; row--) {
            for (let col = 0; col < COLS; col++) {
                const x = padding + col * cellSize;
                const y = padding + (ROWS - 1 - row) * cellSize;

                // Draw cell background
                ctx.fillStyle = '#1e40af';
                ctx.fillRect(x, y, cellSize, cellSize);

                // Draw piece
                const piece = board[row][col];
                if (piece !== EMPTY) {
                    ctx.fillStyle = piece === PLAYER ? '#fbbf24' : '#ef4444';
                    ctx.beginPath();
                    ctx.arc(
                        x + cellSize / 2,
                        y + cellSize / 2,
                        cellSize / 2 - 5,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                }

                // Draw cell border
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, cellSize, cellSize);
            }
        }
    }
}

