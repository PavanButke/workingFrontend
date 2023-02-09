import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./../components/Header";
import { PayPalButton } from "react-paypal-button-v2";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, payOrder } from "../Redux/Actions/OrderActions";
import Loading from "./../components/LoadingError/Loading";
import Message from "./../components/LoadingError/Error";
import moment from "moment";
import axios from "axios";
import { ORDER_PAY_RESET } from "../Redux/Constants/OrderConstants";
// import Razorpay from 'razorpay'





// function loadScript(src) {
// 	return new Promise((resolve) => {
// 		const script = document.createElement('script')
// 		script.src = src
// 		script.onload = () => {
// 			resolve(true)
// 		}
// 		script.onerror = () => {
// 			resolve(false)
// 		}
// 		document.body.appendChild(script)
// 	})
// }



const OrderScreen = ({ match }) => {
  window.scrollTo(0, 0);
  const [sdkReady, setSdkReady] = useState(false);
  const orderId = match.params.id;
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  const [loadingN, setLoadingN] = useState(false);
  const [orderAmount, setOrderAmount] = useState(0);
  const [orders, setOrders] = useState([]);

  async function fetchOrders() {
	const { data } = await axios.get('https://murtikar.vercel.app/list-orders');
	setOrders(data);
  }
  useEffect(() => {
	fetchOrders();
  }, []);

  function loadRazorpay() {
	const script = document.createElement('script');
	script.src = 'https://checkout.razorpay.com/v1/checkout.js';
	script.onerror = () => {
	  alert('Razorpay SDK failed to load. Are you online?');
	};
	script.onload = async () => {
	  try {
		setLoadingN(true);
		const result = await axios.post('https://murtikar.vercel.app/create-order', {
		  amount: orderAmount + '00',
		});
		console.log(orderAmount);
		const { amount, id: order_id, currency } = result.data;
		const {
		  data: { key: razorpayKey },
		} = await axios.get('https://murtikar.vercel.app/get-razorpay-key');

		const options = {
		  key: razorpayKey,
		  amount: amount.toString(),
		  currency: currency,
		  name: 'example name',
		  description: 'example transaction',
		  order_id: order_id,
		  handler: async function (response) {
			const result = await axios.post('https://murtikar.vercel.app/pay-order', {
			  amount: amount,
			  razorpayPaymentId: response.razorpay_payment_id,
			  razorpayOrderId: response.razorpay_order_id,
			  razorpaySignature: response.razorpay_signature,
			});
			alert(result.data.msg);
			fetchOrders();
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


  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("https://murtikar.vercel.app/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (!order || successPay) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, orderId, successPay, order]);





//   async function displayRazorpay() {

//     const res = await loadScript(' https://checkout.razorpay.com/v1/checkout.js')
//     if (!res) {
//       alert('Razorpay SDK failed to load. Are you online?')
//       return
//     }


//     const data = await fetch('http://localhost:5000/api/razorpay', { method: 'POST' }).then((t) =>
// 			t.json()
// 		)

//     console.log(data)

    
//     const options = {
//       currency: data.currency,
// 			// amount: data.amount,
// 			order_id: data.id,
//       description: "Test Transaction",
//       // image: "https://localhost300/razorpay",
//       order_id: "order_EnbxdHZGSA9RFy", // This is a sample Order ID. Pass the `id` obtained in
      
//       handler: function (response) {
//         alert(response.razorpay_payment_id);
//         alert(response.razorpay_order_id);
//         alert(response.razorpay_signature)
//       },
//       prefill: {
//         name: userLogin.name,
//       },

//     };
//     const paymentObject = new window.Razorpay(options)
//     paymentObject.open();
//   }



 const successPaymentHandler = (paymentResult) => {
 dispatch(payOrder(orderId, paymentResult));
   
  };

  return (
    <>
      <Header />
      <div className="container">

        {/* <button

        //  amount={order.totalPrice}
          onClick={displayRazorpay}
          onSuccess={successPaymentHandler}
        /> */}
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="alert-danger">{error}</Message>
        ) : (
          <>
            <div className="row  order-detail">
              <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                <div className="row">
                  <div className="col-md-4 center">
                    <div className="alert-success order-box">
                      <i className="fas fa-user"></i>
                    </div>
                  </div>
                  <div className="col-md-8 center">
                    <h5>
                      <strong>Customer</strong>
                    </h5>
                    <p>{userLogin.name}</p>
                    <p>
                      <a href={`mailto:${userLogin.email}`}>
                        {userLogin.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              {/* 2 */}
              <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                <div className="row">
                  <div className="col-md-4 center">
                    <div className="alert-success order-box">
                      <i className="fas fa-truck-moving"></i>
                    </div>
                  </div>
                  <div className="col-md-8 center">
                    <h5>
                      <strong>Order info</strong>
                    </h5>
                    <p>Shipping: {order.shippingAddress.country}</p>
                    <p>Pay method: {order.paymentMethod}</p>
                    {order.isPaid ? (
                      <div className="bg-info p-2 col-12">
                        <p className="text-white text-center text-sm-start">
                          Paid on {moment(order.paidAt).calendar()}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-danger p-2 col-12">
                        <p className="text-white text-center text-sm-start">
                          Not Paid
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* 3 */}
              <div className="col-lg-4 col-sm-4 mb-lg-4 mb-5 mb-sm-0">
                <div className="row">
                  <div className="col-md-4 center">
                    <div className="alert-success order-box">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                  </div>
                  <div className="col-md-8 center">
                    <h5>
                      <strong>Deliver to</strong>
                    </h5>
                    <p>
                      Address: {order.shippingAddress.city},{" "}
                      {order.shippingAddress.address},{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    {order.isDelivered ? (
                      <div className="bg-info p-2 col-12">
                        <p className="text-white text-center text-sm-start">
                          Delivered on {moment(order.deliveredAt).calendar()}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-danger p-2 col-12">
                        <p className="text-white text-center text-sm-start">
                          Not Delivered
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row order-products justify-content-between">
              <div className="col-lg-8">
                {order.orderItems.length === 0 ? (
                  <Message variant="alert-info mt-5">
                    Your order is empty
                  </Message>
                ) : (
                  <>
                    {order.orderItems.map((item, index) => (
                      <div className="order-product row" key={index}>
                        <div className="col-md-3 col-6">
                          {console.log(item, "my v")}
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="col-md-5 col-6 d-flex align-items-center">
                          <Link to={`/products/${item.product}`}>
                            <h6>{item.name}</h6>
                          </Link>
                        </div>
                        <div className="mt-3 mt-md-0 col-md-2 col-6  d-flex align-items-center flex-column justify-content-center ">
                          <h4>QUANTITY</h4>
                          <h6>{item.qty}</h6>
                        </div>
                        <div className="mt-3 mt-md-0 col-md-2 col-6 align-items-end  d-flex flex-column justify-content-center ">
                          <h4>SUBTOTAL</h4>
                          <h6>Rs. {item.qty * item.price}/-</h6>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
              {/* total */}
              <div className="col-lg-3 d-flex align-items-end flex-column mt-5 subtotal-order">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Products</strong>
                      </td>
                      <td>Rs. {order.itemsPrice}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Shipping</strong>
                      </td>
                      <td>Rs. {order.shippingPrice}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Tax</strong>
                      </td>
                      <td>Rs. {order.taxPrice}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Total</strong>
                      </td>
                      <td>Rs. {order.amount}</td>
                    </tr>
                  </tbody>
                </table>
                {!order.isPaid && (
                  <div className="col-12">
                    {loadingPay && <Loading />}
                    {!sdkReady ? (
                      <Loading />
                    ) : (
                    //   <PayPalButton
                    //     amount={order.totalPrice}
                    //
                    //   />
                    
               		 <button     onSuccess={successPaymentHandler} disabled={loading} onClick={loadRazorpay}>
					            Razorpay
				           </button> 

                    )}
                  </div>
                )}

		<label>
            Amount:{' '}
            <input
              placeholder="INR"
              type="number"
              value={orderAmount}
              onChange={(e) => setOrderAmount(e.target.value)}
            ></input>
          </label>
  
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OrderScreen;




// function loadScript(src) {
// 	return new Promise((resolve) => {
// 		const script = document.createElement('script')
// 		script.src = src
// 		script.onload = () => {
// 			resolve(true)
// 		}
// 		script.onerror = () => {
// 			resolve(false)
// 		}
// 		document.body.appendChild(script)
// 	})
// }

// const __DEV__ = document.domain === 'localhost'

// function OrderScreen() {
// 	const [name, setName] = useState('Mehul')

// 	async function displayRazorpay() {
// 		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

// 		if (!res) {
// 			alert('Razorpay SDK failed to load. Are you online?')
// 			return
// 		}

// 		const data = await fetch('http://localhost:5000/api/razorpay', { method: 'POST' }).then((t) =>
// 			t.json()
// 		)

// 		console.log(data)

// 		const options = {
// 			key: __DEV__ ? 'rzp_test_ubHSpA7szM4jBT' : 'PRODUCTION_KEY',
// 			currency: data.currency,
// 			amount: 500,
// 			order_id: data.id,
// 			name: 'Donation',
// 			description: 'Thank you for nothing. Please give us some money',
// 			image: '',
// 			handler: function (response) {
// 				alert(response.razorpay_payment_id)
// 				alert(response.razorpay_order_id)
// 				alert(response.razorpay_signature)
// 			},
// 			prefill: {
// 				name,
// 				email: 'sdfdsjfh2@ndsfdf.com',
// 				phone_number: '9899999999'
// 			}
// 		}
// 		const paymentObject = new window.Razorpay(options)
// 		paymentObject.open()
// 	}

// 	return (
// 		<div className="App">
// 			<header className="App-header">
				
// 				<p>
// 					Edit <code>src/App.js</code> and save to reload.
// 				</p>
// 				<a
// 					className="App-link"
// 					onClick={displayRazorpay}
// 					target="_blank"
// 					rel="noopener noreferrer"
// 				>
// 					Donate $5
// 				</a>
// 			</header>
// 		</div>
// 	)
// }

// export default OrderScreen;