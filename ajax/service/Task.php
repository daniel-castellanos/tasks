<?php

namespace Service;

class Task extends \Database {

    function add($request) {
        $response = new WsResponse();
        $status = 0;

        $query = "INSERT INTO tasks(task,status,created_at, previous_tasks_id)  VALUES (:task, :status, :created_at,
                (SELECT t.id FROM tasks t 
                left join tasks t2
                on t.id=t2.previous_tasks_id
                where t2.id is null
                limit 1)
                    )";
        $statementInsert = $this->prepare($query);
        $statementInsert->bindParam('task', $request->task, self::PARAM_STR);
        $statementInsert->bindParam('status', $status, self::PARAM_INT);
        $statementInsert->bindParam('created_at', time());
        $statementExecuted = $statementInsert->execute();
        if (FALSE === $statementExecuted) {
            $response->value = FALSE;
            $response->status = 1;
            $response->message = 'Fail on query to insert task';
            $response->debug = $statementInsert->errorInfo();
            return $response;
        }

        $insertedId = $this->lastInsertId();

        $statementSelect = $this->prepare("SELECT * FROM tasks where id=:id");
        $statementSelect->execute(array('id' => $insertedId));
        $taskInserted = $statementSelect->fetchObject();


        if (FALSE === $taskInserted) {
            $response->value = FALSE;
            $response->status = 1;
            $response->message = 'Can not get task inserted';
            $response->debug = $statementInsert->errorInfo();
        } else {
            $response->value = $taskInserted;
        }
        return $response;
    }

    function delete($request) {
        $response = new WsResponse();
        $this->beginTransaction();

        $statementWeanDependentTasks = $this->prepare("UPDATE tasks SET previous_tasks_id=NULL WHERE previous_tasks_id=:id");
        $statementWeanDependentTasks->bindParam('id', $request->id, self::PARAM_INT);
        $statementExecuted = $statementWeanDependentTasks->execute();
        if (FALSE === $statementExecuted) {
            $response->value = FALSE;
            $response->status = 1;
            $response->message = 'Fail on query to wean dependent tasks tasks';
            $response->debug = $statementWeanDependentTasks->errorInfo();
            $this->rollBack();
            return $response;
        }


        $statementDelete = $this->prepare("delete from tasks where id=:id");
        $statementDelete->bindParam('id', $request->id, self::PARAM_INT);
        $statementDeleteExecuted = $statementDelete->execute();
        if (FALSE === $statementDeleteExecuted) {
            $response->value = FALSE;
            $response->status = 1;
            $response->message = 'Fail on query to delete tasks';
            $response->debug = $statementDelete->errorInfo();
            $this->rollBack();
            return $response;
        }

        $this->commit();

        return $response;
    }

    function get($request) {
        $response = new WsResponse();
        $status = $request['status']? : '%';

        $statement = $this->prepare("select * from tasks where status like :status");
        $statement->bindParam('status', $status, self::PARAM_INT);
        $statementExecuted = $statement->execute();
        if (FALSE === $statementExecuted) {
            $response->value = FALSE;
            $response->status = 1;
            $response->message = 'Fail on query to get tasks';
            $response->debug = $statement->errorInfo();
            return $response;
        }
        $results = $statement->fetchAll(self::FETCH_OBJ);

        if (FALSE === $results) {
            $response->value = FALSE;
            $response->status = 1;
            $response->message = 'Can not get tasks';
            $response->debug = $statement->errorInfo();
        } else {
            $response->value = $results;
        }
        return $response;
    }

    function update($request) {
        $response = new WsResponse();

        $statement = $this->prepare("update tasks set status=:newStatus where id=:id");
        $statement->bindParam('newStatus', $request->status, self::PARAM_INT);
        $statement->bindParam('id', $request->id, self::PARAM_INT);
        $statementExecuted = $statement->execute();
        if (FALSE === $statementExecuted) {
            $response->value = FALSE;
            $response->status = 1;
            $response->message = 'Fail on query to update task status';
            $response->debug = $statement->errorInfo();
            return $response;
        }
        $results = $statement->fetchAll(self::FETCH_OBJ);

        if (FALSE === $results) {
            $response->value = FALSE;
            $response->status = 1;
            $response->message = 'Can not update task status';
            $response->debug = $statement->errorInfo();
        } else {
            $response->value = $results;
        }
        return $response;
    }

}
