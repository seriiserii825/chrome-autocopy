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

// handle Ctrl + Click
document.addEventListener("click", (event) => {
  if (!event.ctrlKey) return; // only trigger on Ctrl key

  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    writeClipboard(selectedText);
  }
});
