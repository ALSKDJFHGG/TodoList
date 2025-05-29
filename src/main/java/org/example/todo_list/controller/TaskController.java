package org.example.todo_list.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.example.todo_list.dto.request.CreateTaskRequest;
import org.example.todo_list.dto.request.UpdateTaskRequest;
import org.example.todo_list.dto.response.GetTaskResponse;
import org.example.todo_list.service.TaskService;
import org.example.todo_list.utils.ApiResponse;
import org.springframework.web.bind.annotation.*;

@Tag(name = "任务相关Api", description = "用于管理任务")
@RestController
@RequestMapping("/task")
@RequiredArgsConstructor// 通过 Lombok 自动生成包含所有 final 字段的构造函数，简化代码书写。
public class TaskController {

    final private TaskService taskService;

    @Operation(summary = "新建一个任务",
            description = "传入任务名, 类别.这两个是必须的. 还有非必须的 任务备注, 任务状态(是否完成, true 或者 false), 截至日期(时间戳)，返回 ApiResponse.success(\"创建任务成功\")")
    @PostMapping({"/", ""})
    public ApiResponse<String> createTask(@Valid @RequestBody CreateTaskRequest createTaskRequest, @RequestAttribute("userId") Long userId) {
        //  TODO 新建任务 --- ok_
        taskService.createTask(createTaskRequest, userId);

        return ApiResponse.success("任务创建成功");
    }

    @Operation(summary = "获取一个任务",
            description = "传入任务id, 返回 task的详细信息")
    @GetMapping("/{id}")
    public ApiResponse<GetTaskResponse> getTask(@PathVariable Long id) {
      // TODO 根据id获取任务信息 --- ok

        GetTaskResponse task = taskService.getTask(id);

        return ApiResponse.success(task);

    }

    @Operation(summary = "更新任务对应的参数")
    @PatchMapping({"/{id}"})
    public ApiResponse<String> updateTask(@PathVariable Long id,
                                     @Valid @RequestBody UpdateTaskRequest updateTaskRequest, @RequestAttribute("userId") Long userId) {
        // TODO 根据id更新任务
        taskService.updateTask(id, updateTaskRequest, userId);

        return ApiResponse.success("更新任务对应的参数");
    }

    @Operation(summary = "删除一个任务")
    @DeleteMapping({"/{id}"})
    public ApiResponse<String> deleteTask(@NotNull @PathVariable("id") Long id) {
        // TODO 根据 id 删除任务 --- ok

        taskService.deleteTask(id);

        return ApiResponse.success("删除一个任务");

    }
}
