const Transcript = ({ finalText, interimText, isLoading }) => {
  return (
    <div className="transcript-box">
      {isLoading ? (
        <p className="loading">Transcribing with Hugging Face…</p>
      ) : finalText ? (
        <p>{finalText}</p>
      ) : interimText ? (
        <p className="interim">{interimText}</p>
      ) : (
        <p className="placeholder">
          Click "Start Recording" to begin transcription…
        </p>
      )}
    </div>
  )
}

export default Transcript
