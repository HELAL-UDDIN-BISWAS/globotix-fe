import SampleData1 from "@/components/data/sample1.data";
import SampleData2 from "@/components/data/sample2.data";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

let Data = [SampleData1, SampleData2];
let arrCoverage = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
let arrCoverageCompleted = [75, 80, 85, 90, 100];
let arrCoveragePartialyCompleted = [
  5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70,
];

let arrBuilding = [
  {
    id: "building_1",
    name: "Building 1",
    location: [
      {
        id: "building_1_location_1",
        name: "Location 1",
      },
      {
        id: "building_1_location_2",
        name: "Location 2",
      },
    ],
  },
  {
    id: "building_2",
    name: "Building 2",
    location: [
      {
        id: "building_2_location_3",
        name: "Location 3",
      },
      {
        id: "building_2_location_4",
        name: "Location 4",
      },
      {
        id: "building_2_location_5",
        name: "Location 5",
      },
    ],
  },
  {
    id: "building_3",
    name: "Building 3",
    location: [
      {
        id: "building_3_location_6",
        name: "Location 6",
      }
    ],
  },
];

let arrRobotId = [
  "flexo",
  "flexo_1",
  "flexo_2",
  "flexo_3",
  "flexo_4",
  "flexo_5",
];
let arrCleaningStatus = [
  "CANCELLED",
  "COMPLETED",
  "INCOMPLETE",
];
let arrUser = [
  "Joann Cruz",
  "Erin Hancock",
  "Amanda Kim",
  "Rebecca Williams",
  "Tammy Hood",
  "Daniel Watts",
  "Pamela Clark",
];

const datestring = (d) => {
  let date = ("0" + d.getDate()).slice(-2);
  let month = ("0" + (d.getMonth() + 1)).slice(-2);
  let year = d.getFullYear();
  return `${date}/${month}/${year}`;
};

const dateYYYYMMDD = (d) => {
  let date = ("0" + d.getDate()).slice(-2);
  let month = ("0" + (d.getMonth() + 1)).slice(-2);
  let year = d.getFullYear();
  return `${year}/${month}/${date}`;
};

const strToDate = (str) => {
  let arr = str.split("/");
  let d = new Date(`${arr[2]}/${arr[1]}/${arr[0]}`);

  let date = ("0" + d.getDate()).slice(-2);
  let month = ("0" + (d.getMonth() + 1)).slice(-2);
  let year = d.getFullYear();
  return `${year}/${month}/${date}`;
};

const dateLast7Days = () => {
  const data = [];
  const now = new Date();
  let i = 0;
  while (i < 7) {
    let d = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - (i + 1)
    );
    data.push(datestring(d));
    i++;
  }

  return data;
};

const dateLast30Days = () => {
  const data = [];
  const now = new Date();
  let i = 0;
  while (i < 30) {
    let d = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - (i + 1)
    );
    data.push(datestring(d));
    i++;
  }

  return data;
};

const dateYearToDate = () => {
  const data = [];
  const now = new Date();
  let i = 0;
  while (i < 30) {
    data.push(
      `${getRandomInt(27) + 1}/${getRandomInt(11) + 1}/${now.getFullYear()}`
    );
    i++;
  }

  return data;
};

const dateLastYear = () => {
  const data = [];
  const now = new Date();
  let i = 0;
  while (i < 30) {
    data.push(
      `${getRandomInt(27) + 1}/${getRandomInt(11) + 1}/${now.getFullYear() - 1}`
    );
    i++;
  }

  return data;
};

const generateDuration = () => {
  let rnd = getRandomInt(4);
  let arr = [];

  switch (rnd) {
    case 0:
      arr = dateLast7Days();
      return arr[getRandomInt(arr.length)];
    case 1:
      arr = dateLast30Days();
      return arr[getRandomInt(arr.length)];
    case 2:
      arr = dateYearToDate();
      return arr[getRandomInt(arr.length)];
    case 3:
      arr = dateLastYear();
      return arr[getRandomInt(arr.length)];
    default:
      arr = dateYearToDate();
      return arr[getRandomInt(arr.length)];
  }
};

const percentage = (status) => {
  switch (status) {
    case "COMPLETE":
      return arrCoverageCompleted[getRandomInt(arrCoverageCompleted.length)];

    case "INCOMPLETE":
      return 0;

    case "PARTIALLY COMPLETED":
      return arrCoveragePartialyCompleted[
        getRandomInt(arrCoveragePartialyCompleted.length)
      ];

    case "FAILED":
      return 0;
  }
};

