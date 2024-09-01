import Header from "./header";
import Sidebar from "./Sidebar";

const Page = (props) => {
  return (
    <div className="relative flex bg-white-2 w-full min-h-screen">
      <Sidebar />
      <div className="relative w-full ml-[80px] bg-bgColor">
        <Header
          bread={props.bread}
          title={props?.title}
          noti={props?.noti}
          configure={props?.configure}
        >
          {props?.header}
        </Header>
        <div className="mt-[88px] w-full pb-10">{props.children}</div>
      </div>
    </div>
  );
};

export default Page;
