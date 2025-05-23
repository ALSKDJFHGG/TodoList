// storages/auth.ts

import { User } from "@/models/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * ✅ 说明：
 * 全局用户认证状态管理
 * - 使用 zustand 管理用户登录信息
 * - 支持持久化存储（localStorage），实现刷新页面后仍保持登录
 *
 * ✅ 为什么使用 zustand？
 * - 简洁轻量，无需 boilerplate
 * - 不依赖 Context，性能更优
 * - 使用简单但功能强大（如 persist 插件）
 */

// 用户状态接口
interface AuthState {
    user?: User;                      // 当前登录用户（包括用户名、头像等）
    setUser: (user?: User) => void;  // 设置用户信息（登录后使用）
    clear: () => void;               // 清空用户信息（登出时使用）
}

// 创建状态管理：useAuthStore 包含 user, setUser, clear
export const useAuthStore = create<AuthState>()(
    persist(
        (set, _get) => ({
            setUser: (user?: User) => set({ user }),     // 设置用户
            clear: () => set({ user: undefined }),       // 清空用户
        }),
        {
            name: "auth",                                 // localStorage 的 key 名称
            storage: createJSONStorage(() => localStorage), // 使用 localStorage 存储
        }
    )
);
