import { useSelector } from 'react-redux';
import { useTasksActions } from 'slices/TasksSlice';
import { STATES } from 'presenters/TaskPresenter';

const useTasks = () => {
  const board = useSelector((state) => state.TasksSlice.board);
  
  const {
    mode,
    MODES,
    handleOpenAddPopup,
    handleOpenEditPopup,
    handleClose,
    openedTaskId,
    loadColumn,
    loadColumnMore,
    handleTaskCreate,
    handleCardDragEnd,
    handleTaskLoad,
    handleTaskUpdate,
    handleTaskDestroy,
  } = useTasksActions();

  const loadBoard = () => Promise.all(STATES.map(({ key }) => loadColumn(key)));

  return {
    mode,
    MODES,
    handleOpenAddPopup,
    handleOpenEditPopup,
    handleClose,
    openedTaskId,
    board,
    loadBoard,
    loadColumnMore,
    handleTaskCreate,
    handleCardDragEnd,
    handleTaskLoad,
    handleTaskUpdate,
    handleTaskDestroy,
  };
};

export default useTasks;
