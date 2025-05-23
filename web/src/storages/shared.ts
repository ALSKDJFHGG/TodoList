// storages/shared.ts

import { create } from "zustand";

/**
 * ✅ 说明：
 * 用于组件之间共享状态的全局 store
 * 当前仅用于提供页面/组件刷新信号
 *
 * 使用场景示例：
 * - 用户更新信息后，需要其他组件重新拉取数据
 * - 点击某个操作，想通知多个组件重新加载
 */

// 共享状态接口
interface SharedState {
    refresh: number;        // 每次更新都会自增，触发依赖该值的组件重新渲染
    setRefresh: () => void; // 执行一次刷新：refresh + 1
}

// 创建共享状态管理：useSharedStore 包含 refresh 和 setRefresh
export const useSharedStore = create<SharedState>()((set, get) => ({
    refresh: 0,
    setRefresh: () => set({ refresh: get().refresh + 1 }),
}));
