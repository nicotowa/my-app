// should start with function keyword or arrow function
//component name should start with capital
// you should have component body (jsx) + component logic
//export that component to use outside

import React, { createContext, useState } from "react";
import './App.css';
import ThemeButton from "./components/theme-button";
import Homepage from "./pages/homepage";
//jsx
//createelement
//element -> div, p, h1, span
//properties -> classname, id, click
//children, body

export const ThemeContext = createContext(null)


function App() {

  const [theme, setTheme] = useState(false)

  return (
  <ThemeContext.Provider
  value={{theme,setTheme,}}
  >
    <div className="App" style = {theme ? {backgroundColor: "#feb300"}:{}}>

      <ThemeButton />
      <Homepage />
    </div>
  </ThemeContext.Provider>
  )
}
export default App;