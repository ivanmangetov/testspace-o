<?php
/**
 * Created by PhpStorm.
 * User: manager
 * Date: 3/22/2017
 * Time: 9:55 AM
 */

namespace api\controllers;

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use api\models\SocketServer; //не забудьте поменять, если отличается


class SocketController extends Controller
{
    public function actionStartSocket($port=8088)
    {
        $server = IoServer::factory(
            new HttpServer(
                new WsServer(
                    new SocketServer()
                )
            ),
            $port
        );
        $server->run();
    }
}