import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
    Sidebar,
    SidebarHeader,
    SidebarContent, SidebarFooter,

} from "@/components/ui/sidebar.tsx";
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
} from "@/components/ui/context-menu.tsx"
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx"
import { Button } from "@/components/ui/button.tsx"
import { EditIcon, TrashIcon, LogIn, LogOut, Settings, ListTodo } from "lucide-react";
import { cn } from "@/utils"
import { AddList } from "@/components/widgets/sidebar/edit-list/add-list"
import { InfoSwitch } from "@/components/widgets/sidebar/info-switcher.tsx"
import { getAllTodoLists } from "@/api/todolist"
import { logout } from "@/api/user"
import { toast } from "sonner"
import { useAuthStore } from "@/storages/auth.ts"
import { DeleteListDialog } from "@/components/widgets/sidebar/edit-list/delete-list-dialog.tsx"
import { UpdateListDialog } from "@/components/widgets/sidebar/edit-list/update-list-dialog.tsx"
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Separator } from "@/components/ui/separator.tsx";

type NavItem = { title: string; path: string; id: number }

// 单个列表项，含右键菜单和弹窗
function NavListItem({ item, onRefresh }: { item: NavItem; onRefresh: () => void }) {


    const [showDelete, setShowDelete] = useState(false)
    const [showUpdate, setShowUpdate] = useState(false)

    const handleClose = () => {
        setShowDelete(false)
        setShowUpdate(false)
        onRefresh()
    }

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    <Button
                        asChild
                        variant={"ghost"}
                        className={cn(["w-full justify-start px-6 py-2",
                            "text-lg",
                            "font-medium",

                        ])}
                    >
                        <Link to={item.path}>{item.title}</Link>
                    </Button>
                </ContextMenuTrigger>
                <ContextMenuContent>

                    <ContextMenuItem onClick={() => setShowUpdate(true)}>
                        <EditIcon className="w-4 h-4 mr-2" /> 修改
                    </ContextMenuItem>

                    <ContextMenuItem onClick={() => setShowDelete(true)}>
                        <TrashIcon className="w-4 h-4 mr-2" /> 删除
                    </ContextMenuItem>

                </ContextMenuContent>
            </ContextMenu>

            <Dialog open={showDelete} onOpenChange={setShowDelete}>
                <DialogContent className={cn(["flex","items-center","justify-center","p-0"])}>
                    <DeleteListDialog
                        listId={item.id}
                        category={item.title}
                        onClose={handleClose}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={showUpdate} onOpenChange={setShowUpdate}>
                <DialogContent className={cn(["flex","items-center","justify-center","p-0"])}>
                    <UpdateListDialog
                        listId={item.id}
                        category={item.title}
                        onClose={handleClose}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default function AppSidebar() {
    const [lists, setLists] = useState<NavItem[]>([])
    const authStore = useAuthStore()
    const navigate = useNavigate()

    const fetchLists = async () => {
        const res = await getAllTodoLists()
        if (res.code === 200 && res.data) {
            setLists(res.data.map((i) => ({
                id: i.id,
                title: i.category,
                path: `/list/${i.category}`,
            })))
        }
    }

    useEffect(() => {
        if (authStore.user){
            fetchLists()    /* */
        }else setLists([]) /*清空列表*/
         }, [authStore.user])

    /*
    未登录：显示 “登录 / 注册”。
    已登录：显示 “个人设置” 和 “登出”
     */
    const infoItems = authStore.user?[
        { title: "个人设置", logo: Settings, url: "/account/settings" },
        {
            title: "登出",
            logo: LogOut,
            onClick: async () => {
                const res = await logout()
                if (res.code === 200) {
                    authStore.clear()
                    toast.success("已成功登出！")
                    navigate("/account/login")
                } else {
                    toast.error("登出失败：" + res.msg)
                }
            },
        },
    ]:[
        { title: "登录/注册", logo: LogIn, url: "/account/login" },
    ]

    return (
        <Sidebar className={cn("w-1/5 flex flex-col justify-between")} collapsible="icon">

            <SidebarHeader className={cn(["h-fit"])}>
                <InfoSwitch items={infoItems} />
            </SidebarHeader>

            <SidebarContent className={cn(["overflow-hidden","flex","justify-center"])}>
                {authStore.user&&(<ScrollArea className={cn(["flex","mx-4","border","rounded-md","h-68","overflow-y-auto"])}>
                    <div className={cn([""])}>
                        <div className={cn(["text-base","font-medium","leading-none","h-10","flex","items-center","pl-4",
                            "sticky","top-0","bg-white/80 backdrop-blur-md","z-10","gap-2"
                        ])}><ListTodo color={"#964065"}/>列表</div>
                        <nav className={cn(["space-y-1","px-4"])}>
                            {lists.map((item) => (
                                <>
                                    <NavListItem key={item.id} item={item} onRefresh={fetchLists} />
                                    <Separator className="my-2" />
                                </>
                            ))}
                        </nav>
                    </div>
                </ScrollArea>)}
            </SidebarContent>

            <SidebarFooter className={cn("w-full","flex","h-1/3","justify-end")}>
                {/* 登录状态下显示 AddList，未登录不显示 */}
                {authStore.user && (
                    <AddList onAddSuccess={fetchLists} />
                )}
            </SidebarFooter>
            {/*<SidebarFooter className={cn(["flex items-center justify-center px-10"])}>




            </SidebarFooter>*/}
        </Sidebar>
    )
}
