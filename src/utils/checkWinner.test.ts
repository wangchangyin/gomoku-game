import { describe, it, expect } from 'vitest';
import { checkWinnerFromPosition, checkDraw } from './checkWinner';
import type { Board, Player } from '../types/game';

/**
 * 创建测试用的空棋盘
 */
function createEmptyBoard(size: number = 15): Board {
  return Array(size).fill(null).map(() => Array(size).fill(null));
}

/**
 * 在指定位置放置棋子
 */
function placePieces(board: Board, pieces: Array<[number, number, Player]>): Board {
  const newBoard = board.map(row => [...row]);
  for (const [row, col, player] of pieces) {
    newBoard[row][col] = player;
  }
  return newBoard;
}

describe('checkWinnerFromPosition', () => {
  it('水平方向五子连珠应获胜', () => {
    const board = createEmptyBoard();
    const pieces: Array<[number, number, Player]> = [
      [7, 0, 'black'],
      [7, 1, 'black'],
      [7, 2, 'black'],
      [7, 3, 'black'],
      [7, 4, 'black'],
    ];
    const newBoard = placePieces(board, pieces);
    const result = checkWinnerFromPosition(newBoard, { row: 7, col: 2 }, 'black');

    expect(result).not.toBeNull();
    expect(result?.winner).toBe('black');
    expect(result?.winningLine).toHaveLength(5);
  });

  it('垂直方向五子连珠应获胜', () => {
    const board = createEmptyBoard();
    const pieces: Array<[number, number, Player]> = [
      [3, 5, 'white'],
      [4, 5, 'white'],
      [5, 5, 'white'],
      [6, 5, 'white'],
      [7, 5, 'white'],
    ];
    const newBoard = placePieces(board, pieces);
    const result = checkWinnerFromPosition(newBoard, { row: 5, col: 5 }, 'white');

    expect(result).not.toBeNull();
    expect(result?.winner).toBe('white');
  });

  it('主对角线方向五子连珠应获胜', () => {
    const board = createEmptyBoard();
    const pieces: Array<[number, number, Player]> = [
      [0, 0, 'black'],
      [1, 1, 'black'],
      [2, 2, 'black'],
      [3, 3, 'black'],
      [4, 4, 'black'],
    ];
    const newBoard = placePieces(board, pieces);
    const result = checkWinnerFromPosition(newBoard, { row: 2, col: 2 }, 'black');

    expect(result).not.toBeNull();
    expect(result?.winner).toBe('black');
  });

  it('副对角线方向五子连珠应获胜', () => {
    const board = createEmptyBoard();
    const pieces: Array<[number, number, Player]> = [
      [0, 10, 'white'],
      [1, 9, 'white'],
      [2, 8, 'white'],
      [3, 7, 'white'],
      [4, 6, 'white'],
    ];
    const newBoard = placePieces(board, pieces);
    const result = checkWinnerFromPosition(newBoard, { row: 2, col: 8 }, 'white');

    expect(result).not.toBeNull();
    expect(result?.winner).toBe('white');
  });

  it('未连珠五子不应获胜', () => {
    const board = createEmptyBoard();
    const pieces: Array<[number, number, Player]> = [
      [7, 0, 'black'],
      [7, 1, 'black'],
      [7, 3, 'black'],
      [7, 4, 'black'],
    ];
    const newBoard = placePieces(board, pieces);
    const result = checkWinnerFromPosition(newBoard, { row: 7, col: 0 }, 'black');

    expect(result).toBeNull();
  });

  it('少于五子不应获胜', () => {
    const board = createEmptyBoard();
    const pieces: Array<[number, number, Player]> = [
      [7, 0, 'black'],
      [7, 1, 'black'],
      [7, 2, 'black'],
      [7, 3, 'black'],
    ];
    const newBoard = placePieces(board, pieces);
    const result = checkWinnerFromPosition(newBoard, { row: 7, col: 2 }, 'black');

    expect(result).toBeNull();
  });
});

describe('checkDraw', () => {
  it('空棋盘不应平局', () => {
    const board = createEmptyBoard();
    expect(checkDraw(board)).toBe(false);
  });

  it('下满的棋盘应平局', () => {
    const board: Board = Array(15).fill(null).map(() =>
      Array(15).fill(null).map((_, i) => (i % 2 === 0 ? 'black' : 'white'))
    );
    expect(checkDraw(board)).toBe(true);
  });

  it('部分填充的棋盘不应平局', () => {
    const board = createEmptyBoard();
    const pieces: Array<[number, number, Player]> = [
      [0, 0, 'black'],
      [7, 7, 'white'],
    ];
    const newBoard = placePieces(board, pieces);
    expect(checkDraw(newBoard)).toBe(false);
  });
});
