import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import "../styles/Sidebar/Siidebar.css"

const Sidebar = () => {
  const [databases,setDatabases]=useState([]);
  useEffect(()=>{
      fetch("http://localhost:3001/getdatabase").then((res)=>res.json())
      .then((data)=>{
        setDatabases(data);
      });
  },[]);
  return (
    <div className=' sidebody'>
        <div className=' db-container'>
          <div className=' headDB'>
            <p>Databases</p>
          </div>
          {
            databases.map((el)=>{
              return(
                <Link to={`/page/${el.id}`} style={{ textDecoration: 'none', color: 'white' }} key={el.id}>
                  <div className=' databases'>
                      <p>{el.title}</p>
                  </div>
                </Link>
                
              )
            })
          }
            
        </div>
    </div>
  )
}

export default Sidebar