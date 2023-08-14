import { useState, useEffect, forwardRef, useRef } from 'react'

const Dropdown = forwardRef(function Dropdown({className, type, placeholder = 'Select', value, options = []}, ref)
{
    const [expanded, setExpanded] = useState(false)
    const [selected, setSelected] = useState(value)
    const thisRef = useRef(null)

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

    useEffect(() => {
        setSelected(value)
    }, [value])

    function handleOnItemClick(option)
    {
        let selectedVal;
        if (Object.hasOwn(option, 'value'))
            selectedVal = option.value
        else
            selectedVal = option.title

        let event = new CustomEvent('change')
        event.value = selectedVal 

        let el = ref ? ref.current : thisRef.current

        el.dispatchEvent(event)

        setSelected(selectedVal)
    }

    return (
        <div ref={ref ? ref : thisRef} className={`Dropdown` + (className ? ` ${className}` : '' )} data-type={type} data-expanded={expanded} data-value={selected}>
            <div className='Dropdown__preview' onClick={options.length !== 0 ? handleOnClick : undefined}>
                <span className='Dropdown__value'>{options.length !== 0 ? selected ? selected : placeholder : 'No data available'}</span>
                <svg className='Dropdown__indicator' viewBox='0 0 8 16'>
                    <path d='M 0,3 L 7,8 L 0,13'></path>
                </svg>
            </div>
            {
                expanded && 
                <ul className='Dropdown__options'>
                {
                    options.map((option,i) => {
                        return <li key={i} className='Dropdown__option' onClick={() => handleOnItemClick(option)} data-value={option.title}><span>{option.title}</span></li>
                    })
                }
                </ul>
            }
        </div>
    )
})

export default Dropdown;