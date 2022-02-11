from picamera import PiCamera
import time
from PIL import Image
from io import BytesIO
import cv2
import numpy as np

class ImageType:
    Pillow = 0
    CV2 = 1

def pil2cv(image):
    ''' PIL型 -> OpenCV型 '''
    new_image = np.array(image, dtype=np.uint8)
    if new_image.ndim == 2:  # モノクロ
        pass
    elif new_image.shape[2] == 3:  # カラー
        new_image = cv2.cvtColor(new_image, cv2.COLOR_RGB2BGR)
    elif new_image.shape[2] == 4:  # 透過
        new_image = cv2.cvtColor(new_image, cv2.COLOR_RGBA2BGRA)
    return new_image

def pil2cv(image):
    ''' PIL型 -> OpenCV型 '''
    new_image = np.array(image, dtype=np.uint8)
    if new_image.ndim == 2:  # モノクロ
        pass
    elif new_image.shape[2] == 3:  # カラー
        new_image = new_image[:, :, ::-1]
    elif new_image.shape[2] == 4:  # 透過
        new_image = new_image[:, :, [2, 1, 0, 3]]
    return new_image

def get_capture(ret_type = ImageType.Pillow):
    stream = BytesIO()
    with PiCamera() as camera:
        camera.start_preview()
        camera.capture(stream, format='jpeg')
    stream.seek(0)
    image = Image.open(stream).convert("RGB")
    return image if ret_type == ImageType.Pillow else pil2cv(image)

def stream_camera(size=(640, 480)):
    while True:
        try:
            image = get_capture(ImageType.CV2)
            image = cv2.resize(image, dsize=size)
            cv2.imshow('Stream', image)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                print("quit")
                break
            time.sleep(0.01)
        except KeyboardInterrupt:
            print("Quit")
            break



if __name__ == "__main__":
    print("Test Monitor Camera Check")
    stream_camera()
