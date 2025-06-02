radio.setGroup(12)
radio.setFrequencyBand(39)
radio.setTransmitPower(7)
radio.setTransmitSerialNumber(true)
Sensors.SetLightLevel()

type lightDirection = {
    center: number;
    right: number;
    left: number
}

let expectedSender = 599237509;
let ready: boolean;
let y: number
let z: number
let x: number
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
            x = parseInt(parts[0])
            y = parseInt(parts[1])
            z = parseInt(parts[2])

            leftSpeed = y / 4
            rightSpeed = y / 4

            if (x > 100) {
                leftSpeed += x / 10
                rightSpeed -= x / 2
            } else if (x < -100) {
                leftSpeed += x / 10
                rightSpeed -= x / 2
            }

            PCAmotor.MotorRun(PCAmotor.Motors.M2, -rightSpeed)
            PCAmotor.MotorRun(PCAmotor.Motors.M4, -leftSpeed)
        }
    }
})
