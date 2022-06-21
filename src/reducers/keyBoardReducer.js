import { CLICK_UPDATE_VALUE } from '../actions/actionTypes';
const initialState = {
  keyboardOpen: ''
};
export const keyBoardReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLICK_UPDATE_VALUE:
      return {
        ...state,
        keyboardOpen: action.keyboardOpen
      };
    default:
      return state;
  }
};