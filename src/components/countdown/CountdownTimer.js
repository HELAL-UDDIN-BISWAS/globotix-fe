import React from "react";

import { useCountdown } from "@/hooks/useCountdown";

import DateTimeDisplay from "./DateTimeDisplay";

const ExpiredNotice = () => {
  return (
    <div className="expired-notice">
      <span>OTP expired.</span>
    </div>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <div className="flex">
      <span className="mr-1">OTP expires in</span>
      <div className="flex text-sm text-black-1">
        {/* <DateTimeDisplay value={days} type={'Days'} isDanger={days <= 3} />
        <p>:</p>
        <DateTimeDisplay value={hours} type={'Hours'} isDanger={false} />
        <p>:</p> */}
        <DateTimeDisplay value={minutes} type={"Mins"} isDanger={false} />
        <p>:</p>
        <DateTimeDisplay value={seconds} type={"Seconds"} isDanger={false} />
      </div>
    </div>
  );
};

const CountdownTimer = ({ targetDate, setCanResend }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  if (days + hours + minutes + seconds <= 0) {
    setCanResend()
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default CountdownTimer;
