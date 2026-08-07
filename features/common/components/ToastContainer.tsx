"use client"
import { ToastContainer as ReactToastContainer } from "react-toastify"

const ToastContainer = () => {
  return (
    <ReactToastContainer
      toastClassName={() => "relative flex mt-2 mr-2 p-4 pr-8 w-80 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-lg"}
      closeButton={({ closeToast }) => (
        <button
          className="absolute top-2 right-2 w-4 text-neutral-700 dark:text-neutral-300"
          onClick={closeToast}>
          <svg aria-hidden="true" viewBox="0 0 14 16">
            <path
              fillRule="evenodd"
              fill="currentColor"
              d="M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z" />
          </svg>
        </button>
      )}
    />
    // <ReactToastContainer />
  );
}

export default ToastContainer;