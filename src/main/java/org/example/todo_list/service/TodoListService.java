package org.example.todo_list.service;


import lombok.RequiredArgsConstructor;
import org.example.todo_list.dto.response.GetListResponse;
import org.example.todo_list.exception.UserException;
import org.example.todo_list.exception.errors.ListError;
import org.example.todo_list.exception.errors.UserError;
import org.example.todo_list.model.Task;
import org.example.todo_list.model.TodoList;
import org.example.todo_list.model.User;
import org.example.todo_list.repository.jpa.TaskRepository;
import org.example.todo_list.repository.jpa.TodoListRepository;
import org.example.todo_list.repository.jpa.UserRepository;
import org.example.todo_list.security.JwtUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service//表示该类是一个Spring服务组件，用于业务逻辑处理。
@RequiredArgsConstructor //自动生成包含所有final字段的构造函数
public class TodoListService {
    private final TodoListRepository todoListRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    public void create(String category, Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new UserException(UserError.USER_NOT_FOUND);
        }

        if (todoListRepository.existsByUser_IdAndCategory(userId, category)) {
            throw new UserException(ListError.TASKLIST_ALREADY_EXIST);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(UserError.USER_NOT_FOUND));

        TodoList newList = new TodoList();
        newList.setCategory(category);
        newList.setUser(user);

        user.getTodoLists().add(newList);

        todoListRepository.save(newList);
    }
 /* TODO 新建任务列表 --- ok
开始创建任务列表
│
├─→ 检查用户是否存在
│   ├─→ 存在 → 继续流程
│   └─→ 不存在 → 抛出 USER_NULL
│
├─→ 用户专属 category 检查
│   ├─→ 已有该 category → 抛出 LIST_ALREADY_EXISTS
│   └─→ 无重复 → 继续流程
│
└─→ [操作] 列表创建
    ├─→ 构建新 TodoList 实体
    ├─→ 持久化到数据库
    └─→ 建立用户-列表双向关联
*/

    public void delete(Long id, Long userId) {
        if (!todoListRepository.existsById(id)) {
            throw new UserException(ListError.TASKLIST_NOT_FOUND);
        }

        if (!todoListRepository.existsTodoListByUserId(userId)) {
            throw new UserException(UserError.USER_NOT_FOUND);
        }

        taskRepository.deleteTasksByTodoListId(id);

        todoListRepository.deleteAllByIdAndUser_Id(id, userId);

    }
/* TODO 删除 todolist --- ok
开始删除TodoList
├─→ 根据id查找TodoList
│   ├─→ 存在 → 根据 userId 查找用户
│   │        ├─→ 用户存在
│   │        │       ├─→ 解除用户与TodoList的关联
│   │        │       └─→ 删除TodoList
│   │        └─→ 用户不存在 → 抛出 USER_NULL→ 结束
│   └─→ 不存在 → 抛出 LIST_NOT_EXIST → 结束
*/

    public void changeListCategory(Long id, String newCategory, Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserException(UserError.USER_NOT_FOUND);
        }
        if (todoListRepository.existsByUser_IdAndCategory(userId, newCategory)) {
            throw new UserException(ListError.TASKLIST_ALREADY_EXIST);
        }

        TodoList todoList = todoListRepository.findById(id).orElseThrow(() -> new UserException(ListError.TASKLIST_NOT_FOUND));

        todoList.setCategory(newCategory);
        todoListRepository.save(todoList);
    }
/*TODO 更新 todolist 的类别 --- ok_
开始更新类别
├─→ 根据userId查找用户
│   ├─→ 用户不存在 → 抛出 USER_NULL 异常 → 结束
│   └─→ 用户存在 → 继续流程
│           └─→ 检查该用户下是否存在newCategory的任务列表
│               ├─→ 存在 → 抛出 LIST_ALREADY_EXISTS 异常 → 结束
│               └─→ 不存在 → 继续流程
│                       └─→ 根据id查找目标TodoList
│                           ├─→ 列表不存在 → 抛出 LIST_NOT_EXIST 异常 → 结束
│                           └─→ 列表存在 → 执行更新
│                                   └─→ 设置新类别并保存 → 结束
*/

    public List<GetListResponse> getAllLists(Long userId) {
        List<TodoList> userTodoLists = todoListRepository.findByUser_Id(userId);

        List<GetListResponse> res = null;

        return userTodoLists.stream()
                .map(todoList -> {

                    List<Long> collect = todoList.getTasks().stream()
                            .map(Task::getId)
                            .collect(Collectors.toList());

                    return new GetListResponse(
                            todoList.getId(),
                            todoList.getCategory(),
                            collect
                    );
                })
                .collect(Collectors.toList());
    }
/*TODO 获取所有 todolist --- ok
该方法根据用户ID获取所有待办事项列表，并构建包含任务ID、列表ID和分类的响应数据返回。
开始获取待办列表
├─→ 调用 findTodoListByUserId 获取原始数据
├─→ 初始化空结果列表 res
├─→ 遍历每个 TodoList 条目
│   ├─→ 转换为 GetListResponse 对象（DTO模式）
│   ├─→ 提取任务ID列表、列表ID、分类信息（数据解耦）
│   └─→ 将响应对象加入 res（结果聚合）
└─→ 返回结果列表 res（响应标准化）
     */

    public GetListResponse getListById(Long id) {
        if (!todoListRepository.existsById(id)) {
            throw new UserException(ListError.TASKLIST_NOT_FOUND);
        }
        TodoList todoList = todoListRepository.findById(id).orElseThrow(() -> new UserException(ListError.TASKLIST_NOT_FOUND));

        List<Long> taskIds = taskRepository.findIdsByTodoList_Id(id);

        return GetListResponse.builder()
                .id(id)
                .tasks(taskIds)
                .category(todoList.getCategory())
                .build();
    }
/*TODO 根据 id 获取 todolist --- ok_
开始
└─ 通过 id 查找 todolist
    └─ 查找到的 todolist 是否存在
        └─ 是
            ├─ 查询关联的任务 id 列表
            ├─构建并返回 GetListResponse
        └─ 否
           └─ 抛出 LIST_NOT_FOUND 异常
 */
}

