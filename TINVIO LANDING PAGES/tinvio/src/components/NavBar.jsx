import React from "react"
import { Link } from "react-router-dom"
import Logo from "../svgElements/logo.svg"
import "./NavBar.scss"
import { useState } from "react"
import burger from "../svgElements/burger.svg"
import cross from "../svgElements/cross.svg"

const NavBar = () => {
  const [isNav, setIsNav] = useState(false)
  return (
    <nav className="container">
      <div>
        <Link to={""} className="logo">
          <img src={Logo} alt="NavLogo" />
        </Link>
        EN
      </div>
      <div className={isNav ? "menu active" : "menu"}>
        <ul>
          <li>
            <a href="#1"> Home</a>
          </li>
          <li>
            <a href="#1">Features</a>
          </li>
          <li>
            <a href="#1">Company</a>
          </li>
        </ul>
        <button>Get Started</button>
      </div>
      <div
        onClick={() => setIsNav(!isNav)}
        className="mobile_burg"
      >
        {isNav ? (
          <img src={cross} alt="" />
        ) : (
          <img src={burger} alt="" />
        )}
      </div>
    </nav>
  )
}

export default NavBar
