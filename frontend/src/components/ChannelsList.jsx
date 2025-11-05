//  отображает список каналов и меню

import { useSelector } from 'react-redux';
import { channelsSelectors } from '../features/channels/channelsSlice';
import ChannelItem from './ChannelItem';

export default function ChannelsList({ openModal }) {
  const channels = useSelector((state) => {
    try {
      return channelsSelectors.selectAll(state) || [];
    } catch (error) {
      console.error('Ошибка при получении каналов:', error);
      return [];
    }
  });
  const currentChannelId = useSelector((state) => state.channels?.currentChannelId);


  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>Каналы</b>
        <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={() => openModal('add')}>
          +
        </button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.length > 0 ? channels.map((channel) => (
          <ChannelItem
            key={channel.id}
            channel={channel}
            currentChannelId={currentChannelId}
            openModal={openModal}
          />
        ))  : <p className="text-center text-muted">Нет каналов</p>}
      </ul>
    </div>
  );
}