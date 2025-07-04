package org.example.todo_list.repository.jpa;

import jakarta.transaction.Transactional;
import org.example.todo_list.model.Task;
import org.example.todo_list.model.TodoList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    @Transactional
    @Query("select t.id from Task t where t.todoList.id = ?1")
    List<Long> findIdsByTodoList_Id(Long id);

    @Transactional
    @Modifying
    @Query("delete from Task t where t.todoList.id = :todolist")
    void deleteTasksByTodoListId(@Param("todolist") Long todolistId);

    boolean existsByName(String name);

    boolean existsById(Integer id);

}
