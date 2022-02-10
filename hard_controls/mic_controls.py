import pyaudio
import wave
import os
from datetime import date, datetime
import numpy as np
import time
import soundfile as sf
from io import BytesIO

"""
Settings
"""
class RecordType:
    Seconds = 0
    WhileThreads = 1
form_1 = pyaudio.paInt16 # 16-bit resolution
chans = 1 # 1 channel
samp_rate = 44100 # 44.1kHz　サンプリング周波数
chunk = 4096 # 2^12 一度に取得するデータ数
dev_index = 2 # デバイス番号
wav_output_filename = 'test.wav' # 出力するファイル

audio = pyaudio.PyAudio() # create pyaudio instantiation

def mic_get_audio_stream(
    record_type=RecordType.Seconds, 
    record_secs=3,
    record_thread=0.01,
    is_save=False, 
    output_name=wav_output_filename
):
    # create pyaudio stream
    stream = audio.open(format = form_1,rate = samp_rate,channels = chans, \
                        input_device_index = dev_index,input = True, \
                        frames_per_buffer=chunk)
    print(stream)
    print("recording")
    frames = []

    # loop through stream and append audio chunks to frame array
    if record_type == RecordType.Seconds:
        for i in range(0,int((samp_rate/chunk)*record_secs)):
            data = stream.read(chunk, exception_on_overflow=False)
            frames.append(data)
        # save the audio frames as .wav file
        if is_save:
            output_dir = "./output/"
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)
            wavefile = wave.open(output_dir+output_name,'wb')
            wavefile.setnchannels(chans)
            wavefile.setsampwidth(audio.get_sample_size(form_1))
            wavefile.setframerate(samp_rate)
            wavefile.writeframes(b''.join(frames))
            wavefile.close()
    else:
        while True:
            try:
                threshold = record_thread
                # 音データの取得
                data = stream.read(chunk,exception_on_overflow = False)
                # ndarrayに変換
                x = np.frombuffer(data, dtype="int16") / 32768.0
                print(x.max())

                # 閾値以上の場合はファイルに保存
                if x.max() > threshold:
                    # 2秒間の音データを取込
                    frames = []
                    # all.append(data)
                    for i in range(0,int((samp_rate/chunk)*record_secs)):
                        data = stream.read(chunk,exception_on_overflow = False)
                        frames.append(data)

                    # 音声ファイルとして出力
                    if is_save:
                        now = datetime.now()
                        output_dir = "./output/"
                        if not os.path.exists(output_dir):
                            os.makedirs(output_dir)
                        wavefile = wave.open(output_dir+output_name,'wb')
                        wavefile.setnchannels(chans)
                        wavefile.setsampwidth(audio.get_sample_size(form_1))
                        wavefile.setframerate(samp_rate)
                        wavefile.writeframes(b''.join(frames))
                        wavefile.close()
                        print("Saved.")
                    break
                # time.sleep(0.01)
            except KeyboardInterrupt:
                print("Ctrl+Cが押されました。")
                break

    print("finished recording")

    # stop the stream, close it, and terminate the pyaudio instantiation
    stream.stop_stream()
    stream.close()
    audio.terminate()
    audio_source = output_dir+output_name
    return audio_source

if __name__ == "__main__":
    print("start test mic")
    now = datetime.now()
    filename = now.strftime('%Y%m%d%H%M%S') + ".wav"
    print(filename)
    # 単発録音
    # mic_get_audio_stream(
    #     record_type=RecordType.Seconds, 
    #     record_secs=10, 
    #     record_thread=0.01, 
    #     is_save=True, 
    #     output_name=filename
    # )

    # 一定の音量を超えたら録音
    mic_get_audio_stream(
        record_type=RecordType.WhileThreads, 
        record_secs=10, 
        record_thread=0.005, 
        is_save=True, 
        output_name=filename
    )