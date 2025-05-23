"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar.tsx"
import { Avatar } from "@/components/ui/avatar.tsx";
import { cn } from "@/utils";
import { useAuthStore } from "@/storages/auth.ts";
import { CircleUser, User } from "lucide-react";


// Example data structure
type InfoItem = {
    title: string
    logo: React.ElementType
    url?: string
    onClick?:()=>void
}

export function InfoSwitch(
    {
        items,
        defaultSelected = 0,
    }: {
    items: InfoItem[]
    defaultSelected?: number
}) {
    const authStore =useAuthStore()
    /*const {user} =*/
    const { isMobile } = useSidebar()
    const navigate = useNavigate()
    const [activeItem, setActiveItem] = React.useState<InfoItem | null>(items.length > 0 ? items[defaultSelected] : null)

    if (!activeItem) {
        return null
    }

    const handleItemClick = (item: InfoItem) => {
        if (item.onClick) {
            item.onClick(); // If there is an onClick handler, call it
        }else {
            setActiveItem(item);
            if (item.url) {
                navigate(item.url); // Normal navigation
            }
        }
    }
    const user = useAuthStore((state)=>state.user)
    return (
        <SidebarMenu className={cn([ "w-full","h-full","justify-center"])}>
            <SidebarMenuItem className={cn(["flex",
                "flex","lg:flex-col","flex-row","gap-3",
                "w-full",
                "h-full",
                "justify-center","items-center"])}>

                {/* 如果没有登录则显示未登录 登录状态存储在AuthStore里(/storages/auth) */}
                {user?(
                    < Avatar src={authStore.user?.avatarUrl || ""}
                             className={cn([
                                 "lg:w-[12vw]","lg:h-[12vw]",
                                 "w-[20vw]","h-[20vw]",
                             ])}
                             fallback={"CN"} />
                ):(< CircleUser
                     strokeWidth={1}
                            className={cn([
                                "lg:w-[12vw]","lg:h-[12vw]",
                                "w-[20vw]","h-[20vw]",
                                "text-gray-300",
                            ])}
                             />)}
                <DropdownMenu>
                    <DropdownMenuTrigger className={cn(["h-auto"])} asChild>
                        <SidebarMenuButton
                            size="lg"
                            className={cn(["flex","flex-row","justify-center","w-50","gap-3"
                                /*"data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",*/
                            ])}
                        >
                            <div>
                                <User size={30} color={"#409671"}/>
                            </div>
                            {/*leading-tight 是 Tailwind CSS 中的一个实用类，用来控制 行高（line-height）*/}
                            <p className={cn([
                                "lg:text-2xl","inline-block",
                                "leading-tight","font-sans","font-bold",
                                "w-fit"
                            ])}>
                                {user ? `${user.username}` : "未登录"}
                            </p>


                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className={cn(["w-[--radix-dropdown-menu-trigger-width]","min-w-56","rounded-lg"])}
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        {items.map((item) => (
                            <DropdownMenuItem key={item.title} onClick={() => handleItemClick(item)} className="gap-2 p-2 font-medium">
                                <div className={cn(["flex","size-6","items-center","justify-center","rounded-sm","border"])}>
                                    <item.logo className={cn(["size-5","shrink-0"])} />
                                </div>
                                {item.title}
                            </DropdownMenuItem>
                        ))}

                    </DropdownMenuContent>

                </DropdownMenu>
            </SidebarMenuItem>
            <div className={cn(["px-5"])}>
                <hr className={cn(["my-2"," border-gray-300",])}/>
            </div>
        </SidebarMenu>
    )
}
