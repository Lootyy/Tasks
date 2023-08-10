export default function Feed({data})
{
    return (
        <div className='Feed'>
            <h2>Activity feed</h2>
            <ul>
            {
                data.map(e => {
                    return <li>{e}</li>
                })
            }
            </ul>
        </div>
    )
}