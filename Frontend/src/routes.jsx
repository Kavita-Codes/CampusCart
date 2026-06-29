import { createBrowserRouter } from "react-router-dom";
import Register from "./features/auth/pages/Register";
import Home from "./features/auth/pages/Home";
import Login from "./features/auth/pages/Login";


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

])

export default router