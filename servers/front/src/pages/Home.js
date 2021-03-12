import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Home = () => {
  const get_api = async () => {
    const res = await fetch(
      '/api',
      {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET',
        // body: 'test body' // body data type must match "Content-Type" header
      }
    )
    console.log(await res.json())
  }
  return (
    <div>
      Home
      <Link to="/about">
        About
      </Link>
      <button onClick={get_api}>
        api test
      </button>
    </div>
  )
}

export default Home