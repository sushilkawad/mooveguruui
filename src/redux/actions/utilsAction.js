import { bindActionCreators } from 'redux';
import { store } from '../store/store';

const getListOfTopics = data => dispatch => {
    dispatch({
      type: 'GET_TOPIC_LIST_SUCCESS',
      payload: data,
    });
};

const getTopicDetails = data => dispatch => {
    dispatch({
      type: 'GET_TOPIC_DETAILS_SUCCEESS',
      payload: data,
    });
};

const loadingActions = bindActionCreators(
    {
        getListOfTopics,
        getTopicDetails,
    },
    store.dispatch,
  );
  
  export default loadingActions;