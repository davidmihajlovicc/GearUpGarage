import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';     
import Home from './pages/Home';
import PartsPage from './pages/PartsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import PartDetails from './pages/PartDetails';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Admin from './pages/Admin';
import { useEffect } from 'react';
import Footer from './components/Footer';
import About from './pages/About';

export default function App() {
  return (
    <div className="app">         
     

      <main className="app__main">
          <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parts" element={<PartsPage />} />
          <Route path="/parts/:id" element={<PartDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} /> 
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <Footer />                  
    </div>

  );
}
