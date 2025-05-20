package org.example.todo_list.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.AssertFalse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;


@Builder
@Schema(name = "新建任务请求")
public record CreateTaskRequest(


        @Schema(name = "category", example = "work")
        @NotBlank(message = "任务类别不能为空") String category,

        @Schema(name = "name", example = "task")
        @NotBlank(message = "任务名不能为空") String name,

        @Schema(name = "status", example = "false")
        @NotNull @AssertFalse(message = "完成状态传入的时候必须是 False") Boolean status,

        @Schema(name = "description", example = "this is a task")
        String taskDescription,

        @Schema(name = "deadline", example = "1830268799")
        Long deadline
) {
}

