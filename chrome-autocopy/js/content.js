let lastClipboardData = "";
let noCheckClipboard = false;

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
    // Use the 'out of viewport hidden text area' trick
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Move textarea out of the viewport so it's not visible
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
        noCheckClipboard = false;
      }
    } catch (error) {
      console.error(error);
      noCheckClipboard = false;
    } finally {
      textArea.remove();
      noCheckClipboard = false;
    }
  }
};

function clipboardEnable() {
  let selecter = window.getSelection().toString();
  console.log(selecter, "selecter");
  console.log(selecter.length, "selecter.length");
  const is_true = selecter.length > 0;
  console.log(is_true, "is_true");
  if (is_true) {
    console.log(selecter, "selecter");
    writeClipboard(selecter);
  }
}

const startHandleClipboard = () => {
  document.addEventListener("mouseup", clipboardEnable);
};
const stopHandleClipboard = () => {
  document.removeEventListener("mouseup", clipboardEnable);
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
