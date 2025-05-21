package org.example.todo_list.exception;

import lombok.Getter;
import lombok.Setter;
import org.example.todo_list.exception.errors.ErrorCode;

//@RequiredArgsConstructor
@Getter
@Setter
public abstract class BaseException extends RuntimeException {
    private final ErrorCode errorCode;
    private final String errorType;

    public BaseException( ErrorCode errorCode, String errorType) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.errorType = errorType;
    }
}
