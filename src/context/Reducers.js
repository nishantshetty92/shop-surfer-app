export const cartReducer = (state, action) => {
  let product;
  let cartQuantity;
  switch (action.type) {
    case "ADD_TO_CART":
      product = action?.payload;
      cartQuantity = product?.addQty ? product.addQty : 1;
      delete product.addQty;
      state = [
        ...state,
        {
          product: product,
          quantity: cartQuantity,
          is_selected: true,
        },
      ];
      saveCart(state);
      return state;
    case "MERGE_CART":
      product = action?.payload;
      cartQuantity = product?.addQty ? product.addQty : 1;
      delete product.addQty;
      const itemIsFound = state.find(
        (cartItem) => cartItem.product.id === product?.id
      );
      if (!itemIsFound) {
        state = [
          ...state,
          {
            product: product,
            quantity: cartQuantity,
            is_selected: true,
          },
        ];
        saveCart(state);
      }

      return state;
    case "REMOVE_FROM_CART":
      state = state.filter((c) => c.product.id !== action.payload[0]);
      saveCart(state);
      return state;
    case "CHANGE_CART_QTY":
      state = state.map((c) =>
        c.product.id === action.payload.id
          ? { ...c, quantity: Number(action.payload.quantity) }
          : c
      );
      saveCart(state);
      return state;
    case "SELECT_ITEM":
      state = state.map((c) =>
        c.product.id === action.payload.id
          ? { ...c, is_selected: !c.is_selected }
          : c
      );
      saveCart(state);
      return state;
    case "SELECT_ALL":
      state = state.map((c) => {
        return { ...c, is_selected: action.payload.is_selected };
      });
      saveCart(state);
      return state;
    case "UPDATE_CART":
      state = action.payload;
      saveCart(state);
      return state;
    case "RESET_CART":
      state = [];
      saveCart(state);
      return state;
    default:
      saveCart(state);
      return state;
  }
};

const saveCart = (updatedCart) => {
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};

export const productReducer = (state, action) => {
  switch (action.type) {
    case "SORT_BY_PRICE":
      return { ...state, byPrice: action.payload };
    case "FILTER_BY_STOCK":
      return { ...state, byStock: !state.byStock };
    case "FILTER_BY_DELIVERY":
      return { ...state, byFastDelivery: !state.byFastDelivery };
    case "FILTER_BY_RATING":
      return { ...state, byRating: action.payload };
    case "FILTER_BY_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "CLEAR_FILTERS":
      return {
        ...state,
        byPrice: undefined,
        byStock: false,
        byFastDelivery: false,
        byRating: 0,
      };
    default:
      return state;
  }
};
