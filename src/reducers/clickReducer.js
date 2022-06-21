import { CLICK_UPDATE_VALUE } from '../actions/actionTypes';
const initialState = {
  modalOpen: ''
};
export const clickReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLICK_UPDATE_VALUE:
      return {
        ...state,
        modalOpen: action.modalOpen
      };
    default:
      return state;
  }
};