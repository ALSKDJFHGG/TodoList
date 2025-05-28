package org.example.todo_list.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.todo_list.dto.request.LoginRegisterRequest;
import org.example.todo_list.dto.request.UpdateUserRequest;
import org.example.todo_list.dto.response.UserResponse;
import org.example.todo_list.exception.UserException;
import org.example.todo_list.exception.errors.UserError;
import org.example.todo_list.model.User;
import org.example.todo_list.repository.jpa.UserRepository;
import org.example.todo_list.security.JwtUtils;
import org.example.todo_list.service.UserService;
import org.example.todo_list.utils.ApiResponse;
import org.example.todo_list.utils.CookieUtil;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;

@Slf4j
@Tag(name = "用户相关Api", description = "用于登录和注册")
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor// 通过 Lombok 自动生成包含所有 final 字段的构造函数，简化代码书写。
public class UserController {
    private final JwtUtils jwtUtils;
    private final UserService userService;
    private final UserRepository userRepository;

    @Operation(summary = "注册",
            description = "传入用户名,密码和头像地址")
    @PostMapping("/register")
    public ApiResponse<String> register(@RequestBody @Valid LoginRegisterRequest request) {
        userService.register(request);
        return ApiResponse.success("注册成功");
    }

    @Operation(summary = "登录",
            description = "传入用户名和密码, 如果登陆成功就返回一个 cookie 给前端. 这个 cookie 的值就是 jwt_toke.")
    @PostMapping("/login")
    public ApiResponse<UserResponse> login(@Valid @RequestBody LoginRegisterRequest request,
                                           HttpServletResponse response) {
        // TODO 登录, 登录成功后为 HttpServletResponse 添加 setCookie 响应头, 值为 token ----ok

        // 调用登录接口
        userService.login(request);


        User user = userRepository.findByUsername(request.username());
        // 生成用户 token
        String token = jwtUtils.generateToken(user.getId());
        CookieUtil.setCookie(response, token);

//        // 生成 Cookie
//        Cookie jwtCookie = new Cookie("jwt_token", token);
//        jwtCookie.setPath("/");
//        jwtCookie.setHttpOnly(true);
//        jwtCookie.setMaxAge((int) Duration.ofHours(24).toSeconds());    // 设置生存周期 24 hours
//        response.addCookie(jwtCookie);

        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .build();
        return ApiResponse.success(userResponse);

    }

    @Operation(summary = "更改用户信息", description = "增量更新, 可以传入一个或者多个值, 传入的数据对应的字段如果不为空, 就更新他")
    @PatchMapping({"/", ""})
    public ApiResponse<UserResponse> update(@RequestBody @Valid UpdateUserRequest request,
                                            @RequestAttribute("userId") Long id) {
        if (userRepository.existsById(id)) {
            userService.updateUser(id, new UpdateUserRequest(request.username(), request.password()));
        } else {
            throw new UserException(UserError.USER_NOT_FOUND);
        }
        UserResponse userResponse = UserResponse.builder()
                .id(id)
                .username(request.username())
                .build();
        return ApiResponse.success(userResponse);
    }
// TODO 更改用户信息----ok
//开始
//├── 调用 userService.updateUser 更新用户信息
//│   ├── 根据 id 查询用户
//│   │   └── 用户是否存在
//│   │       ├── 是
//│   │       │   └── 构建 UserResponse 返回成功结果
//│   │       └── 否
//│   │           └── 抛出 USER_NULL 异常
//*/


    @Operation(summary = "用于上传头像", description = "传入一个 id, 用于指定传入的头像归属于那个用户. 一个图片文件作为头像. 记得设置 content-type 为 multipart/form-data")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<String> upload(@RequestParam("file") MultipartFile file,
                                      @RequestAttribute("userId") Long id) throws IOException {
       //TODO 更新头像 api 需要了解如何上传文件.----ok
        try {
            if (file == null || file.isEmpty()) {
                throw new UserException(UserError.INVALID_FILE);
            }

            String storedFile = userService.storeFile(id, file);

            return ApiResponse.success(storedFile);
        } catch (UserException e) {
            log.warn("头像上传业务异常 [用户ID:{}]: {}", id, e.getErrorType());
            return ApiResponse.error(1234, e.getMessage());
        } catch (Exception e) {
            log.error("头像上传系统异常 [用户ID:{}]", id, e);
            return ApiResponse.error(1234, "erroe");
        }
    }


    @Operation(summary = "登出", description = "想要删除 cookie 就把这个 token 的生命周期设置为 0 就可以了.")
    @GetMapping("/logout")
    public ApiResponse<String> logout(HttpServletResponse response) {
        // TODO 登出, 直接调用 cookieUtil 的删除 cookie 的函数, 返回 ApiResponse.success("登出成功") ----ok
        CookieUtil.deleteCookie(response);
        return ApiResponse.success("登出成功");
    }
}
