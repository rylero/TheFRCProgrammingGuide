# **Triggers and Inputs**

A command just sits there until something schedules it. In teleop that something is usually a button. Open ```RobotContainer.java``` with ++ctrl+p++. This file creates the subsystem, creates the controller, and connects buttons to commands.

## **The Controller**
The top of the class should look like this. If your names are a little different, match them to what you already have.

```java
public MotorSubsystem motorSubsystem;
public CommandXboxController controller;

public RobotContainer() {
    motorSubsystem = new MotorSubsystem();
    controller = new CommandXboxController(0);

    configureBindings();
}
```

```CommandXboxController``` is the one that can schedule commands. Port ```0``` is the first controller in the driver station. A plain ```XboxController``` can read buttons, but it will not run commands for you.

## **onTrue and onFalse**
```configureBindings()``` is where the buttons go.

```java
private void configureBindings() {
    controller.a().onTrue(motorSubsystem.spin());
}
```

```controller.a()``` is true while A is held. ```onTrue``` runs the command at the moment the button goes from up to down.

<figure markdown="span">
    ![Trigger Diagram](../img/trigger_code_diagram.png){ width="600" }
  <figcaption>The trigger, the edge, and the command it schedules</figcaption>
</figure>

```onFalse``` runs a command when the button comes back up. That is how the first project called ```stop()```. With the ```runEnd``` version of ```spin()```, you usually do not need ```onFalse```. When the command is cancelled, its end lambda already sets the voltage to 0.

## **whileTrue**
```whileTrue``` starts the command when the button is pressed and cancels it when the button is released.

```java
private void configureBindings() {
    controller.a().whileTrue(motorSubsystem.spin());
    controller.b().whileTrue(motorSubsystem.holdVoltage(6));
}
```

Press A and the motor spins at 3 volts. Let go and it stops. Press B and it spins at 6 volts until you let go. If you press B while A is held, B wins, because both commands need ```MotorSubsystem``` and only one can have it.

```whileTrue``` is what you want when the action should last exactly as long as the button. ```onTrue``` is what you want when the action should start and then finish by itself, like a move to a position.

Deploy, set the driver station to teleop, enable, and try both buttons.

## **Challenges**
Stay on the test board. If you get stuck, spend ~10-20min before asking for help.

Easier:

1. Bind X to ```holdVoltage(1)``` with ```whileTrue```. Deploy and feel how different 1 volt is from 6.

2. Change A from ```whileTrue``` to ```onTrue``` and deploy. Press A and let go. With ```runEnd```, think about whether the motor stops. Try it, then put A back to ```whileTrue``` if you want the hold behavior.

Medium:

1. Bind the right bumper to ```spin()``` and the left bumper to ```holdVoltage(2)```. Hold one, then tap the other, and watch which one survives. Only one subsystem command should be running.

2. Read the triggers on ```CommandXboxController``` besides the letter buttons. Bind one of the sticks' Y axis... actually do not bind an axis yet. Axes are not buttons. Find ```controller.rightTrigger()``` in the autocomplete and bind that to ```holdVoltage``` with ```whileTrue```. The trigger is a button for this. The stick axis is a number, and we are not there yet.

Hard:

1. Make the motor speed follow the right stick while the right bumper is held, and stop when the bumper is released. Hint: the stick is ```controller.getRightY()```, and you can pass that into a command that reads it every cycle inside ```run```. Deadband it a little or the motor will hum on a stick that is not perfectly centered. WPILib has ```MathUtil.applyDeadband```.
