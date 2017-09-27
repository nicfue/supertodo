// src/components/LoginForm/LoginFormEmail.js
import React from 'react'

export const LoginFormEmail = (props) => (
  <input
    type='text'
    name='username'
    className='form-control m-3'
    placeholder="Epost"
    value={props.username}
    onChange={props.onChange}
/>)
