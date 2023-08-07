import { useState, useEffect, forwardRef } from 'react'

const Dropdown = forwardRef(function Dropdown({title, current, options}, ref)
{
    const [expanded, setExpanded] = useState(false)
    const [selected, setSelected] = useState(current)

    function handleOnClick(e)
    {
        e.stopPropagation()
        setExpanded(true)
    }

    useEffect(() => {
        function closeDropdown() {
            setExpanded(false)
        }
        
        window.addEventListener('click', closeDropdown)

        return function cleanUp()
        {
            window.removeEventListener('click', closeDropdown)
        }
    }, [])

    function handleOnItemClick(e)
    {
        if (Object.hasOwn(e, 'value'))
            setSelected(e.value)
        else
            setSelected(e.title)
        if (e.onClick !== undefined)
        e.onClick()        
    }

    return (
        <div ref={ref} className='Dropdown' data-expanded={expanded} data-value={selected}>
            <label className='Dropdown__label'>{title}</label>
            <div className='Dropdown__preview' onClick={handleOnClick}>
                <span className='Dropdown__value'>{selected}</span>
                <svg className='Dropdown__indicator' viewBox='0 0 8 16'>
                    <path d='M 0,3 L 7,8 L 0,13'></path>
                </svg>
            </div>
            {
                expanded && 
                <ul className='Dropdown__options'>
                {
                    options.map((e,i) => {
                        return <li key={i} onClick={() => handleOnItemClick(e)}>{e.title}</li>
                    })
                }
                </ul>
            }
        </div>
    )
})

export default Dropdown;