import { useRef, useState, forwardRef, useEffect } from "react"

const Typeahead = forwardRef(function Typeahead({getResults, value, placeholder}, ref) 
{
    const [results, setResults] = useState(undefined)
    const [selected, setSelected] = useState(value)
    const [input, setInput] = useState('')
    const inputTimeoutRef = useRef(null)
    const thisRef = useRef(null)

    const inputRef = useRef(null)

    useEffect(() => {
        function closeResults() {
            setResults(undefined)
            setInput('')
        }

        window.addEventListener('click', closeResults)

        return (() => {
            window.removeEventListener('click', closeResults)
        })
    }, [])

    useEffect(() => {
        setSelected(value)
    }, [value])

    async function handleInput(e)
    {
        setInput(e.target.value)
        setSelected(undefined)

        if (getResults)
        {
            clearInterval(inputTimeoutRef.current)

            console.log('hi')
            let value = e.target.value
            if (value.length > 3)
                inputTimeoutRef.current = setTimeout(async () => {
                    let data = await getResults()
                    setResults(data)
                    console.log('set data')
                }, 300)
        }
    }

    function handleOnClickResult(e,res)
    {
        e.stopPropagation()
        let selectedVal;
        if (Object.hasOwn(res, 'value'))
            selectedVal = res.value
        else
            selectedVal = e.target.textContent

        let event = new CustomEvent('change')
        event.value = selectedVal 

        let el = ref ? ref.current : thisRef.current

        el.dispatchEvent(event)

        setSelected(selectedVal)
        setInput(selectedVal)
        setResults(undefined)
    }
    

    return (       
        <div ref={ref ? ref : thisRef} className="Typeahead" data-value={selected} data-expanded={results !== undefined}>
            <div className="Typeahead__preview">
                <input className="Typeahead__Input" ref={inputRef} type="text" onInput={handleInput} value={input} placeholder={placeholder}></input>
                <svg className='Dropdown__indicator' viewBox='0 0 8 16'>
                        <path d='M 0,3 L 7,8 L 0,13'></path>
                    </svg>
            </div>
            {
                results && 
                <ul className="Dropdown__options">
                    {
                        results.map((res,i) => 
                            <li key={i} className='Dropdown__option' onClick={(e) => handleOnClickResult(e, res)}>{res.name}</li>
                        ) 
                    }
                </ul>
            }
        </div>
    )
})

export default Typeahead