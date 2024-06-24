const Timer = () => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 60);
  return <div>Resend OTP in </div>;
};

export default Timer;
