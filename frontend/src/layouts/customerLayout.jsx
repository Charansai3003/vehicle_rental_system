import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";

function CustomerLayout() {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default CustomerLayout;