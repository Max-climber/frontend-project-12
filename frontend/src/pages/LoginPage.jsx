// для пути /login
import { Formik, Form, Field } from 'formik';

export const LoginPage = () => {
    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={( values, { setSubmitting }) => {
                console.log("Form is validated! Submitting the form...");
                setSubmitting(false);
            }}
        >
            {() => (
                <Form>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field
                    type="email"
                    name="email"
                    className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Field
                    type="password"
                    name="password"
                    className="form-control"
                    />
                </div>
                <button type="submit">Войти</button>
                </Form>
            )}
        </Formik>
    )
}