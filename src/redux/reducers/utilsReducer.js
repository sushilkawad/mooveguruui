const defaultState = {
    topicDetails: {},
    listOfTopics: [],
};

const utilsReducers = (
    state= { ...defaultState },
    action,
) => {
    const newState = Object.assign({}, state);

    switch (action.type) {
        case 'GET_TOPIC_LIST_SUCCESS':
            newState.listOfTopics = action.payload;
            return newState;
        case 'GET_TOPIC_LIST_ERROR':
            newState.listOfTopics = []
            return newState;
        case 'GET_TOPIC_DETAILS_SUCCEESS':
            newState.topicDetails = action.payload;
            return newState;
        default:
            return newState;
    }
}

export default utilsReducers;