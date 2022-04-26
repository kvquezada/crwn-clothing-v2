import {createContext, useState, useEffect} from "react";

import PRODUCTS from '../shop-data.json';

// initialize context
export const ProductsContext = createContext({
	products: [],
});

// initialize provider, what do we store
export const ProductProvider = ({children}) => {
	const [ products ] = useState(PRODUCTS);
	const value = { products }

	return (
		<ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
	)
}