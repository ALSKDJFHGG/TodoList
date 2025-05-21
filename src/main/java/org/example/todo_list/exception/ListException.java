package org.example.todo_list.exception;

import org.example.todo_list.exception.errors.ErrorCode;

public class ListException extends BaseException {
    public ListException(ErrorCode  errorCode) {
        super(errorCode, "ListError");
    }
}
