import { SET_ADMIN } from './authActions';

interface AuthState {
  isAdmin: boolean;
}

const initialState: AuthState = {
  isAdmin: true,
};

const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case SET_ADMIN:
      return {
        ...state,
        isAdmin: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
