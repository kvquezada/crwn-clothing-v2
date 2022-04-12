import {useEffect} from "react";
import {getRedirectResult} from 'firebase/auth';

import {
	auth,
	signInWithGooglePopup,
	signInWithGoogleRedirect,
	createUserDocumentFromAuth,
} from "../../utils/firebase/firebase.utils";

import SignUpForm from "../../component/sign-up-form/sign-up-form.component";

const SignIn = () => {
	// run for the first time
	// when we come back and remount, this useeffect runs
	useEffect(async () => {
		// get redirect response from auth - tracking all authentication state regardless of where the website is going
		const response = await getRedirectResult(auth);
		if (response) {
			const userDocRef = await createUserDocumentFromAuth(response.user);
		}
	}, []);

	const logGoogleUser = async () => {
		const { user } = await signInWithGooglePopup();
		const userDocRef = await createUserDocumentFromAuth(user);
		console.log(user);
	}
	return (
		<div>
			<h1>Sign in Page</h1>
			<button onClick={logGoogleUser}>
				Sign in With Google Popup
			</button>
			<button onClick={signInWithGoogleRedirect}>
				Sign in With Google Redirect
			</button>
			<SignUpForm/>
		</div>
	)
}

export default SignIn;