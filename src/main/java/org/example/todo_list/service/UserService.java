package org.example.todo_list.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.todo_list.dto.request.LoginRegisterRequest;
import org.example.todo_list.dto.request.UpdateUserRequest;
import org.example.todo_list.exception.UserException;
import org.example.todo_list.exception.errors.UserError;
import org.example.todo_list.model.User;
import org.example.todo_list.repository.jpa.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${file.access-path}")
    private String accessPath;

    @Value("${file.upload-dir}")//将图片保存在当前项目路径下
    private String uploadDir;

    public void register(LoginRegisterRequest request) {
        // 如果注册用户名使用非法字符
        String username = request.username();
        if (!username.matches("[a-zA-Z0-9_]{3,15}")) {
            // 可在此处打印异常信息
            log.warn("非法用户名是: {}", request.username());
            throw new UserException(UserError.INVALID_USERNAME); //抛出1001, "非法用户名"异常处理
        }
        // 如果存在相同的用户名
        if (userRepository.existsByUsername(request.username())) {
            throw new UserException(UserError.DUPLICATE_USERNAME); //抛出异常处理
        }
        // md5 加密密码
        String encodedPassword = passwordEncoder.encode(request.password());
        User user = User.builder()
                .username(request.username())
                .password(encodedPassword)
                .build();
        userRepository.save(user);
    }


    public boolean login(LoginRegisterRequest request) {
        User user = userRepository.findByUsername(request.username());

        if (!userRepository.existsByUsername(user.getUsername())) {
            throw new UserException(UserError.USER_NOT_FOUND);
        }


        if (passwordEncoder.matches(request.password(), user.getPassword())) {
            return true;
        } else {
            throw new UserException(UserError.AUTHENTICATION_FAILURE);
        }
    }
/*TODO 登录----ok
你需要处理
- 如果用户名不存在
- 如果密码错误

开始登录
├─→ 根据用户名查找用户
│   ├─→ 用户是否存在?
│   │   ├─→ 否 → 抛出用户不存在异常（USER_NULL）
│   │   └─→ 是 → 验证密码是否正确
│   │       ├─→ 密码是否匹配?
│   │       │   ├─→ 否 → 抛出密码错误异常（PASSWORD_ERROR）
│   │       │   └─→ 是 → 返回登录成功
└───└───────└──流程结束返回ture
*/

    public String storeFile(Long userId, MultipartFile file) throws IOException {
        String extension = getString(file);

        String newFilename = UUID.randomUUID() + extension;

        Path uploadPath = Paths.get(uploadDir);
        System.out.println("===============");
        System.out.println(uploadPath);
        try {
            // 创建目录（如果不存在）
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 保存文件
            Path targetPath = uploadPath.resolve(newFilename);
            try (InputStream is = file.getInputStream()) {
                Files.copy(is, targetPath, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            log.error("文件存储失败: {}", e.getMessage());
            throw new UserException(UserError.INVALID_FILE);
        }

        String accessUrl = accessPath.replace("/**", "") + "/" + newFilename;

        // 更新用户头像
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(UserError.USER_NOT_FOUND));
        user.setAvatarUrl(accessUrl);
        userRepository.save(user);

        return accessUrl;
    }

    // 封装的获取文件名函数
    private static String getString(MultipartFile file) {
        if (file.isEmpty()) {
            throw new UserException(UserError.INVALID_FILE);
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || file.getOriginalFilename().isEmpty()) {
            throw new UserException(UserError.INVALID_FILE);
        }

        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex);
        } else {
            throw new UserException(UserError.INVALID_FILE_EXTENSION);
        }
        return extension;
    }
/* TODO 存储头像图片. 随意你存储在哪里, 只要最终可以通过 http://localhost:8080/images/文件名 这个地址访问到对应的图片就算成功----ok
开始上传文件
├─→ 文件是否为空?
│   ├─→ 是 → 抛出INVALID_FILE异常
│   └─→ 否 → 获取原始文件名
│       └─→ 生成随机文件名(UUID+后缀)
│           └─→ 上传目录是否存在?
│               ├─→ 否 → 创建目录 → 继续
│               └─→ 是 → 继续
│                   └─→ 保存文件到本地路径
│                       └─→ 构建访问URL
│                           └─→ 根据userId查找用户
│                               └─→ 用户是否存在?
│                                  ├─→ 否 → 抛出USER_NULL异常
│                                  └─→ 是 → 设置用户头像URL并保存 → 返回访问路径
└─→ [异常处理分支]
       └─→ 捕获IO异常 → 记录错误并返回上传失败
*/


    public void updateUser(Long id, UpdateUserRequest newUser) {

        User user = userRepository.getReferenceById(id);

        if (!userRepository.existsById(id)) {
            throw new UserException(UserError.USER_NOT_FOUND);
        }

        if (newUser.username().isEmpty()) {
            throw new UserException(UserError.INVALID_USERNAME);
        }

        if (!newUser.username().matches("[a-zA-Z0-9_]{3,15}")) {
            log.warn("非法用户名: {}", newUser.username());
            throw new UserException(UserError.INVALID_USERNAME);
        }
        user.setUsername(newUser.username());

        if (newUser.password().isEmpty()) {
            throw new UserException(UserError.AUTHENTICATION_FAILURE);
        }
        String encode = passwordEncoder.encode(newUser.password());
        user.setPassword(encode);

        userRepository.save(user);
    }
/*TODO  更新用户信息----ok
开始更新用户
└── 通过ID查找用户
    ├── 用户是否存在？[判断]
    │   ├── 是
    │   │   ├── 获取新用户名
    │   │   │   ├── 新用户名是否为空或空白？[判断]
    │   │   │   │   ├── 是 → 跳过更新用户名
    │   │   │   │   └── 否
    │   │   │   │       └── 用户名格式是否符合 USERNAME_REGEX 正则？[判断]
    │   │   │   │           ├── 否 → 抛出 INVALID_USERNAME 异常
    │   │   │   │           └── 是 → 调用 user.setUsername(newUser.username())更新用户名
    │   │   │   └── 获取新密码
    │   │   │       ├── 新密码是否为空或空白？[判断]
    │   │   │       │   ├── 是 → 跳过更新密码
    │   │   │       │   └── 否
    │   │   │       │       ├── 调用 passwordEncoder.encode(...) 加密密码
    │   │   │       │       └── 调用 user.setPassword(...) 更新密码
    │   │   └── 流程结束
    │   └── 否 → 抛出 USER_NULL 异常
    └── 流程结束
*/



}
