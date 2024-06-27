import { useState } from "react";
import Input from "../components/Input";
import FrameCategory from "../components/FrameCategory";
import Collections from "../components/Collections";
import PopularSizes from "../components/PopularSizes";
import FrameColor from "../components/FrameColor";
import CustomSizeAdmin from "../components/CustomSizeAdmin";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { db, storage } from "../firebase-config";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import FileUpload from "../components/FileUpload";


const AdminPage = () => {
  const [prodName, setProdName] = useState("");
  const [price, setPrice] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [categoryCheck, setCategoryCheck] = useState("");
  const [colorCheck, setColorCheck] = useState("");
  const [sizeCheck, setSizeCheck] = useState("");
  const [collectCheck, setCollectCheck] = useState("");
  // const [imgURL, setImgURL] = useState("");
  let navigate = useNavigate();

  // console.log(categoryCheck);
  // console.log(colorCheck);
  // console.log(sizeCheck);
  // console.log(collectCheck);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    setImageName(file.name)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (imageFile === null) return;
      const imageRef = ref(storage, `image/${imageFile.name + v4()}`);
      // const uploadTask = uploadBytes(imageRef, imageFile);

      // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      //   console.log('File available at', downloadURL);
      //   setImgURL(downloadURL);
      // });

      uploadBytes(imageRef, imageFile).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log("File available at", url);
          // setImgURL(url);
          setDoc(doc(db, "products", prodName + v4()), {
            id: v4(),
            productName: prodName,
            productPrice: price,
            productImage: url,
            frameCategory: categoryCheck,
            frameColor: colorCheck,
            frameSize: sizeCheck,
            frameCollection: collectCheck,
          });
        });
      });
      // console.log(imgURL);
    } catch (error) {
      toast.error("An error occured");
      console.log(error);
    }
    toast.success("Product added sucessfully")
    navigate("/frames", { replace: true });
  };

  return (
    <div className="w-[90%] xl:w-[75%] mx-auto mt-16">
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      <div className="mt-12 flex flex-col xl:flex-row gap-20">
        <form className="md:w-[425px] flex flex-col gap-4">
          <Input
            title={"Product Name"}
            type={"text"}
            placeholder={"wooden frame"}
            name={"product"}
            onChange={(event) => {
              setProdName(event.target.value);
            }}
            //   error={error}
          />
          <Input
            title={"Price"}
            type={"number"}
            placeholder={"$000"}
            name={"price"}
            onChange={(event) => {
              setPrice(event.target.value);
            }}
            //   error={error}
          />
          <FileUpload
            title={"Product Image"}
            type={"file"}
            onChange={handleFileChange}
            imageFile={imageFile}
            imageName={imageName}
            //   error={error}
          />
          <button
            onClick={handleSubmit}
            className="mt-10 py-4 bg-dark-blue text-white rounded-lg"
          >
            Upload
          </button>
        </form>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-3">Product Attributes</h1>
          <div className="flex gap-14 flex-col md:flex-row xl:justify-between">
            <FrameCategory setCategoryCheck={setCategoryCheck} />
            <FrameColor setColorCheck={setColorCheck} />
          </div>
          <div className="flex flex-col md:flex-row gap-14 xl:justify-between mt-14">
            <PopularSizes setSizeCheck={setSizeCheck} />
            <div className="flex flex-col gap-10">
              {/* <CustomSizeAdmin /> */}
              <Collections setCollectCheck={setCollectCheck} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
