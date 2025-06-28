import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmitLog = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
        const res =  await axios.post('http://localhost:8080/api/v1/auth/authentication', {email, password});
        const token = res.data.token; // Save token for authenticated requests
        localStorage.setItem('token', token);
        console.log("Jwt token:", res.data.token); 

        
        toast.success('Login successful!');
        navigate('/home');


        
    } catch (error) {
       if(error.response && error.response.data && error.response.data.message){
          toast.error(error.response.data.message)
       }else{
          toast.error("Login Error!!")

       }
       
    }
        
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google"

  }

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/github"


  }


  return (
        <div className="d-flex justify-content-center align-items-center mt-5">
            <div className="border p-4 rounded shadow " >
                <h2 className="text-center mb-4 fs-3">Login</h2>
                <form onSubmit={handleSubmitLog}>
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
                    Login
                </button>
                
                </form>

                <button className="btn btn-secondary w-100" onClick={handleGoogleLogin}>
                    Google
                </button>

                <button className="btn btn-dark w-100" onClick={handleGithubLogin}>
                    Github
                </button>
            </div>
       </div>
  );
}
export default Login;