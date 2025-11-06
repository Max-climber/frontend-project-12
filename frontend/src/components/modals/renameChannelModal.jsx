import { useSelector } from 'react-redux';
import { channelsSelectors } from '../../features/channels/channelsSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useEffect, useRef } from 'react';
import axios from 'axios';

const schema = yup.object().shape({
  name: yup.string().trim().min(3).max(20).required('Обязательное поле'),
});

export default function RenameChannelModal({ onClose, channel }) {
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
      inputRef.current.select();
    }
  }, []);

  return (
    <>
      <div className="modal-header">
        <h5 className="modal-title">Переименовать канал</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="modal-body">
        <Formik
        initialValues={{ name: channel.name }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          const name = values.name.trim();
          
          // Проверка на дубликат (исключая текущий канал)
          if (channels.some((ch) => ch.name === name && ch.id !== channel.id)) {
            setFieldError('name', 'Канал с таким именем уже существует');
            setSubmitting(false);
            return;
          }

          try {
            const token = localStorage.getItem('token');
            const headers = {
              Authorization: `Bearer ${token}`,
            };
            // В dev-режиме proxy переписывает /api на /api/v1
            // В prod используем прямой путь /api/v1
            const apiPath = import.meta.env.PROD ? `/api/v1/channels/${channel.id}` : `/api/channels/${channel.id}`;
            await axios.patch(apiPath, { name }, { headers });
            // Socket событие renameChannel придет автоматически от сервера
            // и обработается в ChatPage, поэтому здесь не нужно обновлять store
            onClose();
          } catch {
            setFieldError('name', 'Ошибка переименования канала');
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
                Отмена
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Сохранить
              </button>
            </div>
          </Form>
        )}
        </Formik>
      </div>
    </>
  );
}