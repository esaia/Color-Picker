import React, { useRef, useState } from "react";
import { VscSettings } from "react-icons/vsc";
import { TbLock, TbLockOpen } from "react-icons/tb";
import {
  FaWindowClose,
  FaSave,
  FaSync,
  FaScroll,
  FaTrashAlt,
} from "react-icons/fa";
import { SliderPicker } from "react-color";
import { motion, AnimatePresence } from "framer-motion";

const ColorPicker = () => {
  const [activeObj, setAactiveObj] = useState({});
  const [lockedObj, setLockedObj] = useState({});
  const [colorObj, setColorObj] = useState({
    0: "#3BBD3F",
    1: "#E3E571",
    2: "#7186E5",
    3: "#B771E5",
    4: "#E571B0",
  });
  const [showModal, setShowModal] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [inputText, setinputText] = useState("");
  const inputRef = useRef();

  const saveColorsToLocalStorage = () => {
    const localStorageData =
      localStorage.getItem("savedColors") &&
      JSON.parse(localStorage.getItem("savedColors"));

    if (localStorageData) {
      localStorage.setItem(
        "savedColors",
        JSON.stringify([
          ...localStorageData,
          { name: inputText, colors: JSON.stringify(colorObj) },
        ])
      );
    } else {
      localStorage.setItem(
        "savedColors",
        JSON.stringify([{ name: inputText, colors: JSON.stringify(colorObj) }])
      );
    }

    setShowModal(false);
    setinputText("");
  };

  const removeFromLocalStorage = (selectedItem) => {
    const localStorageData = JSON.parse(localStorage.getItem("savedColors"));
    const newdata = localStorageData.filter(
      (item) => item.name !== selectedItem.name
    );

    localStorage.removeItem("savedColors");
    localStorage.setItem("savedColors", JSON.stringify(newdata));

    setShowStore(false);
    setTimeout(() => {
      setShowStore(true);
    }, 0);

    setinputText("");
  };

  const randomColors = () => {
    setColorObj(
      Object.entries(colorObj).map((item, index) => {
        return !lockedObj[index]
          ? `#${Math.floor(Math.random() * 16777215).toString(16)} `
          : `${colorObj[index]}`;
      })
    );
  };

  return (
    <div className=" w-full min-h-[100vh] h-[100vh]   flex flex-col  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ">
      <h2 className="text-2xl font-bold text-center p-2 moduleShow ease-linear text-white   ">
        Color Picker
      </h2>
      <div className="flex w-full  h-full  ">
        {Object.entries(colorObj).map((item, i) => {
          return (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 50,

                delay: "0." + i,
              }}
              className="w-full flex flex-col justify-evenly items-center relative  overflow-hidden"
              style={{
                backgroundColor: `   ${colorObj[i] && colorObj[i]}    `,
              }}
              key={i}
            >
              <h2 className="text-2xl">{colorObj[i]}</h2>
              <div className="flex flex-col gap-8">
                <VscSettings
                  className="cursor-pointer text-4xl"
                  onClick={() => {
                    setAactiveObj(
                      activeObj[i]
                        ? { ...activeObj, [i]: !activeObj[i] }
                        : { ...activeObj, [i]: true }
                    );
                  }}
                />

                <motion.div
                  whileTap={{ scale: 1.2 }}
                  whileHover={{ rotate: 180 }}
                  onClick={() =>
                    setLockedObj(
                      lockedObj[i]
                        ? { ...lockedObj, [i]: !lockedObj[i] }
                        : { ...lockedObj, [i]: true }
                    )
                  }
                >
                  {lockedObj[i] ? (
                    <TbLock className="cursor-pointer text-4xl" />
                  ) : (
                    <TbLockOpen className="cursor-pointer text-4xl" />
                  )}
                </motion.div>
              </div>
              {/* Color Picker Modal */}
              <AnimatePresence>
                {activeObj[i] && (
                  <motion.div
                    initial={{ y: -200, scale: 0.2, opacity: 0.0 }}
                    animate={{ y: 0, scale: 1, opacity: 1 }}
                    exit={{ y: -200, scale: 0.2, opacity: 0.0 }}
                    transition={{
                      duration: 0.1,
                      type: "spring",
                      stiffness: 160,
                    }}
                    className={`absolute w-[80%] h-[200px] bg-red-100 rounded-md bottom-0 `}
                  >
                    <FaWindowClose
                      className="text-2xl absolute right-0 cursor-pointer text-white m-2 z-40"
                      onClick={() => {
                        setAactiveObj(
                          activeObj[i] && { ...activeObj, [i]: false }
                        );
                      }}
                    />

                    <h2 className="my-[10px] ml-1 font-semibold ">
                      Choose Color:
                    </h2>

                    <SliderPicker
                      onChange={(color) => {
                        setColorObj({ ...colorObj, [i]: color.hex });
                      }}
                      onChangeComplete={(color) =>
                        setColorObj({ ...colorObj, [i]: color.hex })
                      }
                      color={colorObj[i] || "orange"}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Menu Section */}
      <motion.div
        className="flex justify-evenly items-center gap-7 h-[100px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 150,
          delay: ".6 ",
        }}
      >
        <div className="iconsdiv" onClick={() => setShowStore(true)}>
          <FaScroll className="icons" />
          <p>Store</p>
        </div>

        <div className="iconsdiv" onClick={randomColors}>
          <FaSync className="icons" />
          <p>Generate</p>
        </div>

        <div
          className="iconsdiv"
          onClick={() => {
            setShowModal(true);
            setTimeout(() => {
              inputRef.current.focus();
            }, 0);
          }}
        >
          <FaSave className="icons" />
          <p>Save</p>
        </div>
      </motion.div>

      {/* Save Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 150,
              delay: "0.1",
            }}
            className="w-full h-full backdrop  absolute"
            onClick={(e) => setShowModal(false)}
          >
            <div
              className=" bg-white rounded-md p-4  backdrop-blur-lg  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
              onClick={(e) => e.stopPropagation()}
            >
              <FaWindowClose
                className="text-2xl absolute top-2 right-0 cursor-pointer text-black m-2 z-50  "
                onClick={() => setShowModal(false)}
              />

              <h3 className="text-xl mb-3 cursor-pointer">Save</h3>
              <input
                type="text"
                ref={inputRef}
                className="border-solid border-gray-700 border-2 p-1 rounded-md outline-none"
                onChange={(e) => setinputText(e.target.value)}
                value={inputText}
              />
              <button
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  rounded-lg m-2 py-1 px-4 text-white"
                onClick={saveColorsToLocalStorage}
              >
                save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show Store */}

      <AnimatePresence>
        {showStore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 150,
              delay: "0.1",
            }}
            className="w-full h-full backdrop  absolute"
            onClick={(e) => setShowStore(false)}
          >
            <div
              className=" min-w-[340px] bg-white rounded-md p-4  backdrop-blur-lg  absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
              onClick={(e) => e.stopPropagation()}
            >
              <FaWindowClose
                className="text-2xl absolute top-2 right-0 cursor-pointer text-black m-2 z-50  "
                onClick={() => setShowStore(false)}
              />

              <h3 className="text-xl mb-3 cursor-pointer">Your Saved Items:</h3>

              {localStorage.getItem("savedColors") &&
              JSON.parse(localStorage.getItem("savedColors")).length !== 0 ? (
                <h2>
                  {JSON.parse(localStorage.getItem("savedColors")).map(
                    (item, index) => {
                      const colorsArr = Object.entries(JSON.parse(item.colors));

                      return (
                        <div
                          key={index}
                          className="flex  justify-between items-center  mb-3 "
                        >
                          <h2 className="flex-1">{item.name}</h2>
                          <div
                            className="flex flex-1 h-10 gap-1  cursor-pointer"
                            onClick={() => setColorObj(JSON.parse(item.colors))}
                          >
                            {colorsArr.map((item, index) => {
                              return (
                                <div
                                  className="w-4 h-full bg-gray-200"
                                  key={index}
                                  style={{ backgroundColor: `${item[1]}` }}
                                ></div>
                              );
                            })}
                          </div>
                          <FaTrashAlt
                            className="hover:text-red-500 cursor-pointer"
                            onClick={() => removeFromLocalStorage(item)}
                          />
                        </div>
                      );
                    }
                  )}
                </h2>
              ) : (
                <h2>There is no saved Colors</h2>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorPicker;
