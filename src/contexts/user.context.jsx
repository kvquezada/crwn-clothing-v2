import {createContext, useState, useEffect} from "react";

import {createUserDocumentFromAuth, onAuthStateChangedListener} from "../utils/firebase/firebase.utils";

// as the actual value you want to access
export const UserContext = createContext({
	currentUser: null,
	setCurrentUser: () => null,

});

// provider, actual component
// alias component that allows us to use the context provider and wrap the children
export const UserProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const value = { currentUser, setCurrentUser};

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