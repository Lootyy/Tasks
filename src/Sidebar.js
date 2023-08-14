import { useEffect, useRef } from "react"
import Dropdown from "./NavComponents/Dropdown"

export default function Sidebar({currentProject, availableProjects, setProject})
{
    const dropdownRef = useRef(null)

    useEffect(() => {
        let dropdown = dropdownRef.current

        function changeHandler(e)
        {
            let selectedProject = availableProjects.find(el => el.title === e.value)
            setProject(selectedProject)
        }
        dropdown.addEventListener('change', changeHandler)

        return (() => {
            dropdown.removeEventListener('change', changeHandler)
        })
    },[])

    return (
        <div className='Sidebar'>
            <div className='Sidebar__Header'>
                <div className='Sidebar__User'>
                    <div className='Sidebar__User__Picture'></div>
                    <div className="Sidebar__User__Controls">
                        <svg className="Sidebar__User__Controls__Menu HamburgerMenu" viewBox="0 0 15 10">
                            <path d='M 0,1 L 15,1 M 0,5 L 15,5 M 0,9 L 15,9'></path>
                        </svg>
                        <div className="Sidebar__User__Controls__Messages"></div>
                    </div>
                </div>
                {
                    availableProjects &&
                    <Dropdown ref={dropdownRef} title='Project' current={currentProject && currentProject.title} options={availableProjects}></Dropdown>
                }
            </div>
        </div>
    )
}