import { Routes, Route } from "react-router-dom";
import Header from "./components/header/header.jsx";
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx"
import Feedback from "./pages/Feedback.jsx"

export default function App() {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />}/>
        <Route path="/feedback" element={<Feedback/>}/>
      </Routes>
    </div>
  );
}
