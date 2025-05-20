package org.example.todo_list.dto.response;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Null;
import lombok.Builder;


@Builder
public record UserResponse(
        Long id,
        String username,
        @Nullable String avatarUrl
) {
}
