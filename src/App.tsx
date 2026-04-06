/**
 * 五子棋游戏主组件
 */

import './App.css';
import { Board } from './components/Board';
import { useGame } from './hooks/useGame';

function App() {
  const { board, currentPlayer, gameStatus, gameResult, lastPosition, makeMove, undoMove, resetGame } = useGame();

  /**
   * 获取游戏状态文本
   */
  const getStatusText = (): string => {
    if (gameStatus === 'won') {
      return `${gameResult?.winner === 'black' ? '黑棋' : '白棋'}获胜！`;
    }
    if (gameStatus === 'draw') {
      return '平局！';
    }
    return `当前回合：${currentPlayer === 'black' ? '黑棋' : '白棋'}`;
  };

  return (
    <div className="game-container">
      <h1>五子棋</h1>
      <div className="status">{getStatusText()}</div>
      <Board
        board={board}
        winningLine={gameResult?.winningLine || []}
        lastPosition={lastPosition}
        onCellClick={makeMove}
        disabled={gameStatus !== 'playing'}
      />
      <div className="button-group">
        {gameStatus === 'playing' && (
          <button className="undo-button" onClick={undoMove}>
            悔棋
          </button>
        )}
        {gameStatus !== 'playing' && (
          <button className="reset-button" onClick={resetGame}>
            重新开始
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
