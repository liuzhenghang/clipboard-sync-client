const { app, BrowserWindow, Tray, Menu,nativeImage,ipcMain,clipboard } = require('electron');
const WebSocket = require('websocket').w3cwebsocket;
const os = require('os');
const path = require('node:path')


let mainWindow;
let tray;
let isQuiting = false;
let webContents
function createWindow() {
    const iconSrc = path.join(__dirname,'icons/tray-icon@2x.png');
    const trayIcon = nativeImage.createFromPath(iconSrc);

    mainWindow = new BrowserWindow({ width: 800, height: 600, show: true,icon:trayIcon,
        webPreferences: {
            nodeIntegration: true, // 启用 Node.js 集成
            contextIsolation: false, // 禁用上下文隔离
            backgroundThrottling: false, // 禁用后台降频
            preload: path.join(__dirname, 'preload.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
        }})
    mainWindow.webContents.on('did-finish-load', () => {
        // 将常量值注入到渲染进程的全局上下文中
        mainWindow.webContents.executeJavaScript(`window.osName = "${os.hostname()}";`);
    })
    mainWindow.loadFile('index.html')
    mainWindow.on('minimize',function(event){
        event.preventDefault();
        mainWindow.hide();
    })
    mainWindow.on('close', function (event) {
        if(!isQuiting){
            event.preventDefault();
            mainWindow.hide();
            return false
        }
        return true
    })
    webContents = mainWindow.webContents

    // const iconSrc = path.join(__dirname,'icons/tray-icon.png');
    // const trayIcon = nativeImage.createFromPath(iconSrc);
    // tray = new Tray('icons/tray-icon.png')
    tray = new Tray(trayIcon)
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Open', click: () => mainWindow.show() },
        { label: 'Exit', click: () => {
                isQuiting = true
                app.quit()
            } }
    ])
    tray.setToolTip('Clipboard Sync')
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
        mainWindow.show();
    })
}
app.commandLine.appendSwitch('disable-background-timer-throttling')
app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // app.quit()
    }
})
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})
ipcMain.on('ipc-connect', (event, options) => {
    // 执行主线程方法
    connectWebsocket(options)
})
ipcMain.on('ipc-disconnect', (event) => {
    // 执行主线程方法
    disconnectWebsocket()
})

let wsConnection = null;
let clipboardText = null;
let clipboardListing = null;
let clientId = null;
let deviceId = null;
function sendMessage(message) {
    try {
        wsConnection.send(JSON.stringify(message))
    } catch (e) {
    }
}
function sendStatusCallback(status, message) {
    webContents.send('ipc-status-change', {
        status: status,
        message: message
    })
}
function connectWebsocket(options) {
    const wsUrl = options.wsUrl
    const groupName = options.groupName
    deviceId = os.hostname()
    // this.statusCallback = options.statusCallback
    clientId = 'client_' + groupName;
    if (wsConnection) {
        sendStatusCallback(false, `Already connected to ${wsUrl}`)
    } else {
        // 创建WebSocket连接
        wsConnection = new WebSocket(wsUrl);

        wsConnection.onopen = () => {
            sendStatusCallback(true, `Connected to ${wsUrl}`)
            console.log({
                clientId: clientId,
                deviceId: deviceId,
                connect: true
            })
            // 可以在此处将表单内容传递给后端方法，例如发送groupName等
            // wsConnection.send(groupName);
            sendMessage({
                clientId: clientId,
                deviceId: deviceId,
                connect: true
            })
        }

        wsConnection.onclose = (e) => {
            console.log('is disconnected')
            sendStatusCallback(false, `Disconnected`)
            wsConnection = null;
        }
        // Handle WebSocket messages
        wsConnection.onmessage = function (event) {
            const message = JSON.parse(event.data)
            if (!message.time) {
                return
            }
            if (!message.data) {
                return
            }
            if (message.deviceId === deviceId) {
                return
            }
            try {
                // if (new Date().getTime() > new Date(message.time).getTime()){
                //     // 检测到外部剪贴板内容变化，但是时间戳比当前时间戳还要小，说明是自己发送的消息，不需要处理
                //     return;
                // }
                clipboard.writeText(message.data)
            }catch (e) {

            }
        }
        // 创建一个监听剪贴板变化的函数
        clipboardListing = setInterval(() => {
           const text = clipboard.readText()
            if (!text) {
                return
            }
            if (clipboardText === text) {
                return
            }
            clipboardText = text
            sendMessage({
                clientId: clientId,
                deviceId: deviceId,
                time: new Date().toLocaleString(),
                data: clipboardText
            })
        }, 1000)
    }
}
function disconnectWebsocket() {
    if (wsConnection) {
        wsConnection.close();
    }
    if (clipboardListing) {
        clearInterval(clipboardListing)
        clipboardListing = null
    }
}
