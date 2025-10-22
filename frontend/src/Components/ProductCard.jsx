import React from 'react';
import { Link } from 'react-router-dom';
// import DebugImageInfo from '../DebugImageInfo'; // Temporary


const ProductCard = ({ product, addToCart }) => {
  // ✅ Universal Image URL logic (same as in your working cards)
  const getImageUrl = (image) => {
    if (!image) {
      return 'https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=No+Image';
    }

    // Full URL
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }

    // Normalize upload path
    if (image.startsWith('uploads')) {
      image = '/' + image;
    }

    if (image.startsWith('/uploads')) {
      return `http://localhost:8080${image}`;
    }

    // Otherwise assume it's just a filename
    return `http://localhost:8080/uploads/${image}`;
  };

  const imageUrl = getImageUrl(product.image);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
          onError={(e) => {
            console.error('❌ Image failed:', imageUrl);
            e.target.src =
              'https://via.placeholder.com/300x300/EF4444/FFFFFF?text=No+Image';
          }}
        />

        {/* Status Badges */}
        {/* <div className="absolute top-4 right-4 flex flex-col space-y-2">
          {product.featured && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
              FEATURED
            </span>
          )}
          {product.trending && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
              TRENDING
            </span>
          )}
          {product.createdAt &&
            new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                NEW
              </span>
            )}
        </div> */}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title + Price */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition duration-300 line-clamp-1">
            {product.name}
          </h3>
          <span className="text-2xl font-bold text-indigo-600">
            ₹{product.price}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

        {/* Stock + Buttons */}
        <div className="flex justify-between items-center">
          <span
            className={`text-sm font-medium ${
              product.stock > 10
                ? 'text-green-600'
                : product.stock > 0
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            {product.stock > 10
              ? 'In Stock'
              : product.stock > 0
              ? 'Low Stock'
              : 'Out of Stock'}
          </span>

          <div className="flex space-x-2">
            {/* View Details */}
            <Link
              to={`/product/${product._id}`}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300"
            >
              View Details
            </Link>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className={`px-4 py-2 rounded-lg font-semibold transition duration-300 transform hover:scale-105 ${
                product.stock === 0
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {product.stock === 0 ? 'Out' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;




// const ProductCard = ({ product, addToCart }) => {
//   console.log('🔄 ProductCard Rendering:', product.name);
//   console.log('📸 Image URL:', product.image);

//   // Simple direct image URL function
//   const getImageUrl = () => {
//     // If it's already a full URL, use it directly
//     if (product.image?.startsWith('http')) {
//       return product.image;
//     }
    
//     // If it starts with /uploads, add the server URL
//     if (product.image?.startsWith('/uploads')) {
//       return `http://localhost:8080${product.image}`;
//     }
    
//     // If it's just a filename, construct the URL
//     if (product.image && !product.image.includes('/')) {
//       return `http://localhost:8080/uploads/${product.image}`;
//     }
    
//     // Fallback to placeholder
//     return 'https://via.placeholder.com/300x300/6366F1/FFFFFF?text=No+Image+Found';
//   };

//   const imageUrl = getImageUrl();
//   console.log('🎯 Final Image URL:', imageUrl);

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group relative">
//       {/* Temporary debug info - remove after fixing */}
//       {/* <DebugImageInfo product={product} /> */}
      
//       <Link to={`/product/${product._id}`} className="block">
//         <div className="relative overflow-hidden bg-gray-100 h-64">
//           {/* Test with a known working image first */}
//           <img
//             src={imageUrl}
//             alt={product.name}
//             className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
//             onLoad={() => console.log('✅ Image loaded successfully:', imageUrl)}
//             onError={(e) => {
//               console.error('❌ Image failed to load:', imageUrl);
//               console.error('🔄 Trying fallback image...');
//               // Try multiple fallbacks
//               e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop';
              
//               // If that fails too, use placeholder
//               e.target.onerror = () => {
//                 e.target.src = 'https://via.placeholder.com/300x300/EF4444/FFFFFF?text=Image+Error';
//                 e.target.className = 'w-full h-full object-contain bg-gray-200 p-4';
//               };
//             }}
//           />
          
//           {/* Badges */}
//           <div className="absolute top-3 right-3 flex flex-col space-y-2">
//             {product.featured && (
//               <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
//                 Featured
//               </span>
//             )}
//             {product.trending && (
//               <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
//                 Trending
//               </span>
//             )}
//           </div>
          
//           {/* Hover overlay */}
//           <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-300" />
//         </div>
//       </Link>

//       <div className="p-6">
//         <Link to={`/product/${product._id}`} className="block hover:no-underline">
//           <div className="flex justify-between items-start mb-3">
//             <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition duration-300 line-clamp-1">
//               {product.name}
//             </h3>
//             <span className="text-xl font-bold text-indigo-600">
//               ${product.price}
//             </span>
//           </div>
          
//           <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//             {product.description}
//           </p>
//         </Link>

//         <div className="flex justify-between items-center mb-3">
//           <span className={`text-sm font-medium px-2 py-1 rounded ${
//             product.stock > 10 
//               ? 'bg-green-100 text-green-800' 
//               : product.stock > 0 
//               ? 'bg-yellow-100 text-yellow-800' 
//               : 'bg-red-100 text-red-800'
//           }`}>
//             {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
//           </span>
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               addToCart(product);
//             }}
//             disabled={product.stock === 0}
//             className={`px-4 py-2 rounded-lg font-semibold transition duration-300 transform hover:scale-105 ${
//               product.stock === 0
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-indigo-600 text-white hover:bg-indigo-700'
//             }`}
//           >
//             {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
//           </button>
//         </div>

//         <Link 
//           to={`/product/${product._id}`}
//           className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition duration-300 text-center block"
//         >
//           View Details
//         </Link>
//       </div>
//     </div>
//   );
// };
// export default ProductCard;







// const ProductCard = ({ product, addToCart }) => {
//   // Debug: Log product data to see what's coming from backend
//   console.log('ProductCard - Product data:', product);

//   // Enhanced image URL helper with better debugging
//   const getImageUrl = (image) => {
//     console.log('Original image URL:', image);
    
//     if (!image) {
//       console.log('No image provided, using placeholder');
//       return 'https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=No+Image';
//     }
    
//     // If it's already a full URL (http or https), use it directly
//     if (image.startsWith('http://') || image.startsWith('https://')) {
//       console.log('Using full HTTP URL');
//       return image;
//     }
    
//     // If it's a local upload path, construct full URL
//     if (image.startsWith('/uploads')) {
//       const fullUrl = `http://localhost:8080${image}`;
//       console.log('Constructed upload URL:', fullUrl);
//       return fullUrl;
//     }
    
//     // If it's just a filename, assume it's in uploads
//     if (!image.includes('/')) {
//       const fullUrl = `http://localhost:8080/uploads/${image}`;
//       console.log('Constructed filename URL:', fullUrl);
//       return fullUrl;
//     }
    
//     console.log('Using original image as fallback');
//     return image;
//   };

//   const imageUrl = getImageUrl(product.image);

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
//       <Link to={`/product/${product._id}`} className="block">
//         <div className="relative overflow-hidden bg-gray-100">
//           <img
//             src={imageUrl}
//             alt={product.name}
//             className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
//             onLoad={() => console.log('Image loaded successfully:', imageUrl)}
//             onError={(e) => {
//               console.error('Image failed to load:', imageUrl);
//               e.target.src = 'https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=Image+Error';
//               e.target.className = 'w-full h-64 object-contain bg-gray-100 p-4';
//             }}
//             onLoadStart={() => console.log('Image loading started:', imageUrl)}
//           />
//           <div className="absolute top-3 right-3 flex flex-col space-y-2">
//             {product.featured && (
//               <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
//                 Featured
//               </span>
//             )}
//             {product.trending && (
//               <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
//                 Trending
//               </span>
//             )}
//           </div>
//           <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-300" />
//         </div>
//       </Link>

//       <div className="p-6">
//         <Link to={`/product/${product._id}`} className="block hover:no-underline">
//           <div className="flex justify-between items-start mb-3">
//             <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition duration-300 line-clamp-1">
//               {product.name}
//             </h3>
//             <span className="text-xl font-bold text-indigo-600">
//               ${product.price}
//             </span>
//           </div>
          
//           <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//             {product.description}
//           </p>
//         </Link>

//         <div className="flex justify-between items-center mb-3">
//           <span className={`text-sm font-medium px-2 py-1 rounded ${
//             product.stock > 10 
//               ? 'bg-green-100 text-green-800' 
//               : product.stock > 0 
//               ? 'bg-yellow-100 text-yellow-800' 
//               : 'bg-red-100 text-red-800'
//           }`}>
//             {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
//           </span>
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               addToCart(product);
//             }}
//             disabled={product.stock === 0}
//             className={`px-4 py-2 rounded-lg font-semibold transition duration-300 transform hover:scale-105 ${
//               product.stock === 0
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-indigo-600 text-white hover:bg-indigo-700'
//             }`}
//           >
//             {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
//           </button>
//         </div>

//         <Link 
//           to={`/product/${product._id}`}
//           className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition duration-300 text-center block"
//         >
//           View Details
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;