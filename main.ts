radio.setGroup(12)
radio.setFrequencyBand(39)
radio.setTransmitPower(7)
radio.setTransmitSerialNumber(true)

let expectedSender = -1584843917

radio.onReceivedString(function (received: string) {
    let sender = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    if (sender !== expectedSender) {
        basic.showIcon(IconNames.No)
        PCAmotor.MotorStopAll()
        return
    }

    basic.clearScreen()

    let parts = received.split(",")
    if (parts.length != 3) {
        return
    }

    let x = parseInt(parts[0])
    let y = parseInt(parts[1])
    let z = parseInt(parts[2])  // zatím se nepoužívá

    // Převrácení osy Y
    y = -y

    let baseSpeed = y / 4
    let turning = Math.constrain(x / 1000, -1, 1)

    // Úprava rychlosti pro každé kolo
    let leftSpeed = baseSpeed * (1 - turning)
    let rightSpeed = baseSpeed * (1 + turning)

    // Omezení na rozsah -255 až 255
    leftSpeed = Math.constrain(leftSpeed, -255, 255)
    rightSpeed = Math.constrain(rightSpeed, -255, 255)

    // Ovládání motorů
    PCAmotor.MotorRun(PCAmotor.Motors.M1, -2 * leftSpeed)
    PCAmotor.MotorRun(PCAmotor.Motors.M4, rightSpeed)
})
