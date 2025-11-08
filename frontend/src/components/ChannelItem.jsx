//  отдельная кнопка канала + dropdown (выпадающий список)

import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { setCurrentChannelId } from '../features/channels/channelsSlice'

export default function ChannelItem({ channel, currentChannelId, openModal }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const handleSelect = () => {
    dispatch(setCurrentChannelId(channel.id))
  }

  const btnClass = channel.id === currentChannelId ? 'btn btn-secondary w-100 text-start' : 'btn w-100 text-start'

  if (!channel.removable) {
    return (
      <li className="nav-item w-100">
        <button type="button" className={btnClass} onClick={handleSelect}>
          <span className="me-1">#</span>
          {channel.name}
        </button>
      </li>
    )
  }

  return (
    <li className="nav-item w-100">
      <div role="group" className="d-flex dropdown btn-group">
        <button type="button" className={`${btnClass} text-truncate`} onClick={handleSelect}>
          <span className="me-1">#</span>
          {channel.name}
        </button>
        <button
          type="button"
          className="btn dropdown-toggle dropdown-toggle-split"
          data-bs-toggle="dropdown"
        >
          <span className="visually-hidden">
            {t('channels.manage')}
          </span>
        </button>
        <ul className="dropdown-menu">
          <li>
            <button
              className="dropdown-item"
              onClick={() => openModal('rename', channel)}
            >
              {t('channels.rename')}
            </button>
          </li>
          <li>
            <button
              className="dropdown-item"
              onClick={() => openModal('remove', channel)}
            >
              {t('modals.remove')}
            </button>
          </li>
        </ul>
      </div>
    </li>
  )
}
