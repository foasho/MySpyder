# 環境構築
- **Python**:3.7.3
## 現在の"python"がバージョン３系になっているか確認
```
python
```
** ちがかった場合、以下で更新する **
```
cd /usr/bin
sudo rm python
sudo ln -s python3 python
cd /usr/local/lib
python
```

## 必要なものをインストール
```
sudo apt-get update
pip install mpu6050-raspberrypi
sudo apt-get install -y libqt5gui5 python3-dev python3-pyqt5
sudo apt-get install -y libatlas-base-dev libjasper-dev
```

```
sudo mkdir python3.7
pip install -r requirements.txt
```


## セットアップ
### 合成音声セットアップ
```
sudo apt install -y open-jtalk open-jtalk-mecab-naist-jdic hts-voice-nitech-jp-atr503-m001
sudo nano jtalk.sh
sudo chmod 755 jtalk.sh
unzip MMDAgent_Example-1.7.zip
sudo cp -R ./MMDAgent_Example-1.7/Voice/mei /usr/share/hts-voice/
./jtalk.sh "こんにちは。ラズベリーパイが喋っていますよ"
```

### マイクのセットアップ
```
arecord -l
>> カード番号を確認
amixer -D hw:1 sset Mic 100%
```

### 音声認識セットアップ
```
pip install pyaudio
sudo apt install libportaudio0 libportaudio2 libportaudiocpp0 portaudio19-dev
```

### OpenCVのインストール
```
pip install opencv-python==4.1.0.25
sudo apt-get install libatlas-base-dev
sudo apt-get install libjasper-dev
```

### TeamViewerのインストール