import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MAKE_MOVE } from "../pages/Game";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const DraggablePiece = ({ square, onDrop }: { 
    square: { type: PieceSymbol; color: Color; square: Square }; 
    onDrop: (to: Square) => void 
}) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: "piece",
        item: { from: square.square },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <img
            ref={dragRef}
            className={`w-full ${isDragging ? "opacity-50" : ""}`}
            src={`/${square.color === "b" ? `b${square.type}` : `w${square.type}`}.png`}
        />
    );
};

const DroppableSquare = ({ square, children, onDrop }: { 
    square: Square; 
    children: React.ReactNode; 
    onDrop: (to: Square) => void 
}) => {
    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: "piece",
        drop: (item: { from: Square }) => {
            onDrop(item.from);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    return (
        <div
            ref={dropRef}
            className={`w-16 h-16 ${(parseInt(square[1]) + square.charCodeAt(0)) % 2 === 0 ? 'bg-green-500' : 'bg-white'} ${
                isOver ? "bg-yellow-300" : ""
            }`}
        >
            <div className="w-full justify-center flex h-full">{children}</div>
        </div>
    );
};

export const ChessBoard = ({
    chess,
    board,
    socket,
    setBoard,
}: {
    chess: Chess;
    setBoard: React.Dispatch<
        React.SetStateAction<
            (
                | {
                      square: Square;
                      type: PieceSymbol;
                      color: Color;
                  }
                | null
            )[][]
        >
    >;
    board: (
        | {
              square: Square;
              type: PieceSymbol;
              color: Color;
          }
        | null
    )[][];
    socket: WebSocket;
}) => {
    
    const handleMove = (from: Square, to: Square) => {
        socket.send(
            JSON.stringify({
                type: MAKE_MOVE,
                payload: {
                    move: {
                        from,
                        to,
                    },
                },
            })
        );

        chess.move({
            from,
            to,
        });
        setBoard(chess.board());
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="text-white-200">
                {board.map((row, i) => {
                    return (
                        <div key={i} className="flex">
                            {row.map((square, j) => {
                                const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;

                                return (
                                    <DroppableSquare
                                        key={j}
                                        square={squareRepresentation}
                                        onDrop={(from) => handleMove(from, squareRepresentation)}
                                    >
                                        {square ? (
                                            <DraggablePiece
                                                square={{ ...square, square: squareRepresentation }}
                                                onDrop={(to) => handleMove(squareRepresentation, to)}
                                            />
                                        ) : null}
                                    </DroppableSquare>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </DndProvider>
    );
};
