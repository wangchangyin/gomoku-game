/**
 * 棋盘单元格组件
 */

import type { CellState } from '../types/game';

interface CellProps {
  value: CellState;
  onClick: () => void;
  isWinningCell: boolean;
  isLastMove: boolean;
}

export function Cell({ value, onClick, isWinningCell, isLastMove }: CellProps) {
  return (
    <div className={`cell ${isWinningCell ? 'winning' : ''}`} onClick={onClick}>
      {value && <div className={`piece ${value}`} />}
      {isLastMove && <div className="last-move-marker" />}
    </div>
  );
}
