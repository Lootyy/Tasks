import { useState, useContext } from 'react'
import { ProjectContext } from './ProjectContext'

import CardList from './CardList'

export default function CardArea({ cards, dropOnCard, dropOnList, setDraggingList, moveList })
{


    return (
        <div className='CardArea'>
            {
                cards.map(e => {
                    return <CardList key={e.id} id={e.id} cards={e.tasks} dropOnCard={dropOnCard} dropOnList={dropOnList} setDraggingList={setDraggingList} moveList={moveList}></CardList>
                })
            }
        </div>
    )
}