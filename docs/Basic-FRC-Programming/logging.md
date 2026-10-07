# **Logging Basics and AdvantageScope**

If the motor does something weird, staring at it does not tell you the position it thought it was at. Logging writes numbers out of the robot every cycle so we can graph them.

## **Log from periodic()**
```periodic()``` already runs every cycle. That is where these numbers go. Keep the last target in a field so we can graph it next to the measured position.

Change ```goToPosition``` and add ```periodic()``` like this. If you already have a ```periodic()```, put the ```putNumber``` lines in it and delete any print you left behind.

```java
private double targetRotations = 0;

public Command goToPosition(double rotations) {
    return run(() -> {
        targetRotations = rotations;
        motor.setControl(positionRequest.withPosition(rotations));
    });
}

@Override
public void periodic() {
    SmartDashboard.putNumber("Motor/Position", motor.getPosition().getValueAsDouble());
    SmartDashboard.putNumber("Motor/Velocity", motor.getVelocity().getValueAsDouble());
    SmartDashboard.putNumber("Motor/Target", targetRotations);
}
```

Add ```import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;```.

```getPosition()``` and ```getVelocity()``` are status signals. ```getValueAsDouble()``` reads them in the normal units: rotations, and rotations per second. ```putNumber``` publishes that number on NetworkTables under the name you give it. The slash in ```Motor/Position``` just groups the keys in the tool.

Keep ```periodic()``` boring. Read signals, publish numbers. Do not also run the position controller in here if a command is already doing it.

## **Open AdvantageScope**
AdvantageScope comes with WPILib. Open the command palette with ++ctrl+shift+p++ and run ```WPILib: Start Tool```, then pick AdvantageScope.

The driver station should already be connected to the robot.

1. In AdvantageScope, ```File``` > ```Connect to Robot``` > ```Default```.
2. The title bar shows the address. If it stays disconnected, set the robot address to the roboRIO. On the USB cable that is ```172.22.11.2```.
3. The line graph is already the first tab. Open ```SmartDashboard``` in the field list and drag ```Motor/Position``` and ```Motor/Target``` onto the graph.

Deploy, enable, press the button that runs ```goToPosition```. The target line should jump to 5, and the position line should move over to it. Drag ```Motor/Velocity``` on too. It should spike while the shaft is turning and fall back near 0 when it is holding.

The graph sticks to "now" while you are connected. Scroll left to look at the move you just did. Scroll all the way right to lock onto live data again.

!!! note

    AdvantageScope can also open a ```.wpilog``` later and replay a match. This lesson is only the live connection. If a field is missing, enable the robot once. Nothing gets published until the code is running.

## **Challenges**
Do these with AdvantageScope open. If you get stuck, spend ~10-20min before asking for help. The <a href="https://docs.advantagescope.org/">AdvantageScope docs</a> are worth having open for the last one.

Easier:

1. Also log the voltage with ```motor.getMotorVoltage().getValueAsDouble()``` under the name ```Motor/Voltage```. Drag it onto the graph and press A. You should see voltage jump when the move starts.

2. Scroll left after a move and hover the graph. Read the position and the target at the same time. Are they actually on top of each other at the end, or is the motor short?

Medium:

1. Log a fourth number, ```Motor/Error```, that is target minus measured position. After a good move it should settle near 0. If your kP is too small it will sit at some leftover error. Try it.

2. Disconnect AdvantageScope, press a button, then connect again. The move you did while it was disconnected is gone from the live graph. That is why we will care about log files later. For now, just notice it.

Hard:

1. Log the applied output with ```motor.getClosedLoopReference().getValueAsDouble()``` or, if that signal is not the one you want, ```motor.getDutyCycle().getValueAsDouble()```. One of those will show you what the controller is actually asking for during the move. Get at least one extra TalonFX signal on the graph besides position and velocity. The status signal page is here: <a href="https://v6.docs.ctr-electronics.com/en/stable/docs/api-reference/api-usage/status-signals.html">Status Signals</a>
