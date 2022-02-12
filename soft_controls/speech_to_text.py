import time
import speech_recognition as sr
import soundfile as sf
from io import BytesIO
import os

r = sr.Recognizer()
mic = sr.Microphone()

def speech_to_text(audio_source, is_finish_delete=True):
    # print("## Start Recognition")
    text = ""
    try:
        with sr.AudioFile(audio_source) as src:
            audio = r.record(src)
            text = r.recognize_google(audio, language='ja-JP')
        # print(f"## SpeechRecognition Result = '{text}'")
        if is_finish_delete:
            os.remove(audio_source)
    # 以下は認識できなかったときに止まらないように。
    except sr.UnknownValueError:
        print("## Error [could not understand audio]")
    except sr.RequestError as e:
        print("## Error [Could not request results from Google Speech Recognition service; {0}]".format(e))
    except:
        print("## Error [Other Error]")
    return text

if __name__ == "__main__":
    print("音声認識テスト")
    import sys
    from os import path
    sys.path.append(path.join(path.dirname(__file__), '..'))
    from hard_controls.mic_controls import *
    audio_source = mic_get_audio_stream(
        record_type=RecordType.Seconds, 
        record_secs=10, 
        record_thread=0.01, 
        is_save=True, 
        output_name="recognision.wav"
    )
    
    speech_to_text(audio_source)