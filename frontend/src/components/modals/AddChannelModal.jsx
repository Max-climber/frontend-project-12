
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { setCurrentChannelId } from '../../features/channels/channelsSlice';
import { channelsSelectors } from '../../features/channels/channelsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import api from '../../api/axios';

const schema = yup.object().shape({
  name: yup.string().trim().min(3, 'Минимум 3 символа').max(20, 'Максимум 20 символов').required('Обязательное поле'),
});

export default function AddChannelModal({ onClose }) {
    const dispatch = useDispatch();
    const inputRef = useRef(null);
    const channels = useSelector((state) => {
      try {
        return channelsSelectors.selectAll(state) || [];
      } catch (error) {
        console.error('Ошибка при получении каналов:', error);
        return [];
      }
    });

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []);

    return (
        <>
            <div className="modal-header">
                <h5 className="modal-title">Добавить канал</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
                <Formik
                    initialValues={{ name: '' }}
                    validationSchema={schema}
                    onSubmit={async (values, { setSubmitting, setFieldError }) => {
                        const name = values.name.trim();

                        // Проверка на дубликат
                        if (channels.some((channel) => channel.name === name)) {
                            setFieldError('name', 'Канал с таким именем уже существует');
                            setSubmitting(false);
                            return;
                        }
                    
                        // Используем REST API для создания канала
                        try {
                            const apiPath = import.meta.env.PROD ? '/api/v1/channels' : '/api/channels';
                            const { data: channel } = await api.post(apiPath, { name });
                            
                            dispatch(setCurrentChannelId(channel.id));
                            onClose();
                        } catch {
                            setFieldError('name', 'Ошибка создания канала');
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                    <Form>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Имя канала</label>
                            <Field 
                                id="name" 
                                name="name" 
                                className="form-control"
                                innerRef={inputRef}
                            />
                            <ErrorMessage name="name" component="div" className="text-danger" />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
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
        </>
    )
}