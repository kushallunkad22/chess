"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const message_1 = require("./message");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.moveCount = 0;
        this.playerColors = new Map();
        // Assign colors to players
        this.playerColors.set(this.player1, "white");
        this.playerColors.set(this.player2, "black");
        // Notify players of their colors
        this.player1.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "white",
            },
        }));
        this.player2.send(JSON.stringify({
            type: message_1.INIT_GAME,
            payload: {
                color: "black",
            },
        }));
        this.player1.send(JSON.stringify({
            type: "SET_COLOR",
            payload: { color: "white" },
        }));
        this.player2.send(JSON.stringify({
            type: "SET_COLOR",
            payload: { color: "black" },
        }));
    }
    makeMove(socket, move) {
        const playerColor = this.playerColors.get(socket); // Get player's color
        // Check if it's the player's turn
        if ((this.board.turn() === "w" && playerColor !== "white") ||
            (this.board.turn() === "b" && playerColor !== "black")) {
            return;
        }
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log(e);
            return;
        }
        // Check if the game is over
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? this.player2 : this.player1; // Winner is the other player
            this.player1.send(JSON.stringify({
                type: message_1.GAME_OVER,
                payload: {
                    winner,
                },
            }));
            this.player2.send(JSON.stringify({
                type: message_1.GAME_OVER,
                payload: {
                    winner,
                },
            }));
            return;
        }
        // Send the move to the other player
        const opponent = socket === this.player1 ? this.player2 : this.player1;
        opponent.send(JSON.stringify({
            type: message_1.MAKE_MOVE,
            payload: move,
        }));
        this.moveCount++;
    }
    sendUserColor(socket) {
        const color = this.playerColors.get(socket);
        if (color) {
            socket.send(JSON.stringify({
                type: "SET_COLOR",
                payload: {
                    color, // Send the color ("white" or "black") to the client
                },
            }));
        }
    }
}
exports.Game = Game;
