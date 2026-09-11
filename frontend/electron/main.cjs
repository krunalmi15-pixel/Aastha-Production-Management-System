const {
  app,
  BrowserWindow,
  screen
} = require("electron");

const path = require("path");

let mainWindow;

const isDev = !app.isPackaged;

function createWindow() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  mainWindow = new BrowserWindow({
    width: Math.floor(width * 0.9),
    height: Math.floor(height * 0.9),
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: "#ffffff",
    show: false,
    autoHideMenuBar: true,
    title: "Aastha Engineering Production Management System",
    icon: path.join(
      __dirname,
      "assets",
      "icon.ico"
    ),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.once(
    "ready-to-show",
    () => {
      mainWindow.show();
    }
  );

  if (isDev) {
    mainWindow.loadURL(
      "http://localhost:5173"
    );
  } else {
    mainWindow.loadFile(
      path.join(
        __dirname,
        "../dist/index.html"
      )
    );
  }

  mainWindow.setMenu(null);
}

app.whenReady()
.then(() => {
  createWindow();

  app.on(
    "activate",
    () => {
      if (
        BrowserWindow
        .getAllWindows()
        .length === 0
      ) {
        createWindow();
      }
    }
  );
});

app.on(
  "window-all-closed",
  () => {
    if (
      process.platform !== "darwin"
    ) {
      app.quit();
    }
  }
);