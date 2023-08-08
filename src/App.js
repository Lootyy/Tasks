import { useState, useRef, useEffect } from 'react';
import {v4 as uuidv4} from 'uuid';

import './Style.css';
import Nav from './Nav.js'
import FocusArea from './FocusArea.js'
import CardList from './CardList'
import Feed from './Feed.js'


function App() {
  /* const [cards, setCards] = useState([    {id: uuidv4(), title: 'List 1', tasks: [{id: uuidv4(), title: 'Card 1'}, {id: uuidv4(), title: 'Card 2'}]},
                                          {id: uuidv4(), title: 'List 2', tasks: [{id: uuidv4(), title: 'Card 3'}, {id: uuidv4(), title: 'Card 4'}]},
                                          {id: uuidv4(), title: 'List 3', tasks: [{id: uuidv4(), title: 'Card 3'}, {id: uuidv4(), title: 'Card 4'}]}])
 */

  const [cards, setCards] = useState([])
  const [bookmarks, setBookmarks] = useState([{tasks: []}])
  const draggingListID = useRef(null)
  const [draggingCardHeight, setDraggingCardHeight] = useState(0)
  const [availableProjects, setAvailableProjects] = useState(null)
  const [currentProject, setCurrentProject] = useState(null)

  const userID = 'testuser'

  // The loading functions are all kinds of messsed up to accomodate localstorage for ease of testing,
  // the intent is for the bookmarks to be user specific, not project / board specific

  useEffect(() => {
    loadBookmarks(userID)
    loadProjects()
  }, [])

  useEffect(() => {
    if (currentProject !== null)
      saveCards(currentProject.id)
  }, [cards])

  useEffect(() => {
    if (currentProject !== null)
    {
      saveBookmarks(userID)
      markBookmarked()
    }
  }, [bookmarks])


  function loadProjects()
  {
    let projects = JSON.parse(localStorage.getItem('projects'))
     
    if (projects !== null)
    {
      loadCards(projects[0].id)
      setCurrentProject(projects[0])
    }
    setAvailableProjects(projects)
  }

  function saveCards(projectID)
  {    
      localStorage.setItem(projectID + '', JSON.stringify(cards))
  }

  function loadCards(projectID)
  {
    let cards = JSON.parse(localStorage.getItem(projectID + ''))
    if (cards !== null)
      setCards(cards)
  }

  function markBookmarked()
  {
    let newCards = [...cards]
    newCards.forEach(list => { // mark bookmarks
      list.tasks.forEach(task => {
        task.isBookmarked = (bookmarks[0].tasks.findIndex(e => e.id === task.id) !== -1)
      })
    })
    setCards(newCards)
  }

  function loadBookmarks(userID)
  {
    let bookmarks = JSON.parse(localStorage.getItem(userID))
    if (bookmarks != null)
      setBookmarks(bookmarks)
  }

  function saveBookmarks(userID)
  {
    localStorage.setItem(userID, JSON.stringify(bookmarks))
  }

  function createProject()
  {
    localStorage.setItem('projects', JSON.stringify([{id: 1, title: 'test project'}]))
    localStorage.setItem('1', JSON.stringify([{id: uuidv4(), title: 'Drag me', tasks: [
                                                                                  {id: '1', title: 'Normal size', content: 'Cards are draggable via native html5 drag&drop api \n\n lists are draggable too', tasks: [], preferredDisplay: 'Description', taskType: 'Type 1'},
                                                                                  {id: '3', title: 'Card', content: 'No way to delete cards individually just yet', tasks: [], preferredDisplay: 'Description', taskType: 'Type 2'},
                                                                                  {id: '2', title: 'Slightly bigger', content: 'Of varying \n\n\n\n\n\n\n\n\n sizes', tasks: [], preferredDisplay: 'Description', taskType: 'Type 3'},
                                                                                
                                                                                ]},
                                              {id: uuidv4(), title: 'Theres buttons too', tasks: [
                                                                                  {id: '4', title: 'Normal size', content: 'Cards are draggable via native html5 drag&drop api \n\n lists are draggable too', tasks: [], preferredDisplay: 'Description'},
                                                                                  {id: '5', title: 'Slightly bigger', content: 'Of varying \n\n\n\n\n\n\n\n\n sizes', tasks: [], preferredDisplay: 'Description'},
                                                                                  {id: '6', title: 'Card', content: 'No way to delete cards individually just yet', tasks: [], preferredDisplay: 'Description'},                                                                                
                                                                                ]},                                                                              
                                                                              ]))
    loadProjects()
  }

  function setDraggingList(id)
  {
    draggingListID.current = id
  }

  function moveList(toID)
  {
    let newCards = [...cards]
    let newIndex = newCards.findIndex(list => list.id === toID)
    let oldIndex = newCards.findIndex(list => list.id === draggingListID.current)
    
    let list = newCards.splice(oldIndex, 1)[0]
    newCards.splice(newIndex, 0, list)

    setCards(newCards)
  }
  
  function dropOnCard_Cards({inPos, inListPos, outPos, outListPos})
  {
    transferCard({inPos, inListPos, outPos, outListPos, cards, setCards})
  }

  function dropOnCard_Bookmarks({inPos, inListPos, outPos, outListPos})
  {
    transferCard({inPos, inListPos, outPos, outListPos, cards: bookmarks, setCards: setBookmarks})
  }

  function dropOnList({inPos, inListPos, outPos, outListPos})
  {

    console.log(outListPos)
    let newCards = [...cards]
    let card = newCards[outListPos].tasks.splice(outPos, 1)[0]
    newCards[inListPos].tasks.splice(inPos, 0, card)  

    setCards(newCards)
  }
  
  function transferCard({inPos, inListPos, outPos, outListPos, cards, setCards})
  {
    let newCards = [...cards]
    let card = newCards[outListPos].tasks.splice(outPos, 1)[0]
    newCards[inListPos].tasks.splice(inPos, 0, card)  

    setCards(newCards)
  }

  function insertList(listID)
  {
    let newCards = [...cards]
    let index = newCards.findIndex(e => e.id === listID)
    newCards.splice(index, 0, new List())
    setCards(newCards)
  }

  function addList(listPos)
  {
    let newCards = [...cards]
    newCards.splice(listPos + 1, 0, new List())
    setCards(newCards)
  }

  function removeList(listPos)
  {
    if (cards.length > 1)
    {
      let newCards = [...cards]
      newCards.splice(listPos, 1)
      setCards(newCards)
    }
  }

  function addCard(listPos)
  {
    let newCard = new Card()
    let newCards = [...cards]

    newCards[listPos].tasks.splice(0,0, newCard)

    setCards(newCards)
  }

  function updateCard({pos, listPos, card})
  {
    let newCards = [...cards]
    let updatedCard = {...newCards[listPos].tasks[pos], ...card}
    newCards[listPos].tasks[pos] = updatedCard
    updateCardInBookmarks(updatedCard)
    setCards(newCards)
  }

  //temporary for localstorage behavior
  function updateCardInBookmarks(card)
  {
    let newBookmarks = [...bookmarks]
    let bookmarkIndex = newBookmarks[0].tasks.findIndex(e => e.id === card.id)
    newBookmarks[0].tasks[bookmarkIndex] = card
    saveBookmarks(userID)
  }

  function setBookmark(id, value)
  {
    let cardIndex, card
    cards.some(e => {
      if ((cardIndex = e.tasks.findIndex(card => card.id === id)) !== -1)
      {
        card = e.tasks[cardIndex]
        return true
      }
      return false
    })
    
    if (value === true)
    {
      let newBookmarks = [...bookmarks]
      newBookmarks[0].tasks.push(card)      
      setBookmarks(newBookmarks)
    }
    else 
    {
      let newBookmarks = [...bookmarks]
      let bookmarkIndex = newBookmarks[0].tasks.findIndex(e => e.id === id)
      newBookmarks[0].tasks.splice(bookmarkIndex,1)
      setBookmarks(newBookmarks)
    }
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
  }

  return (
    <div id='app' style={{'--dragging-card-height': `${draggingCardHeight}px`}}>
      <Nav currentProject={currentProject} availableProjects={availableProjects}></Nav>
      {
        availableProjects !== null ?
        <>
          <div className='CardArea'>
          <FocusArea bookmarks={bookmarks} dropOnCard={dropOnCard_Bookmarks} setBookmark={setBookmark}></FocusArea>
          <div className='CardList_Area'>
              {
                cards.map((e,i) => {
                  return <CardList key={e.id} id={e.id} pos={i} title={e.title} cards={e.tasks} type='task' dropOnCard={dropOnCard_Cards} addCard={addCard} dropOnList={dropOnList}
                  setDraggingList={setDraggingList} moveList={moveList} insertList={insertList} addList={addList} draggable={true} displayMenu={true}
                  setBookmark={setBookmark} updateCard={updateCard} removeList={removeList} setDraggingCardHeight={(height) => setDraggingCardHeight(height)}></CardList>
                })
              }
          </div>
          </div>
          <Feed></Feed>
        </>
        :
        <div className='no_content'>No project is available
          <button onClick={createProject}>Create new</button>
        </div>
      }
    </div>
  )
}
export default App;
