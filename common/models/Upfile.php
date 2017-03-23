<?php

namespace common\models;

use common\models\query\PostQuery;
use yii\behaviors\TimestampBehavior;
use yii\db\ActiveRecord;
use yii\helpers\Url;
use yii\web\Linkable;

/**
 * This is the model class for table "upfile".
 *
 * @property string $id
 * @property string $url
 * @property string $type
 * @property string $blog_id
 *
 * @property Post $blog
 */
class Upfile extends ActiveRecord 
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'upfile';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['url'], 'string'],
            [['type', 'blog_id', 'user_id'], 'integer'],
            [['user_id'], 'required'],
            [['name'], 'string'],
			[['blog_id'],'integer'],
           // [['blog_id'], 'exist', 'skipOnError' => true, 'targetClass' => Post::className(), 'targetAttribute' => ['blog_id' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'url' => 'Url',
            'type' => 'Type',
            'blog_id' => 'Blog ID',
            'name' => 'Name',
            'user_id' => 'User ID',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getBlog()
    {
        return $this->hasOne(Post::className(), ['id' => 'blog_id']);
    }
}
