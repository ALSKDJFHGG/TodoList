package org.example.todo_list.exception.errors;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum ListError {
    // TODO 任务列表相关异常
//    异常描述	    错误码	触发场景
//    重复任务列表分类	    3001	创建重复分类的任务列表
//    任务列表不存在	    3002	操作不存在任务列表
    ;

    private final Integer code;
    private final String message;
}
