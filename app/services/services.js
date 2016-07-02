angular.module('myApp')

        .service('WS', function ($http, Loading) {
            var port = window.location.port;
            port = port ? ':' + port : '';
            this.serverUrl = '//' + window.location.hostname + port + window.location.pathname + '/ajax/service.php';
            /**
             * @function call
             * invoca la ejecucion de un metodo en el servidor
             * @param String entidad Entidad sobre la que se ejecuta la operacion, ej. Usuario, Proyecto, Tarea etc.
             * @param String operacion metodo a ejecutar sobre la entidad, ej. crear, listar, editar, eliminar, etc.
             * @param Object data parametros necesarios para ejecutar la operacion, 
             * ej. {email:'fulano@biconsulting.mx', password:'****'}
             **/
            this.call = function (entidad, operacion, data) {
                var request = $http({
                    url: this.serverUrl + '?entidad=' + entidad + '&operacion=' + operacion
                    , async: true
                    , method: 'POST'
                    , data: data
                    , headers: {
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                        , 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                });
                return request;
            };
            this.handleRequestError = function (result) {
                Loading.hide();
                console.log(result);
                if (result && result.data && 'string' === typeof result.data.response.message) {
                    alert('¡Oh no!., ' + result.data.response.message);
                } else {
                    alert(':( Algo anda mal con la conexión.' + result.statusText);
                }
            };
        })
        .service('Loading', function () {
            this.show = function () {
                try {
                    document.getElementById('overlayer-loading').style.display = 'table';
                } catch (err) {
                    console.warn(err);
                }
            };
            this.hide = function () {
                try {
                    document.getElementById('overlayer-loading').style.display = 'none';
                } catch (err) {
                    console.warn(err);
                }
            };
        })
        ;
