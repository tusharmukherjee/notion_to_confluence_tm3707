import React from 'react'
import '../styles/Navbar/Navbar.css'

const NavBar = () => {
  return (
    <nav>
      <div className='nav-content'>
        <h1>N2C</h1>
        <div className=' search'>
            <input type="text" placeholder='Notion Document ID' />
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" className=" search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar