import {Link} from "react-router-dom";
function Navbar(){
    return(
        <div className="d-flex justify-content-center bg-primary ">
            <ul className=" d-flex list-unstyled gap-3 m-4">
                
                <li >
                    <Link className="text-decoration-none text-white    " to={"/"}>Login</Link>

                </li>
                
            </ul>


        </div>
    )
}
export default Navbar;