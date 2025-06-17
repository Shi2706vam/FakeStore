import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://fakestoreapi.com/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;
  if (!product) return <div className="text-center p-5">Product not found</div>;

  return (
    <div className="container py-5">
      <Link to="/" className="btn btn-secondary mb-4">← Back</Link>
      <h2>{product.title}</h2>
      <img src={product.image} alt={product.title} style={{ maxHeight: '300px' }} />
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p>{product.description}</p>
    </div>
  );
};

export default ProductDetail;