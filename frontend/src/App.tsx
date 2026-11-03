import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Book from "./pages/Book";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

export default function App() {
  return <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/book" element={<Book/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/admin" element={<Admin/>}/>
    <Route path="*" element={<Home/>}/>
  </Routes>;
}
