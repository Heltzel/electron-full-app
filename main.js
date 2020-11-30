const { app, BrowserWindow, Menu, shell } = require('electron')
const ipc = require('electron').ipcMain

let win

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  })

  win.loadFile('./src/pages/index.html')
  win.on('closed', () => app.quit())
}

const menu = Menu.buildFromTemplate([
  {
    label: 'Menu',
    submenu: [
      { label: 'Adjust Notification Value' },
      {
        label: 'CoinMarketCap',
        click() {
          shell.openExternal('http://coinmarketcap.com')
        },
      },
      { type: 'separator' },
      {
        label: 'exit',
        accelerator: 'Ctrl+Q',
        click() {
          app.quit()
        },
      },
    ],
  },
  {
    label: 'Info',
    submenu: [
      {
        label: 'About Electron',
        click() {
          shell.openExternal('https://www.electronjs.org')
        },
      },
      {
        label: 'About Api',
        click() {
          shell.openExternal('https://min-api.cryptocompare.com/')
        },
      },
    ],
  },
])

app.whenReady().then(createWindow).then(Menu.setApplicationMenu(menu))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipc.on('update-notify-value', function (event, args) {
  win.webContents.send('targetPriceVal', args)
})
