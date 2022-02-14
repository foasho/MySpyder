import smbus
import time

class ADCDevice(object):
    def __init__(self):
        self.cmd = 0
        self.address = 0
        self.bus=smbus.SMBus(1)
        # print("ADCDevice init")
        
    def detectI2C(self,addr):
        try:
            self.bus.write_byte(addr,0)
            #print("Found device in address 0x%x"%(addr))
            return True
        except:
            #print("Not found device in address 0x%x"%(addr))
            return False
            
    def close(self):
        self.bus.close()
        
class PCF8591(ADCDevice):
    def __init__(self):
        super(PCF8591, self).__init__()
        self.cmd = 0x40     # The default command for PCF8591 is 0x40.
        self.address = 0x4f # 0x48 is the default i2c address for PCF8591 Module.
        
    def analogRead(self, chn): # PCF8591 has 4 ADC input pins, chn:0,1,2,3
        #self.bus.write_byte(self.address, self.cmd+chn)
        value = self.bus.read_byte_data(self.address, self.cmd+chn)
        value = self.bus.read_byte_data(self.address, self.cmd+chn)
        return value
    
    def analogWrite(self,value): # write DAC value
        self.bus.write_byte_data(self.address, self.cmd,value) 

class ADS7830(ADCDevice):
    def __init__(self):
        super(ADS7830, self).__init__()
        self.cmd = 0x84
        self.address = 0x48 # 0x4b is the default i2c address for ADS7830 Module.   
        
    def analogRead(self, chn): # ADS7830 has 8 ADC input pins, chn:0,1,2,3,4,5,6,7
        try:
            value = self.bus.read_byte_data(self.address, self.cmd|(((chn<<2 | chn>>1)&0x07)<<4))
            return value
        except:
            pass
        return None

class ADC:
    def __init__(self):
        self.adcFlag = None
        self.adc = ADCDevice()
        if(self.adc.detectI2C(0x4f)): # Detect the pcf8591.
            self.adcFlag = False
            self.adc = PCF8591()
        elif(self.adc.detectI2C(0x48)): # Detect the ads7830
            self.adcFlag = True
            self.adc = ADS7830()
        else:
            print("No correct I2C address found, \n"
            "Please use command 'i2cdetect -y 1' to check the I2C address! \n"
            "Program Exit. \n");
            exit(-1)
    def batteryValue(self,chn):
        return self.adc.analogRead(chn)
        
    def batteryPower(self): 
        if self.adcFlag == True:
            val0 = self.batteryValue(0)
            val1 = self.batteryValue(4)
        else:
            val0 = self.batteryValue(0)
            val1 = self.batteryValue(1)
        if val0 and val1:
            battery1=round(val0/255*5*3,2)
            battery2=round(val1/255*5*3,2)
            #print(str(self.adc.address)+" "+str(val0)+" "+str(val1))
            return battery1,battery2
        return None, None

def get_battery_per():
    Power1, Power2 = None, None
    for i in range(10):
        try:
            Power1, Power2 = adc.batteryPower()
            if Power1 and Power2:
                break
        except KeyboardInterrupt:
            pass

    max = 8.0 * 2
    per = (Power1 + Power2) / max if Power1 else None

    return per

if __name__ == '__main__':
    print("start .. \n")
    adc=ADC()
    try:
        while True:
            Power=get_battery_per()
            print ("The battery voltage is "+str(Power)+'\n')
            time.sleep(1)
    except KeyboardInterrupt:
        adc.adc.close()
        print ("\nEnd of program")
    pass

