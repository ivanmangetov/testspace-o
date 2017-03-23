<?php
/**
 * Created by PhpStorm.
 * User: manager
 * Date: 3/22/2017
 * Time: 9:55 AM
 */

namespace console\controllers;

use yii\console\Controller;


use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use console\models\SocketServer;


class SocketController extends Controller
{
    public function actionStartSocket($port=8081)
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