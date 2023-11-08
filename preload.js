const { ipcRenderer } = require('electron')
ipcRenderer.on('ipc-status-change', (event, data) => {
    // 处理从主进程发送的消息
    try {
        window.ipc_statusChange(data)
    } catch (e) {

    }
})

window.ipc_connectServer = (options) => {
    // 执行一些操作
    ipcRenderer.send('ipc-connect', options)
}
window.ipc_disconnectServer = () => {
    // 执行一些操作
    ipcRenderer.send('ipc-disconnect')
}
