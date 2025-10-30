
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { addChannel, setCurrentChannelId } from '../features/channels/channelsSlice';
import { channelsSelectors } from '../features/channels/channelsSlice';

import { useDispatch, useSelector } from 'react-redux';
import socket from '../socket';

const schema = yup.object().shape({
  name: yup.string().trim().min(3, 'Минимум 3 символа').max(20, 'Максимум 20 символов').required('Обязательное поле'),
});

export default function AddChannelModal({ onClose }) {
    const dispatch = useDispatch();
    const channels = useSelector(channelsSelectors.selectAll) || [];
    return (
        <div className="modal">
            <Formik
                initialValues={{ name: '' }}
                validationSchema={schema}
                onSubmit={(values, { setSubmitting, setFieldError }) => {
                    const name = values.name.trim();

                    // Проверка на дубликат
                    if (channels.some((channel) => channel.name === name)) {
                        setFieldError('name', 'Канал с таким именем уже существует');
                        setSubmitting(false);
                        return;
                    }
                
                    // Отправляем событие на сервер
                    socket.emit('newChannel', { name }, (response) => {
                        if (response && response.id) {
                        const channel = response;
                        dispatch(addChannel(channel));
                        dispatch(setCurrentChannelId(channel.id));
                        onClose();
                        } else {
                        setFieldError('name', response.error || 'Ошибка создания канала');
                        }
                        setSubmitting(false);
                    });
                }}
            >
                {({ isSubmitting }) => (
                <Form>
                    <label htmlFor="name">+</label>
                    <Field id="name" name="name" className="form-control" />
                    <ErrorMessage name="name" component="div" className="text-danger" />
                    <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                        Отменить
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        Отправить
                    </button>
                    </div>
                </Form>
                )}
            </Formik>
        </div>
    )
}