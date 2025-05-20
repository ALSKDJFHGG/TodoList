package org.example.todo_list.repository.jpa;

import org.example.todo_list.model.TodoList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Repository
public interface TodoListRepository extends JpaRepository<TodoList, Long> {
//TODO JPA仓库方法，分别用于操作待办事项列表   TIPS:参考TaskRepository

}

