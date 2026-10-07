# **What is a Subsystem**

In the last project we made `MotorSubsystem` and spun the Falcon. Now lets actually look at what that class is doing.

A subsystem is the code for one mechanism. It holds the motors and sensors for that mechanism, and the rest of the robot asks the subsystem when it wants something to move. The test board is one mechanism, so one subsystem is enough. A real robot is the same idea split up: drivetrain, intake, elevator, each in its own class.

<figure markdown="span">
    ![Programming Test Board](../img/test_board.webp){ width="600" }
  <figcaption>The test board is one mechanism, so it gets one subsystem</figcaption>
</figure>

## **Open the Class**
Open the search palette with ++ctrl+p++ and type ```MotorSubsystem.java```. You should already have something like this from the last project:

```java
public class MotorSubsystem extends SubsystemBase {
    private TalonFX motor;

    public MotorSubsystem() {
        motor = new TalonFX(10);
    }
}
```

```extends SubsystemBase``` is what tells WPILib this class is a subsystem. That gives us ```periodic()```, and the command helpers like ```runOnce()```, which we will use in the next lesson.

The constructor runs once, when ```RobotContainer``` does ```new MotorSubsystem()```. ```new TalonFX(10)``` is the Falcon on CAN id 10. If that number is wrong, the code still deploys. The motor just will not be the one you think it is.

```private``` means other files cannot do ```motor.setVoltage()``` themselves. They have to call a method on the subsystem. That sounds annoying until two different commands both try to spin the same motor.

## **What Goes in Here**
Put the hardware for this mechanism in the subsystem. Put methods that talk to that hardware in the subsystem. Button logic does not go here. Buttons live in ```RobotContainer```.

```periodic()``` is a method the scheduler calls for us about every 20ms. We will use it later to log position and velocity. For now, add an empty one so you can see where it goes:

```java
@Override
public void periodic() {
}
```

## **One Command at a Time**
Only one command is allowed to use a subsystem at a time. If a new command needs ```MotorSubsystem``` while another one already has it, the scheduler stops the old command and starts the new one. You do not write that stop yourself. Requiring the subsystem is enough, and the command helpers do that for you.
