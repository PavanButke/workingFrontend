import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "./../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, payOrder } from "../Redux/Actions/OrderActions";
import Loading from "./../components/LoadingError/Loading";
import Message from "./../components/LoadingError/Error";
import moment from "moment";
import axios from "axios";
import { ORDER_PAY_RESET } from "../Redux/Constants/OrderConstants";

const OrderScreen = () => {
  window.scrollTo(0, 0);
  const [loadingN, setLoadingN] = useState(false);
  const [orderAmount, setOrderAmount] = useState(0);
  const { id } = useParams();
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!order || successPay) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(id));
    } else {
      // Extract the order amount from the order object and update the orderAmount state
      if (order && order.itemsPrice) {
        setOrderAmount(order.itemsPrice);
      }
    }
  }, [dispatch, id, successPay, order]);

  function loadRazorpay(event, order) {
    event.preventDefault(); // prevent the default behavior of the button click
    console.log("Order----?", order);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onerror = () => {
      alert('Razorpay SDK failed to load. Are you online?');
    };
    script.onload = async () => {
      try {
        setLoadingN(true);
        const result = await axios.post('http://localhost:5000/create-order', {
          amount: (order.totalPrice * 100).toString(), // convert amount to paise and then to string
        });
        console.log(order.totalPrice);
        const { amount, id: order_id, currency } = result.data;
        const {
          data: { key: razorpayKey },
        } = await axios.get('http://localhost:5000/get-razorpay-key');
  
        const options = {
          key: razorpayKey,
          amount: amount.toString(), // convert amount to string
          currency: currency,
          name: 'example name',
          description: 'example transaction',
          order_id: order_id,
          handler: async function (response) {
            console.log("userId", userInfo._id)
            const payload = {
              shippingAddress: order.shippingAddress,
              itemsPrice: order.itemsPrice,
              shippingPrice: order.shippingPrice,
              totalPrice: order.totalPrice,
              amount: (order.itemsPrice * 100).toString(), // convert amount to paise and then to string
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              userId: userInfo._id,
            };
            
            const result = await axios.post('http://localhost:5000/pay-order', payload);
            console.log(result.data)
            alert(result.data.message);
            // fetchOrders();
          },
          prefill: {
            name: 'example name',
            email: 'email@example.com',
            contact: '111111',
          },
          notes: {
            address: 'example address',
          },
          theme: {
            color: '#80c0f0',
          },
        };
  
        setLoadingN(false);
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        alert(err);
        setLoadingN(false);
      }
    };
    document.body.appendChild(script);
  }

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(id, paymentResult));
  };

  return (
    <>
      <Header />
      <div className="container">
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger">{error}</Message>
        ) : (
          <>
            {/* Order details */}
            {/* Payment button */}
            <button disabled={loading} onClick={(event) => loadRazorpay(event, order)}>
              Pay with Razorpay
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default OrderScreen;
