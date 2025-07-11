let lastClipboardData = "";
let noCheckClipboard = false;
let isDragging = false;

const writeClipboard = async (text) => {
  noCheckClipboard = true;
  lastClipboardData = text;

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    if (Toastify) {
      Toastify({
        text: "Text copied to clipboard",
        duration: 3000,
        gravity: "top",
        position: "right",
      }).showToast();
    }
    noCheckClipboard = false;
  } else {
    // Fallback for insecure context
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "absolute";
    textArea.style.left = "-999999px";
    document.body.prepend(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
      if (Toastify) {
        Toastify({
          text: "Text copied to clipboard",
          duration: 3000,
          gravity: "top",
          position: "right",
        }).showToast();
      }
    } catch (error) {
      console.error(error);
    } finally {
      textArea.remove();
      noCheckClipboard = false;
    }
  }
};

function clipboardEnable() {
  const selectedText = window.getSelection().toString();
  if (selectedText.length > 0) {
    writeClipboard(selectedText);
  }
}

function handleMouseDown() {
  isDragging = false;
}

function handleMouseMove() {
  isDragging = true;
}

function handleMouseUp() {
  if (isDragging) {
    clipboardEnable();
  }
}

const startHandleClipboard = () => {
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

const stopHandleClipboard = () => {
  document.removeEventListener("mousedown", handleMouseDown);
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "enable": {
      if (request.value) {
        startHandleClipboard();
      } else {
        stopHandleClipboard();
      }
      sendResponse({ ok: true });
      return;
    }
  }
  sendResponse({ ok: true });
});

chrome.runtime.sendMessage({ type: "status" }, (res) => {
  if (res?.active) {
    startHandleClipboard();
  } else {
    stopHandleClipboard();
  }
});
