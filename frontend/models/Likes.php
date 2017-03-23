<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "likes".
 *
 * @property integer $id
 * @property string $post_id
 * @property string $token
 */
class Likes extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'likes';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'post_id', 'token'], 'required'],
            [['id', 'post_id'], 'integer'],
            [['token'], 'string', 'max' => 200],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'post_id' => 'Post ID',
            'token' => 'Token',
        ];
    }
}
