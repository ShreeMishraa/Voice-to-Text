const Actions = ({ finalText, clearText }) => {
  const copyText = () => {
    navigator.clipboard.writeText(finalText)
  }

  const saveText = () => {
    const blob = new Blob([finalText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'transcript.txt'
    a.click()
  }

  return (
    <div className="actions">
      <button onClick={copyText} disabled={!finalText}>📋 Copy</button>
      <button onClick={saveText} disabled={!finalText}>💾 Save</button>
      <button onClick={clearText} disabled={!finalText}>🗑 Clear</button>
    </div>
  )
}

export default Actions
