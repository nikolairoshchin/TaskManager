import React from 'react';
import { propEq } from 'ramda';
import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { changeColumn } from '@asseinfo/react-kanban';
import TasksRepository from 'repositories/TasksRepository';
import { STATES } from 'presenters/TaskPresenter';
import TaskForm from 'forms/TaskForm';

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
  const prevState = useSelector((state) => state.TasksSlice.board);

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

  const handleTaskCreate = (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    return TasksRepository.create(attributes).then(({ data: { task } }) => {
      loadColumn(task.state);
    });
  };

  const handleCardDragEnd = (task, source, destination) => {
    const transition = task.transitions.find(({ to }) => destination.toColumnId === to);
    if (!transition) {
      return null;
    }

    return TasksRepository.update(task.id, { stateEvent: transition.event })
      .then(() => {
        loadColumn(destination.toColumnId);
        loadColumn(source.fromColumnId);
      })
      .catch((error) => {
        alert(`Move failed! ${error.message}`);
      });
  };

  const handleTaskLoad = (id) => TasksRepository.show(id).then(({ data: { task } }) => task);

  const handleTaskUpdate = (task) => {
    const attributes = TaskForm.attributesToSubmit(task);

    return TasksRepository.update(task.id, attributes).then(() => {
      loadColumn(task.state);
    });
  };

  const handleTaskDestroy = (task) =>
    TasksRepository.destroy(task.id).then(() => {
      loadColumn(task.state);
    });

  const loadBoard = () => STATES.map(({ key }) => loadColumn(key));

  const imageAttach = (task_id, attachment) => {
    TasksRepository.attachImage(task_id, attachment);
  };

  const imageRemove = (task_id) => {
    TasksRepository.removeImage(task_id);
  };


  return {
    loadBoard,
    loadColumn,
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

export default tasksSlice.reducer;
