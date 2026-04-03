/**
 * 检查获胜者的工具函数
 * 检查是否有五子连珠
 */

import type { Board, Player, GameResult } from '../types/game';

// 方向向量：水平、垂直、两个对角线方向
const DIRECTIONS: [number, number][] = [
  [0, 1],   // 水平
  [1, 0],   // 垂直
  [1, 1],   // 主对角线
  [1, -1],  // 副对角线
];

/**
 * 在指定方向上统计连续相同棋子数量
 */
function countInDirection(
  board: Board,
  row: number,
  col: number,
  player: Player,
  dRow: number,
  dCol: number
): [number, number][] {
  const line: [number, number][] = [[row, col]];
  let r = row + dRow;
  let c = col + dCol;

  // 正方向统计
  while (r >= 0 && r < board.length && c >= 0 && c < board[0].length && board[r][c] === player) {
    line.push([r, c]);
    r += dRow;
    c += dCol;
  }

  // 反方向统计
  r = row - dRow;
  c = col - dCol;
  while (r >= 0 && r < board.length && c >= 0 && c < board[0].length && board[r][c] === player) {
    line.unshift([r, c]);
    r -= dRow;
    c -= dCol;
  }

  return line;
}

/**
 * 检查是否有玩家获胜
 * @param board 棋盘状态
 * @param player 当前玩家
 * @returns 游戏结果
 */
export function checkWinner(board: Board, player: Player): GameResult | null {
  const boardSize = board.length;

  // 遍历整个棋盘
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      // 只在有棋子的位置检查
      if (board[row][col] !== player) continue;

      // 检查四个方向
      for (const [dRow, dCol] of DIRECTIONS) {
        const line = countInDirection(board, row, col, player, dRow, dCol);

        // 五子连珠
        if (line.length >= 5) {
          // 返回前5个位置作为获胜连线
          return {
            winner: player,
            winningLine: line.slice(0, 5),
          };
        }
      }
    }
  }

  return null;
}

/**
 * 检查是否平局（棋盘下满）
 */
export function checkDraw(board: Board): boolean {
  return board.every(row => row.every(cell => cell !== null));
}
