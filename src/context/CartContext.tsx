"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

export type Food = {
  _id: string;
  name: string;
  image: string;
  description:string;
  price: number;
  offerPrice?: number;
};

export type CartItem = Food & { quantity: number };

export type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

type Action =
  | { type: "ADD_TO_CART"; payload: any }
  | { type: "INCREASE_QUANTITY"; payload: string }
  | { type: "DECREASE_QUANTITY"; payload: string }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "LOAD_FROM_STORAGE"; payload: any }
  | { type: "CLEAR_CART" }; 

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const exists = state.items.find((item) => item._id === action.payload._id);
      if (exists) {
        return {
          ...state,
          items: state.items.map((item) =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }
    }
    case "INCREASE_QUANTITY": {
      return {
        ...state,
        items: state.items.map((item) =>
          item._id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }
    case "DECREASE_QUANTITY": {
      return {
        ...state,
        items: state.items
          .map((item) =>
            item._id === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
    }
    case "REMOVE_FROM_CART": {
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload),
      };
    }
    case "CLEAR_CART":
  return { ...state, items: [] };

    case "LOAD_FROM_STORAGE": {
      return {
        ...state,
        items: action.payload,
      };
    }
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data } = useSession();
  const userKey = data?.user?.email || "guest";

  useEffect(() => {
    const stored = localStorage.getItem(`cart-${userKey}`);
    if (stored) {
      dispatch({ type: "LOAD_FROM_STORAGE", payload: JSON.parse(stored) });
    }
  }, [userKey]);

  useEffect(() => {
    localStorage.setItem(`cart-${userKey}`, JSON.stringify(state.items));
  }, [state.items, userKey]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
