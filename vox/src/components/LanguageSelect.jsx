const LanguageSelect = ({ language, setLanguage }) => {
  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      <option value="en-US">English (US)</option>
      <option value="en-GB">English (UK)</option>
      <option value="en-IN">English (India)</option>
    </select>
  )
}

export default LanguageSelect
