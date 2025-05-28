package org.example.todo_list.repository.jpa;

import jakarta.transaction.Transactional;
import org.example.todo_list.model.TodoList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TodoListRepository extends JpaRepository<TodoList, Long> {
//TODO JPA仓库方法，分别用于操作待办事项列表   TIPS:参考TaskRepository
//    @Transactional
//    @Query("select t.id from TodoList t where t.user_id = ?1")
//    List<Long> findIdsByUser_Id(Long id);

}

