import { propEq } from 'ramda';
import { createSlice } from '@reduxjs/toolkit';
import TasksRepository from 'repositories/TasksRepository';
import { STATES } from 'presenters/TaskPresenter';
import { useDispatch, useSelector } from 'react-redux';
import { changeColumn } from '@asseinfo/react-kanban';

const initialState = {
  board: {
    columns: STATES.map((column) => ({
      id: column.key,
      title: column.value,
      cards: [],
      meta: {},
    })),
  },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    loadColumnSuccess(state, { payload }) {
      const { items, meta, columnId } = payload;
      const column = state.board.columns.find(propEq('id', columnId));
      state.board = changeColumn(state.board, column, {
        cards: items,
        meta,
      });

      return state;
    },
  },
});

const { loadColumnSuccess } = tasksSlice.actions;

export const useTasksActions = () => {
  const dispatch = useDispatch();
  const prevState = useSelector(state => state.TasksSlice.board);

  const getColumn = (state, page, perPage) =>
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage,
    });

  const loadColumn = (state, page = 1, perPage = 10) => {
    getColumn(state, page, perPage).then(({ data }) => {
      dispatch(loadColumnSuccess({ ...data, columnId: state }));
    });
  };

  const loadColumnMore = (state, page = 1, perPage = 10) => {
    getColumn(state, page, perPage).then(({ data }) => {
    const column = prevState.columns.find(propEq('id', state));
      dispatch(loadColumnSuccess({ items: [...column.cards, ...data.items], meta: data.meta, columnId: state }));
    });
  };

  const loadBoard = () => STATES.map(({ key }) => loadColumn(key));

  return {
    loadBoard,
    loadColumn,
    loadColumnMore,
  };
};

export default tasksSlice.reducer;
