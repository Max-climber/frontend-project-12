// для пути /login
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { setUser } from '../features/users/userSlice'
import axios from 'axios'

export const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <div className="w-100">
                <h2 className="text-center mb-4">{t('loginPage.title')}</h2>
                <Formik
                  initialValues={{
                    username: '',
                    password: '',
                  }}
                  onSubmit={async (values, { setSubmitting, setStatus }) => {
                    try {
                      // В dev-режиме proxy переписывает /api на /api/v1
                      // В prod используем прямой путь /api/v1
                      const apiPath = import.meta.env.PROD ? '/api/v1/login' : '/api/login'
                      const response = await axios.post(apiPath, values)
                      localStorage.setItem('token', response.data.token)

                      dispatch(setUser(values.username))

                      navigate('/')
                    } catch (e) {
                      console.error(e)
                      setStatus(t('loginPage.error'))
                    } finally {
                      setSubmitting(false)
                    }
                  }}
                >
                  {formik => {
                    const { status, isSubmitting } = formik
                    return (
                      <Form>
                        <div className="mb-3">
                          <label htmlFor="username" className="form-label">{t('loginPage.username')}</label>
                          <Field
                            id="username"
                            type="text"
                            name="username"
                            className="form-control"
                            autoComplete="username"
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">{t('loginPage.password')}</label>
                          <Field
                            id="password"
                            type="password"
                            name="password"
                            className="form-control"
                            autoComplete="current-password"
                          />
                        </div>
                        {status && <div className="text-danger mb-3">{status}</div>}
                        <button type="submit" className="btn btn-primary w-100 mb-3" disabled={isSubmitting}>
                          {t('loginPage.login')}
                        </button>
                        <div className="text-center">
                          <span>{t('loginPage.noAccount')} </span>
                          <Link to="/signup">{t('loginPage.signup')}</Link>
                        </div>
                      </Form>
                    )
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
