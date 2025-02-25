const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, '../renderer/index.js'), // Đường dẫn đến tệp renderer
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    win.loadFile(path.join(__dirname, '../renderer/index.html')); // Tải tệp HTML
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});