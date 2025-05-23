import { Outlet, useNavigate } from "react-router-dom";
import globalRouter from "@/utils/global-router.ts";
import { cn } from "@/utils";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import AppSidebar from "@/components/widgets/sidebar";
export default function layout(){
    /*globalRouter.navigate 被初始化赋值，实现没有登录自动跳转login界面*/
    const navigate = useNavigate();
    globalRouter.navigate = navigate;
    return(
        <div className={cn(["flex h-screen flex-col"])}>

            <div>
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <main
                            className={cn([

                                "flex", "flex-col", /*"min-h-[calc(100vh-64px)]",*/"p-4","justify-center","h-full"
                            ])}
                        >
                            <Outlet/>

                        </main>
                    </SidebarInset>
                </SidebarProvider>
            </div>
        </div>
    )
}