import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MAKE_MOVE } from "./message";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private startTime: Date;
    private moveCount: number;
    private playerColors: Map<WebSocket, "white" | "black">; // Map to track colors

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.moveCount = 0;
        this.playerColors = new Map();

        // Assign colors to players
        this.playerColors.set(this.player1, "white");
        this.playerColors.set(this.player2, "black");

        // Notify players of their colors
        this.player1.send(
            JSON.stringify({
                type: INIT_GAME,
                payload: {
                    color: "white",
                },
            })
        );
        this.player2.send(
            JSON.stringify({
                type: INIT_GAME,
                payload: {
                    color: "black",
                },
            })
        );
        this.player1.send(
            JSON.stringify({
                type: "SET_COLOR",
                payload: { color: "white" },
            })
        );
        
        this.player2.send(
            JSON.stringify({
                type: "SET_COLOR",
                payload: { color: "black" },
            })
        );
    }

    makeMove(socket: WebSocket, move: { from: string; to: string }) {
        const playerColor = this.playerColors.get(socket); // Get player's color

        // Check if it's the player's turn
        if (
            (this.board.turn() === "w" && playerColor !== "white") ||
            (this.board.turn() === "b" && playerColor !== "black")
        ) {
            return;
        }

        try {
            this.board.move(move);
        } catch (e) {
            console.log(e);
            return;
        }

        // Check if the game is over
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === "w" ? this.player2 : this.player1; // Winner is the other player
            this.player1.send(
                JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner,
                    },
                })
            );
            this.player2.send(
                JSON.stringify({
                    type: GAME_OVER,
                    payload: {
                        winner,
                    },
                })
            );
            return;
        }

        // Send the move to the other player
        const opponent = socket === this.player1 ? this.player2 : this.player1;
        opponent.send(
            JSON.stringify({
                type: MAKE_MOVE,
                payload: move,
            })
        );

        this.moveCount++;
    }

    sendUserColor(socket: WebSocket) {
        const color = this.playerColors.get(socket);
        if (color) {
            socket.send(
                JSON.stringify({
                    type: "SET_COLOR",
                    payload: {
                        color, // Send the color ("white" or "black") to the client
                    },
                })
            );
        }
    }
}
