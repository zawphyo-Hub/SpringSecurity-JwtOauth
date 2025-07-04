import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

function QrCode() {
  const location = useLocation();
  const navigate = useNavigate();
  const { qrCode, email} = location.state || {};

  const [code, setCode] = useState('');

  const handleVerify = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/v1/auth/verify", {
        email,
        code,
      });

      if (res.data.token) {
        toast.success("2FA verification successful!");
        localStorage.setItem("token", res.data.token); // ✅ store it
        console.log("JWTToken:", res.data.token);   
        navigate("/home");
      } else {
        toast.error("Invalid code.");
      }
    } catch (err) {
      toast.error("Error in 2FA!!");
      console.error(err.response?.data || err.message);
    }
  };

  if (!qrCode || !email) {
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>
        Invalid navigation. Please register first.
      </Typography>
    );
  }

  return (
    <Box 
    
    sx={
        {
        textAlign: 'center', 
        maxWidth: 400,
        margin: "0 auto",
        mt: 3,
        p:1,
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 3}
        }
    >
      <Typography variant="h5">Scan this QR Code in your Authenticator App.</Typography>
      <img src={qrCode} alt="2FA QR Code" style={{ marginTop: 20, width: 200, height: 200 }} />
      <Typography sx={{ mt: 3 }}>
        Then enter the from your google Authenticator.
      </Typography>
      <TextField
        label="6-digit code"
        variant="outlined"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleVerify}>
          Verify Code
        </Button>
      </Box>
    </Box>
  );
}

export default QrCode;
