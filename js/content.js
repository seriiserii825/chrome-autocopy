let lastClipboardData = "";
let noCheckClipboard = false;
const writeClipboard = async (text) => {
    noCheckClipboard = true;
    lastClipboardData = text;
    await navigator.clipboard.writeText(text);
    noCheckClipboard = false;
    if (Toastify) {
        Toastify({
            text: "Text copied to clipboard",
            duration: 3000,
            gravity: "top",
            position: "center",
        }).showToast();
    }
};

function clipboardEnable(){
    let selecter = window.getSelection().toString();
    if (selecter != null && selecter.length > 0) {
        console.log(selecter, 'selecter')
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
            sendResponse({ok: true});
            return;
        }
    }
    sendResponse({ok: true});
});
chrome.runtime.sendMessage({type: "status"}, (res) => {
    if (res?.active) {
        startHandleClipboard();
    } else {
        stopHandleClipboard();
    }
});
