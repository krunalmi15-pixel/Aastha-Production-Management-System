const {
  app,
  BrowserWindow,
  screen
} = require("electron");

const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let backendProcess;

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

const isDev = !app.isPackaged;

function startBackend() {

  return new Promise((resolve) => {

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
      process.execPath,
      [backendPath],
      {
        windowsHide: true,
        cwd: path.dirname(backendPath)
      }
    );


    backendProcess.stdout.on(
      "data",
      (data) => {

        const message = data.toString();

        console.log(message);

        if (message.includes("Server running on port 5000")) {
          resolve();
        }

      }
    );


    backendProcess.stderr.on(
      "data",
      (data) => {
        console.error(data.toString());
      }
    );


    backendProcess.on(
      "exit",
      (code) => {
        console.log(
          "Backend exited:",
          code
        );
      }
    );

  });

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

app.whenReady().then(async () => {

  await startBackend();

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
      backendProcess.kill("SIGTERM");
      backendProcess = null;
    }

    if (
      process.platform !== "darwin"
    ) {
      app.quit();
    }
  }
);