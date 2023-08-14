import { useState, useContext, useRef, useEffect, useMemo } from 'react'
import {v4 as uuidv4} from 'uuid'

import CardList from './CardList'
import useFetch from './useFetch'

export default function CardListArea({ dropOnCard, addCard, projectId, isBookmarked, toggleBookmark, filter})
{
    const {data: lists, setData: setLists, pending, error} = useFetch(`getCards?project=${projectId}`)
    const draggingListID = useRef(null)    
    const [draggingCardHeight, setDraggingCardHeight] = useState(0)

    const fileredLists = useMemo(() => {
        if (!pending)
        {
            let newLists = [...lists] // gotta deep copy both so the original array is not mutated
            newLists = newLists.map(list => {return {...list}})

            newLists.forEach(list => list.tasks = [...list.tasks].filter(task => {
                    return ((task.title.toLowerCase().indexOf(filter.query) !== -1) || (task.content.toLowerCase().indexOf(filter.query) !== -1))
                })                
            )
            
            if (filter.type !== undefined)
                newLists.forEach(list => list.tasks = list.tasks.filter(task => (task.taskType === filter.type)))

            return newLists
        }
        else    
            return []
    }, [filter, lists])

    useEffect(() => {
    }, [lists])

    function setDraggingList(id)
    {
      draggingListID.current = id
    }

    function moveList(toID)
    {
        let newLists = [...lists]
        let newIndex = newLists.findIndex(list => list.id === toID)
        let oldIndex = newLists.findIndex(list => list.id === draggingListID.current)

        newLists[oldIndex].transitionedFrom = oldIndex > newIndex ? 'right': 'left'
        newLists[newIndex].transitionedFrom = oldIndex > newIndex ? 'left' : 'right'
        
        let list = newLists.splice(oldIndex, 1)[0]
        newLists.splice(newIndex, 0, list)

        setLists(newLists)
    }

    function dropOnCard({inPos, inListPos, outPos, outListPos})
    {
        transferCard({inPos, inListPos, outPos, outListPos, lists, setLists})
    }


    function dropOnList({inPos, inListPos, outPos, outListPos})
    {
        let newLists = [...lists]
        let card = newLists[outListPos].tasks.splice(outPos, 1)[0]
        newLists[inListPos].tasks.splice(inPos, 0, card)
                
        card.listId = newLists[inListPos].id
        updateCardDB({...card})

        setLists(newLists)
    }
    
    function transferCard({inPos, inListPos, outPos, outListPos, lists, setLists})
    {
        let newLists = [...lists]
        let card = newLists[outListPos].tasks.splice(outPos, 1)[0]
        newLists[inListPos].tasks.splice(inPos, 0, card)  

        card.listId = newLists[inListPos].id
        updateCardDB({...card})

        setLists(newLists)
    }

    function insertList(listID)
    {
        let newLists = [...lists]
        let newList = new List()
        let index = newLists.findIndex(e => e.id === listID)
        newLists.splice(index, 0, newList)        
        newLists.forEach((e) => delete e.transitionedFrom)

        updateListDB(newList)
        setLists(newLists)
    }

    function addList(listPos)
    {
        let newLists = [...lists]
        let newList = new List()
        newLists.splice(listPos + 1, 0, newList)
        newLists.forEach((e) => delete e.transitionedFrom)

        updateListDB(newList)
        setLists(newLists)
    }

    function removeList(listPos)
    {
        if (lists.length > 1)
        {
            let newLists = [...lists]
            newLists.splice(listPos, 1)
            setLists(newLists)
        }
    }

    function addCard(listPos)
    {
        let newCard = new Card()
        newCard.listId = lists[listPos].id
        let newLists = [...lists]

        newLists[listPos].tasks.splice(0,0, newCard)

        setLists(newLists)
    }

    function updateCard({pos, listPos, card})
    {
        let newLists = [...lists]
        let updatedCard = {...newLists[listPos].tasks[pos], ...card}
        newLists[listPos].tasks[pos] = updatedCard
        newLists.forEach((e) => delete e.transitionedFrom)

        updateCardDB({...updatedCard})

        setLists(newLists)
    }

    function updateListDB(list)
    {
        let header = new Headers();
        header.append('Content-Type', 'application/json')
        let body = JSON.stringify(list)

        
            fetch(`lists/${list.id}`,{
                method: "PUT",
                body: body,
                headers: header
        })
        .then(res => {  //json-server doesn't respect the http standard in regards to PUT creating a new resource, fallback POST req if put fails
            if (res.status === 404)
            fetch('lists', {        
                method: "POST",
                body: body,
                headers: header
        })
        })
    }

    function updateCardDB(card)
    {
        delete card.bookmarked

        let header = new Headers();
        header.append('Content-Type', 'application/json')
        let body = JSON.stringify(card)

            fetch(`tasks/${card.id}`,{
                method: "PUT",
                body: body,
                headers: header
        })
        .then(res => {  //json-server doesn't respect the http standard in regards to PUT creating a new resource, fallback POST req if put fails
            if (res.status === 404)
            fetch('tasks', {        
                method: "POST",
                body: body,
                headers: header
        })
        })
    }

    function Card()
    {
        this.id = uuidv4()
        this.title = 'New Card'
        this.content = 'Click the container to edit'
        this.tasks = []
        this.preferredDisplay = 'Description'
    }

    function List()
    {
        this.id = uuidv4()
        this.title = 'Drag me'
        this.tasks = []
        this.projectId = projectId
    }

    function cardToggleBookmark({pos, listPos})
    {
        toggleBookmark(lists[listPos].tasks[pos])
    }

    return (
        <>
        {
            pending ? 
            <div>cards are loading</div>
            :
            <div className='CardList_Area' style={{'--dragging-card-height': `${draggingCardHeight}px`}}>
            {
                fileredLists.map((e,i) => {
                    return <CardList key={e.id} id={e.id} pos={i} title={e.title} cards={e.tasks} type='task' dropOnCard={dropOnCard} addCard={addCard} dropOnList={dropOnList}
                    setDraggingList={setDraggingList} moveList={moveList} insertList={insertList} addList={addList} draggable={true} displayMenu={true}
                    updateCard={updateCard} removeList={removeList} setDraggingCardHeight={(height) => setDraggingCardHeight(height)}
                    transitionedFrom={Object.hasOwn(e, 'transitionedFrom') && e.transitionedFrom} isBookmarked={isBookmarked} toggleBookmark={cardToggleBookmark}></CardList>
                })
            }
            </div>
        }
        </>
    )
}