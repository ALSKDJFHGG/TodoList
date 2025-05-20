package org.example.todo_list.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;


// 用于注册的 DTO 其中头像的url可以为空
@Builder
@Schema(name = "更新用户请求")
public record UpdateUserRequest(
        @Schema(name = "username", example = "test")
        String username,

        @Schema(name = "password", example = "123456")
        String password

) {
}
