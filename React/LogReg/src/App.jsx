import Login from "./pages/Login"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Register from "./pages/Register";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";

import Navbar from "./pages/Navbar";
import OAuthSuccessHandler from "./component/OAuthSuccessHandler";

function App() {

  return (
    <>
   
    <BrowserRouter>
    <ToastContainer position="top-center" />
      <Navbar />
      <Routes>
        <Route path="/oauthsuccess" element={<OAuthSuccessHandler />} />
        <Route path="/" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/home" element={<Home />}/>


      </Routes>
        
       
    </BrowserRouter>
    
         


    </>
  );
}

export default App;
