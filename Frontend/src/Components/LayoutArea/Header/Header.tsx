import { NavLink } from "react-router-dom";
import "./Header.css";

export function Header() {
    return (
        <div className="Header">
            <div className="Header-brand">
                <span className="Header-logo">STYLEAGENT</span>
                <span className="Header-badge">AI MULTI-AGENT</span>
            </div>

            <nav className="Header-nav">
                <NavLink to="/home" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                    Studio
                </NavLink>
                <NavLink to="/wardrobe" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                    My Wardrobe
                </NavLink>
            </nav>

            <div className="Header-status">
                <span className="status-dot"></span>
                <span>Agents Online</span>
            </div>
        </div>
    );
}
