import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';


const Cart = ({ cart, updateQuantity, removeFromCart, clearCart, totalAmount }) => {
  const { user } = useAuth();

  // Image URL helper function
  const getImageUrl = (image) => {
    if (!image) {
      return 'https://via.placeholder.com/100x100/6366F1/FFFFFF?text=No+Image';
    }
    
    // If it's already a full URL, use it directly
    if (image.startsWith('http')) {
      return image;
    }
    
    // If it starts with /uploads, add the server URL
    if (image.startsWith('/uploads')) {
      return `http://localhost:8080${image}`;
    }
    
    // Fallback to placeholder
    return 'https://via.placeholder.com/100x100/6366F1/FFFFFF?text=Image';
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-8">You need to be logged in to view your cart.</p>
          <Link 
            to="/login" 
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some products to your cart!</p>
          <Link 
            to="/products" 
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Your Shopping Cart</h2>
        <button
          onClick={clearCart}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Clear Cart
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {cart.items.map((item) => {
              const product = item.product;
              const imageUrl = getImageUrl(product?.image);
              
              return (
                <div key={item._id || product?._id} className="flex items-center justify-between border-b border-gray-200 py-6 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={imageUrl}
                        alt={product?.name}
                        className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100/EF4444/FFFFFF?text=Image+Error';
                          e.target.className = 'w-20 h-20 object-contain bg-gray-100 p-2 rounded-lg';
                        }}
                      />
                      {/* <span className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {item.quantity}
                      </span> */}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{product?.name}</h3>
                      <p className="text-gray-600">₹{product?.price}</p>
                      <p className="text-sm text-gray-500">{product?.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(product?._id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition duration-300"
                      >
                        -
                      </button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product?._id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition duration-300"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-lg font-semibold w-20 text-right">
                      ₹{((product?.price || 0) * item.quantity).toFixed(2)}
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(product?._id)}
                      className="text-red-600 hover:text-red-800 transition duration-300 p-2"
                      title="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h3 className="text-xl font-bold mb-6">Order Summary</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span>Items ({cart.items.reduce((total, item) => total + item.quantity, 0)})</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{totalAmount > 50 ? 'Free' : '₹9.99'}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{(totalAmount * 0.1).toFixed(2)}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>
                  ₹{(totalAmount + (totalAmount > 50 ? 0 : 9.99) + (totalAmount * 0.1)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 mb-4">
            Proceed to Checkout
          </button>
          
          <Link 
            to="/products" 
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition duration-300 text-center block"
          >
            Continue Shopping
          </Link>

          {/* Security Features */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

