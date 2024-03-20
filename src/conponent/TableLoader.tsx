import { CSSProperties } from "react";
import BarLoader from "react-spinners/BarLoader";

const TableLoader = ({ isLoading }: any) => {



  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    width: "99.8%",
    borderRadius: "50px"
  };


  return (
    <div className="loading_container">
      <BarLoader
        cssOverride={override}
        color={"#8796FC"}
        loading={isLoading}
      />
    </div>
  );
};

export default TableLoader;
