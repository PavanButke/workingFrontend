import React from "react";
import "./App.css";
import "./responsive.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import SingleProduct from "./screens/SingleProduct";
import Login from "./screens/Login";
import Register from "./screens/Register";
import CartScreen from "./screens/CartScreen";
import ShippingScreen from "./screens/ShippingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import NotFound from "./screens/NotFound";
import PrivateRouter from "./PrivateRouter";
import PayScreen from "./screens/PayScreen";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} exact />
        <Route path="/search/:keyword" element={<HomeScreen />} exact />
        <Route path="/page/:pagenumber" element={<HomeScreen />} exact />
        <Route
          path="/search/:keyword/page/:pagenumber"
          element={<HomeScreen />}
          exact
        />
        <Route path="/products/:id" element={<SingleProduct />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <PrivateRouter>
              <ProfileScreen />
            </PrivateRouter>
          }
        />
        <Route
          path="/cart/:id?"
          element={
            <PrivateRouter>
              <CartScreen />
            </PrivateRouter>
          }
        />

        <Route
          path="/shipping"
          element={
            <PrivateRouter>
              <ShippingScreen />
            </PrivateRouter>
          }
        />
        <Route
          path="/payment"
          element={
            <PrivateRouter>
              <PaymentScreen />
            </PrivateRouter>
          }
        />
        <Route
          path="/placeorder"
          element={
            <PrivateRouter>
              <PlaceOrderScreen />
            </PrivateRouter>
          }
        />
        <Route
          path="/order/:id"
          element={
            <PrivateRouter>
              <OrderScreen />
            </PrivateRouter>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
