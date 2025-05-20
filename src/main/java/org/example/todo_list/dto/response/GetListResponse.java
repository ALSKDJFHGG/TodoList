package org.example.todo_list.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.util.List;



@Schema(name = "获取所有list的响应")
@Builder
public record GetListResponse(
        @NotNull Long id,
        @NotNull String category,
        List<Long> tasks
) {
}
