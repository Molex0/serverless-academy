import React from "react"
import "./Header.scss"
import coolEmoji from '../svgElements/coolEmoji.svg'
import rect from '../svgElements/redRectangle.svg'
import stars from '../svgElements/stars.svg'

const HomePage = () => {
  return (
    <header className="main_header">
      <img className="rect" src={rect} alt="" />
      <div className="container text">
        <img className="stars" src={stars} alt="" />
        <h1 className="title">Collecting payments <br/> <span className="text-red">is easy</span>, right?</h1>
        <h4 className="subtitle">Manage all your supply chain transactions <br/> in one dashboard. Get paid faster, reconcile<br/> quicker, grow bigger. </h4>
        <div className="btn">
          <button className="red-btn"> Get Started Now</button>
          <p className="sub-btn">It's free to try! <img src={coolEmoji} alt="" /> </p> 
        </div>
      </div>
      
    </header>
  )
}

export default HomePage
