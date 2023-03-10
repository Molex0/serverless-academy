import React from 'react'
import './CheckOut.scss'
import check from '../svgElements/checkOut.svg'
import back from '../svgElements/checkBack.svg'

const CheckOut = () => {
  return (
    <div className='checkOut'>
      <img className='back' src={back} alt="" />
      <div className='content container'>
        <img src={check} alt="" />
        <div className='right'>
        <h1 className='title'>Check out how it works </h1> 
        <h4 className='subtitle'>It’s easy! Exchange messages, create or confirm orders, send<br/> 
            invoices, and collect payments across your supply chain — all<br/> 
            within one dashboard.
        </h4>
        <button className='btn'><i class="fas fa-play"></i> Play Video</button>
        </div>
      </div>
    </div>
  )
}

export default CheckOut