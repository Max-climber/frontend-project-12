import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { setCurrentChannelId } from '../../features/channels/channelsSlice'
import { channelsSelectors } from '../../features/channels/channelsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useRef } from 'react'
import axios from 'axios'
import { filterProfanity } from '../../utils/profanityFilter'

export default function AddChannelModal({ onClose }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
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
    const filteredName = filterProfanity(name)

    if (channels.some(channel => channel.name === filteredName)) {
      setFieldError('name', t('channels.validation.duplicate'))
      setSubmitting(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const headers = {
        Authorization: `Bearer ${token}`,
      }
      const apiPath = import.meta.env.PROD ? '/api/v1/channels' : '/api/channels'
      const { data: channel } = await axios.post(apiPath, { name: filteredName }, { headers })
      dispatch(setCurrentChannelId(channel.id))
      toast.success(t('toast.channelCreated'))
      onClose()
    }
    catch {
      setFieldError('name', t('channels.errors.create'))
    }
    finally {
      setSubmitting(false)
    }
  }, [channels, dispatch, onClose, t])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <>
      <div className="modal-header">
        <h5 className="modal-title">
          {t('channels.add')}
        </h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="modal-body">
        <Formik
          initialValues={{ name: '' }}
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
                  {t('modals.send')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}
