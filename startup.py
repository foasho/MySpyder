
## [ GPIOのテスト ]
# import RPi.GPIO as GPIO
# import time

# test_input_pin = 6
# GPIO.setmode(GPIO.BCM)
# GPIO.setup(test_input_pin, GPIO.IN)

# while True:
#     try:
#         print(GPIO.input(test_input_pin))
#         time.sleep(1)
#     except KeyboardInterrupt:
#         print("Break")
#         break

# GPIO.cleanup()

## [ Servoのテスト ]
# from hard_controls.servo_controls import Servo
# import time
# servo=Servo.Servo()
# def test_Servo():
#     try:
#         # 足の第1関節
#         for i in range(50):
#             servo.setServoAngle(15,90+i)
#             servo.setServoAngle(12,90+i)
#             servo.setServoAngle(9,90+i)
#             servo.setServoAngle(16,90+i)
#             servo.setServoAngle(19,90+i)
#             servo.setServoAngle(22,90+i)
#             time.sleep(0.005)
        
#         # # 足の第2関節
#         for i in range(60):
#             servo.setServoAngle(14,90+i)
#             servo.setServoAngle(11,90+i)
#             servo.setServoAngle(8,90+i)
#             servo.setServoAngle(17,90-i)
#             servo.setServoAngle(20,90-i)
#             servo.setServoAngle(23,90-i)
#             time.sleep(0.005)
        
#         # # 足の第3関節
#         for i in range(120):
#             servo.setServoAngle(13,i)
#             servo.setServoAngle(10,i)
#             servo.setServoAngle(31,i)
#             servo.setServoAngle(18,180-i)
#             servo.setServoAngle(21,180-i)
#             servo.setServoAngle(27,180-i)
#             time.sleep(0.005)

#         print ("\nEnd of program")      
#     except KeyboardInterrupt:
#         print ("\nEnd of program")
# test_Servo()


## [ カメラテスト ]