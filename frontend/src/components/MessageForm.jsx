import socket from "../socket";
import { useSelector } from "react-redux";

//компонент формы, чтобы пользователь отправлял сообщение в чат.
const MessageForm = () => {
    const currentChannelId = useSelector((state) => state.channels.currentChannelId); // id канала, в который сейчас пишет юзер
    const username = useSelector((state) => state.user.username);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const text = e.target.elements.message.value.trim()
        if(!text) return;

        socket.emit('newMessage', {
            body: text, 
            channelId: currentChannelId || 1, 
            username, 
            }   
        )
        
        e.target.reset(); //очищаем поле ввода после отправки сообщения

    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
            name="message"
            placeholder="Введите сообщение"
            className="form-control"
            />
            <button type="submit">Отправить</button>
        </form>
    )
}

export default MessageForm;