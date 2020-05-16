import React, { Component } from "react";
import "./App.css";
import Header from "./Components/Header/Header.js";
import ProductList from "./Components/ProductList/ProductList";
import SearchResult from "./Components/SearchResult/SearchResult";
import { Switch, Route } from "react-router-dom";
import Menu from "./Components/Menu/Menu";
import CartDialog from "./Components/CartDialog/CartDialog";
import Details from "./Components/Details/Details";
import Order from "./Components/Order/Order";
import Login from "./Components/Login/Login";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Footer from "./Components/Footer/Footer";
import RegisterStep1 from "./Components/Register/Step1";
import RegisterStep2 from "./Components/Register/Step2";

class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          {/* <Menu /> */}
          <div className="content">
            <CartDialog />
            <Switch>
              <Route path="/" exact component={ProductList} />
              <Route path="/search" exact component={SearchResult} />
              <Route path="/details/:id" component={Details} />
              <Route path="/login" component={Login} />
              <Route path="/register_step1" component={RegisterStep1} />
              <Route path="/register_step2" component={RegisterStep2} />
              <ProtectedRoute path="/order" component={Order} />
              <Route
                component={() => (
                  <div style={{ padding: 20 }}>Page not found</div>
                )}
              />
            </Switch>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }
}

export default App;
