import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import Pagination from "./pagination";
import products from "../../data/Products";
import { useDispatch, useSelector } from "react-redux";
import { listProduct } from "../../Redux/Actions/ProductActions";
import Loading from "../LoadingError/Loading.js";
import Message from "../LoadingError/Error.js";

const ShopSection = (props) => {
  const { keyword,pagenumber } = props;

  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page , pages} = productList;

  useEffect(() => {
    dispatch(listProduct(keyword,pagenumber));
  }, [dispatch,keyword , pagenumber]);
  return (
    <>
      <div className="container">
        <div className="section">
          <div className="row">
            <div className="col-lg-12 col-md-12 article">
              <div className="shopcontainer row">

                {
                  loading ?
                    (
                    <div className="mb-5"> 
                       <Loading/>
                    </div>
                  
                    ) : error ? (
                    <Message variant="alert-danger">{error}</Message>)
                      :
                      (
                        <>
                          {products.map((product) => (
                            <div
                              className="shop col-lg-4 col-md-6 col-sm-6"
                              key={product._id}
                            >
                              <div className="border-product">
                                <Link to={`/products/${product._id}`}>
                                  <div className="shopBack">
                                    <img src={product.image} alt={product.name} />
                                  </div>
                                </Link>

                                <div className="shoptext">
                                  <p>
                                    <Link to={`/products/${product._id}`}>
                                      {product.name}
                                    </Link>
                                  </p>

                                  <Rating
                                    value={product.rating}
                                    text={`${product.numReviews} reviews`}
                                  />
                                  <h3>Rs. {product.price}/- </h3>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )
                }

                {/* Pagination */}
                <Pagination pages={pages} page={page} keyword={keyword ? keyword:""} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopSection;
