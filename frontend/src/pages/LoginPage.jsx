// для пути /login
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { createLoginSchema } from '../validation/loginSchema'
import { createLoginHandler } from '../utils/loginHandler'

export const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const schema = createLoginSchema(t)
  const handleSubmit = createLoginHandler(dispatch, navigate, t)

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <div className="w-100">
                <h2 className="text-center mb-4">
                  {t('loginPage.title')}
                </h2>
                <Formik
                  initialValues={{
                    username: '',
                    password: '',
                  }}
                  validationSchema={schema}
                  onSubmit={handleSubmit}
                >
                  {(formik) => {
                    const { status, isSubmitting } = formik
                    return (
                      <Form>
                        <div className="mb-3">
                          <label htmlFor="username" className="form-label">
                            {t('loginPage.username')}
                          </label>
                          <Field
                            id="username"
                            type="text"
                            name="username"
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
                            {t('loginPage.password')}
                          </label>
                          <Field
                            id="password"
                            type="password"
                            name="password"
                            className="form-control"
                            autoComplete="current-password"
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                        {status && (
                          <div className="text-danger mb-3">
                            {status}
                          </div>
                        )}
                        <button type="submit" className="btn btn-primary w-100 mb-3" disabled={isSubmitting}>
                          {t('loginPage.login')}
                        </button>
                        <div className="text-center">
                          <span>
                            {t('loginPage.noAccount')}
                            {' '}
                          </span>
                          <Link to="/signup">
                            {t('loginPage.signup')}
                          </Link>
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
