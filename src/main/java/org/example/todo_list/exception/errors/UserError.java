package org.example.todo_list.exception.errors;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.net.http.HttpClient;

@Getter
@AllArgsConstructor
public enum UserError  implements ErrorCode{
    // TODO 补充用户相关异常处理. 登陆的时候用户名或者密码错误等等 ...
    // 注册的时候使用了非法字符
    INVALID_USERNAME(1001, "非法用户名", HttpStatus.BAD_REQUEST),
    // 注册的时候不能有重复的用户名
    DUPLICATE_USERNAME(1003, "用户名已经存在", HttpStatus.BAD_REQUEST),
    NO_COOKIE(1004, "未登录访问", HttpStatus.UNAUTHORIZED),
    INVALID_FILE(1006, "上传文件不存在", HttpStatus.NOT_FOUND),;

//    异常描述	      错误码	    触发场景
//    非法用户名	      1001	    用户名不符合格式规范
//    用户名或密码错误	  1002	    登录验证失败
//    用户名已存在	      1003	    重复注册
//    未登录访问	      1004	    无有效Cookie访问受保护接口
//    用户不存在	      1005	    更新不存在的用户信息
//    上传文件不存在     1006      文件为空
    private final Integer code;
    private final String message;
    private final HttpStatus httpStatus;
}
