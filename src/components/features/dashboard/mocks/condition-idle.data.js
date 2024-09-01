const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

let Data = [];
let Info = [
  "Docked",
  "Idle",
  "Undocked",
];

let i = 0;
while (i < 8) {
  Data.push({
    base_id: "BASE_ID_" + getRandomInt(2000),
    module_id: "MODULE_ID_" + getRandomInt(2000),
    building_name: "-",
    location_name: "SingPost Centre",
    coverage: 80,
    cleaning_time: "-",
    cleaning_duration: `-`,
    info: Info[getRandomInt(Info.length)],
  });

  i++;
}

const getAllIdle = () => {
  return Data;
};

export { getAllIdle };
