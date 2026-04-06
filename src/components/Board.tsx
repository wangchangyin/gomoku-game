/**
 * 棋盘组件
 */

import { useMemo } from 'react';
import type { Board, Position } from '../types/game';
import { Cell } from './Cell';

interface BoardProps {
  board: Board;
  winningLine: [number, number][];
  lastPosition: Position | null;
  onCellClick: (position: Position) => void;
  disabled: boolean;
}

export function Board({ board, winningLine, lastPosition, onCellClick, disabled }: BoardProps) {
  // 将获胜连线转换为Set便于快速查找
  const winningSet = useMemo(
    () => new Set(winningLine.map(([r, c]) => `${r},${c}`)),
    [winningLine]
  );

  const handleCellClick = (row: number, col: number) => {
    if (disabled) return;
    onCellClick({ row, col });
  };

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((_, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={board[rowIndex][colIndex]}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              isWinningCell={winningSet.has(`${rowIndex},${colIndex}`)}
              isLastMove={lastPosition?.row === rowIndex && lastPosition?.col === colIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
