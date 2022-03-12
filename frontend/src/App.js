import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Register from "./Register.js";
import About from "./About.js";
import Login from "./Login.js";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Register />} />
        <Route exact path="about" element={<About />} />
        <Route exact path="login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
