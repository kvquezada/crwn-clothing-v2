import {createContext, useEffect, useReducer} from "react";

import {createAction} from "../utils/reducer/reducer.utils";

import {
	createUserDocumentFromAuth,
	onAuthStateChangedListener
} from "../utils/firebase/firebase.utils";



// as the actual value you want to access
export const UserContext = createContext({
	currentUser: null,
	setCurrentUser: () => null,

});

export const USER_ACTION_TYPES = {
	'SET_CURRENT_USER': 'SET_CURRENT_USER'
}

const userReducer = (state, action) => {
	const { type, payload} = action;

	switch (type) {
		case USER_ACTION_TYPES.SET_CURRENT_USER:
			return {
				...state,
				currentUser: payload
			}
		default:
			throw new Error(`Unhandled type ${type} in userReducer`)
	}
}

const INITIAL_STATE = {
	currentUser: null
}
// provider, actual component
// alias component that allows us to use the context provider and wrap the children
export const UserProvider = ({ children }) => {
	const [{ currentUser }, dispatch] = useReducer(userReducer, INITIAL_STATE);

	const setCurrentUser = (user) => {
		dispatch(createAction(USER_ACTION_TYPES.SET_CURRENT_USER, user));
	}

	const value = { currentUser, setCurrentUser };

	// run only once component mounts
	useEffect(() => {
		// whenever user signin/signout, auth state is invoked
		const unsubscribe = onAuthStateChangedListener((user) => {
			if (user) {
				createUserDocumentFromAuth(user);
			}
			setCurrentUser(user);
		})
		return unsubscribe;
	}, [])
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}