<?php
/**
 * Created by PhpStorm.
 * User: manager
 * Date: 3/17/2017
 * Time: 1:45 PM
 */

namespace api\controllers;

use Yii;
use yii\web\Controller;
use app\models\Files;
use yii\web\UploadedFile;

use api\models\UpfileSearch;
use common\models\Upfile;
use common\rbac\Rbac;
use yii\filters\AccessControl;
use yii\filters\auth\HttpBasicAuth;
use yii\filters\auth\HttpBearerAuth;
use yii\helpers\Url;
use yii\rest\ActiveController;
use yii\web\ForbiddenHttpException;
use yii\web\ServerErrorHttpException;


class UpfileController extends ActiveController
{

    public $modelClass = 'common\models\Upfile';
    public $documentPath = 'documents/';

    public function verbs()
    {
        $verbs = parent::verbs();
        $verbs[ "upload" ] = ['POST' ];
        return $verbs;
    }


    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $behaviors['authenticator']['only'] = ['create', 'update', 'delete'];
        $behaviors['authenticator']['authMethods'] = [
            HttpBasicAuth::className(),
            HttpBearerAuth::className(),
        ];

        $behaviors['access'] = [
            'class' => AccessControl::className(),
            'only' => ['create', 'update', 'delete'],
            'rules' => [
                [
                    'allow' => true,
                    'roles' => ['@'],
                ],
            ],
        ];

        return $behaviors;
    }

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['create']);
        $actions['index']['prepareDataProvider'] = [$this, 'prepareDataProvider'];
        return $actions;
    }

    public function actionCreate()
    {




        $model = new Upfile();
        $model->user_id = Yii::$app->user->id;

        $model->load(Yii::$app->getRequest()->getBodyParams(), '');
        if ($model->save()) {
            $response = Yii::$app->getResponse();
            $response->setStatusCode(201);
            $id = implode(',', array_values($model->getPrimaryKey(true)));
            $response->getHeaders()->set('Location', Url::toRoute(['view', 'id' => $id], true));
        } elseif (!$model->hasErrors()) {
            throw new ServerErrorHttpException('Failed to create the object for unknown reason.');
        }

        return $model;
    }

    public function prepareDataProvider()
    {
        $searchModel = new UpfileSearch();
        return $searchModel->search(Yii::$app->request->queryParams);
    }

    public function checkAccess($action, $model = null, $params = [])
    {
        if (in_array($action, ['update', 'delete'])) {
            if (!Yii::$app->user->can(Rbac::MANAGE_POST, ['post' => $model])) {
                throw  new ForbiddenHttpException('Forbidden.');
            }
        }
    }




}