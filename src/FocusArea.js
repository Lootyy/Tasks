import CardList from "./CardList";

export default function FocusArea({bookmarks, dropOnCard, setBookmark})
{

    if (bookmarks.length !== 0)
        bookmarks[0].tasks.forEach(e => e.isBookmarked = true)
    return (
        <div className='FocusArea'>
            {
                <CardList cards={bookmarks[0].tasks} title='Bookmarks' direction="Horizontal" dropOnCard={dropOnCard} type='bookmark' setBookmark={setBookmark}></CardList>
            }
        </div>
    )
}