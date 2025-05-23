import { alova } from "@/utils/alova.ts";
import { WebResponse } from "@/types";
import { Task } from "@/models/task.ts";

/* 增 */
export interface CreateTaskRequest {
    name: string; // 任务名称（必须上传）
    description?: string;
    status?: boolean;
    deadline?: number;
    category: string;
}
export async function createTask(data: CreateTaskRequest) {
    return alova.Post<WebResponse<Task>>("/task", data); /* alova 连接后端8080/task接口*/
    /*<Task> 返回完整的 Task 对象
    * code msg data
    * */
}


/* 查  删 */
export interface GetTaskResponse {
    id: number;
    name: string;
    description: string;
    deadline: number;
    status: boolean;
}

export async function getTask(id: number) {
    return alova.Get<WebResponse<GetTaskResponse>>(`/task/${id}`);
}
export interface DeleteTaskRequest {
    id?: number;
}

export async function deleteTask(request:DeleteTaskRequest) {
    return alova.Delete<WebResponse<string>>(`/task/${request.id}`);
}

/* 改 */
export interface UpdateTaskRequest {
    id:number;  /* 没有问好表示必填  必须发给后端 */
    name?: string;
    description?: string;
    status?: boolean;
    deadline?: number;
    category?: string;
}
export async function updateTask(request:UpdateTaskRequest) {
    return alova.Patch<WebResponse<Task>>(`/task/${request.id}`,request);
}


