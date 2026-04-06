/**
 * 游戏状态管理Hook
 */

import { useState, useCallback } from 'react';
import type { Board, Player, GameStatus, GameResult, Position } from '../types/game';
import { checkWinnerFromPosition, checkDraw } from '../utils/checkWinner';

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

// 游戏历史记录
interface GameHistory {
  board: Board;
  currentPlayer: Player;
  lastPosition: Position | null;
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
  // 历史记录（用于悔棋）
  const [history, setHistory] = useState<GameHistory[]>([]);
  // 最后一步位置
  const [lastPosition, setLastPosition] = useState<Position | null>(null);

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

      // 保存历史记录
      setHistory(prev => [...prev, { board, currentPlayer, lastPosition }]);

      // 更新棋盘
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = currentPlayer;
      setBoard(newBoard);
      setLastPosition(position);

      // 检查获胜（使用优化版，只检查落子位置）
      const result = checkWinnerFromPosition(newBoard, position, currentPlayer);
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
    [board, currentPlayer, gameStatus, lastPosition]
  );

  /**
   * 悔棋
   */
  const undoMove = useCallback((): boolean => {
    // 游戏已结束不能悔棋
    if (gameStatus !== 'playing') return false;
    // 没有历史记录不能悔棋
    if (history.length === 0) return false;

    const lastState = history[history.length - 1];
    setBoard(lastState.board);
    setCurrentPlayer(lastState.currentPlayer);
    setLastPosition(lastState.lastPosition);
    setHistory(prev => prev.slice(0, -1));
    return true;
  }, [history, gameStatus]);

  /**
   * 重置游戏
   */
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('black');
    setGameStatus('playing');
    setGameResult(null);
    setHistory([]);
    setLastPosition(null);
  }, []);

  return {
    board,
    currentPlayer,
    gameStatus,
    gameResult,
    lastPosition,
    makeMove,
    undoMove,
    resetGame,
  };
}
