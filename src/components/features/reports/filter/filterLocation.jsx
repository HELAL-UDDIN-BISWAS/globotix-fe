import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import CardExpandable from "@/components/common/cardExpandable";
import CardExpandableFilter from "@/components/common/cardExpandableFilter";
import ChecboxInput from "@/components/form/checkbox.input";

const FilterLocation = (props) => {
  const [options, setOptions] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {};

  useEffect(() => {
    let data = props.options.map((item) => {
      return {
        ...item,
        show: true,
      };
    });

    setOptions(data);
  }, [props.options]);

  useEffect(() => {
    props.handleFilter({
      location: watch("location"),
    });
  }, [watch("location")]);

  // useEffect(() => {
  //   let data = props.options.map((item) => {
  //     return {
  //       ...item,
  //       show: item.name.toLowerCase().includes(watch("search").toLowerCase())
  //         ? true
  //         : false,

  //     };
  //   });
  //   setOptions(data);
  // }, [watch("search")]);

  const checkJamak = () => {
    if (watch("location") && watch("location").length > 1) {
      return "locations";
    } else {
      return "location";
    }
  };

  const checkJamakBuilding = () => {
    if (watch("building") && watch("building").length > 1) {
      return "buildings";
    } else {
      return "building";
    }
  };

  return (
    <CardExpandable
      infoMsg={`
      ${
        watch("building") ? watch("building").length : 0
      } ${checkJamakBuilding()},
      
      ${
        watch("location") ? watch("location").length : 0
      } ${checkJamak()} selected`}
      darkHeader
      title="Filter by Building"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <div>
          <TextInput
            register={register}
            name="search"
            placeholder="Search Location"
            isInvalid={errors.search}
            color={"text-white"}
          />
        </div> */}
        {options?.length > 0 && (
          <div className="flex flex-col space-y-2.5">
            {options.map((item, key) => {
              if (item.show) {
                return (
                  <CardExpandableFilter
                    key={key}
                    checkbox={
                      <ChecboxInput
                        label={item.name}
                        value={item.name}
                        name={"building"}
                        register={register}
                        control={control}
                        color="text-black-1"
                      />
                    }
                  >
                    {item.location.map((subitem, subkey) => {
                      return (
                        <div className="pl-6 mt-1" key={subkey}>
                          <ChecboxInput
                            label={subitem.name}
                            value={subitem.name}
                            name={"location"}
                            register={register}
                            control={control}
                            color="text-black-1"
                          />
                        </div>
                      );
                    })}
                  </CardExpandableFilter>
                );
              }
            })}
          </div>
        )}
      </form>
    </CardExpandable>
  );
};

export default FilterLocation;
