package org.example.todo_list.exception;

public class ListException extends BaseException {
    public ListException(Integer code, String message) {
        super(code, message, "ListError");
    }
}
