import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../../PagesArea/Home/Home";
import { Page404 } from "../../PagesArea/Page404/Page404";
import { Wardrobe } from "../../PagesArea/Wardrobe/Wardrobe";

export function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/wardrobe" element={<Wardrobe />} />
            <Route path="*" element={<Page404 />} />
        </Routes>
    );
}
