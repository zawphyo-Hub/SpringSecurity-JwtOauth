import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import SignIn from "./pages/SignIn/SignIn";
import OAuthSuccessHandler from "./component/OAuthSuccessHandler";
import SignUp from "./pages/SignUp/SignUp";
import QrCode from "./pages/2FA/QrCode";
import TotpLogin from "./pages/2FA/TotpLogin";
import 'bootstrap/dist/css/bootstrap.min.css';


function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ["/qrcode", "/totplogin"];

  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      <ToastContainer position="top-center" />
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        <Route path="/oauthsuccess" element={<OAuthSuccessHandler />} />
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/qrcode" element={<QrCode />} />
        <Route path="/totplogin" element={<TotpLogin />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
