import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },

  imageUploadContainer: {
    width: 200,
    maxHeight: 200,
    overflow: 'auto',
  },

  previewContainer: {
    width: 200,
    height: 200,
    overflow: 'auto',
  },

  preview: {
    width: 200,
    maxHeight: 200,
  },
}));

export default useStyles;
