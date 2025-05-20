import { createAlova } from "alova";
import ReactHook from "alova/react";
import globalRouter from "./global-router";
import { toast } from "sonner";
import adapterFetch from "alova/fetch";
import { useAuthStore } from "@/storages/auth";

export const alova = createAlova({
    baseURL: "/api",
    requestAdapter: adapterFetch(/*{
        credentials: "include"
    }*/),
    timeout: 5000,
    shareRequest: true,
    statesHook: ReactHook,
    cacheFor: {
        POST: 0,
        PUT: 0,
        DELETE: 0,
    },

    responded: {
        onSuccess: async (response, _method) => {
            const res = await response.json()
            console.log(res)
            if (res.code === 1004) {

                globalRouter?.navigate?.("/account/login");
                toast.warning("请先登录", {
                    id: "please-login",
                    description: "登录后才能继续操作",
                });
                useAuthStore?.getState()?.clear();
                return Promise.reject(res);
            }

            if (res.code === 502) {
                toast.error("服务器离线", {
                    id: "502-backend-offline",
                    description: "服务器暂时无法处理请求",
                });
                return Promise.reject(res);
            }

            return res;
        },
    },
});
