<?php

namespace api\models;

use yii\base\Model;
use yii\data\ActiveDataProvider;
use common\models\Likes;

class LikeSearch extends Likes
{
    public function rules()
    {
        return [
            [['post_id'], 'safe'],
            [['token'], 'safe'],
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

        $query = Likes::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $this->load($params);

      /* if (!$this->validate()) {
            return $dataProvider;
        }*/

        $query->andFilterWhere([
            'post_id' => $this->post_id,
            'token' => $this->token,
        ]);

       // $query->andFilterWhere(['like', 'blog_id', $this->blog_id]);

        return $dataProvider;
    }

    public function formName()
    {
        return 's';
    }
}
