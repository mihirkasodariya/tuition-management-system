export const speakTextFunction = (text) => {
  if (!window.speechSynthesis) {
    console.error('Speech Synthesis API is not supported in this browser.');
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US'; // Set the language to English
  utterance.rate = 1; // Set the speaking rate (1 is normal speed)
  utterance.pitch = 1; // Set the pitch (1 is normal pitch)

  window.speechSynthesis.speak(utterance);
};
