import { Routes, Route } from "react-router-dom";
import Header from "./components/header/header.jsx";
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx"
import Products from './pages/Products.jsx'
import Faq from './pages/Faq.jsx'

export default function App() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/get-a-machine" element={<Contact />} />
        <Route path="/about-us" element={<About />}/>
        <Route path="/faq" element={<Faq />}/>
      </Routes>
    </div>
  );
}
