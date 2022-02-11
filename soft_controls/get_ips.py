#!/usr/bin/env python
# -*- coding: utf-8 -*-
import time
import netifaces

def get_ip():
    ip_address = None
    interface_data = netifaces.ifaddresses('eth0')
    for key, val in interface_data.items():
        for v in val:
            addr = v["addr"]
            if "." in addr and "192" in addr and ip_address == None:
                ip_address = addr
    interface_data2 = netifaces.ifaddresses('wlan0')
    for key, val in interface_data2.items():
        for v in val:
            addr = v["addr"]
            if "." in addr and "192" in addr and ip_address == None:
                ip_address= addr
    return ip_address

if __name__ == "__main__":
    pass