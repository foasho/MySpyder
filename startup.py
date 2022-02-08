#!/usr/bin/env python
# -*- coding: utf-8 -*-
import time
import netifaces
from hard_controls.lcd_controls import show_lcd

def startup():
    ip_addres = None
    interface_data = netifaces.ifaddresses('eth0')
    for key, val in interface_data.items():
        for v in val:
            addr = v["addr"]
            if "." in addr and "192" in addr and ip_addres == None:
                ip_addres = addr
    interface_data2 = netifaces.ifaddresses('wlan0')
    for key, val in interface_data2.items():
        for v in val:
            addr = v["addr"]
            if "." in addr and "192" in addr and ip_addres == None:
                ip_addres = addr
    print(f"取得したIPアドレス＝{ip_addres}")
    show_lcd("[IP ADDRESS]", ip_addres)
    print("Waiting1")
    time.sleep(3)
    print("Waiting2")
    time.sleep(3)
    print("Completed.")

if __name__ == "__main__":
    startup()