package org.example.todo_list.exception.errors;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum TaskError implements ErrorCode {
    // TODO 任务相关异常
//    异常描述	    错误码	触发场景
//    任务不存在	    2001	操作不存在任务
    TASK_NOT_FOUND(2001, "任务不存在", HttpStatus.NOT_FOUND),
//    过去时间设置	    2002	设置过去时间为截止时间
    INVALID_DUE_DATE(2002, "过去时间设置", HttpStatus.BAD_REQUEST),
//    非法状态参数	    2003	新建任务时status=true
    INVALID_INITIAL_STATUS(2003, "非法状态参数", HttpStatus.BAD_REQUEST)
    ;

    private final Integer code;
    private final String message;
    private final HttpStatus httpStatus;
}
