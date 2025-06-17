// src/components/ProductList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const productsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('https://fakestoreapi.com/products');
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = products.filter(product => product.title.toLowerCase().includes(value.toLowerCase()));
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleProductClick = (product) => setSelectedProduct(product);
  const handleClose = () => setSelectedProduct(null);

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">All Products</h1>
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={handleSearch}
      />
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="row">
          {currentProducts.map(product => (
            <div key={product.id} className="col-md-3 mb-4">
              <div className="card h-100" onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                <img src={product.image} alt={product.title} className="card-img-top p-3" style={{ height: '200px', objectFit: 'contain' }} />
                <div className="card-body">
                  <h5 className="card-title">{product.title.slice(0, 40)}</h5>
                  <p className="card-text">${product.price}</p>
                  <p className="card-text"><small>{product.category}</small></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-center">
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for product detail */}
      {selectedProduct && (
        <Modal show={true} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column flex-md-row gap-4">
          <img
            src={selectedProduct?.image}
            alt={selectedProduct?.title}
            style={{ width: "100%", maxWidth: "300px", objectFit: "contain" }}
          />
          <div>
            <p><strong>Description:</strong> {selectedProduct?.description}</p>
            <p><strong>Brand:</strong> {selectedProduct?.brand}</p>
            <p><strong>Model:</strong> {selectedProduct?.model}</p>
            <p><strong>Category:</strong> {selectedProduct?.category}</p>
            <h5 className="text-danger">Price: ${selectedProduct?.price}</h5>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
      )}
    </div>
  );
};

export default ProductList;