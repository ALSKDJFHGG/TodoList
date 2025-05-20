package org.example.todo_list.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.todo_list.repository.jpa.TaskRepository;
import org.example.todo_list.repository.jpa.TodoListRepository;
import org.example.todo_list.repository.jpa.UserRepository;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TodoListRepository todoListRepository;
    private final TodoListService todoListService;
    private final UserRepository userRepository;

//    public void createTask(CreateTaskRequest createTaskRequest, Long userId) {
//    }
/*   TODO 新建任务:
你需要处理的业务异常:
- 如果不存在对应的任务类别
- 如果截至日期不是将来的时间
开始
├─ 根据 userId 检查用户下是否存在分类 TodoList
│  ├─ 不存在 → 创建新TodoList
│  └─ 存在 → 继续流程
├─ 处理TodoList
│  ├─ 根据 userId 找到对应的 TodoList → 构建Task对象
│  │     ├─ 保存Task
│  │     ├─ 加入TodoList
│  └─ 未找到 → 抛出 任务列表不存在异常 → 结束
└─ 结束流程
*/

//    public GetTaskResponse getTask(Long id) {
//    }
/* TODO 获取任务
开始
├─ 调用 taskRepository.findById(id)
│  ├─ 任务存在 → 构建 GetTaskResponse 对象 → 返回响应
│  └─ 任务不存在 → 抛出 TASK_NOT_FOUND → 进入异常处理流程
*/

//    public void deleteTask(Long id) {
//    }
/* TODO 删除任务
开始
├─ 检查任务是否存在
│  ├─ 否 → 抛出 TASK_NOT_FOUND → 结束
│  └─ 是 → 删除任务 → 结束
*/

//    public void updateTask(Long id, UpdateTaskRequest newTask, Long userId) {
//    }
/*TODO 更新任务
- 如果有截至日期: 新截至日期超过了 2038 年, 新的截止日期不是将来的时间
- 如果有类别: 如果没有对应的类别, 你需要新建一个对应的类别的 todoList
- id 对应的 task 不存在
开始更新任务
├─ 根据ID查找任务
│  ├─ 存在 → 检查截止时间
│  │  ├─ 无截止时间 → 修改完成状态
│  │  │  ├─ 检查类别
│  │  │  │  ├─ 无类别 → 修改任务名/备注
│  │  │  │  └─ 有类别 → 验证类别
│  │  │  │     ├─ 类别不存在 → 创建新类别 (todoListService.create)
│  │  │  │     └─ 类别存在 → 加入TodoList → 修改任务名/备注
│  │  │  └─ 字段更新检查
│  │  │     └─ 是 → 保存到数据库
│  │  └─ 有截止时间 → 时间验证
│  │     ├─ 早于当前时间 → 抛出 LESS_TIME
│  │     ├─ 晚于2038年 → 抛出 OUT_TIME
│  │     └─ 有效时间 → 更新截止时间 → 修改完成状态 (接上方流程)
│  └─ 不存在 → 抛出 TASK_NOT_FOUND
  */
}
