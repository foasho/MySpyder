# 環境構築
```
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