radio.setGroup(12)
radio.setFrequencyBand(39)
radio.setTransmitPower(7)
radio.setTransmitSerialNumber(true)

let expectedSender = 599237509;
let ready: boolean;
let y
let z
let x

radio.onReceivedString(function (received: string) {
    let sender = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    if (sender == expectedSender) {
        if (received === "stop") {
            ready = false
            basic.pause(60)
            PCAmotor.MotorStopAll()
            basic.showString("G")
        } else ready = true
        if(ready) {
            basic.clearScreen()
            let parts = received.split(",")
            if (parts.length != 3) {
                return
            }
            x = parseInt(parts[0])
            y = parseInt(parts[1])
            z = parseInt(parts[2])

            y = -y

            let leftSpeed = y / 4
            let rightSpeed = y / 4

            if (x > 100) {
                leftSpeed += x / 10
                rightSpeed -= x / 2
            } else if (x < -100) {
                leftSpeed += x / 10
                rightSpeed -= x / 2
            }

            PCAmotor.MotorRun(PCAmotor.Motors.M1, -rightSpeed)
            PCAmotor.MotorRun(PCAmotor.Motors.M4, -leftSpeed)
        }
    }
})
