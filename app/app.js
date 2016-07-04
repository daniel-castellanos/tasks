//Define an angular module for our app
var app = angular.module('myApp', []);

app.controller('tasksController', function ($scope, $http, Loading, WS) {
    getTask(); // Load all available tasks 
    $scope.newTask = {};
    $scope.sortableOptions = {
        update: function (e, ui) {
            console.log(e, ui);
            alert('How to know which task is before?');
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
                    $scope.tasks.map(function (task) {//force position to be int to order numericaly
                        task.position = parseInt(task.position) || 0;
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

        }, function (result) {
            task.status = '0' === task.status ? '2' : '0';//revert
            WS.handleRequestError(result);
        });

    };

    $scope.handleDragStart = function (e, task) {
        $scope.taskAToOrder = task;
        e.currentTarget.classList.add('dragging');
    };

    $scope.handleDragEnd = function (e) {
//        console.log('drag end', e);
        $scope.taskAToOrder = null;
        e.currentTarget.classList.remove('dragging');
    };

    $scope.handleDragEnter = function (e) {
        e.currentTarget.classList.add('over');
    };

    $scope.handleDragLeave = function (e) {
        e.currentTarget.classList.remove('over');  // this / e.target is previous target element.
    };

    $scope.handleDragOver = function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        e.currentTarget.classList.add('over');//por si acaso, por que de repente no jala bien el de dragenter
    };


    $scope.handleDrop = function (e, task) {
        $scope.taskBToOrder = task;
        // this / e.target is current target element.
        e.stopPropagation(); // stops the browser from redirecting.
        e.preventDefault();
        if ($scope.taskAToOrder && $scope.taskBToOrder) {
            $scope.changeOrder($scope.taskAToOrder, $scope.taskBToOrder)
        }
//        console.log('drop ', $scope.taskAToOrder, $scope.taskBToOrder);
        $scope.handleDragLeave.call(this, e);
    };

    $scope.changeOrder = function (taskA, taskB) {
        $scope.localChangeOrder(taskA, taskB);//Change order localy while database is updated
        var $promise = WS.call('Task', 'changeOrder', {taskAId: taskA.id, taskBId: taskB.id});
        Loading.show();
        $promise.then(function (result) {
            Loading.hide();
            if (0 === result.data.response.status) {
                //Success order changed in tdatabase
            } else {
                alert(result.data.response.message);
                $scope.localChangeOrder(taskA, taskB);//Revert order changed
            }

        }, function (result) {
            $scope.localChangeOrder(taskA, taskB);//Revert order changed
            WS.handleRequestError(result);
        });
    };

    $scope.localChangeOrder = function (taskA, taskB) {
        var tempOrder = taskA.position;
        taskA.position = taskB.position;
        taskB.position = tempOrder;
    };

});
