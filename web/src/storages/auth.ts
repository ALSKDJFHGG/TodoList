import { User } from "@/models/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/*
* 这是一个非常有用的用户全局状态文件
* zustand是什么？为什么要使用zustand?
* zustand 是一个轻量的 React 状态管理库,简单来说
* 存储了登录信息、主题模式、用户偏好等，可以在不同页面共享使用
* */
interface AuthState {
    user?: User;  //这个User是指User的类型(/model/User.tsx),包括头像，名字都会全局存储
    setUser: (user?: User) => void;  //设置
    clear: () => void; //登出时清空
}

/* useAuthStore有use,setUser,clear这些属性 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set, _get) => ({
            setUser: (user?: User) => set({ user }),
            clear: () => set({ user: undefined }),
        }),

        /* 把这个状态持久化（保存）到 localStorage，就算用户刷新页面，也不会丢失登录信息 */
        {
            name: "auth",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
