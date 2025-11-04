import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addChannel, setCurrentChannelId } from '../../features/channels/channelsSlice';

const schema = yup.object().shape({
  name: yup.string().trim().min(3).max(20).required('Обязательное поле'),
});

export default function AddChannelModal({ show, handleClose }) {
  const dispatch = useDispatch();
  const channels = useSelector((state) =>
    state.channels.entities ? Object.values(state.channels.entities) : []
  );
  const token = localStorage.getItem('token');

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    const name = values.name.trim();

    if (channels.some((ch) => ch.name === name)) {
      setFieldError('name', 'Канал с таким именем уже существует');
      setSubmitting(false);
      return;
    }

    try {
      const { data } = await axios.post(
        '/api/channels',
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(addChannel(data));
      dispatch(setCurrentChannelId(data.id));
      handleClose();
    } catch (err) {
      console.error('Ошибка создания канала', err);
      setFieldError('name', 'Ошибка при создании канала');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Formik initialValues={{ name: '' }} validationSchema={schema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <Modal.Body>
              <Field
                name="name"
                placeholder="Имя канала"
                className="form-control mb-2"
              />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Отменить
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Отправить
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}