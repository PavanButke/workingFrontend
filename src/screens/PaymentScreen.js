import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../Redux/Actions/CartActions.js";
import Header from "./../components/Header";
import { useNavigate } from "react-router-dom";

const PaymentScreen = () => {
  window.scrollTo(0, 0);

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const navigate = useNavigate();

  if (!shippingAddress) {
    navigate("/shipping");
  }

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };
  return (
    <>
      <Header />
      <div className="container d-flex justify-content-center align-items-center login-center">
        <form
          className="Login2 col-md-8 col-lg-4 col-11"
          onSubmit={submitHandler}
        >
          <h6>SELECT PAYMENT METHOD</h6>
          <div className="payment-container">
            <div className="radio-container">
              <input
                className="form-check-input"
                type="radio"
                id="PayPal"
                value="PayPal"
                name="paymentMethod"
                checked={paymentMethod === "PayPal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label" htmlFor="PayPal">
                PayPal or Credit Card
              </label>
            </div>
          </div>

          <button type="submit">Continue</button>
        </form>
      </div>
    </>
  );
};

export default PaymentScreen;
