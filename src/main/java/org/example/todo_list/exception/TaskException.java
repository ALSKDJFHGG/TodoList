package org.example.todo_list.exception;

public class TaskException extends BaseException {
    public TaskException(Integer code, String message) {
        super(code, message, "TaskError");
    }
}
