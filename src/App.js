import { useState, useRef, useEffect } from 'react';
import {v4 as uuidv4} from 'uuid';

import './Style.css';
import Sidebar from './Sidebar.js'
import FocusArea from './FocusArea.js'
import CardList from './CardList'
import Feed from './Feed.js'
import Navbar from './Navbar';
import useFetch from './useFetch';
import CardListArea from './CardListArea';
import useBookmarks from './useBookmarks';


function App() {
  const userID = 1

  const {data: availableProjects, setData: setAvailableProjects, pending: projectsPending, error: projectsError} = useFetch(`/users/${userID}`)
  const {data: bookmarks, setData: setBookmarks, pending: bookmarksPending, error: bookmarksError} = useFetch(`getBookmarks?user=${userID}`, [])
  const [currentProject, setCurrentProject] = useState(null)
  const [filter, setFilter] = useState({query: ''})

  function setProject(project)
  {
    setCurrentProject(project)
  }

  function toggleBookmark(card)
  {
    let newBookmarks = [...bookmarks]
    let toRemoveIndex;

    if ((toRemoveIndex = bookmarks.findIndex(e => e.taskId === card.id)) !== -1)
    {
      newBookmarks.splice(toRemoveIndex, 1)

      fetch(`bookmarks/${bookmarks[toRemoveIndex].id}`, {
        method: "DELETE"
      })
    }
    else
    {
      let newBookmark = {id: uuidv4(), userId: userID, taskId: card.id, task: {...card}}
      newBookmarks.push(newBookmark)

      let header = new Headers()
      header.append("Content-Type", "application/json")
      let body = JSON.stringify({ id: newBookmark.id, userId: newBookmark.userId, taskId: newBookmark.taskId})

      fetch(`bookmarks/${newBookmark.id}`, { //json-server doesn't respect the http standard in regards to put creating a new resource, fallback POST req if put fails
        method: 'PUT',
        headers: header,
        body
      })
      .then(res => {
          if (res.status === 404)
          fetch('bookmarks', {        
              method: "POST",
              body,
              headers: header
      })
      })
    }

    setBookmarks(newBookmarks)
  }

  function isBookmarked(cardId)
  {
    return bookmarks.some(e => e.task.id === cardId)
  }  

  //todo - some login form, assigns, priority, sorting, create new project, add user to project

  return (
    <div id='app'>
      {
        availableProjects !== null ?
        <Sidebar currentProject={currentProject !== null ? currentProject : undefined} availableProjects={availableProjects.projects} setProject={setProject}></Sidebar>
        :
        <span>No projects are available</span>
      }
      <div className='CardArea'>
      <FocusArea isLoading={bookmarksPending} hasError={bookmarksError} bookmarks={bookmarks} toggleBookmark={toggleBookmark}></FocusArea>
      <Navbar setFilter={setFilter}></Navbar>
      {
        currentProject === null ?
        <div>No project is selected sadge</div>
        :
        <CardListArea draggable={true} displayMenu={true} projectId={currentProject.id} isBookmarked={isBookmarked} toggleBookmark={toggleBookmark} filter={filter}></CardListArea>
      }
      </div>
      <Feed data={[]}></Feed>
      {
        availableProjects === null && !projectsPending && 
        <div className='no_content'>No project is available
          <button>Create new</button>
        </div>
      }
    </div>
  )
}
export default App;
