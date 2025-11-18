import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { channelsSelectors } from '../../features/channels/channelsSlice'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useCallback, useEffect, useRef } from 'react'
import axios from 'axios'

export default function RenameChannelModal({ onClose, channel }) {
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const channels = useSelector((state) => {
    try {
      return channelsSelectors.selectAll(state) || []
    }
    catch (error) {
      console.error('Ошибка при получении каналов:', error)
      return []
    }
  })

  const schema = yup.object().shape({
    name: yup.string().trim().min(3, t('channels.validation.length')).max(20, t('channels.validation.length')).required(t('channels.validation.required')),
  })

  const handleSubmit = useCallback(async (values, { setSubmitting, setFieldError }) => {
    const name = values.name.trim()

    if (channels.some(ch => ch.name === name && ch.id !== channel.id)) {
      setFieldError('name', t('channels.validation.duplicate'))
      setSubmitting(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const headers = {
        Authorization: `Bearer ${token}`,
      }
      const apiPath = import.meta.env.PROD ? `/api/v1/channels/${channel.id}` : `/api/channels/${channel.id}`
      await axios.patch(apiPath, { name }, { headers })
      toast.success(t('toast.channelRenamed'))
      onClose()
    }
    catch {
      setFieldError('name', t('channels.errors.rename'))
    }
    finally {
      setSubmitting(false)
    }
  }, [channel.id, channels, onClose, t])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [])

  return (
    <>
      <div className="modal-header">
        <h5 className="modal-title">
          {t('channels.rename')}
        </h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="modal-body">
        <Formik
          initialValues={{ name: channel.name }}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  {t('channels.name')}
                </label>
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
                  {t('modals.cancel')}
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {t('modals.save')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}
