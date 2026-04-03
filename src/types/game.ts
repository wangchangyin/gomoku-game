/**
 * 游戏相关类型定义
 */

// 玩家类型：黑棋或白棋
export type Player = 'black' | 'white';

// 棋盘单元格状态
export type CellState = Player | null;

// 棋盘二维数组类型
export type Board = CellState[][];

// 游戏状态
export type GameStatus = 'playing' | 'won' | 'draw';

// 游戏结果
export interface GameResult {
  winner: Player | null;
  winningLine: [number, number][];
}

// 位置坐标
export interface Position {
  row: number;
  col: number;
}
