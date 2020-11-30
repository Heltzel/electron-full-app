const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow
const axios = require('axios')
const ipc = electron.ipcRenderer

const notifyBtn = document.getElementById('notifyBtn')
const price = document.querySelector('h1')
const targetPrice = document.querySelector('#target-price')
let targetPriceVal

const notification = {
  title: 'BTC Alert',
  body: 'BTC just beat your target price',
  icon: path.join(__dirname, '../../assets/images/btc.png'),
}

function getBTC() {
  axios
    .get(
      'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD',
    )
    .then((res) => {
      const cryptos = res.data.BTC.USD
      price.innerHTML = '$ ' + cryptos.toFixed(2)
      if (targetPrice.innerHTML !== '' && targetPriceVal < res.data.BTC.USD) {
        const myNotification = new window.Notification(
          notification.title,
          notification,
        )
      }
    })
}
getBTC()
setInterval(getBTC, 10000)

notifyBtn.addEventListener('click', (event) => {
  const modalPath = path.join(__dirname, '../pages/add.html')
  let win = new BrowserWindow({
    width: 400,
    height: 200,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  })
  win.on('closed', () => {
    win = null
  })
  win.loadFile(modalPath)
})

ipc.on('targetPriceVal', function (event, args) {
  targetPriceVal = Number(args)
  if (Number.isInteger(targetPriceVal) && targetPriceVal > 0) {
    targetPrice.innerHTML = '$ ' + targetPriceVal.toFixed(0) + '. 00'
  } else {
    targetPrice.innerHTML = 'Choose a Target Price'
  }
})
