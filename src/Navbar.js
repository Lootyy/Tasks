import { useEffect, useRef, useState } from "react";

import Dropdown from "./NavComponents/Dropdown";
import Typeahead from "./NavComponents/Typeahead";
import { unstable_batchedUpdates } from "react-dom";

export default function Navbar({setFilter})
{
    const [query, setQuery] = useState('')
    const [type, setType] = useState(undefined)
    const [assignee, setAssignee] = useState(undefined)
    const [creator, setCreator] = useState(undefined)

    const typeRef = useRef(null)
    const assigneeRef = useRef(null)
    const inputRef = useRef(null)

    const queryTimeoutRef = useRef(null)
    
    const filter = {
        query, type, assignee, creator
    }

    useEffect(() => {
        setFilter(filter)
        console.log(filter)
    }, [query, type, assignee, creator])

    useEffect(() => {
        let type = typeRef.current
        let assignee = assigneeRef.current
        function typeHandler(e)
        {
            setType(e.value)
        }
        function assigneeHandler(e)
        {
            setAssignee(e.value)
        }

        type.addEventListener('change', typeHandler)
        assignee.addEventListener('change', assigneeHandler)

        return () => {
            type.removeEventListener('change', typeHandler)
            assignee.removeEventListener('change', assigneeHandler)
        }
    })

    async function getPeople()
    {    
        let data = await fetch('/users')
        data = await data.json()
        return data
    }

    function handleQueryInput(e)
    {
        clearTimeout(queryTimeoutRef.current)

        queryTimeoutRef.current = setTimeout(() => {
            setQuery(e.target.value.toLowerCase())
        }, 300)
    }

    function handleInputKeyDown(e)
    {
        if (e.key === 'Escape')
        {
            e.target.value = ''
            setQuery('')
        }
    }

    function clearFilter()
    {   
        inputRef.current.value = ''

        unstable_batchedUpdates(() => {
            setQuery('')
            setType(undefined)
            setAssignee(undefined)
            setCreator(undefined)
        })
    }

    return (
        <div className='Navbar'>
            <div className="left">
                <Typeahead ref={assigneeRef} getResults={getPeople} value={assignee} placeholder='Assignee'></Typeahead>
                <Typeahead placeholder='Creator'></Typeahead>
            </div>
            <div className="center">
                <input ref={inputRef} type="text" placeholder="Search" className="Navbar__Search" onInput={handleQueryInput} onKeyDown={handleInputKeyDown}></input>
            </div>
            <div className="right">
                <Dropdown ref={typeRef} type='Type' placeholder='Type' options={[{title: 'Type 1'}, {title: 'Type 2'}, {title: 'Type 3'}]} value={type}></Dropdown>
                <button className="Navbar__ClearButton" onClick={clearFilter}>Clear</button>
            </div>
        </div>
     )
}