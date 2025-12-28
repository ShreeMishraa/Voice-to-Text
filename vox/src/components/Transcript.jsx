const Transcript = ({ finalText, interimText }) => {
  return (
    <div className="transcript-box">
      {finalText || interimText ? (
        <p>
          {finalText}
          <span className="interim">{interimText}</span>
        </p>
      ) : (
        <p className="placeholder">
          Click "Start Recording" to begin transcription...
        </p>
      )}
    </div>
  )
}

export default Transcript
