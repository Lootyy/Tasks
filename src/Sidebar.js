import Dropdown from "./NavComponents/Dropdown"

export default function Sidebar({currentProject, availableProjects})
{
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
                    <Dropdown title='Project' current={currentProject.title} options={availableProjects}></Dropdown>
                }
            </div>
        </div>
    )
}