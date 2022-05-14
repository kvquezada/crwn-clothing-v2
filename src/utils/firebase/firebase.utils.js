import {initializeApp} from 'firebase/app';
import {
	getAuth,
	signInWithRedirect,
	signInWithPopup,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged
} from 'firebase/auth';
import {
	getFirestore,
	doc, // point to the doc of firestore db
	getDoc, // get doc data
	setDoc, // set doc data
	collection, // point to the collection of firestore db
	writeBatch, // call write batch instance that you can perform crud
	query,
	getDocs, // get all docs
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

// instantiate as classes so we can add new providers
const googleProvider = new GoogleAuthProvider();

// force them to select the account
googleProvider.setCustomParameters({
	prompt: "select_account"
})

// auth tracks all the auth state of entire application
export const auth = getAuth();
// list down all providers
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

// instantiate firestore
export const db = getFirestore();

// add shop data on load - only use once to store all shop_data
export const addCollectionAndDocuments = async(collectionKey, objectsToAdd) => {
	// point to the collection of firestore db
	const collectionRef = collection(db, collectionKey);
	// call write batch instance
	const batch = writeBatch(db);
	console.log(objectsToAdd);
	objectsToAdd.forEach((object) => {
		const docRef = doc(collectionRef, object.title.toLowerCase());
		batch.set(docRef, object);
	})

	await batch.commit();
	console.log('done');
};

export const getCategoriesAndDocuments = async() => {
	const collectionRef = collection(db, 'categories');
	const q = query(collectionRef);

	// querySnapshot.docs - array of individual documents/ instance inside
	const querySnapshot = await getDocs(q);
	console.log(querySnapshot.docs);
	// returning/reducing to only one object
	const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
		const {title, items} = docSnapshot.data()
		acc[title.toLowerCase()] = items;
		return acc;
	}, {})
	return categoryMap;
};

export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
	if (!userAuth) return;

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
				createdAt,
				...additionalInformation
			})
		} catch (e) {
			console.log('error creating the user', e.message);
		}
	}

	return userDocRef;

	// if user does not exist / create a  collection from userAuth
	// return userDoc ref
}

export const createAuthUserWithEmailAndPassword = async (email, password) => {
	if (!email || !password) return;

	return await createUserWithEmailAndPassword(auth, email, password);
}

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
	if (!email || !password) return;

	return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

// observer listener
export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);