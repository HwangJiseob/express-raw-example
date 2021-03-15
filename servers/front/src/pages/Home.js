import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'

const Home = () => {
  const [userid, setID ] = useState('')
  const [userpw, setPW ] = useState('')

  const post_submit = async (e) => {
    e.preventDefault()
    const formData = {
      'id': userid,
      'pw': userpw
    }

    const res = await fetch('/api/auth/login', {
      method: 'post',
      headers: {
        // "Content-Type": "application/x-www-form-urlencoded"
        'Content-Type': 'application/json',
        'Accept': "application/json"
      },
      body: JSON.stringify(formData),
    })
    console.log(res)
  }

  const post_register = async () => {
    const formData = {
      'id': userid,
      'pw': userpw
    }
    const res = await fetch('/api/auth/register', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': "application/json"
      },
      body: JSON.stringify(formData)
    })
    console.log(res)
  }

  const post_auth = async () => {
    const res = await fetch('/api/auth/verify', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': "application/json"
      }
    })
    console.log(res)
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
      <button onClick={get_auth}>
        auth test
      </button>
      <div>
        <input value={userid} onChange={(e)=>{setID(e.target.value)}} />
        <input value={userpw} onChange={(e)=>{setPW(e.target.value)}} />
      </div>
      <button onClick={post_submit}>
          react submit
      </button>
      <button onClick={post_register}>
          react register
      </button>
      <button onClick={post_auth}>
          jwt uath
      </button>
    </div>
  )
}

export default Home

const get_api = async () => {
  const res = await fetch(
    '/api',
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': "application/json"
      },
      method: 'GET',
      // body: 'test body' // body data type must match "Content-Type" header
    }
  )
  console.log(await res.json())
}
const get_auth = async () => {
  const res = await fetch(
    '/api/auth',
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': "application/json"
      },
      method: 'POST',
      // body: 'test body' // body data type must match "Content-Type" header
    }
  )
  console.log(await res.json())
}
