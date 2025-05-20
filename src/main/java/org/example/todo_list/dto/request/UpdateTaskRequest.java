package org.example.todo_list.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;


@Schema
@Builder
public record UpdateTaskRequest(
        @Schema(name = "category", example = "work")
        String category,

        @Schema(name = "name", example = "task1")
        String name,

        @Schema(name = "status", example = "false")
        Boolean status,

        @Schema(name = "description", example = "this is a task")
        String description,

        @Schema(name = "deadline", example = "2147483642")
        Long deadline
) {
}
