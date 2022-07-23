import {createContext, useReducer } from "react";

import {createAction} from "../utils/reducer/reducer.utils";

const addCartItem = (cartItems, productToAdd) => {
	// find if cartItems contains productToAdd
	const existingCartItem = cartItems.find(
		(cartItem) => cartItem.id === productToAdd.id
	);
	// If found, increment quantity
	if (existingCartItem) {
		return cartItems.map((cartItem) =>
				cartItem.id === productToAdd.id
					? {...cartItem, quantity: cartItem.quantity + 1}
					: cartItem
		);
	}

	// return new array with modified cartItems/ new cart Item
	return [...cartItems, { ...productToAdd, quantity: 1}]
}

const removeCartItem = (cartItems, cartItemToRemove) => {
	// find the cartitem to remove
	const existingCartItem = cartItems.find(
		(cartItem) => cartItem.id === cartItemToRemove.id
	);
	// check if quantity is equal to 1. if it is, remove the item from the cart
	if (existingCartItem.quantity === 1) {
		return cartItems.filter(cartItem => cartItem.id !== cartItemToRemove.id)
	}
	// return back cart items with matching cart item with reduce quantity
	return cartItems.map((cartItem) =>
		cartItem.id === cartItemToRemove.id
			? {...cartItem, quantity: cartItem.quantity - 1}
			: cartItem
	);
}

const clearCartItem = (cartItems, cartItemToClear) => cartItems.filter(cartItem => cartItem.id !== cartItemToClear.id)

export const CartContext = createContext({
	isCartOpen: false,
	setIsCartOpen: () => {},
	cartItems: [],
	addItemToCart: () => {},
	removeItemToCart: () => {},
	clearItemFromCart: () => {},
	cartCount: 0,
	cartTotal: 0,
})

export const CART_ACTION_TYPES = {
	'SET_IS_CART_OPEN': 'SET_IS_CART_OPEN',
	'SET_CART_ITEMS': 'SET_CART_ITEMS',
}

const INITIAL_STATE = {
	isCartOpen: true,
	cartItems: [],
	cartCount: 0,
	cartTotal: 0,
}

// should only be updating the state, not the business/logic
const cartReducer = (state, action) => {
	const { type, payload} = action;

	switch(type) {
		case CART_ACTION_TYPES.SET_IS_CART_OPEN:
			return {
				...state,
				isCartOpen: payload
			}
		case CART_ACTION_TYPES.SET_CART_ITEMS:
			return {
				...state,
				...payload,
			}
		default:
			throw new Error(`Unhandled type ${type} in cartReducer`)
	}
}

export const CartProvider = ({children}) => {
	const [{cartItems, isCartOpen, cartCount, cartTotal}, dispatch] = useReducer(cartReducer, INITIAL_STATE);

	const updateCartItemsReducer = (newCartItems) => {
		const newCartCount = newCartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);

		const newCartTotal = newCartItems.reduce((total, cartItem) => total + cartItem.quantity * cartItem.price, 0);

		dispatch(
			createAction(CART_ACTION_TYPES.SET_CART_ITEMS, {
				cartItems: newCartItems,
				cartTotal: newCartTotal,
				cartCount: newCartCount
			})
		);

		/*
		generate newCartTotal

		generate newCartCount

		dispatch new action with payload = {
		 newCartItems,
		 newCartTotal,
		 newCartCount
		}
		 */
	}

	const addItemToCart = (productToAdd) => {
		const newCartItems = addCartItem(cartItems, productToAdd);
		updateCartItemsReducer(newCartItems);
	}

	const removeItemToCart = (cartItemToRemove) => {
		const newCartItems = removeCartItem(cartItems, cartItemToRemove);
		updateCartItemsReducer(newCartItems);
	}

	const clearItemFromCart = (cartItemToClear) => {
		const newCartItems = clearCartItem(cartItems, cartItemToClear);
		updateCartItemsReducer(newCartItems);
	}

	const setIsCartOpen = (bool) => {
		dispatch(createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, bool));
	}

	const value = {
		isCartOpen,
		setIsCartOpen,
		addItemToCart,
		removeItemToCart,
		clearItemFromCart,
		cartItems,
		cartCount,
		cartTotal
	};
	return (
		<CartContext.Provider value={value}>{children}</CartContext.Provider>
	)
}