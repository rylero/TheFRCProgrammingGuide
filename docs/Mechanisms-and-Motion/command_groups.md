# **Command Groups**

A single `run` or `runOnce` is one job. A match is a chain of jobs: drive to a position, wait, come back, and later run an intake at the same time as an arm. Command groups build that chain out of commands you already have.

Groups are commands too. You bind them with `onTrue` or `whileTrue` the same way.

## **Sequence**

`andThen` runs the next command after the previous one finishes. `Commands.sequence` is the same idea for a list.

```java
public Command outAndBack() {
    return motionMagicTo(5)
        .andThen(Commands.waitSeconds(1))
        .andThen(motionMagicTo(0));
}
```

`motionMagicTo` uses `run`, and `run` never finishes on its own. A sequence would sit on the first command forever. Finish it when the mechanism is close enough, or cut it off with a timeout.

```java
public Command motionMagicTo(double rotations) {
    return run(() -> motor.setControl(motionMagicRequest.withPosition(rotations)))
        .until(() -> Math.abs(motor.getPosition().getValueAsDouble() - rotations) < 0.25);
}
```

`until` ends the command when the lambda returns true. The `0.25` rotation window is a tolerance, not a gain. Tighten it after the graph shows the motor actually settling inside it.

`Commands.waitSeconds` does not require `MotorSubsystem`, so the motor command and the wait can sit in one sequence without fighting over the subsystem.

Bind the whole group:

```java
controller.y().onTrue(motorSubsystem.outAndBack());
```

`onTrue` is the right edge here. The group has an end. `whileTrue` would cancel it when the button is released, which is what you want for `holdVelocity` and not for a three-step move.

## **Parallel, Race, and Deadline**

These run commands at the same time. They only work when the commands require **different** subsystems. Two commands that both require `MotorSubsystem` cannot be parallel. The scheduler will interrupt one of them. That is the subsystem rule from the basic section, still in force inside a group.

| Group | It ends when | The other commands |
| --- | --- | --- |
| `Commands.parallel(a, b)` | every command has finished | keep running until then |
| `Commands.race(a, b)` | the first command finishes | are interrupted |
| `Commands.deadline(main, other)` | `main` finishes | are interrupted |

```java
Commands.parallel(intake.spin(), elevator.goToHeight(1.2));

Commands.deadline(
    Commands.waitSeconds(1.0),
    motorSubsystem.holdVelocity(20)
);
```

`deadline` is the one to reach for when a timed action should cut off another command. The wait is the deadline. At one second, `holdVelocity` is interrupted and its `end()` stops the motor.

`withTimeout` is the small version of the same idea on a single command:

```java
motorSubsystem.holdVelocity(20).withTimeout(1.0);
```

## **When a Lambda Is Not Enough**

Factories and decorators (`andThen`, `until`, `withTimeout`, `alongWith`) cover most mechanisms. Write a class that extends `Command` when the job has several fields, or when `isFinished` and `end` are awkward to read as lambdas.

```java
public class MoveThenStop extends Command {
    private final MotorSubsystem motor;
    private final double rotations;

    public MoveThenStop(MotorSubsystem motor, double rotations) {
        this.motor = motor;
        this.rotations = rotations;
        addRequirements(motor);
    }

    @Override
    public void execute() {
        motor.setMotionMagic(rotations);
    }

    @Override
    public boolean isFinished() {
        return Math.abs(motor.getPosition() - rotations) < 0.25;
    }

    @Override
    public void end(boolean interrupted) {
        motor.stop();
    }
}
```

`addRequirements(motor)` is what the factories were doing for you. Forget it and this command will not interrupt anything else using that subsystem.

Keep the TalonFX call inside the subsystem. The command class should call `motor.setMotionMagic(rotations)`, not construct a `MotionMagicVoltage` itself. The subsystem still owns the hardware.

Use a group when the steps are commands you already trust. Use a class when one step has its own lifecycle and the lambda version is hard to read.
