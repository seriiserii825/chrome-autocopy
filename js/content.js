let lastClipboardData = "";
let noCheckClipboard = false;

const writeClipboard = async (text) => {
  noCheckClipboard = true;
  lastClipboardData = text;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.prepend(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }

    if (window.Toastify) {
      Toastify({
        text: "Text copied to clipboard",
        duration: 2500,
        gravity: "top",
        position: "right",
      }).showToast();
    }
  } catch (error) {
    console.error("Clipboard error:", error);
  } finally {
    noCheckClipboard = false;
  }
};

let mouseDownX = 0;
let mouseDownY = 0;

document.addEventListener("mousedown", (event) => {
  mouseDownX = event.clientX;
  mouseDownY = event.clientY;
});

document.addEventListener("mouseup", (event) => {
  if (event.ctrlKey) return;

  const dx = Math.abs(event.clientX - mouseDownX);
  const dy = Math.abs(event.clientY - mouseDownY);
  if (dx < 5 && dy < 5) return; // клик без перетаскивания

  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    writeClipboard(selectedText);
  }
});
