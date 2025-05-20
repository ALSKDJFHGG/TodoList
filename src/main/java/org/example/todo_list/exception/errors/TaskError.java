package org.example.todo_list.exception.errors;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum TaskError {
    // TODO 任务相关异常
//    异常描述	    错误码	触发场景
//    任务不存在	    2001	操作不存在任务
//    过去时间设置	    2002	设置过去时间为截止时间
//    非法状态参数	    2003	新建任务时status=true
    ;

    private final Integer code;
    private final String message;
}
