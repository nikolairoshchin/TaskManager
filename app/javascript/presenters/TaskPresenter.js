import PropTypes from 'prop-types';
import PropTypesPresenter from 'utils/PropTypesPresenter';

export default new PropTypesPresenter({
  id: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  author: PropTypes.integer,
  assignee: PropTypes.integer,
  state: PropTypes.string,
  expired_at: PropTypes.date,
});
