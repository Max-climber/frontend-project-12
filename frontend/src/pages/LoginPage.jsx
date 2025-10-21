// для пути /login
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <Formik
            initialValues={{ 
                username: '', 
                password: '',
             }}
            onSubmit={ async ( values, { setSubmitting, setStatus}) => {
                try {
                    const response = await axios.post('api/v1/login', values); //отправка данных формы на сервер
                    localStorage.setItem('token', response.data.token);
                    navigate('/') //если получили токен, значит, пользователь авторзован и можно перенаправлять на главную страницу
                } catch (e) {
                    setStatus('Неверные имя пользователя или пароль')
                } finally {
                    setSubmitting(false); 
                }
                
            }}
        >
            {(formik) => {
                const { status} = formik;
                return (<Form>
                    <h1>Войти</h1>
                <div className="form-group">
                    <label htmlFor="username">Ваш ник</label>
                    <Field
                    type="text"
                    name="username"
                    className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">пароль</label>
                    <Field
                    type="password"
                    name="password"
                    className="form-control"
                    />
                </div>
                { status && <div className='text-danger'>{status}</div> }
                <button type="submit">Войти</button>
                </Form> 
                )
            }}
        </Formik>
    )
}