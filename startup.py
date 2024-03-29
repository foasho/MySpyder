
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


## [ 足の動作テスト ]

from hard_controls.servo_controls import Move
control = Move.Control()
while True:
    try:
        cmd = input()
        if cmd == "test":# 前
            test_move = ['CMD_MOVE', '1', '0', '25', '10', '0']
            control.run(test_move)
        if cmd == "test2":
            test_move = ['CMD_MOVE', '1', '0', '25', '1', '0']
            control.run(test_move)
        if cmd == "test3":# 右上
            test_move = ['CMD_MOVE', '1', '25', '25', '10', '0']
            control.run(test_move)
        if cmd == "test4":# era- 
            test_move = ['CMD_MOVE', '1', '50', '25', '50', '0']
            control.run(test_move)
        if cmd == "test5":# 斜めした
            test_move = ['CMD_MOVE', '1', '-25', '-25', '10', '0']
            control.run(test_move)
        if cmd == "test6":# 真後ろ
            test_move = ['CMD_MOVE', '1', '0', '-25', '5', '0']
            control.run(test_move)
        if cmd == "test7":# 真後ろ
            test_move = ['CMD_MOVE', '1', '0', '-50', '5', '0']
            control.run(test_move)
        if cmd == "test8": # 右下
            test_move = ['CMD_MOVE', '1', '99', '99', '10', '0']
            control.run(test_move)
    except KeyboardInterrupt:
        print("Quit")
        # control.relax()
        break

## [ 顔の動きテスト ]
# from hard_controls.servo_controls import Servo
# from hard_controls.servo_controls import Move
# import time
# control = Move.Control()
# while True:
#     try:
#         cmd = input()
#         if cmd == "init":
#             control.face_init()
#         if cmd == "facex":
#             control.face_move(
#                 x_ratio=0.5,
#                 y_ratio=0
#             )
#         if cmd == "facey":
#             control.face_move(
#                 x_ratio=0,
#                 y_ratio=0.5,
#                 speed = 1
#             )

#     except KeyboardInterrupt:
#         print("Quit")
#         break
