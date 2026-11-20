const base64Field = document.querySelector<HTMLTextAreaElement>('#base64')!
const textField = document.querySelector<HTMLTextAreaElement>('#plain-text')!
const error = document.querySelector<HTMLParagraphElement>('#error')!
const encoder = new TextEncoder()
const decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true })

function showError(message = '') {
  error.textContent = message
  if (message) {
    base64Field.setAttribute('aria-invalid', 'true')
  } else {
    base64Field.removeAttribute('aria-invalid')
  }
}

textField.addEventListener('input', () => {
  let binary = ''
  for (const byte of encoder.encode(textField.value)) {
    binary += String.fromCharCode(byte)
  }

  base64Field.value = btoa(binary)
  showError()
})

base64Field.addEventListener('input', () => {
  try {
    const binary = atob(base64Field.value)
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
    textField.value = decoder.decode(bytes)
    showError()
  } catch (exception) {
    textField.value = ''
    showError(exception instanceof DOMException ? 'Invalid Base64 input.' : 'The decoded data is not valid UTF-8 text.')
  }
})
