radio.setGroup(12);
radio.setFrequencyBand(39);
radio.setTransmitPower(7);
radio.setTransmitSerialNumber(true);
Sensors.SetLightLevel();

type drivingSignal = {
    x: number;
    y: number;
    z: number
};
type lightDirection = {
    c: DigitalPin;
    r: DigitalPin;
    l: DigitalPin
};
type data = {
    c: number;
    r: number;
    l: number
};

const IR: lightDirection = {
    c: DigitalPin.P15,
    r: DigitalPin.P13,
    l: DigitalPin.P14
};

let expectedSender = 599237509;
let ready: boolean;
let drivingPackage: drivingSignal;
let leftSpeed: number;
let rightSpeed: number;
let parts;
let sender;
let dataPack: data;

pins.setPull(DigitalPin.P8, PinPullMode.PullNone)
pins.digitalReadPin(DigitalPin.P8)
pins.setPull(IR.c, PinPullMode.PullNone)
pins.setPull(IR.r, PinPullMode.PullNone)
pins.setPull(IR.l, PinPullMode.PullNone)

basic.forever(function () {
    dataPack.c = pins.digitalReadPin(IR.c)
    dataPack.r = pins.digitalReadPin(IR.r)
    dataPack.l = pins.digitalReadPin(IR.l)
    basic.pause(20)
})

radio.onReceivedString(function (received: string) {
    sender = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    if (sender == expectedSender) {
        if (received === "stop") {
            ready = false
            basic.pause(1000)
            PCAmotor.MotorStopAll()
            basic.showString("G", 0)
        } else ready = true
        if (ready) {
            basic.clearScreen()
            parts = received.split(",")
            if (parts.length != 3) {
                return
            }
            drivingPackage.x = parseInt(parts[0])
            drivingPackage.y = parseInt(parts[1])
            drivingPackage.z = parseInt(parts[2])

            leftSpeed = drivingPackage.y / 4
            rightSpeed = drivingPackage.y / 4

            if (drivingPackage.x > 100) {
                leftSpeed += drivingPackage.x / 10
                rightSpeed -= drivingPackage.x / 2
            } else if (drivingPackage.x < -100) {
                leftSpeed += drivingPackage.x / 10
                rightSpeed -= drivingPackage.x / 2
            }

            PCAmotor.MotorRun(PCAmotor.Motors.M2, -rightSpeed)
            PCAmotor.MotorRun(PCAmotor.Motors.M4, -leftSpeed)
        }
    }
})
