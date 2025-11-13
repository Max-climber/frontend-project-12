import axios from 'axios'
import { setUser } from '../features/users/userSlice'

export const createLoginHandler = (dispatch, navigate, t) => async (values, { setSubmitting, setStatus }) => {
  try {
    // В dev-режиме proxy переписывает /api на /api/v1
    // В prod используем прямой путь /api/v1
    const apiPath = import.meta.env.PROD ? '/api/v1/login' : '/api/login'
    const response = await axios.post(apiPath, values)
    localStorage.setItem('token', response.data.token)

    dispatch(setUser(values.username))

    navigate('/')
  }
  catch (e) {
    console.error(e)
    setStatus(t('loginPage.error'))
  }
  finally {
    setSubmitting(false)
  }
}
