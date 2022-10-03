import React, { useEffect, useState } from 'react';
import Board from '@asseinfo/react-kanban';
import '@asseinfo/react-kanban/dist/styles.css';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import Task from 'components/Task';
import AddPopup from 'components/AddPopup';
import EditPopup from 'components/EditPopup';
import ColumnHeader from 'components/ColumnHeader';

import useTasks from 'hooks/store/useTasks';

import useStyles from './useStyles';

function TaskBoard() {
  const {
    mode,
    MODES,
    handleOpenAddPopup,
    handleOpenEditPopup,
    handleClose,
    openedTaskId,
    board,
    loadBoard,
    loadColumnMore,
    handleCloseProx,
    handleTaskCreate,
    handleCardDragEnd,
    handleTaskLoad,
    handleTaskUpdate,
    handleTaskDestroy,
  } = useTasks();

  const styles = useStyles();

  useEffect(() => {
    loadBoard();
  }, []);

  return (
    <>
      <Fab onClick={handleOpenAddPopup} className={styles.addButton} color="primary" aria-label="add">
        <AddIcon />
      </Fab>

      <Board
        disableColumnDrag
        onCardDragEnd={handleCardDragEnd}
        renderCard={(card) => <Task onClick={handleOpenEditPopup} task={card} />}
        renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={loadColumnMore}/>}
      >
        {board}
      </Board>

      {mode === MODES.ADD && <AddPopup onCreateCard={handleTaskCreate} onClose={handleClose} />}
      {mode === MODES.EDIT && (
        <EditPopup
          onLoadCard={handleTaskLoad}
          onDestroyCard={handleTaskDestroy}
          onUpdateCard={handleTaskUpdate}
          onClose={handleClose}
          cardId={openedTaskId}
        />
      )}
    </>
  );
}

export default TaskBoard;
