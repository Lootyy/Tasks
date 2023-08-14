import { useEffect, useRef } from "react";
import CardList from "./CardList";

export default function FocusArea({isLoading, hasError, bookmarks, dropOnCard, toggleBookmark})
{
    const AreaRef = useRef(null)
    
    useEffect(() => {
        function setBookmarksWidth() {
            let width = AreaRef.current.getBoundingClientRect().width;
            AreaRef.current.style.setProperty('--parent-width', width + 'px')
        }

        setBookmarksWidth()

        window.addEventListener('resize', setBookmarksWidth)

        return () => window.removeEventListener('resize', setBookmarksWidth)
    }, [])

    function cardToggleBookmark({pos, listPos})
    {
        toggleBookmark({id: bookmarks[pos].taskId})
    }

    return (
        <div ref={AreaRef} className='FocusArea'>
            {
            isLoading ?
            <div className='FocusArea_bookmarks_loading'>
                <svg viewBox="0 0 50 50" className="spinner">
                    <g>
                        <path className='spinner_background' fill='none' d='M 45,25 A 20 20 0 1 0 44.9999 25.001'></path>
                        <path className="spinner_highlight" fill='none' d='M 45,25 A 20 20 0 1 0 44.9999 25.001'></path>
                    </g>
                </svg>
            </div>
            :
            <CardList cards={bookmarks.map(e => e.task)} title='Bookmarks' direction="Horizontal" dropOnCard={dropOnCard} type='bookmark' isBookmarked={() => true}
            toggleBookmark={cardToggleBookmark}></CardList>
            }
        </div>
    )
}