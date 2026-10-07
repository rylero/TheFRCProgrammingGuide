# **Simple TalonFX Control**

The TalonFX can be told two different things. Voltage control says how hard to push, in volts. Position control says where to go, in rotations. Both are sent with ```setControl```, and whichever request you sent last is the one the motor follows.

## **Voltage Control**
```setVoltage(3)``` from the earlier lessons is voltage control. The TalonFX version that matches position control is a ```VoltageOut``` request. You keep one request object and call ```withOutput``` with the volts you want.

Add this next to the motor. Leave ```spin()``` and ```holdVoltage()``` if you still have them.

```java
import com.ctre.phoenix6.controls.VoltageOut;

private final VoltageOut voltageRequest = new VoltageOut(0);

public Command applyVoltage(double volts) {
    return runEnd(
        () -> motor.setControl(voltageRequest.withOutput(volts)),
        () -> motor.setControl(voltageRequest.withOutput(0))
    );
}
```

```runEnd``` matters here. The first lambda sends the voltage every cycle. The second one sends 0 when the command stops, including when another command takes the subsystem. If you only use ```run```, letting go of the button cancels the command but the Falcon keeps the last voltage.

Bind it so it only spins while the button is held:

```java
controller.x().whileTrue(motorSubsystem.applyVoltage(3));
```

Deploy and press X. The shaft should spin and stop when you let go. There is no target position. 3 volts is a gentle spin on this board. Stay under 6 until you know which way the shaft is clear.

## **Position Control**
Voltage does not tell the motor where to stop. Position control does. We give the TalonFX a target in rotations, and the controller on the motor drives there.

We are only using one gain, kP, and we put it in a ```TalonFXConfiguration```.

## **What kP Does**
The TalonFX reads its own encoder. Error is target position minus measured position, in rotations. kP turns that error into volts:

$$
V = k_P \cdot (\text{target} - \text{measured})
$$

kP is volts per rotation of error. Bigger kP pushes harder for the same miss. Too small and the shaft crawls or stops short. Too big and it oscillates or slams past the target. On the unloaded test board Falcon, start at ```0.5```.

The number we send is rotor rotations. The default gear ratio is 1, so 1.0 is one turn of the motor shaft. Five rotations is a small move on this board. Do not start at 100.

## **Apply the Config**
Gains do not go in ```setControl```. They go in the config, and we apply that once from the constructor.

Add these imports, the request field, and the config. Leave ```spin()``` and ```holdVoltage()``` where they are.

```java
import com.ctre.phoenix6.configs.TalonFXConfiguration;
import com.ctre.phoenix6.controls.PositionVoltage;
import com.ctre.phoenix6.signals.NeutralModeValue;

private final PositionVoltage positionRequest = new PositionVoltage(0);

public MotorSubsystem() {
    motor = new TalonFX(10);

    TalonFXConfiguration config = new TalonFXConfiguration();
    config.Slot0.kP = 0.5;
    config.MotorOutput.NeutralMode = NeutralModeValue.Brake;
    motor.getConfigurator().apply(config);
}

public Command goToPosition(double rotations) {
    return run(() -> motor.setControl(positionRequest.withPosition(rotations)));
}
```

```Slot0``` is the gain slot ```PositionVoltage``` uses if we do not pick another one. Leave kI, kD, and the feedforward gains alone for this lesson.

```NeutralMode.Brake``` makes the motor resist being turned when we are not driving it. ```Coast``` lets it spin down.

```getConfigurator().apply(config)``` sends the config to the controller. Do it in the constructor. Do not apply it every loop.

```new PositionVoltage(0)``` is a request we keep and reuse. ```withPosition(rotations)``` sets the target. ```goToPosition``` uses ```run```, not ```runOnce```, because the TalonFX wants ```setControl``` every cycle for as long as we want it to hold.

## **Bind It**
In ```configureBindings()```:

```java
controller.a().whileTrue(motorSubsystem.goToPosition(5));
controller.b().whileTrue(motorSubsystem.goToPosition(0));
```

Deploy, enable, press A. The shaft should turn about five rotations and hold. Press B and it should go back to where it was when the code booted. If it barely moves, try ```1.0```, then ```2.0```. If it oscillates, go back down. Change one number, redeploy, try again.

!!! note

    kP by itself is enough for this unloaded motor and a nearby target. Elevators, arms, and anything that has to limit its speed use feedforward and Motion Magic. That is the next section. Same config object. We add fields to it later.
