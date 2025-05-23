import { User } from "@/models/user";
import { WebResponse } from "@/types";
import { alova } from "@/utils/alova";

/* 获取所有用户信息的接口 */

/* 登录的接口 POST请求*/
export interface UserLoginRequest {
    username: string;
    password: string;
}
export async function login(request: UserLoginRequest) {
    return alova.Post<WebResponse<User>>("/user/login", request);
}
export async function logout() {
    return alova.Get<WebResponse<never>>("/user/logout");
}

/*注册需要用到的类型*/
export interface UserRegisterRequest {
    username: string;
    password: string;
    confirm_password: string;

}
export async function register(request: UserRegisterRequest) {
    return alova.Post<WebResponse<User>>("/user/register", request);
}


export interface UserUpdateRequest{
    id:number
    username?: string;
    password?: string;
}
export async function updateUser (request: UserUpdateRequest) {
    return alova.Patch<WebResponse<string>>("/user", request);
}

export async function uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return alova.Post<WebResponse<string>>("/user/upload", formData);
}
