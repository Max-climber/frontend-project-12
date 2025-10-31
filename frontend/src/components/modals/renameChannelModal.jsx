import { useDispatch } from 'react-redux';
import { renameChannel } from '../features/channels/channelsSlice';
import socket from '../socket';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().trim().min(3).max(20).required(),
});

export default function RenameChannelModal({ onClose, channel }) {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{ name: channel.name }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        socket.emit('renameChannel', { id: channel.id, name: values.name.trim() }, (response) => {
          if (response && response.name) {
            dispatch(renameChannel({ id: channel.id, changes: { name: response.name } }));
            onClose();
          } else {
            setFieldError('name', 'Ошибка при переименовании');
          }
          setSubmitting(false);
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name="name" className="form-control" />
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Сохранить</button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Отменить</button>
        </Form>
      )}
    </Formik>
  );
}