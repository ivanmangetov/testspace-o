<?php

namespace api\models;

use yii\base\Model;
use yii\data\ActiveDataProvider;
use common\models\Upfile;

class UpfileSearch extends Upfile
{
    public function rules()
    {
        return [
            [['blog_id'], 'safe'],
        ];
    }

    public function scenarios()
    {
        return Model::scenarios();
    }

    /**
     * @param array $params
     * @return ActiveDataProvider
     */
    public function search($params)
    {

        $query = Upfile::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $this->load($params);

      /* if (!$this->validate()) {
            return $dataProvider;
        }*/

        $query->andFilterWhere([
           'id'=> $this->id,
            'blog_id' => $this->blog_id,
            'user_id' => $this->user_id,
        ]);

       // $query->andFilterWhere(['like', 'blog_id', $this->blog_id]);

        return $dataProvider;
    }

    public function formName()
    {
        return 's';
    }
}
