import * as yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { setCurrentChannelId } from '../../features/channels/channelsSlice'
import { channelsSelectors } from '../../features/channels/channelsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import axios from 'axios'
import { filterProfanity } from '../../utils/profanityFilter'

export default function AddChannelModal({ onClose }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const inputRef = useRef(null)
  const channels = useSelector(state => {
    try {
      return channelsSelectors.selectAll(state) || []
    } catch (error) {
      console.error('Ошибка при получении каналов:', error)
      return []
    }
  })

  const schema = yup.object().shape({
    name: yup.string().trim().min(3, t('channels.validation.length')).max(20, t('channels.validation.length')).required(t('channels.validation.required')),
  })

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <>
      <div className="modal-header">
        <h5 className="modal-title">{t('channels.add')}</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="modal-body">
        <Formik
          initialValues={{ name: '' }}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            const name = values.name.trim()
            // Фильтруем нецензурные слова в названии канала
            const filteredName = filterProfanity(name)

            // Проверка на дубликат
            if (channels.some(channel => channel.name === filteredName)) {
              setFieldError('name', t('channels.validation.duplicate'))
              setSubmitting(false)
              return
            }

            // Используем REST API для создания канала
            try {
              const token = localStorage.getItem('token')
              const headers = {
                Authorization: `Bearer ${token}`,
              }
              // В dev-режиме proxy переписывает /api на /api/v1
              // В prod используем прямой путь /api/v1
              const apiPath = import.meta.env.PROD ? '/api/v1/channels' : '/api/channels'
              const { data: channel } = await axios.post(apiPath, { name: filteredName }, { headers })
              // Socket событие newChannel придет автоматически от сервера
              // и обработается в ChatPage, поэтому здесь не нужно обновлять store
              dispatch(setCurrentChannelId(channel.id))
              toast.success(t('toast.channelCreated'))
              onClose()
            } catch {
              setFieldError('name', t('channels.errors.create'))
            } finally {
              setSubmitting(false)
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">{t('channels.name')}</label>
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
