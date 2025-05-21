package org.example.todo_list.exception;

import org.example.todo_list.exception.errors.ErrorCode;

public class TaskException extends BaseException {
    public TaskException(ErrorCode  errorCode) {
        super(errorCode, "TaskError");
    }
}
