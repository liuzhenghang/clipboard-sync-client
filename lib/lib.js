const Store = require('electron-store')
const store = new Store()
export class App {
    wsConnection = null
    clipboardText = null
    clipboardListing = null
    statusCallback = null

    sendMessage(message) {
        try {
            this.wsConnection.send(JSON.stringify(message))
        } catch (e) {
        }
    }

    sendStatusCallback(status, message) {
        if (this.statusCallback) {
            this.statusCallback({
                status: status,
                message: message
            })
        }
    }

    clientId
    deviceId

    connect(options) {
        const wsUrl = options.wsUrl
        const groupName = options.groupName
        this.deviceId = options.deviceId
        this.statusCallback = options.statusCallback
        this.clientId = 'client_' + groupName;
        if (this.wsConnection) {
            this.sendStatusCallback(false, `Already connected to ${wsUrl}`)
        } else {
            // 创建WebSocket连接
            this.wsConnection = new WebSocket(wsUrl);

            this.wsConnection.onopen = () => {
                this.sendStatusCallback(true, `Connected to ${wsUrl}`)
                console.log({
                    clientId: this.clientId,
                    deviceId: this.deviceId,
                    connect: true
                })
                // 可以在此处将表单内容传递给后端方法，例如发送groupName等
                // wsConnection.send(groupName);
                this.sendMessage({
                    clientId: this.clientId,
                    deviceId: this.deviceId,
                    connect: true
                })
            }

            this.wsConnection.onclose = (e) => {
                console.log('is disconnected')
                this.sendStatusCallback(false, `Disconnected`)
                this.wsConnection = null;
            }
            // Handle WebSocket messages
            this.wsConnection.onmessage = function (event) {
                const message = JSON.parse(event.data)
                if (!message.time) {
                    return
                }
                if (!message.data) {
                    return
                }
                if (message.deviceId === this.deviceId) {
                    return
                }
                navigator.clipboard.writeText(message.data).then()
            }
            // 创建一个监听剪贴板变化的函数
            this.clipboardListing = setInterval(() => {
                navigator.clipboard.readText()
                    .then(text => {
                        if (!text) {
                            return
                        }
                        if (this.clipboardText === text) {
                            return
                        }
                        this.clipboardText = text
                        this.sendMessage({
                            clientId: this.clientId,
                            deviceId: this.deviceId,
                            time: new Date().toLocaleString(),
                            data: this.clipboardText
                        })
                    })
            }, 1000)
        }
    }
    disconnect() {
        if (this.wsConnection) {
            this.wsConnection.close();
        }
        if (this.clipboardListing) {
            clearInterval(this.clipboardListing)
        }
    }


}
