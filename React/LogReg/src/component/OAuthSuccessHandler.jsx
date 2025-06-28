import { useEffect} from "react";
import { useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
function OAuthSuccessHandler(){
    const navigate = useNavigate();
    const hasRun = useRef(false);

  useEffect(() => {

    if (hasRun.current) return;
    hasRun.current = true;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      console.log("JWT OAuth:", token);
      localStorage.setItem("token", token);
      
      setTimeout(() => {
      navigate("/home");
      }, 300);

    } else {
      // Error handling
      navigate("/");
      toast.error("Login Failed!!")
    }
  }, []);


    return(
        <div>
            <p>Logging in...</p>;

        </div>
    )

}
export default OAuthSuccessHandler;