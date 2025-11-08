import { Modal, Button, Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { addChannel, setCurrentChannelId, channelsSelectors } from '../../features/channels/channelsSlice'
import axios from 'axios'

const schema = yup.object().shape({
  name: yup.string().trim().min(3).max(20).required('Обязательное поле'),
})

export default function AddChannelModal({ show, handleClose }) {
  const dispatch = useDispatch()
  const channels = useSelector(state => {
    try {
      return channelsSelectors.selectAll(state) || []
    } catch (error) {
      console.error('Ошибка при получении каналов:', error)
      return []
    }
  })

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    const name = values.name.trim()

    if (channels.some(ch => ch.name === name)) {
      setFieldError('name', 'Канал с таким именем уже существует')
      setSubmitting(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const headers = {
        Authorization: `Bearer ${token}`,
      }
      // В dev-режиме proxy переписывает /api на /api/v1
      // В prod используем прямой путь /api/v1
      const apiPath = import.meta.env.PROD ? '/api/v1/channels' : '/api/channels'
      const { data } = await axios.post(apiPath, { name }, { headers })
      dispatch(addChannel(data))
      dispatch(setCurrentChannelId(data.id))
      handleClose()
    } catch (err) {
      console.error('Ошибка создания канала', err)
      setFieldError('name', 'Ошибка при создании канала')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Formik initialValues={{ name: '' }} validationSchema={schema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <Modal.Body>
              <Field name="name" placeholder="Имя канала" className="form-control mb-2" />
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
  )
}
