import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { addChannel, setCurrentChannelId } from '../../features/channels/channelsSlice';
import { useDispatch, useSelector } from 'react-redux';

const schema = yup.object().shape({
  name: yup.string().trim().min(3, 'Минимум 3 символа').max(20, 'Максимум 20 символов').required('Обязательное поле'),
});

export default function AddChannelModal({ onClose }) {
  const dispatch = useDispatch();
  const channels = useSelector((state) => Object.values(state.channels.entities));

  return (
    <div className="modal">
      <Formik
        initialValues={{ name: '' }}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          const name = values.name.trim();

          if (channels.some((ch) => ch.name === name)) {
            setFieldError('name', 'Канал с таким именем уже существует');
            setSubmitting(false);
            return;
          }

          const newChannel = {
            id: Date.now(),
            name,
            removable: true,
          };

          dispatch(addChannel(newChannel));
          dispatch(setCurrentChannelId(newChannel.id));
          setSubmitting(false);
          onClose();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <label htmlFor="name" className="form-label">Имя канала</label>
            <Field id="name" name="name" className="form-control" />
            <ErrorMessage name="name" component="div" className="text-danger" />

            <div className="d-flex justify-content-end mt-3">
              <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                Создать
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}