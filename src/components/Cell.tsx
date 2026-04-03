/**
 * 棋盘单元格组件
 */

import type { CellState } from '../types/game';

interface CellProps {
  value: CellState;
  onClick: () => void;
  isWinningCell: boolean;
}

export function Cell({ value, onClick, isWinningCell }: CellProps) {
  return (
    <div className={`cell ${isWinningCell ? 'winning' : ''}`} onClick={onClick}>
      {value && <div className={`piece ${value}`} />}
    </div>
  );
}
