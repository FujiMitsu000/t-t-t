import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../../stores';
import { trackPromise } from "react-promise-tracker";
import LoadingIndicator from '../UI/LoadingIndicator/LoadIndicator';
import './rating.css';

const Rating = observer(() => {
  const Store = useContext(StoreContext);

  useEffect(() => {
    if(!Store.RatingStore.ratings?.length) {
      trackPromise(
        Store.RatingStore.getStatistics()
      );
    }
  }, []);
  
  return (
    <>
      {
        Store.RatingStore.ratings?.length
        ?
          <table className="rating__table table">
            <thead>
            <tr className="table__row">
              <th className="text text_bold">Логин</th>
              <th className="text text_bold">Всего игр</th>
              <th className="text text_bold">Победы</th>
              <th className="text text_bold">Проигрыши</th>
              <th className="text text_bold">Процент побед</th>
            </tr>
            </thead>
            <tbody>
              {
                Store.RatingStore.ratings
                  ?.map(
                    (rating) => (
                      <tr key={rating.id}>
                        <td className="text text_bold rating__login td_rating">{rating.username}</td>
                        <td className="text text_average td_rating">{rating.total}</td>
                        <td className="text rating__wins td_rating">{rating.wins}</td>
                        <td className="text rating__loses td_rating">{rating.loses}</td>
                        <td className="text text_average td_rating">{rating.total ? Math.round(rating.wins/rating.total * 100) : 0}%</td>
                      </tr>
                    )
                  )
              }
            </tbody>
          </table>
        :
          <h2>Игр пока нет</h2>
      }
      {
          Store.RatingStore.ratings?.length ?
          '' 
          :
          <LoadingIndicator cls={"page-indicator"}/>
      }
    </>
  )
})

export default Rating