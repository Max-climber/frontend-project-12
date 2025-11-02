import { useDispatch } from 'react-redux';
import { renameChannel } from '../../features/channels/channelsSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().trim().min(3).max(20).required('Обязательное поле'),
});

export default function RenameChannelModal({ onClose, channel }) {
  const dispatch = useDispatch();

  return (
    <div className="modal">
      <Formik
        initialValues={{ name: channel.name }}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(renameChannel({ id: channel.id, changes: { name: values.name.trim() } }));
          setSubmitting(false);
          onClose();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="name" className="form-control" />
            <ErrorMessage name="name" component="div" className="text-danger" />
            <div className="d-flex justify-content-end mt-3">
              <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
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
  );
}