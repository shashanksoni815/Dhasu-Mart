import React from 'react';
import Cart from './Cart';

const CartPage = ({ cart, updateQuantity, removeFromCart, totalAmount }) => {
  return (
    <Cart 
      cart={cart} 
      updateQuantity={updateQuantity} 
      removeFromCart={removeFromCart}
      totalAmount={totalAmount}
    />
  );
};

export default CartPage;