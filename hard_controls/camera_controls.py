from picamera import PiCamera
from time import sleep
from PIL import Image
from io import BytesIO

class ImageType:
    Pillow = 0
    CV2 = 1

def get_capture(ret_type = ImageType.Pillow):
    stream = BytesIO()
    with PiCamera() as camera:
        camera.start_preview()
        camera.capture(stream, format='jpeg')
    stream.seek(0)
    image = Image.open(stream)
    return image

def stream_camera():
    while True:
        try:
            image = get_capture()
            image.show()
        except KeyboardInterrupt:
            print("Quit")
            break



if __name__ == "__main__":
    print("Test")
    stream_camera()
