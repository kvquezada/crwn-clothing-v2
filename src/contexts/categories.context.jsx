import {createContext, useState, useEffect} from "react";

import {getCategoriesAndDocuments} from "../utils/firebase/firebase.utils";

// initialize context
export const CategoriesContext = createContext({
	categoriesMap: {},
});

// initialize provider, what do we store
export const CategoriesProvider = ({children}) => {
	const [ categoriesMap, setCategoriesMap ] = useState({});
	useEffect(() => {
		const getCategoriesMap = async () => {
			const categoryMap = await getCategoriesAndDocuments();
			console.log(categoryMap);
			setCategoriesMap(categoryMap);
		}
		getCategoriesMap();
	}, [])
	const value = { categoriesMap }

	return (
		<CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
	)
}