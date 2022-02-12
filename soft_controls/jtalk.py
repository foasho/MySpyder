import subprocess

def start_jtalk(text: str):
    subprocess.call(f'./jtalk.sh "{text}"'.split())


if __name__ == "__main__":
    start_jtalk("これはテストです。")
