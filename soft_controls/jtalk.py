import subprocess

def start_jtalk(text: str):
    subprocess.call(['./jtalk.sh', f'"{text}"'])


if __name__ == "__main__":
    start_jtalk("これはテストです。")
