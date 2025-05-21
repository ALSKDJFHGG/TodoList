package org.example.todo_list.exception;

import org.example.todo_list.exception.errors.ErrorCode;

public class UserException extends BaseException {
    public UserException(ErrorCode errorCode) {
        super(errorCode, "UserError");
    }
}
