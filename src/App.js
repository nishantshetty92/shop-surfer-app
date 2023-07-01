import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Confirmation from "./components/Confirmation";
import Login from "./components/Login";
import Register from "./components/Register";
import Missing from "./components/Missing";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import VerifyUser from "./components/VerifyUser";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";

function App() {
  const oAuthClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={oAuthClientId}>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify" element={<VerifyUser />} />

          <Route element={<RequireAuth />}>
            <Route path="checkout" element={<Checkout />} />
          </Route>
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

const MainLayout = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Routes>
          <Route element={<PersistLogin />}>
            <Route path="/" element={<Home />} exact />
            <Route path="products" element={<Products />} />
            <Route path="cart" element={<Cart />} />

            <Route element={<RequireAuth />}>
              <Route path="confirmation" element={<Confirmation />} />
            </Route>

            <Route path="*" element={<Missing />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
