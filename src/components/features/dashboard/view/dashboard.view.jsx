"use client";
import { useEffect, useState } from "react";

import Page from "@/components/layout/page";
import CONDITION from "@/const/condition";
import ROBOT from "@/const/robot";
import useBases from "@/hooks/useBases";

import CardFilterCondition from "../filter/filterCondition.card";

import CardRobotBase from "./robot-base.card";
import CardRobotModule from "./robot-module.card";
import CardRobotOnline from "./robot-online.card";

const DashboardView = () => {
  const [condition, setCondition] = useState(null);
  const [online, setOnline] = useState(true);
  const [robot, setRobot] = useState(ROBOT.BASE);

  const [dataCritical, setDataCritical] = useState([]);
  const [dataWarning, setDataWarning] = useState([]);
  const [dataGood, setDataGood] = useState([]);
  const [dataIdle, setDataIdle] = useState([]);
  const [dataRobotBase, setDataRobotBase] = useState([]);
  const [dataRobotModule, setDataRobotModule] = useState([]);

  const { getAllRobots, onlineRobots, offlineRobots, allRobots } = useBases();

  useEffect(() => {
    getAllRobots();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [condition, online, robot]);

  useEffect(() => {
    if (allRobots) {
      setDataCritical(onlineRobots?.critical || []);
      if (onlineRobots?.critical?.length > 0) {
        setCondition(CONDITION.CRITICAL);
      }

      setDataWarning(onlineRobots?.warning || []);
      if (onlineRobots?.warning?.length > 0) {
        setCondition(CONDITION.WARNING);
      }

      setDataGood(onlineRobots?.good || []);
      if (onlineRobots?.good?.length > 0) {
        setCondition(CONDITION.GOOD);
      }

      setDataIdle(onlineRobots?.idle || []);
      if (onlineRobots?.idle?.length > 0) {
        setCondition(CONDITION.IDLE);
      }

      setDataRobotBase(offlineRobots || []);
    }
  }, [allRobots]);

  return (
    <Page title={"Dashboard"}>
      <div className="flex flex-col w-full text-black-1">
        <div className=" px-2 md:px-5 flex flex-col md:flex-row  w-full h-full bg-white-2 space-y-2.5">
          <CardFilterCondition
            condition={condition}
            setCondition={(val) => setCondition(val)}
            online={online}
            setOnline={(val) => setOnline(val)}
            robot={robot}
            setRobot={(val) => setRobot(val)}
            totCritical={dataCritical?.length}
            totWarning={dataWarning?.length}
            totGood={dataGood?.length}
            totIdle={dataIdle?.length}
            totRobotBase={dataRobotBase?.length}
            totRobotModule={dataRobotModule?.length}
          />
        </div>

        <div className="">
          {online && (
            <div className="px-4 mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 gap-y-2.5">
              {condition === CONDITION.CRITICAL && (
                <>
                  {dataCritical.map((item, key) => {
                    return (
                      <CardRobotOnline
                        robots={allRobots?.data || []}
                        key={key}
                        item={item}
                      />
                    );
                  })}
                </>
              )}

              {condition === CONDITION.WARNING && (
                <>
                  {dataWarning.map((item, key) => {
                    return (
                      <CardRobotOnline
                        robots={allRobots?.data || []}
                        key={key}
                        item={item}
                      />
                    );
                  })}
                </>
              )}

              {condition === CONDITION.GOOD && (
                <>
                  {dataGood.map((item, key) => {
                    return (
                      <CardRobotOnline
                        robots={allRobots?.data || []}
                        key={key}
                        item={item}
                      />
                    );
                  })}
                </>
              )}

              {condition === CONDITION.IDLE && (
                <>
                  {dataIdle.map((item, key) => {
                    return (
                      <CardRobotOnline
                        robots={allRobots?.data || []}
                        key={key}
                        item={item}
                      />
                    );
                  })}
                </>
              )}
            </div>
          )}

          {!online && (
            <div className="px-4 mt-5 grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-2.5">
              {robot === ROBOT.BASE && (
                <>
                  {dataRobotBase.map((item, key) => {
                    return (
                      <CardRobotBase
                        robots={allRobots?.data || []}
                        key={key}
                        item={item}
                      />
                    );
                  })}
                </>
              )}

              {/* {robot === ROBOT.MODULE && (
                <>
                  {dataRobotModule.map((item, key) => {
                    return <CardRobotModule key={key} item={item} />;
                  })}
                </>
              )} */}
            </div>
          )}
        </div>
      </div>
    </Page>
  );
};

export default DashboardView;
