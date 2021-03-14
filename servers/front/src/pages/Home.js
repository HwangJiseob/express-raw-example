import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'

const Home = () => {
  const [userid, setID ] = useState('')
  const [userpw, setPW ] = useState('')

  const post_submit = async () => {
    const formData = {
      'id': userid,
      'pw': userpw
    }
    // const res = await fetch(
    //   '/api/auth/login',
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(formData)
    //   }
    // )

    console.log(formData)

    const res = await axios({
      method: 'post',
      url: '/api/auth/login',
      data: formData
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
        <button onClick={post_submit}>
          submit
        </button>
      </div>
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
