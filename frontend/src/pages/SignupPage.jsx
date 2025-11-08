import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { setUser } from '../features/users/userSlice'
import axios from 'axios'

export const SignupPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const schema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .min(3, t('signupPage.validation.usernameLength'))
      .max(20, t('signupPage.validation.usernameLength'))
      .required(t('signupPage.validation.required')),
    password: yup
      .string()
      .min(6, t('signupPage.validation.passwordMin'))
      .required(t('signupPage.validation.required')),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref('password')], t('signupPage.validation.passwordsMatch'))
      .required(t('signupPage.validation.required')),
  })

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      // В dev-режиме proxy переписывает /api на /api/v1
      // В prod используем прямой путь /api/v1
      const apiPath = import.meta.env.PROD ? '/api/v1/signup' : '/api/signup'
      const response = await axios.post(apiPath, {
        username: values.username.trim(),
        password: values.password,
      })

      localStorage.setItem('token', response.data.token)
      dispatch(setUser(values.username.trim()))
      navigate('/')
    } catch (e) {
      if (e.response?.status === 409) {
        setFieldError('username', t('signupPage.errors.userExists'))
      } else {
        setFieldError('username', t('signupPage.errors.registrationError'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <div className="w-100">
                <h2 className="text-center mb-4">
                  {t('signupPage.title')}
                </h2>
                <Formik
                  initialValues={{
                    username: '',
                    password: '',
                    passwordConfirmation: '',
                  }}
                  validationSchema={schema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                          {t('signupPage.username')}
                        </label>
                        <Field
                          id="username"
                          name="username"
                          type="text"
                          className="form-control"
                          autoComplete="username"
                        />
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          {t('signupPage.password')}
                        </label>
                        <Field
                          id="password"
                          name="password"
                          type="password"
                          className="form-control"
                          autoComplete="new-password"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="passwordConfirmation"
                          className="form-label"
                        >
                          {t('signupPage.passwordConfirmation')}
                        </label>
                        <Field
                          id="passwordConfirmation"
                          name="passwordConfirmation"
                          type="password"
                          className="form-control"
                          autoComplete="new-password"
                        />
                        <ErrorMessage
                          name="passwordConfirmation"
                          component="div"
                          className="text-danger"
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary w-100 mb-3"
                        disabled={isSubmitting}
                      >
                        {t('signupPage.signup')}
                      </button>
                      <div className="text-center">
                        <span>
                          {t('signupPage.hasAccount')}
                          {' '}
                        </span>
                        <Link to="/login">
                          {t('signupPage.login')}
                        </Link>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
