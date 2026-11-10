import { NavLink } from "react-router-dom";
import "./Page404.css";

export function Page404() {

    return (
        <div className="Page404">
            <h2>404</h2>
            <p>The page you are looking for doesn't exist.</p>
            <NavLink to="/home">Back to Studio</NavLink>
        </div>
    );
}
