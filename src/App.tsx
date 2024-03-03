import React from "react";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";

import { Setup } from "./Setup";
import { View } from "./View";

const router = createBrowserRouter([
    {
        path: "/setup",
        element: <Setup />,
    },
    {
        path: "/view",
        element: <View />,
    },
    {
        path: "/",
        element: (
            <>
                <Link to="/setup">setup</Link> or <Link to="/view">view</Link>
            </>
        ),
    },
]);

export function App() {
    return <RouterProvider router={router} />;
}
