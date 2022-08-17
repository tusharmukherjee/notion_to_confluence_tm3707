import React, { createContext, useState } from 'react'

export const Head = createContext();

const Context = ({children}) => {
    const [docHead, setDocHead] = useState();

  return (
    <Head.Provider value={{docHead,setDocHead}}>{children}</Head.Provider>
  )
}

export default Context