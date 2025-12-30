const socket = io();

const btnSend = document.getElementById('btn-send');
const inputMsg = document.getElementById('input-msg');
const messagesDiv = document.getElementById('messages');

btnSend.onclick = () => {
    if(inputMsg.value) {
        socket.emit('send-message', { user: 'Usuario', msg: inputMsg.value });
        inputMsg.value = '';
    }
};

socket.on('new-message', (data) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message';
    msgDiv.innerHTML = '<b>' + data.user + ':</b> ' + data.msg;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Lógica de "Volver"
document.getElementById('btn-back').onclick = () => {
    alert('Regresando al menú principal...');
};
