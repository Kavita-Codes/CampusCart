import { createBrowserRouter } from "react-router-dom";
import Register from "./features/auth/pages/Register";
import Home from "./features/auth/pages/Home";
import Login from "./features/auth/pages/Login";
import Verify from "./features/auth/pages/Verify";
import VerifyToken from "./features/auth/pages/VerifyToken";


const router = createBrowserRouter([
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/",
        element:<Home/>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/verify",
        element:<Verify/>
    },
    {
        path:"/verify/:token",
        element:<VerifyToken/>
    }

])

export default router