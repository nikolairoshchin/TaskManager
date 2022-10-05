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

const MODES = {
   ADD: 'add',
   EDIT: 'edit',
   NONE: 'none',
 };

function TaskBoard() {

  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setOpenedTaskId] = useState(null);
  const {
    board,
    loadBoard,
    loadColumnMore,
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

  const handleOpenAddPopup = () => {
    setMode(MODES.ADD);
  };

  const handleOpenEditPopup = (task) => {
    setOpenedTaskId(task.id);
    setMode(MODES.EDIT);
  };

  const handleClose = () => {
    setMode(MODES.NONE);
    setOpenedTaskId(null);
  };

  const taskCreate = (params) => {
    handleTaskCreate(params);
    handleClose();
  };

  const taskUpdate = (task) => {
    handleTaskUpdate(task);
    handleClose();
  };

  const taskDestroy = (task) => {
    handleTaskDestroy(task);
    handleClose();
  };

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

      {mode === MODES.ADD && <AddPopup onCreateCard={taskCreate} onClose={handleClose} />}
      {mode === MODES.EDIT && (
        <EditPopup
          onLoadCard={handleTaskLoad}
          onDestroyCard={taskDestroy}
          onUpdateCard={taskUpdate}
          onClose={handleClose}
          cardId={openedTaskId}
        />
      )}
    </>
  );
}

export default TaskBoard;
