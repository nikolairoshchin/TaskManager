import { useSelector } from 'react-redux';
import { useTasksActions } from 'slices/TasksSlice';
import { STATES } from 'presenters/TaskPresenter';

const useTasks = () => {
  const board = useSelector((state) => state.TasksSlice.board);

  const {
    loadColumn,
    loadColumnMore,
    handleTaskCreate,
    handleCardDragEnd,
    handleTaskLoad,
    handleTaskUpdate,
    handleTaskDestroy,
    imageAttach,
    imageRemove,
  } = useTasksActions();

  const loadBoard = () => Promise.all(STATES.map(({ key }) => loadColumn(key)));

  return {
    board,
    loadBoard,
    loadColumnMore,
    handleTaskCreate,
    handleCardDragEnd,
    handleTaskLoad,
    handleTaskUpdate,
    handleTaskDestroy,
    imageAttach,
    imageRemove,
  };
};

export default useTasks;
