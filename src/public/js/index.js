  const socket = io();

const enviarMensaje = () => {
    const user = document.getElementById('user').value;
    const message = document.getElementById('message').value;
    socket.emit('message', { user, message });
    document.getElementById('message').value = '';
};

socket.on('message', (data) => {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML += `<li><strong>${data.user}</strong>: ${data.message}</li>`;
});
