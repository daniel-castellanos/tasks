<?php

namespace Service;

class Task extends \Database {

    function add($request) {
        $response = new WsResponse();
        $status = 0;

        $query = "INSERT INTO tasks(task,status,created_at, position)  VALUES (:task, :status, :created_at,
                (SELECT 1+t2.position position 
                FROM tasks t2
                ORDER BY position DESC
                LIMIT 1)
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

        $statementDelete = $this->prepare("delete from tasks where id=:id");
        $statementDelete->bindParam('id', $request->id, self::PARAM_INT);
        $statementDeleteExecuted = $statementDelete->execute();
        if (FALSE === $statementDeleteExecuted) {
            $response->value = FALSE;
            $response->status = 1;
            $response->message = 'Fail on query to delete tasks';
            $response->debug = $statementDelete->errorInfo();
            return $response;
        }


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

        $statementUpdate = $this->prepare("update tasks set status=:newStatus where id=:id");
        $statementUpdate->bindParam('newStatus', $request->status, self::PARAM_INT);
        $statementUpdate->bindParam('id', $request->id, self::PARAM_INT);
        $statementExecuted = $statementUpdate->execute();
        if (FALSE === $statementExecuted) {
            $response->value = FALSE;
            $response->status = 1;
            $response->message = 'Fail on query to update task status';
            $response->debug = $statementUpdate->errorInfo();
            return $response;
        }
        return $response;
    }

    function changeOrder($request) {
        $response = new WsResponse();

        $statementUpdate = $this->prepare("UPDATE tasks t1
            LEFT JOIN tasks t2
            ON t1.id!=t2.id
            SET t1.position=t2.position
            WHERE t1.id in(:taskAid,:taskBid) AND t2.id in (:taskAid,:taskBid)");
        $statementUpdate->bindParam('taskAid', $request->taskAId, self::PARAM_INT);
        $statementUpdate->bindParam('taskBid', $request->taskBId, self::PARAM_INT);
        $statementExecuted = $statementUpdate->execute();
        if (FALSE === $statementExecuted) {
            $response->value = FALSE;
            $response->status = 1;
            $response->message = 'Fail on query to reorder task status';
            $response->debug = $statementUpdate->errorInfo();
            return $response;
        }



        return $response;
    }

}
