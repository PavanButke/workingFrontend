import {
    ORDER_CREATE_FAIL,
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_DETAILS_SUCCESS,
    ORDER_LIST_MY_FAIL,
    ORDER_LIST_MY_REQUEST,
    ORDER_PAY_FAIL,
    ORDER_PAY_REQUEST,

  } from "../Constants/OrderConstants.js";
  import axios from "axios";

  import { logout } from "./userActions.js";
  import { CART_CLEAR_ITEMS } from './../Constants/CartConstant.js';
import { ORDER_DETAILS_REQUEST, ORDER_DETAILS_FAIL, ORDER_PAY_SUCCESS, ORDER_LIST_MY_SUCCESS } from './../Constants/OrderConstants';

  // CREATE ORDER
  export const createOrder = (order) => async (dispatch, getState) => {
    console.log("Create Order Action Called", order);
    try {
      dispatch({ type: ORDER_CREATE_REQUEST });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const updatedOrder = {
        ...order,
        user: userInfo._id, // include the user id in the order object
      };
  
      const { data } = await axios.post(`http://localhost:5000/api/orders`, updatedOrder, config);
      dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
      dispatch({ type: CART_CLEAR_ITEMS, payload: data });
  
      localStorage.removeItem("cartItems");
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch({
        type: ORDER_CREATE_FAIL,
        payload: message,
      });
    }
  };
  
  

// ORDER DETAILS
export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, config);
    console.log("Object data we are getting",data);
    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: message,
    });
  }
};

// ORDER PAY
export const payOrder = (orderId, paymentResult) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_PAY_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const updatedPaymentResult = {
      ...paymentResult,
      userId: userInfo._id,
    };

    console.log(userInfo)
    const { data } = await axios.put(
      `http://localhost:5000/api/orders/${orderId}/pay`,
      updatedPaymentResult,
      config
    );
    dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: ORDER_PAY_FAIL,
      payload: message,
    });
  }
};


  
  // USER ORDERS
  export const listMyOrders = () => async (dispatch, getState) => {
    try {
       dispatch({ type: ORDER_LIST_MY_REQUEST });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const { data } = await axios.get(`http://localhost:5000/api/orders/`, config);
       dispatch({ type: ORDER_LIST_MY_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch({
        type: ORDER_LIST_MY_FAIL,
        payload: message,
      });
    }
  };