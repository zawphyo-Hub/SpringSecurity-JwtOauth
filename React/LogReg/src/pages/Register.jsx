import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";

function Register(){
    const navigate = useNavigate();
     const [email, setEmail] = useState('');
     const [full_name, setFullName] = useState('');
     const [password, setPassword] = useState('');
   
     const handleSubmitReg = async (e) => {
       e.preventDefault(); // prevent page reload
       try {
        const res = await axios.post("http://localhost:8080/api/v1/auth/register", {full_name, email, password})
        toast.success("Successfully Registered.");
        console.log("Jwt token:", res.data.token);
        navigate('/home')

        
       } catch (error) {
        console.log("Full error:", error.response);
        if (error.response && error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);  // Show the actual backend message
        } else {
            toast.error("Registration failed!");
        }
        
       }
           
     };
   
     return (
           <div className="d-flex justify-content-center align-items-center mt-5">
               <div className="border p-4 rounded shadow " >
                   <h2 className="text-center mb-4 fs-3">Register</h2>
                   <form onSubmit={handleSubmitReg}>
                    <div className="mb-3">
                       <input
                       type="text"
                       className="form-control"
                       placeholder="Full Name"
                       value={full_name}
                       onChange={(e) => setFullName(e.target.value)}
                       required
                       />
                   </div>
                   <div className="mb-3">
                       <input
                       type="email"
                       className="form-control"
                       placeholder="Email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                       />
                   </div>
                   <div className="mb-3">
                       <input
                       type="password"
                       className="form-control"
                       placeholder="Password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       required
                       />
                   </div>
                   
                   <button type="submit" className="btn btn-primary w-100">
                       Register
                   </button>
                   </form>
               </div>
          </div>
     );
}
export default Register;