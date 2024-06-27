import React, { useState } from "react";
import FileUploadImg from "../assets/uploadIcon.png";

const FileUpload = ({ title, onChange, imageFile, imageName }) => {
  return (
    <label className="flex flex-col">
      <span className="font-semibold lg:text-xl pb-2">{title}</span>
      <div className="bg-[#F8F8FF] p-5 border border-dashed rounded-md  border-dark-blue flex flex-col items-center gap-2">
        {/* // FIXME: Use next/image here*/}
        {/* <img src={FileUploadImg} alt="uploadIcon" />  */}
        {!imageFile ? (
          <p>
            Drag and drop files or{" "}
            <span className="cursor-pointer font-semibold text-dark-blue">
              Browse
            </span>
          </p>
        ) : (
          <p className="cursor-pointer font-semibold text-dark-blue">
            {imageName}
          </p>
        )}
        <p className="text-[#676767] text-xs">
          Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
        </p>
        <input hidden type="file" className="mt-4" onChange={onChange} />
      </div>
    </label>
  );
};

export default FileUpload;
