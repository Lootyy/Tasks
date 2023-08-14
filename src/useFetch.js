import { useEffect, useState } from "react";

const useFetch = (url, defaultVal = null, handleData = (data) => data) =>
{
    const [data, setData] = useState(defaultVal)
    const [pending, setPending] = useState(true)
    const [error, setError] = useState(false)
    
    useEffect(() => {
        const abortController = new AbortController()
        if (!pending)
            setPending(true)

        fetch(url, { signal: abortController.signal })
        .then((res) => {
            return res.json()
        })
        .then(json => {
            setData(handleData(json))
            setPending(false)
        })
        .catch((err) => {
            setPending(false)
            setError(true)
        })
        
        return () => { //strict mode breaks aborting as of v18
            
        }
    }, [url])

    return {data, setData, pending, error}
}
export default useFetch