import React, { useEffect, useState } from "react";
import Logo from "../assets/frameasy-logo.png";
import DefaultWall from "../assets/defaultWall.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack, IoIosAdd } from "react-icons/io";
import Input from "../components/Input";
import Frame from "../assets/frame-1.png";
import { FaTimes } from "react-icons/fa";
import FileUpload from "../components/FileUpload";
import CustomSizeAdmin from "../components/CustomSizeAdmin";
import PopularSizes from "../components/PopularSizes";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { toast } from "react-toastify";

const AddArtWork = ({ addFrame, toggle }) => {
  return (
    <>
      {addFrame && (
        <div onClick={toggle} className="fixed right-0 top-0 w-full h-full bg-black opacity-50" />
      )}
      <div
        className={`fixed overflow-y-scroll right-[-100%] top-0 bg-white max-w-[640px] h-full p-12 shadow-xl z-30 ease-in-out duration-300 ${
          addFrame && "right-[0]"
        }`}
      >
        <div className="flex justify-end">
          <FaTimes
            size={24}
            onClick={toggle}
            className="cursor-pointer text-right mb-12"
          />
        </div>

        <div className="flex flex-col gap-10">
          <div>
            <h1 className="text-3xl font-semibold">Add Artwork</h1>
            <p className="pt-2">
              We offer you the flexibility to add artwork in a way that suits
              your preferences. Whether you have a direct link to the piece you
              want to frame or wish to browse through our system.
            </p>
          </div>
          <div className="flex flex-col gap-8">
            <Input
              title={"Link to Artwork"}
              type={"text"}
              placeholder={"https://www.shutterstock.com/image-illustration"}
              name={"name"}
              // onChange={(event) => {
              //   setRegisterEmail(event.target.value);
              // }}
              // error={error}
            />
            <div className="flex items-center">
              <div className="bg-[#D2D1D1] h-[1px] w-full" />
              <p className="font-semibold text-xl px-4">or</p>
              <div className="bg-[#D2D1D1] h-[1px] w-full" />
            </div>
            <FileUpload
              title={"Add Artwork"}
              type={"file"}
              // onChange={handleFileChange}
              // imageFile={imageFile}
              // imageName={imageName}
              //   error={error}
            />
          </div>
          <button className="bg-dark-blue py-4 text-white text-xl rounded-xl">
            Add
          </button>
        </div>
      </div>
    </>
  );
};

const ChangeFrameSize = ({toggle, changeFrame}) => {
  return (
    <>
          {changeFrame && (
        <div onClick={toggle} className="fixed right-0 top-0 w-full h-full bg-black opacity-50" />
      )}
      <div
        className={`fixed overflow-y-scroll right-[-100%] top-0 bg-white h-full p-12 shadow-xl z-30 ease-in-out duration-300 ${
          changeFrame && "right-[0]"
        }`}
      >
    <div className="flex justify-end">
          <FaTimes
            size={24}
            onClick={toggle}
            className="cursor-pointer text-right mb-12"
          />
        </div>
        <div className="flex flex-col gap-[60px]">
          <CustomSizeAdmin />
          <PopularSizes />
          <button className="border border-dark-blue border-solid py-4 text-dark-blue text-xl rounded-xl">
            Apply sizes
          </button>
        </div>
    </div>
    </>
  )
}

const FramesDetails = ({ onAdd, frames }) => {
  const [frameDetails, setFrameDetails] = useState({})
  const [addFrame, setAddFrame] = useState(false);
  const [frameSizeChange, setFrameSizeChange] = useState(false)
  const location = useLocation();
  const navigate = useNavigate();
  
  const framesCollectionDetailsRef = doc(db, "products", location.state.id);

  useEffect(() => {
    const getFrameDetail = async () => {
      //  setLoading(true);
       const docSnap = await getDoc(framesCollectionDetailsRef);
       setFrameDetails(docSnap.data());
      //  setLoading(false);
    };
    getFrameDetail(); // eslint-disable-next-line
 }, []);

 const { productName, productPrice, productImage } = frameDetails;


  const addToCart = () => {
    onAdd(frameDetails);
    toast.success("Product added to cart");
  };

  const toggleAddArtwork = () => {
    addFrame === true ? setAddFrame(false) : setAddFrame(true);
  };

  const toggleChangeFrame = () => {
    frameSizeChange === true ? setFrameSizeChange(false) : setFrameSizeChange(true);
  };

  return (
    <>
      <div className="relative w-[89%] mx-auto">
        <nav className="flex justify-between my-10">
          <button
            onClick={() => navigate(-1)}
            className="flex gap-3 items-center"
          >
            <IoIosArrowRoundBack />
            Back
          </button>
          <img src={Logo} alt="logo" className="hidden md:block" />
          <button
            onClick={addToCart}
            className="px-5 py-2 md:py-4 bg-dark-blue text-xl font-semibold rounded-xl text-white"
          >
            Add to Cart
          </button>
        </nav>
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 relative">
            <img src={DefaultWall} alt="wall" />
            <img src={productImage} alt="frame" className="absolute top-20 left-20 w-[300px]" />
          </div>
          <div className="flex-1">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold pb-3">
                {productName}
              </h2>
              <p className="text-xl">${productPrice}</p>
              <h3 className="text-2xl mt-8 font-semibold">Personalize</h3>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <button
                  onClick={() => {
                    setAddFrame(!addFrame);
                  }}
                  className="flex gap-4 items-center justify-center text-dark-blue border border-solid border-dark-blue px-3 py-4 rounded-xl text-xl"
                >
                  <IoIosAdd size={24} />
                  Add Artwork
                </button>
                <button
                  onClick={() => {
                    setFrameSizeChange(!frameSizeChange);
                  }}
                  className="text-dark-blue px-3 py-4 text-xl"
                >
                  Change Frame size
                </button>
              </div>
              <Input
                title={"Frame Label"}
                type={"text"}
                placeholder={"wooden frame"}
                name={"name"}
                // onChange={(event) => {
                //   setRegisterEmail(event.target.value);
                // }}
                // error={error}
              />
            </div>
          </div>
        </div>
      </div>
      {addFrame && <AddArtWork addFrame={addFrame} toggle={toggleAddArtwork} />}
      <ChangeFrameSize changeFrame={frameSizeChange} toggle={toggleChangeFrame} />
    </>
  );
};

export default FramesDetails;
