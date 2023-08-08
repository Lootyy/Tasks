import {useRef, useState, useEffect} from 'react'
import EditCardModal from './EditCardModal'

export default function Card({id, pos = 0, listPos = 0, title, content, tasks, taskType, dropOnCard, listType, bookmarked, setBookmark, updateCard,
                            setDraggingCardHeight, preferredDisplay}) {
    const [dragOver, setDragOver] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const cardRef = useRef(null)

    const canEdit = listType != 'bookmark'

    
    function handleDragStart(e)
    {
        setDraggingCardHeight(cardRef.current.parentElement.getBoundingClientRect().height)
        e.dataTransfer.setDragImage(cardRef.current, e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        e.stopPropagation()

        setTimeout(() => setIsDragging(true), 0) // settimeout to introduce a delay in hiding the card, drag doesn't work when the element disappears instantly
        e.dataTransfer.setData(listType, JSON.stringify({id, pos, listPos}))
        e.dataTransfer.clearData('cardlist')
    }

    function handleDragEnd(e)
    {
        e.stopPropagation()
        setIsDragging(false)
    }

    function handleDrop(e)
    {
        if (e.dataTransfer.types.indexOf(listType) !== -1)
        {
            e.preventDefault()
            e.stopPropagation()
            let dropped = JSON.parse(e.dataTransfer.getData(listType))
            if (dropped.listPos === listPos && dropped.pos < pos)
                pos--
            if (dropped.id !== id)
                dropOnCard({inPos: pos, inListPos: listPos, outPos: dropped.pos, outListPos: dropped.listPos})
            setDragOver(false)
        }
    }
    
    function handleDragEnter(e)
    {
        console.log(e)
        if (e.dataTransfer.types.indexOf(listType) !== -1)
        {
            e.stopPropagation()
            if (!isDragging)
                setDragOver(true)
        }
    }

    function handleDragOver(e) 
    {
        e.preventDefault()
        e.stopPropagation()
    }

    function handleDragLeave(e)
    {
        if (e.dataTransfer.types.indexOf(listType) !== -1)
        {            
            e.stopPropagation()
            setDragOver(false)
        }
    }

    function handleBookmark(e)
    {
        setBookmark(id, e.target.checked)
    }

    function handleCardClick()
    {
        console.log('clicked')
        setIsEditing(true)
    }

    return (
        <>
        <div className='Card_wrapper' draggable={true} onDragStart={handleDragStart} onDrop={handleDrop} onDragOver={handleDragOver} onDragEnd={handleDragEnd}
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} data-isdragover={dragOver + ''} data-isdragging={isDragging ? 'true' : 'false'} data-tasktype={taskType}>
            <div className='Card' ref={cardRef} onDragLeave={e => e.stopPropagation()}>
                <div className='Card__Header'>
                    <span className='Card__Title'>{title}</span>
                    <div className='Card__Header__Type'></div>
                </div>
                <div className='Card__Content' onClick={canEdit ? handleCardClick : undefined}>
                    {
                        (() => {
                            if (preferredDisplay === 'Description')
                                return (
                                    <div className='Card__Content_Text'>
                                    {content}
                                    </div> )
                            else if (preferredDisplay === 'Tasks')
                                return (                            
                                    <ul className='Card__Content_TaskList'>
                                    {
                                        tasks.map((e,i) => {
                                            return <li key={i} data-checked={e.checked}>{e.text}</li>
                                        })
                                    }
                                    </ul>
                                )               
                        })()   
                    }
                </div>
                <div className='Card__Footer'>
                    <div className='Card__Footer__Assignee'></div>
                    {
                        tasks.length !== 0 ? <div className='Card_Footer_Progress'><span>{`${tasks.reduce((acc, val) => acc + (val.checked ? 1 : 0), 0)}/${tasks.length}`}</span></div> : undefined
                    }
                    <div className='Card__Footer__Bookmark'>
                        <input type='checkbox' onChange={handleBookmark} checked={bookmarked}></input>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -1 19 18" fill='none'> <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/> </svg>
                    </div>
                </div>
            </div>
        </div>
        {
            isEditing && 
            <EditCardModal onSubmit={(card) => { updateCard({card, pos, listPos}); setIsEditing(false)}} onClose={() => setIsEditing(false)} card={{title, content, tasks, taskType, preferredDisplay}}></EditCardModal>
        }
        </>
    )
}