package org.example.todo_list.repository.jpa;

import jakarta.transaction.Transactional;
import org.example.todo_list.model.Task;
import org.example.todo_list.model.TodoList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TodoListRepository extends JpaRepository<TodoList, Long> {
//TODO JPA仓库方法，分别用于操作待办事项列表   TIPS:参考TaskRepository

    List<TodoList> findByUser_Id(Long userId);

    @Transactional
    @Query("select t.id from TodoList t where t.user.id = :userId")
    List<Long> findIdsByUser_Id(@Param("userId") Long userId);

    boolean existsByUser_IdAndCategory(@Param("userId") Long userId,
                                       @Param("category") String category);

    @Modifying
    @Transactional
    @Query("delete from TodoList t where t.user.id = :userId")
    void deleteAllByUser_Id(@Param("userId") Long userId);

}

