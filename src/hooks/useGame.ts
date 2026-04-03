/**
 * 游戏状态管理Hook
 */

import { useState, useCallback } from 'react';
import type { Board, Player, GameStatus, GameResult, Position } from '../types/game';
import { checkWinner, checkDraw } from '../utils/checkWinner';

// 棋盘大小
const BOARD_SIZE = 15;

/**
 * 初始化空棋盘
 */
function createEmptyBoard(): Board {
  return Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
}

/**
 * 游戏Hook
 */
export function useGame() {
  // 棋盘状态
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  // 当前玩家
  const [currentPlayer, setCurrentPlayer] = useState<Player>('black');
  // 游戏状态
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  // 游戏结果
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  /**
   * 下棋
   */
  const makeMove = useCallback(
    (position: Position): boolean => {
      // 游戏已结束则不能下棋
      if (gameStatus !== 'playing') return false;

      const { row, col } = position;

      // 位置已有棋子则不能下棋
      if (board[row][col] !== null) return false;

      // 更新棋盘
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = currentPlayer;
      setBoard(newBoard);

      // 检查获胜
      const result = checkWinner(newBoard, currentPlayer);
      if (result) {
        setGameStatus('won');
        setGameResult(result);
        return true;
      }

      // 检查平局
      if (checkDraw(newBoard)) {
        setGameStatus('draw');
        setGameResult({ winner: null, winningLine: [] });
        return true;
      }

      // 切换玩家
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
      return true;
    },
    [board, currentPlayer, gameStatus]
  );

  /**
   * 重置游戏
   */
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('black');
    setGameStatus('playing');
    setGameResult(null);
  }, []);

  return {
    board,
    currentPlayer,
    gameStatus,
    gameResult,
    makeMove,
    resetGame,
  };
}
