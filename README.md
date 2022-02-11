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
pip install uvicorn[standard]
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
# ビルドツール関係(もしかしたらいらないかも)
sudo apt-get install build-essential cmake pkg-config -y
# 画像関係
sudo apt-get install libjpeg-dev libtiff5-dev libjasper-dev libpng-dev -y
# 動画関係
sudo apt-get install libavcodec-dev libavformat-dev libswscale-dev libv4l-dev -y
sudo apt-get install libxvidcore-dev libx264-dev -y
# 最適化関係
sudo apt-get install libatlas-base-dev gfortran -y
# HDF5関係
sudo apt-get install libhdf5-dev libhdf5-serial-dev libhdf5-103 -y
# Qtライブラリ
sudo apt-get install libqtgui4 libqtwebkit4 libqt4-test python3-pyqt5 -y

pip3 install opencv-contrib-python==4.1.0.25
```

### TeamViewerのインストール

### Nodejsのインストール
```
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install nodejs
npm install
```

### リロード数の上限変更
```
sudo nano /proc/sys/fs/inotify/max_user_watches
8192 => 178400
```

### オレオレ証明書の作成
```
sudo apt-get install openssl -y
#秘密鍵の作成
openssl genrsa 2048 > server.key
openssl req -new -key server.key > server.csr
>> すべてエンター
openssl x509 -days 3650 -req -signkey server.key < server.csr > server.crt
rm -f server.csr
```

# 起動方法
```
npm run build
```