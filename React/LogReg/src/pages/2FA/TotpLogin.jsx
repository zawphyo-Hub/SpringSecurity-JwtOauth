import { useState } from "react";
import { TextField, Button, Typography, Box } from '@mui/material';
import { toast } from "react-toastify";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";

function TotpLogin(){
    const navigate = useNavigate();
    const location = useLocation();
    const [code, setCode] = useState("");
    const { email } = location.state || {};

    const handleDigit = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Allow only digits
        if (value.length <= 6) {
            setCode(value);
        }
    };
    const handleVerify = async () => {
        
        try {
        const res = await axios.post("http://localhost:8080/api/v1/auth/verify", {
            email,
            code,
        });

        const token = res.data.token;

        if (token) {
            localStorage.setItem("token", token);
            toast.success("Verification successful!");
            console.log("JWT token:", token)
            navigate("/home");
        } else {
            toast.error("Incorrect verification code");
        }
        } catch (err) {
        console.error("Verification error:", err.response?.data || err.message);
        toast.error("Error verification!!");
        }
    };

     if (!email) {
        return (
          <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>
            Invalid navigation. Please Login first.
          </Typography>
        );
      }
    

        
    return(
       
        <Box sx={{ mt: 4, textAlign: "center" }}> 
         
            <Box 
            sx={
                {maxWidth: 400,
                margin: "0 auto",
                p:1,
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: 3}
            }
            >
            <Typography sx={{ mt: 3 }}>
                Enter verification code from your Authenticator.
            </Typography>
                
                <TextField
                    label="verification code"
                    variant="outlined"
                    
                    value={code}
                    onChange={handleDigit}
                    sx={{ mt: 2 }}
                />
                <Box sx={{ mt: 2 }}>
                    <Button 
                    variant="contained" 
                    onClick={handleVerify}
                    >
                    Verify Code
                    </Button>
                </Box>
            </Box>

        </Box> 
        
       
     
    )
}
export default TotpLogin;