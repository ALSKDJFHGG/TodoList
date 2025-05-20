package org.example.todo_list.dto.request;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;


@Schema(name = "登录请求")
@Builder
public record LoginRegisterRequest(
        @Schema(name = "username", example = "test")
        @NotBlank(message = "用户名不能为空") String username,
        @Schema(name = "password", example = "123456")
        @NotBlank(message = "密码不能为空") String password
) {
}
