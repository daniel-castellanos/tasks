//Define an angular module for our app
var app = angular.module('myApp', ['ui.sortable']);

app.controller('tasksController', function ($scope, $http, Loading, WS) {
    getTask(); // Load all available tasks 
    $scope.newTask = {};
    $scope.sortableOptions = {
        update: function (e, ui) {
            console.log(e, ui);
        },
        axis: 'y'
    };
    function getTask() {
        var $promise = WS.call('Task', 'get');
        Loading.show();
        $promise.then(function (result) {
            Loading.hide();
            if (0 === result.data.response.status) {
                $scope.tasks = result.data.response.value;
                if ($scope.tasks.map) {
                    $scope.tasks.map(function (task) {//force previous_tasks_id to be int to order numericaly
                        task.previous_tasks_id = parseInt(task.previous_tasks_id) || 0;
                    });
                }
                console.log($scope.tasks);
            } else {
                alert(result.data.response.message);
            }

        }, WS.handleRequestError);
    }
    ;
    $scope.addTask = function (newTask) {
        var $promise = WS.call('Task', 'add', newTask);
        Loading.show();
        $promise.then(function (result) {
            Loading.hide();
            if (0 === result.data.response.status) {
                $scope.tasks.push(result.data.response.value);
                $scope.newTask = {};
            } else {
                alert(result.data.response.message);
            }
        }, WS.handleRequestError);
    };

    $scope.deleteTask = function (task, taskIndex) {
        console.log('delete task', taskIndex, task);
        if (confirm("Are you sure to delete this line?")) {
            var $promise = WS.call('Task', 'delete', {id: task.id});
            Loading.show();
            $promise.then(function (result) {
                Loading.hide();
                if (0 === result.data.response.status) {
                    $scope.tasks.splice(taskIndex, 1);
                } else {
                    alert(result.data.response.message);
                }

            }, WS.handleRequestError);
        }
    };

    $scope.toggleStatus = function (task) {
        var $promise = WS.call('Task', 'update', {id: task.id, status: task.status});
        Loading.show();
        $promise.then(function (result) {
            Loading.hide();
            if (0 === result.data.response.status) {
                //updated
            } else {
                alert(result.data.response.message);
                task.status = '0' === task.status ? '2' : '0';//revert
            }

        }, WS.handleRequestError);

    };

});
