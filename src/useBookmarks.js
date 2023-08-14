import { useEffect } from "react"
import useFetch from "./useFetch"

const useBookmarks = (userID) => {
    const {data: bookmarks, setData: setBookmarks, pending: bookmarksPending, error: bookmarksError} = useFetch(`bookmarks?userId=${userID}&_expand=task`, [], (data) => data.map((e) => e.task))

    return ({bookmarks, setBookmarks, bookmarksPending, bookmarksError})
}

export default useBookmarks