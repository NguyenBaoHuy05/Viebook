import React from "react";
import { CgSpinnerTwo } from "react-icons/cg";
const LoadingPage = ({ isError }: { isError: boolean }) => {
  if (!isError) return false;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:text-black">
      <CgSpinnerTwo
        className="spinner text-blue-500"
        style={{ fontSize: "50px", animation: "spin 2s infinite linear" }}
      />
    </div>
  );
};

export default LoadingPage;
