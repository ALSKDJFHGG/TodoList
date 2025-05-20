package org.example.todo_list.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;


@Schema
@Builder
public record UpdateTaskRequest(

) {
}
