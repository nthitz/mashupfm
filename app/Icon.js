'use strict'
import React from 'react'

export default function Icon(props){
  let {icon, className, ...others} = props
  className = `${icon}-icon ${className}`
  return (
    <div className={className} {...others}></div>
  )
}

