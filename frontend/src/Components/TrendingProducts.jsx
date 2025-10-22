import React from 'react';
import { Link } from 'react-router-dom';

const TrendingProducts = ({ products, addToCart }) => {
  const trendingProducts = products.filter(product => product.trending);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Trending Now</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore what everyone's talking about
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <div
              key={product._id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 group"
            >
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    TRENDING
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition duration-300 line-clamp-1">
                  {product.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                // ... in the product card section
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">
                    ₹{product.price}
                  </span>
                  <div className="flex space-x-2">
                    <Link 
                      to={`/product/${product._id}`}
                      className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition duration-300"
                    >
                      View
                    </Link>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:from-orange-500 hover:to-pink-600 transition duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {trendingProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No trending products available.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingProducts;