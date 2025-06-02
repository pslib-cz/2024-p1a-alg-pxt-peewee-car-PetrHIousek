radio.setGroup(12)
radio.setFrequencyBand(39)
radio.setTransmitPower(7)
radio.setTransmitSerialNumber(true)
Sensors.SetLightLevel()

type drivingSignal = {
    x: number;
    y: number;
    z: number
}
type lightDirection = {
    center: number;
    right: number;
    left: number
}

let expectedSender = 599237509;
let ready: boolean;
let drivingPackage: drivingSignal
let leftSpeed: number
let rightSpeed: number
let parts
let sender

pins.setPull(DigitalPin.P8, PinPullMode.PullNone)
pins.digitalReadPin(DigitalPin.P8)

radio.onReceivedString(function (received: string) {
    sender = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    if (sender == expectedSender) {
        if (received === "stop") {
            ready = false
            basic.pause(1000)
            PCAmotor.MotorStopAll()
            basic.showString("G", 0)
        } else ready = true
        if(ready) {
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
