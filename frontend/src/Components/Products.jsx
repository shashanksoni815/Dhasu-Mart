import React from 'react';
import ProductList from './ProductList';

const Products = ({ products, addToCart }) => {
  return <ProductList products={products} addToCart={addToCart} />;
};

export default Products;