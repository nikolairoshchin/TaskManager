import React from 'react';
import PropTypes from 'prop-types';
import { has, isNil } from 'ramda';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import UserSelect from 'components/UserSelect';
import TaskPresenter from 'presenters/TaskPresenter';
import ImageUpload from 'components/ImageUpload';

import useStyles from './useStyles';

function Form({ errors, onChange, attachImage, removeImage, task }) {
  const handleChangeTextField = (fieldName) => (event) => onChange({ ...task, [fieldName]: event.target.value });
  const handleChangeSelect = (fieldName) => (user) => onChange({ ...task, [fieldName]: user });
  const styles = useStyles();
  const onAttachImage = (attachment) => {
    attachImage(task.id, attachment);
  };
  const onRemoveImage = () => {
    removeImage(task.id);
  };

  return (
    <form className={styles.root}>
      <TextField
        error={has('name', errors)}
        helperText={errors.name}
        onChange={handleChangeTextField('name')}
        value={TaskPresenter.name(task)}
        label="Name"
        required
        margin="dense"
      />
      <TextField
        error={has('description', errors)}
        helperText={errors.description}
        onChange={handleChangeTextField('description')}
        value={TaskPresenter.description(task)}
        label="Description"
        required
        multiline
        margin="dense"
      />
      <UserSelect
        label="Author"
        value={TaskPresenter.author(task)}
        onChange={handleChangeSelect('author')}
        isDisabled={false}
        isRequired
        error={has('author', errors)}
        helperText={errors.author}
      />
      <UserSelect
        label="Assignee"
        value={TaskPresenter.assignee(task)}
        onChange={handleChangeSelect('assignee')}
        isDisabled={false}
        isRequired
        error={has('assignee', errors)}
        helperText={errors.assignee}
      />

      {isNil(TaskPresenter.imageUrl(task)) ? (
        <div className={styles.imageUploadContainer}>
          <ImageUpload onUpload={onAttachImage} />
        </div>
      ) : (
        <div className={styles.previewContainer}>
          <img className={styles.preview} src={TaskPresenter.imageUrl(task)} alt="Attachment" />
          <Button variant="contained" size="small" color="primary" onClick={onRemoveImage}>
            Remove image
          </Button>
        </div>
      )}
    </form>
  );
}

Form.propTypes = {
  onChange: PropTypes.func.isRequired,
  task: PropTypes.shape().isRequired,
  errors: PropTypes.shape({
    name: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.arrayOf(PropTypes.string),
    author: PropTypes.arrayOf(PropTypes.string),
    assignee: PropTypes.arrayOf(PropTypes.string),
  }),
};

Form.defaultProps = {
  errors: {},
};

export default Form;
