<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "files".
 *
 * @property string $id
 * @property string $url
 * @property string $type
 * @property string $blog_id
 *
 * @property Blogs $blog
 * @property Type $type0
 */
class Files extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'files';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'url', 'type', 'blog_id'], 'required'],
            [['id', 'type', 'blog_id'], 'integer'],
            [['url'], 'string'],
            [['id'], 'unique'],
            [['blog_id'], 'exist', 'skipOnError' => true, 'targetClass' => Blogs::className(), 'targetAttribute' => ['blog_id' => 'id']],
            [['type'], 'exist', 'skipOnError' => true, 'targetClass' => Type::className(), 'targetAttribute' => ['type' => 'id']],
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
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getBlog()
    {
        return $this->hasOne(Blogs::className(), ['id' => 'blog_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getType0()
    {
        return $this->hasOne(Type::className(), ['id' => 'type']);
    }
}
