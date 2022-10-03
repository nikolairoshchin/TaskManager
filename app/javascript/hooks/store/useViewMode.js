import React, { useState } from 'react';

const MODES = {
   ADD: 'add',
   EDIT: 'edit',
   NONE: 'none',
 };

const useViewMode = () => {

  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setOpenedTaskId] = useState(null);

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

  return {
  	mode,
  	MODES,
  	handleOpenAddPopup,
	handleOpenEditPopup,
	handleClose,
	openedTaskId,
  };
};

export default useViewMode;