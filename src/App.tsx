import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useGetIpContryAndCityQuery } from "./services/ip_geolocation";
import { Location, LocationResponce } from "./types/location_res";
import { ReactComponent as LocIcon } from "../public/images/icon-location.svg";
import { Icon } from "leaflet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
function SetView({
  data,
}: {
  data: LocationResponce | undefined;
}): null {
  const map = useMap();
  map.setView(
    [data?.location.lat ?? 51.505, data?.location.lng ?? -0.09],
    map.getZoom(),
    {
      animate: true,
    }
  );
  return null;
}
 
function App() {
  const [skipToken,SetSkipToken]=useState(true);
  const [ipAddress, setIpAddress] = useState("");
  const {
    data,
    error,
    isLoading,
    originalArgs,
    requestId,
    currentData,
    status,
    endpointName,
    refetch,
  } = useGetIpContryAndCityQuery(ipAddress, { skip: skipToken });
 
  if (error) {
    
    setIpAddress("");
  }
  if (error && !isLoading) {
    toast.error((error as any)?.data?.messages ?? (error as any)?.error, {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
  function go() {
    
    if (ipAddress.search(new RegExp("[a-z]")) !== -1) {
      if (
        !new RegExp(
          "^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:.[a-zA-Z]{2,})+$"
        ).test(ipAddress)
      ) {
        toast.error("Invalid domain\nexample.com", {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      }

    }
    
    SetSkipToken ( false);
  }
  return (
    <div className="flex flex-col h-[100vh]">
      <div className=" absolute z-50 w-full top-0 left-0  gap-5 items-stretch px-5  h-[15rem] md:h-[13rem]   bg-[url('/images/pattern-bg.png')]">
        <div className="flex flex-col gap-5 h-fit">
          <p className=" self-center text-xl mt-5 text-white">
            IP Address Tracker
          </p>
          <div className="flex  self-center  rounded-xl overflow-clip bg-black">
            <input
              onKeyDown={(a) => {
                if (a.code === "Enter") {
                  go();
                }
              }}
              defaultValue={ipAddress}
              disabled={isLoading}
              className={`${
                isLoading
                  ? "animate-back-line"
                  : "pl-5 md:w-[25rem] md:animate-md-moving-line animate-moving-line"
              } 
          outline-0 border-transparent outline-none 
          border-none py-3  md:w-[25rem] bg-white  ring-white ring-0`}
              placeholder="Search for any IP address or domaine"
              onChange={(e) => {
                if (!skipToken) {
                  SetSkipToken ( true);
                }
                 setIpAddress( e.target.value);
              }}
            />
            <button
              className="flex  
      items-center justify-center h-[3rem]  w-[3rem]"
              onClick={() => {
                go();
              }}
            >
              <img
                className={`${isLoading && "animate-ping"}`}
                src="images/icon-arrow.svg"
              />
            </button>
          </div>
          <div className="flex md:flex-row md:mt-3 md:mx-20  flex-col md:gap-16 justify-between drop-shadow-lg gap-1 rounded-xl  p-4 bg-white">
            <div className="bat-container">
              <p className="head-bat">
                {ipAddress &&
                  (ipAddress.search(RegExp("[a-z]")) ? "Ip address" : "domain")}
              </p>
              <p className="sub-bat ">{ipAddress ? ipAddress : "---"}</p>
            </div>
            <div className="bat-container">
              <p className="head-bat">Location</p>
              <p className="sub-bat whitespace-pre-wrap">
                {data?.location?.city
                  ? `${data.location.city},\n${data.location.region}`
                  : "---"}
              </p>
            </div>
            <div className="bat-container">
              <p className="head-bat">Timezone</p>
              <p className="sub-bat break-keep whitespace-nowrap    ">
                {data?.location?.timezone
                  ? "UTC " + data.location.timezone
                  : "---"}
              </p>
            </div>
            <div className="bat-container  ">
              <p className="head-bat">isp</p>
              <p className="sub-bat ">{data?.isp ? data.isp : "---"}</p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
      <div className=" z-10 absolute  -bottom-0 w-full h-[90%]   ">
        <MapContainer
          className="h-full flex flex-col bg-black"
          id={"map"}
          center={[data?.location.lat ?? 51.505, data?.location.lng ?? -0.09]}
          zoom={13}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            icon={
              new Icon({
                iconUrl: "images/icon-location.svg",
                className: "h-14 -ml-[1.5rem]",
              })
            }
            position={[
              data?.location.lat ?? 51.505,
              data?.location.lng ?? -0.09,
            ]}
          >
            <Popup className="self-center ">
              {!data && <p className="text-center">---</p>}
              {data && (
                <p>
                  {data.location.country}-{data.location.city}-
                  {data.location.region}
                </p>
              )}
            </Popup>
          </Marker>
          <SetView data={data} />
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
