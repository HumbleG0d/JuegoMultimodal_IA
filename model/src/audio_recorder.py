import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wavfile

SAMPLE_RATE = 44100  # Sample rate in Hz

def record_audio():
    print("[INFO: Recording... Press <Enter> to stop]")
    audio_data = []  # Initialize a list to store audio frames
    def callback(indata, frames, time, status):
        audio_data.append(indata.copy())
    with sd.InputStream(samplerate=SAMPLE_RATE, channels=1, callback=callback, dtype='int16'):
        input()  # Wait for the user to press Enter to stop recording
    print("[INFO: Recording complete]")
    print()
    audio_data = np.concatenate(audio_data)  # Concatenate the list into a single array
    filename = "output.wav"
    wavfile.write(filename, SAMPLE_RATE, audio_data)
    return audio_data