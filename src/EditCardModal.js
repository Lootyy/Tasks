import { useState, useEffect, useRef } from "react"
import Dropdown from "./NavComponents/Dropdown"

export default function EditCardModal({onSubmit, onClose, card})
{
    const [tasks, setTasks] = useState([...card.tasks, {checked: false, value: ''}])
    const dialogRef = useRef(null)
    const titleRef = useRef(null)
    const textContentRef = useRef(null)
    const tasksRef = useRef(null)
    const typeRef = useRef(null)
    const preferredDisplayRef = useRef(null)

    useEffect(() => {
        dialogRef.current.showModal()
    }, [])

    function handleFormSubmit(e)
    {
        let _tasks = tasks.map((e,i) => {
            return {
                checked: tasksRef.current.children[i].firstChild.children[0].checked,
                text: tasksRef.current.children[i].firstChild.children[1].value
            }
        })

        _tasks = _tasks.filter(e => {
            return e.text.trim() !== ''
        })
        
        onSubmit({  title: titleRef.current.value,
                    content: textContentRef.current.value,
                    tasks: _tasks,
                    taskType: typeRef.current.getAttribute('data-value'),
                    preferredDisplay: (!preferredDisplayRef.current.checked && _tasks.length !== 0) ? 'Tasks' : 'Description'})
    }

    return (
        <>
        <dialog ref={dialogRef} className='EditCardDialog' onClose={onClose} >
            <form method="dialog" className="EditCardDialog__Form" onSubmit={handleFormSubmit}>
                <div className="EditCardDialog__Header">
                    <input ref={titleRef} type='text' id='title' name='title' defaultValue={card?.title}></input>
                    <span>Assignee</span>
                </div>
                <div className='EditCardDialog__Type'>
                    <Dropdown ref={typeRef} title='Type' current={card.taskType !== undefined ? card.taskType : 'Type 1'} options={[{title:'Type 1'}, {title:'Type 2'}, {title:'Type 3'}]}></Dropdown>
                </div>
                <div className="EditCardDialog__TextContent">
                    <label htmlFor='textContent'>Description</label>
                    <textarea ref={textContentRef} type='text' id='textContent' name='textContent' defaultValue={card?.content}></textarea>
                </div>
                <div className='EditCardDialog__Tasks'>
                    <span>Tasks</span>
                    <ul ref={tasksRef} className='EditCardDialog__Tasks__List'>
                    {
                        tasks.map((e, i) => {
                            return <li key={i}>
                                <div>
                                    <input type='checkbox' defaultChecked={e.checked}></input>
                                    <input type='text' defaultValue={e.text} onInput={() => {
                                        if (tasks.length - 1 === i)
                                        {
                                            let newTasks = [...tasks]
                                            newTasks.push('')
                                            setTasks(newTasks)
                                        }
                                    }}>                                           
                                    </input>
                                </div>
                            </li>
                        })
                    }
                    </ul>
                </div>
                <div className="EditCardDialog__Footer">
                    <div className="EditCardDialog__PreferredDisplay">
                        Preferred display
                        <div>                            
                            <input ref={preferredDisplayRef} type='radio' name='preferredDisplay' value='Description' defaultChecked={card.preferredDisplay === 'Description'}></input>
                            <label>Description</label>
                        </div><div>                            
                            <input type='radio' name='preferredDisplay' value='Tasks' defaultChecked={card.preferredDisplay === 'Tasks'} disabled={tasks.length <= 1}></input>
                            <label>Tasks</label>
                        </div>
                    </div>
                    <button className="EditCardDialog__Save">Save</button>
                </div>
            </form>
        </dialog>
        </>
    )
}