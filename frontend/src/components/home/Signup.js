import React, { useState } from 'react'
import { NavLink, Navigate } from 'react-router-dom'
// import { Button, Form, Grid, Segment, Message } from 'semantic-ui-react'
import { useAuth } from '../context/AuthContext'
import { bookApi } from '../misc/BookApi'
import { handleLogError } from '../misc/Helpers'
import '../../styles/Signup.css'

function Signup() {
  const Auth = useAuth()
  const isLoggedIn = Auth.userIsAuthenticated()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'name') setName(value);
    else if (name === 'email') setEmail(value);
  };

  // const handleInputChange = (e, { name, value }) => {
  //   if (name === 'username') {
  //     setUsername(value)
  //   } else if (name === 'password') {
  //     setPassword(value)
  //   } else if (name === 'name') {
  //     setName(value)
  //   } else if (name === 'email') {
  //     setEmail(value)
  //   }
  // }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!(username && password && name && email)) {
      setIsError(true)
      setErrorMessage('Please, fill in all fields!')
      return
    }

    const user = { username, password, name, email }

    try {
      const response = await bookApi.signup(user)
      const { id, name, role } = response.data
      const authdata = window.btoa(username + ':' + password)
      const authenticatedUser = { id, name, role, authdata }

      Auth.userLogin(authenticatedUser)

      setUsername('')
      setPassword('')
      setName('')
      setEmail('')
      setIsError(false)
      setErrorMessage('')
    } catch (error) {
      handleLogError(error)
      if (error.response && error.response.data) {
        const errorData = error.response.data
        let errorMessage = 'Invalid fields'
        if (errorData.status === 409) {
          errorMessage = errorData.message
        } else if (errorData.status === 400) {
          errorMessage = errorData.errors[0].defaultMessage
        }
        setIsError(true)
        setErrorMessage(errorMessage)
      }
    }
  }

  if (isLoggedIn) {
    return <Navigate to='/' />
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <i className="user icon"></i>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="form-input"
              value={username}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <i className="lock icon"></i>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-input"
              value={password}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <i className="address card icon"></i>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="form-input"
              value={name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <i className="at icon"></i>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-input"
              value={email}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <p className="login-link">
          Already have an account? <NavLink to="/login">Login</NavLink>
        </p>
        {isError && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}


export default Signup