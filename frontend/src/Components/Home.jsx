import React from 'react';
import Hero from './Hero';
import ProductCarousel from './ProductCarousel';
import NewCollections from './NewCollection';
import TrendingProducts from './TrendingProducts';

const Home = ({ products, addToCart }) => {
  const featuredProducts = products.filter(product => product.featured);
  const trendingProducts = products.filter(product => product.trending);

  return (
    <div className="min-h-screen">
      <Hero />
      
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <ProductCarousel 
              products={featuredProducts} 
              title="Featured Products"
            />
          </div>
        </section>
      )}

      <NewCollections products={products} addToCart={addToCart} />
      <TrendingProducts products={products} addToCart={addToCart} />

      <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-xl opacity-90">Find exactly what you're looking for</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Electronics', 'Fashion', 'Home', 'Accessories'].map((category) => (
              <div
                key={category}
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-opacity-20 transition duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className="text-3xl mb-3">📱</div>
                {/* <div className="text-3xl mb-3">{category}</div> */}
                <h3 className="text-xl font-semibold text-blue-600">{category}</h3>
                <p className=" text-blue-400 text-opacity-80 mt-2">Explore products</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;