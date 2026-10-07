# **Basic Command Based Programming**

```SubsystemBase``` has a few helpers for building commands. They all return a ```Command```, and they all require the subsystem you call them on.

## **runOnce and run both hold a voltage**
The TalonFX does not clear voltage when a command ends. It keeps the last voltage you sent until some other line sets a new one. So both of these leave the motor spinning:

```java
public Command holdVoltage(double volts) {
    return runOnce(() -> motor.setVoltage(volts));
}

public Command holdVoltage(double volts) {
    return run(() -> motor.setVoltage(volts));
}
```

Same voltage on the motor either way. The difference is the command, not the Falcon.

```runOnce``` runs the lambda once, then the command is finished. Nothing is left requiring the subsystem. A new command can start whenever it wants, and this one is not around to get interrupted. The old voltage just stays until that new command writes a different one.

```run``` calls the lambda every cycle and does not finish on its own. It sits on the subsystem until a button cancels it or another command needs ```MotorSubsystem```. That other command interrupts it. ```runOnce``` will not get interrupted, because it already ended.

Use ```run``` for voltage when you want this command to be the one in charge, so the next command actually kicks it off. Use ```runOnce``` when you just want to set a voltage and get out of the way.

Position control is different. ```setControl``` has to be sent every cycle, so that one really does need ```run```. A single ```runOnce``` is not enough to hold a position loop.

## **runEnd**
```runEnd``` takes two lambdas. The first one runs every cycle. The second one runs once when the command stops, including when it gets interrupted.

Replace ```spin()``` with this:

```java
public Command spin() {
    return runEnd(
        () -> motor.setVoltage(3),
        () -> motor.setVoltage(0)
    );
}
```

While the command is active the motor gets 3 volts. When the command stops, it gets 0. You can delete the separate stop command if this is the only thing that was using it.

!!! note

    ```() ->``` is a lambda, a tiny function written in place. ```() -> motor.setVoltage(3)``` is a function with no inputs that sets the voltage. The helpers take functions so we do not have to make a whole new class for every command.

The subsystem should now look about like this. Yours might still have ```periodic()``` from the last lesson. Leave that in.

```java
package frc.robot.subsystems;

import com.ctre.phoenix6.hardware.TalonFX;

import edu.wpi.first.wpilibj2.command.Command;
import edu.wpi.first.wpilibj2.command.SubsystemBase;

public class MotorSubsystem extends SubsystemBase {
    private TalonFX motor;

    public MotorSubsystem() {
        motor = new TalonFX(10);
    }

    public Command spin() {
        return runEnd(
            () -> motor.setVoltage(3),
            () -> motor.setVoltage(0)
        );
    }

    public Command holdVoltage(double volts) {
        return run(() -> motor.setVoltage(volts));
    }
}
```

These methods are public so ```RobotContainer``` can call them. They return a command. They do not move the motor at the moment you call them. The next lesson hooks them up to buttons.
