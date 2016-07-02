<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
setlocale(LC_ALL, 'es_MX');
date_default_timezone_set('America/Mexico_City');

if (isset($_GET['entidad']) && isset($_GET['operacion'])) {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    ob_start();
    include_once __DIR__ . '/../includes/settings.php';
    include_once __DIR__ . '/../includes/db.php';
    include_once __DIR__ . '/service/User.php';
    include_once __DIR__ . '/service/WsResponse.php';

    $response = new Service\WsResponse();
    $entidad = preg_replace('/[^ \w]+/', '', $_GET['entidad']);
    $operacion = preg_replace('/[^ \w]+/', '', $_GET['operacion']);
    $classFile = __DIR__ . "/service/$entidad.php";
    if (file_exists($classFile)) {
        include_once $classFile;
    }
    try {
        if (class_exists('\\Service\\' . $entidad)) {
            $className = "Service\\" . $entidad;
            $entidadInstanciada = new $className();
            if (method_exists($entidadInstanciada, $operacion)) {
                $usuario = new Service\User();
                if ($usuario->validarPermiso($entidad, $operacion)) {
                    $request_body = json_decode(file_get_contents('php://input'));
                    if (!$request_body) {
                        $request_body = json_decode(json_encode(filter_input_array(INPUT_POST)));
                    }
                    $response = $entidadInstanciada->$operacion($request_body);
                    if (!($response instanceof Service\WsResponse)) {
                        throw new Exception("La respuesta de [$entidad::$operacion()] no es de tipo [Service\\WsResponse]");
                    }
                } else {
                    header('HTTP/1.0 403 Forbidden');
                    $response->message = "No tienes permiso para realizar esta operación: [$entidad:$operacion]";
                }
            } else {
                header("HTTP/1.0 404 Not Found");
                $response->message = "Operación [$operacion] no soportada";
            }
        } else {
            header("HTTP/1.0 404 Not Found");
            $response->message = "Entidad [$entidad] no encontrada";
        }
    } catch (Exception $e) {
        header("HTTP/1.0 500 internal server error");
        if (Settings::$debug) {
            $response->message = $e->getMessage();
        } else {
            $response->message = '500 internal server error';
        }
    }
    $output = ob_get_clean();
    if (Settings::$debug) {
        $response->output = $output;
    } else {
        $output = '0';
        unset($response->debug);
    }
    echo json_encode(array('response' => $response));
    exit();
}
echo 0;
exit();
