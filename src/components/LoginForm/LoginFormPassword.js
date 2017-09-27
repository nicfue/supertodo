// src/components/LoginForm/LoginFormPassword.js
import React from 'react'

export const LoginFormPassword = (props) => (
  <input
    type='text'
    name='password'
    className='form-control m-3'
    placeholder="Lösenord"
    value={props.password}
    onChange={props.onChange}
/>)
