const { app, BrowserWindow, shell, Menu } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Photopea",
    icon: path.join(__dirname, "build", "icon.png"),
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.maximize();
  win.show();

  Menu.setApplicationMenu(null);

  win.loadURL("https://www.photopea.com/");

  win.webContents.on("dom-ready", () => {
    win.webContents.executeJavaScript(`
      Object.defineProperty(window, 'innerWidth', {
        get: () => document.documentElement.clientWidth + 300
      });
      window.dispatchEvent(new Event('resize'));
    `);
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith("https://www.photopea.com")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  win.on("page-title-updated", (e) => {
    e.preventDefault();
    win.setTitle("Photopea");
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