let i = 0;
while (i < 50) {
  let status = arrCleaningStatus[getRandomInt(arrCleaningStatus.length)];
  let rnd = getRandomInt(arrBuilding.length);

  Data.push({
    ...SampleData1,
    user: arrUser[getRandomInt(arrUser.length)],
    _id: i + 3,
    building_name: arrBuilding[rnd].name,
    location_name:
      arrBuilding[rnd].location[getRandomInt(arrBuilding[rnd].location.length)].name,
    coverage_percentage: percentage(status),
    robot_id: arrRobotId[getRandomInt(arrRobotId.length)],
    cleaning_status: status,
    date: generateDuration(),
  });

  i++;
}

const strLoc = (filter) => {
  if (filter?.location?.length > 0) {
    let evalLoc = [];
    let i = 0;
    while (i < filter?.location?.length) {
      evalLoc.push(`arr[i].building_name === '${filter?.location[i]}'`);
      i++;
    }
    return evalLoc.join(" || ");
  } else {
    return false;
  }
};

const strRob = (filter) => {
  if (filter?.robot_id?.length > 0) {
    let evalLoc = [];
    let i = 0;
    while (i < filter?.robot_id?.length) {
      evalLoc.push(`arr[i].robot_id === '${filter?.robot_id[i]}'`);
      i++;
    }
    return evalLoc.join(" || ");
  } else {
    return false;
  }
};

const strStatus = (filter) => {
  if (filter?.cleaning_status?.length > 0) {
    let evalLoc = [];
    let i = 0;
    while (i < filter?.cleaning_status?.length) {
      evalLoc.push(
        `arr[i].cleaning_status === '${filter?.cleaning_status[i]}'`
      );
      i++;
    }
    return evalLoc.join(" || ");
  } else {
    return false;
  }
};

const strDuration = (filter) => {
  const now = new Date();
  const nowStr = datestring(now);
  let minDate;
  let maxDate;
  switch (filter.duration) {
    case "all_time":
      return false;

    case "last_7_days":
      minDate = datestring(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      );
      return `strToDate(arr[i].date) >= strToDate('${minDate}') && strToDate(arr[i].date) <= strToDate('${maxDate}')`;
    case "last_30_days":
      minDate = datestring(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)
      );
      return `strToDate(arr[i].date) >= strToDate('${minDate}') && strToDate(arr[i].date) <= strToDate('${maxDate}')`;

    case "year_to_date":
      minDate = datestring(new Date(now.getFullYear(), 0, 1));
      return `strToDate(arr[i].date) >= strToDate('${minDate}') && strToDate(arr[i].date) <= strToDate('${maxDate}')`;

    case "last_year":
      minDate = datestring(new Date(now.getFullYear() - 1, 0, 1));
      maxDate = datestring(new Date(now.getFullYear() - 1, 11, 31));
      return `strToDate(arr[i].date) >= strToDate('${minDate}') && strToDate(arr[i].date) <= strToDate('${maxDate}')`;

    case "custom":
      minDate = datestring(new Date(filter.min_date));
      maxDate = datestring(new Date(filter.max_date));
      return `strToDate(arr[i].date) >= strToDate('${minDate}') && strToDate(arr[i].date) <= strToDate('${maxDate}')`;

      return false;

    default:
      return false;
  }
};

const getAllReport = (filter) => {
  let arr = [...Data];
  let arrFilter = [];
  let ifArr = [
    `(${strDuration(filter)})`,
    `(${strLoc(filter)})`,
    `(${strRob(filter)})`,
    `(${strStatus(filter)})`,
  ];

  let ifReport = ifArr.filter((item) => item !== "(false)").join(" && ");
  if (ifReport !== "") {
    let i = 0;
    while (i < arr.length) {
      eval(ifReport) ? arrFilter.push(arr[i]) : "";
      i++;
    }

    return arrFilter;
  } else {
    return arr;
  }
};

const getAllRobotId = () => {
  return arrRobotId;
};

const getAllLocation = () => {
  return arrBuilding;
};

const getAllCleaningPlan = () => {
  let i = 0;
  let arr = [];
  while (i < 10) {
    arr.push("Terminal " + (i + 1));
    i++;
  }
  return arr;
};
const getAllCleaningStatus = () => {
  return arrCleaningStatus;
};

const getReportById = (id) => {
  let item = Data.find((item) => item._id.toString() == id);
  return item;
};

export {
  getAllCleaningPlan,
  getAllCleaningStatus,
  getAllLocation,
  getAllReport,
  getAllRobotId,
  getReportById,
};
