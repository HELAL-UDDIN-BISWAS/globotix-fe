import CONDITION from "@/const/condition";
import ROBOT from "@/const/robot";

import CardCriticalCondition from "./conditionCritical.card";
import CardGoodCondition from "./conditionGood.card";
import CardIdleCondition from "./conditionIdle.card";
import CardOfflineCondition from "./conditionOffline.card";
import CardWarningCondition from "./conditionWarning.card";
import CardStatus from "./status.card";

const CardFilterCondition = (props) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex ">
        <CardStatus
          setOnline={() => props.setOnline(true)}
          online={props.online}
          label="Online"
          total={
            props.totCritical + props.totWarning + props.totGood + props.totIdle
          }
        />
        <CardStatus
          setOnline={() => props.setOnline(false)}
          online={!props.online}
          label="Offline"
          total={props.totRobotBase}
        />
      </div>
      <div className="border-b border-[bodyTextColor] w-full my-3"></div>
      <div className="flex flex-col md:flex-row gap-2">
        {props.online ? (
          <>
            <CardCriticalCondition
              total={props.totCritical}
              active={props.condition == CONDITION.CRITICAL}
              onClick={
                props.totCritical > 0
                  ? (val) => props.setCondition(val)
                  : () => {}
              }
            />
            <CardWarningCondition
              total={props.totWarning}
              active={props.condition == CONDITION.WARNING}
              onClick={
                props.totWarning > 0
                  ? (val) => props.setCondition(val)
                  : () => {}
              }
            />
            <CardGoodCondition
              total={props.totGood}
              active={props.condition == CONDITION.GOOD}
              onClick={
                props.totGood > 0 ? (val) => props.setCondition(val) : () => {}
              }
            />
            <CardIdleCondition
              total={props.totIdle}
              active={props.condition == CONDITION.IDLE}
              onClick={
                props.totIdle > 0 ? (val) => props.setCondition(val) : () => {}
              }
            />
          </>
        ) : (
          <>
            <CardOfflineCondition
              label={ROBOT.BASE}
              total={props.totRobotBase}
              active={props.robot == ROBOT.BASE}
              onClick={(val) => props.setRobot(val)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CardFilterCondition;
