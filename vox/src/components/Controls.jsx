const Controls = ({ isRecording, toggleRecording }) => {
  return (
    <button className={`record-btn ${isRecording ? 'recording' : ''}`}
      onClick={toggleRecording}>
      {isRecording ? '⏹ Stop Recording' : '🎤 Start Recording'}
    </button>
  )
}

export default Controls
