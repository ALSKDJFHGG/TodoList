import { createBrowserRouter } from "react-router-dom";

export default createBrowserRouter([
    {
        path:"/account/settings",
        lazy:async ()=>({
            Component:(
                await import("@/pages/account/settings")
            ).default
        })
    },
    {
        /* hydrateFallback */
        path:"/",
        lazy:async ()=>({
            Component:(await import("@/pages/layout.tsx")).default,
        }),
        children:[
            {
                index:true,
                lazy:async()=>({
                    Component: (
                        await import("@/pages/home")
                    ).default
                })
            },
            {
                path:"list",
                children:[
                    {
                        index:true,
                        lazy:async()=>({
                            Component: (
                                await import("@/pages/list")
                            ).default
                        })
                    },
                    {
                        path: ":category",
                        lazy:async()=>({
                            Component: (
                                await import("@/pages/list/index.tsx")
                            ).default
                        })
                    }
                ]
            },
            {
                path:"account",
                children:[
                    {
                        path:"login",
                        lazy:async ()=>({
                            Component:(
                                await import("@/pages/account/login")
                            ).default
                        })
                    },
                    {
                        path:"register",
                        lazy:async ()=>({
                            Component:(
                                await import("@/pages/account/register")
                            ).default
                        })
                    },
                ]
            }



        ]
    }
])