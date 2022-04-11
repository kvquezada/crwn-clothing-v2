import {initializeApp} from 'firebase/app';
import {
	getAuth,
	signInWithRedirect,
	signInWithPopup,
	GoogleAuthProvider,
} from 'firebase/auth';
import {
	getFirestore,
	doc,
	getDoc,
	setDoc,
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBhblMeYjaGYWMf6bwkJ30X1mP13s7JKuw",
	authDomain: "crwn-clothing-db-26715.firebaseapp.com",
	projectId: "crwn-clothing-db-26715",
	storageBucket: "crwn-clothing-db-26715.appspot.com",
	messagingSenderId: "262322517228",
	appId: "1:262322517228:web:eb329171d850aa980421c9"
};

// Initialize Firebase, interacts crud using this instance
const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
// force them to select the account
provider.setCustomParameters({
	prompt: "select_account"
})

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

// instantiate firestore
export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth) => {
	const userDocRef = doc(db, 'users', userAuth.uid);

	console.log(userDocRef);
	const userSnapshot = await getDoc(userDocRef);
	console.log('b', userSnapshot);
	console.log('b', userSnapshot.exists());

	// if user data exists
	if (!userSnapshot.exists()) {
		const { displayName, email } = userAuth;
		const createdAt = new Date();
		try {
			await setDoc(userDocRef, {
				displayName,
				email,
				createdAt
			})
		} catch (e) {
			console.log('error creating the user', e.message);
		}
	}

	return userDocRef;

	// if user does not exist / create a  collection from userAuth
	// return userDoc ref
}