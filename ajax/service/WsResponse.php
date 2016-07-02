<?php

namespace Service;

class WsResponse {

    /**
     *
     * @var Int Asignar 0 si la operacion se realizo con exito
     * en caso de algun fallo asignar cualquier valor diferente a 0
     */
    public $status = 0;

    /**
     *
     * @var String Indicar el significado del status, por ejemplo
     * 0="Exito", 1="Error, elemento no encontrado", etc
     */
    public $message = 'Éxito';

    /**
     *
     * @var mixed Asignar cualquier valor que se quiera regresar, como una lista de tareas,
     * propiedades de un usuario, etc.
     */
    public $value = true;

}
