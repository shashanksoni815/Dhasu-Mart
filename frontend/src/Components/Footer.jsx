import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Dhasu Mart</h3>
            <p className="text-gray-400 mb-4">
              Your one-stop shop for all your needs. Quality products, amazing prices.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Products', 'About', 'Contact'].map(link => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase()}`} className="text-gray-400 hover:text-white transition duration-300">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {['Help Center', 'Returns', 'Shipping Info', 'Size Guide'].map(service => (
                <li key={service}>
                  <button className="text-gray-400 hover:text-white transition duration-300">
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-gray-400">
              <p>📧 dhasumart@gmail.com</p>
              <p>📞 +91-8839080214</p>
              <p>📍 Airport Road</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Dhasu Mart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;