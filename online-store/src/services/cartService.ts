// src/services/cartService.ts

import { db } from "../services/firebaseConfig";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Cart, CartItem } from "../types/ cart";

// 1. Function to get the cart
export const getCart = async (userId: string): Promise<Cart | null> => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);
  return cartSnap.exists() ? (cartSnap.data() as Cart) : null;
};

// 2. Function to add an item to the cart
export const addItemToCart = async (
  userId: string,
  item: CartItem
): Promise<void> => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);

  if (!cartSnap.exists()) {
    // Create new cart if it doesn't exist
    await setDoc(cartRef, {
      userId,
      items: [item],
      updatedAt: new Date(),
    });
    return;
  }

  const cart = cartSnap.data() as Cart;
  const existingItemIndex = cart.items.findIndex(
    (i) => i.productId === item.productId
  );

  if (existingItemIndex >= 0) {
    const updatedItems = [...cart.items];
    updatedItems[existingItemIndex] = {
      ...updatedItems[existingItemIndex],
      quantity: updatedItems[existingItemIndex].quantity + item.quantity,
    };

    await updateDoc(cartRef, {
      items: updatedItems,
      updatedAt: new Date(),
    });
  } else {
    await updateDoc(cartRef, {
      items: arrayUnion(item),
      updatedAt: new Date(),
    });
  }
};

// 3. Function to update item quantity
export const updateCartItemQuantity = async (
  userId: string,
  productId: string,
  newQuantity: number
): Promise<void> => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);

  if (!cartSnap.exists()) {
    throw new Error("Cart does not exist!");
  }

  const cart = cartSnap.data() as Cart;
  const itemIndex = cart.items.findIndex(
    (item) => item.productId === productId
  );

  if (itemIndex >= 0) {
    const updatedItems = [...cart.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      quantity: newQuantity,
    };

    await updateDoc(cartRef, {
      items: updatedItems,
      updatedAt: new Date(),
    });
  }
};

// 4. Function to remove an item
export const removeItemFromCart = async (
  userId: string,
  productId: string
): Promise<void> => {
  const cartRef = doc(db, "carts", userId);
  const cartSnap = await getDoc(cartRef);

  if (cartSnap.exists()) {
    const cart = cartSnap.data() as Cart;
    const itemToRemove = cart.items.find(
      (item) => item.productId === productId
    );

    if (itemToRemove) {
      await updateDoc(cartRef, {
        items: arrayRemove(itemToRemove),
        updatedAt: new Date(),
      });
    }
  }
};

// 5. Function to clear the cart
export const clearCart = async (userId: string): Promise<void> => {
  const cartRef = doc(db, "carts", userId);
  await updateDoc(cartRef, {
    items: [],
    updatedAt: new Date(),
  });
};
