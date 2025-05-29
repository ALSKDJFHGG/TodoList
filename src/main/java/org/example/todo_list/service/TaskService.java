package org.example.todo_list.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.todo_list.dto.request.CreateTaskRequest;
import org.example.todo_list.dto.request.UpdateTaskRequest;
import org.example.todo_list.dto.response.GetTaskResponse;
import org.example.todo_list.exception.UserException;
import org.example.todo_list.exception.errors.ListError;
import org.example.todo_list.exception.errors.TaskError;
import org.example.todo_list.model.Task;
import org.example.todo_list.model.TodoList;
import org.example.todo_list.model.User;
import org.example.todo_list.repository.jpa.TaskRepository;
import org.example.todo_list.repository.jpa.TodoListRepository;
import org.example.todo_list.repository.jpa.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TodoListRepository todoListRepository;
    private final TodoListService todoListService;
    private final UserRepository userRepository;

    public void createTask(CreateTaskRequest createTaskRequest, Long userId) {
        if (!todoListRepository.existsByUser_IdAndCategory(userId, createTaskRequest.category())) {
            todoListService.create(createTaskRequest.category(), userId);
        }

        TodoList todoList = todoListRepository.findTodoListByCategoryAndUserId(createTaskRequest.category(), userId)
                .orElseThrow(() -> new UserException(ListError.TASKLIST_NOT_FOUND));

        Long deadline = createTaskRequest.deadline();
        if (deadline != null) {
            LocalDateTime dueDate = LocalDateTime.ofInstant(
                    Instant.ofEpochSecond(deadline),
                    ZoneId.systemDefault()
            );

            if (dueDate.isBefore(LocalDateTime.now())) {
                throw new UserException(TaskError.INVALID_DUE_DATE);
            }
        }

        Task task = Task.builder()
                .deadline(deadline)
                .description(createTaskRequest.taskDescription())
                .name(createTaskRequest.name())
                .status(false)
                .todoList(todoList)
                .build();

        taskRepository.save(task);
    }
/*   TODO 新建任务: --- ok_
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

    public GetTaskResponse getTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new UserException(TaskError.TASK_NOT_FOUND);
        }

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new UserException(TaskError.TASK_NOT_FOUND));

        return GetTaskResponse.builder()
                .id(task.getId())
                .description(task.getDescription())
                .deadline(task.getDeadline())
                .name(task.getName())
                .status(task.isStatus())
                .build();
    }
/* TODO 获取任务 --- ok
开始
├─ 调用 taskRepository.findById(id)
│  ├─ 任务存在 → 构建 GetTaskResponse 对象 → 返回响应
│  └─ 任务不存在 → 抛出 TASK_NOT_FOUND → 进入异常处理流程
*/

    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new UserException(TaskError.TASK_NOT_FOUND);
        }
        taskRepository.deleteById(id);
    }
/* TODO 删除任务 --- ok
开始
├─ 检查任务是否存在
│  ├─ 否 → 抛出 TASK_NOT_FOUND → 结束
│  └─ 是 → 删除任务 → 结束
*/

    public void updateTask(Long id, UpdateTaskRequest newTask, Long userId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new UserException(TaskError.TASK_NOT_FOUND));

        task.setStatus(newTask.status());

        if (newTask.deadline() != null) {
            LocalDateTime dueDate = LocalDateTime.ofInstant(
                    Instant.ofEpochSecond(newTask.deadline()),
                    ZoneId.systemDefault());

            LocalDateTime now = LocalDateTime.now();

            if (dueDate.isBefore(now)) {
                throw new UserException(TaskError.INVALID_DUE_DATE);
            }

            LocalDateTime maxDate = LocalDateTime.of(2038, 1, 1, 0, 0);

            if (dueDate.isAfter(maxDate)) {
                throw new UserException(TaskError.INVALID_INITIAL_STATUS);
            }

            task.setDeadline(newTask.deadline());
        }

        if (newTask.name() != null && !newTask.name().trim().isEmpty()) {
            task.setName(newTask.name());
        }

//        if (newTask.description() != null && !newTask.description().trim().isEmpty()) {
//        }
        task.setDescription(newTask.description());

        if (newTask.category() != null && !newTask.category().isEmpty()) {
            String category = newTask.category();

            TodoList todoList = todoListRepository.findTodoListByCategoryAndUserId(category, userId)
                    .orElseGet(() -> {
                        TodoList newList = TodoList.builder()
                                .category(category)
                                .user(task.getTodoList().getUser())
                                .build();
                        return todoListRepository.save(newList);
                            });
            task.setTodoList(todoList);
        }

        taskRepository.save(task);
    }
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
