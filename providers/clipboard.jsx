/**
 * Copies a given text to the clipboard.
 * @param {string} text - The text to copy.
 * @returns {Promise} A promise that resolves if the text was copied successfully and rejects if not.
 */
export async function copyToClipboard(text) {
  // Navigator clipboard api needs a secure context (https)
  if (!navigator.clipboard) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful
        ? Promise.resolve()
        : Promise.reject("Failed to copy text.");
    } catch (err) {
      document.body.removeChild(textArea);
      return Promise.reject("Failed to copy text.");
    }
  }

  return navigator.clipboard
    .writeText(text)
    .then(() => console.log("Text copied to clipboard"))
    .catch((err) => Promise.reject("Failed to copy text: " + err));
}
