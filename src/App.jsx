import { Routes, Route } from 'react-router-dom'
import AdminRoutes from './routes/AdminRoutes'

import Home from './pages/customer/Home'
import Products from './pages/customer/Products'
import Categories from './pages/customer/Categories'
import ProductDetails from './pages/customer/ProductDetails'
import Cart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import Login from './pages/customer/Login'
import Register from './pages/customer/Register'
import Account from './pages/customer/Account'
import OrderDetails from './pages/customer/OrderDetails'
import OrderSuccess from './pages/customer/OrderSuccess'
import Wishlist from './pages/customer/Wishlist'
import SearchResults from './pages/customer/SearchResults'
import Contact from './pages/customer/Contact'
import About from './pages/customer/About'
import Shipping from './pages/customer/Shipping'
import Returns from './pages/customer/Returns'
import Privacy from './pages/customer/Privacy'
import Terms from './pages/customer/Terms'

function App() {
  return (
    <>
      <Routes>

        {/* CUSTOMER */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/categories"
          element={<Categories />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/order-success/:id"
          element={<OrderSuccess />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/account"
          element={<Account />}
        />

        <Route
          path="/account/orders/:id"
          element={<OrderDetails />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/search"
          element={<SearchResults />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/shipping"
          element={<Shipping />}
        />

        <Route
          path="/returns"
          element={<Returns />}
        />

        <Route
          path="/privacy"
          element={<Privacy />}
        />

        <Route
          path="/terms"
          element={<Terms />}
        />

      </Routes>

      {/* ADMIN */}

      <AdminRoutes />

    </>
  )
}

export default App