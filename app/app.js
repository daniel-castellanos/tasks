"use strict";
//Define an angular module for our app
var app = angular.module('myApp', []);

app.controller('tasksController', function ($scope, $filter, Loading, WS) {
    getTask(); // Load all available tasks 
    $scope.newTask = {};
    $scope.reorder = [];
    function getTask() {
        var $promise = WS.call('Task', 'get');
        Loading.show();
        $promise.then(function (result) {
            Loading.hide();
            if (0 === result.data.response.status) {
                $scope.tasks = result.data.response.value;
                if ($scope.tasks.map) {
                    $scope.tasks.map(function (task) {//force position to be int to order numericaly
                        task.position = task.initialPosition = parseInt(task.position) || 0;
                    });
                }
                $scope.applyFilerOrder();
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
                var newTask = result.data.response.value;
                newTask.initialPosition = newTask.position;
                $scope.tasks.push(newTask);
                $scope.applyFilerOrder();
                $scope.newTask = {};
            } else {
                alert(result.data.response.message);
            }
        }, WS.handleRequestError);
    };

    $scope.deleteTask = function (task, taskIndex) {
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

    $scope.handleDragStart = function (e, taskIndex) {
        $scope.taskAIndex = taskIndex;
        e.currentTarget.classList.add('dragging');

        var dragIcon = document.createElement('img');
//        dragIcon.src = 'img/logo.png';
//        dragIcon.width = 10;
        e.dataTransfer.setDragImage(dragIcon, 0, 0);
    };

    $scope.handleDragEnd = function (e) {
        $scope.taskAIndex = null;
        e.currentTarget.classList.remove('dragging');
        if (!$scope.updating) {
            console.log('dropped outside. Canceled');
            $scope.revertOrder();
        }
    };

    $scope.handleDragEnter = function (e, taskBIndex) {
        $scope.shiftOrder($scope.taskAIndex, taskBIndex);
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

    $scope.handleDrop = function (e, taskBIndex) {
        e.stopPropagation(); // stops the browser from redirecting.
        e.preventDefault();

        $scope.handleDragLeave.call(this, e);

        if (taskBIndex === $scope.taskAIndex) {
            console.log('Canceled.');
            $scope.revertOrder();
        } else {
            $scope.updating = true;
            $scope.updateOrder();
        }
    };

    $scope.updateOrder = function () {
        var updates = [];
        for (var t in $scope.tasks) {
            var task = $scope.tasks[t];
            if (task.position !== task.initialPosition) {
                updates.push({id: task.id, position: task.position});
            }
        }
        if (0 === updates.length) {
            console.log('no changes');
            return false;
        }
        var $promise = WS.call('Task', 'updateOrder', {updates: updates});
        Loading.show();
        $promise.then(function (result) {
            Loading.hide();
            $scope.updating = false;
            if (0 === result.data.response.status) {
                //Success order changed in tdatabase
                $scope.applyInitialOrder();
                $scope.applyFilerOrder();
            } else {
                alert(result.data.response.message);
                $scope.revertOrder();//Revert order changed
            }

        }, function (result) {
            $scope.updating = false;
            $scope.revertOrder();//Revert order changed
            WS.handleRequestError(result);
        });

    };

    $scope.revertOrder = function () {
        for (var t in $scope.tasks) {
            var task = $scope.tasks[t];
            task.position = task.initialPosition;
        }
    };
    $scope.applyInitialOrder = function () {
        for (var t in $scope.tasks) {
            var task = $scope.tasks[t];
            task.initialPosition = task.position;
        }
    };


    $scope.shiftOrder = function (fromTaskIndex, toTaskIndex) {

        $scope.revertOrder();
        if (fromTaskIndex < toTaskIndex) {
            for (var i = toTaskIndex; i > fromTaskIndex; i--) {
                var taskA = $scope.tasks[i];
                taskA.position = i - 1;
            }
            $scope.tasks[i].position = toTaskIndex;

        } else {
            for (var i = toTaskIndex; i < fromTaskIndex; i++) {
                var taskA = $scope.tasks[i];
                taskA.position = i + 1;
            }
            $scope.tasks[i].position = toTaskIndex;
        }

    };

    $scope.applyFilerOrder = function () {
        $scope.tasks = $filter('orderBy')($scope.tasks, ['position', 'id'])
    };

});
