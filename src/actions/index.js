import { CLICK_UPDATE_VALUE } from './actionTypes';
export const clickButton = value => ({
  type: CLICK_UPDATE_VALUE,
  modalOpen: value
});

export const clickKeyboard = value => ({
  type: CLICK_UPDATE_VALUE,
  keyboardOpen: value
});
