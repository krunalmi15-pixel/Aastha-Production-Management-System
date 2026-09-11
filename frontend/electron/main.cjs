const {
  app,
  BrowserWindow,
  screen
} = require("electron");

const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let backendProcess;

const isDev = !app.isPackaged;

function startBackend() {
  const backendPath = app.isPackaged
    ? path.join(
        process.resourcesPath,
        "backend",
        "dist",
        "server.js"
      )
    : path.join(
        __dirname,
        "../../backend/dist/server.js"
      );

  backendProcess = spawn(
    "node",
    [backendPath],
    {
      windowsHide: true
    }
  );

  backendProcess.stdout.on(
    "data",
    (data) => {
      console.log(
        `Backend: ${data}`
      );
    }
  );

  backendProcess.stderr.on(
    "data",
    (data) => {
      console.error(
        `Backend Error: ${data}`
      );
    }
  );
}

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
    mainWindow
      .loadFile(
        path.join(
          __dirname,
          "../dist/index.html"
        )
      )
      .catch((err) => {
        console.log(
          "Failed loading app:",
          err
        );
      });
  }

  mainWindow.setMenu(null);
}

app.whenReady()
.then(() => {
  startBackend();
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
    if (backendProcess) {
      backendProcess.kill();
    }

    if (
      process.platform !== "darwin"
    ) {
      app.quit();
    }
  }
);