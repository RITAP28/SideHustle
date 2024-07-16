import { Menu, MenuItem, MenuList, useDisclosure } from "@chakra-ui/react";
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Modal,
} from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "../../utils/constants";
import { useState } from "react";

const languages = LANGUAGE_VERSIONS;

const AllFiles = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  return (
    <>
      <div className="">
        <Modal
          blockScrollOnMount={false}
          isOpen={isOpen}
          onClose={onClose}
          isCentered
          size={"xl"}
        >
          <ModalOverlay />
          <ModalContent backgroundColor={"gray"}>
            <h1 className="font-Code font-bold text-lg pl-2 pt-2">
              Create a new file:
            </h1>
            <ModalCloseButton />
            <ModalBody>
              <div className="w-full flex flex-row">
                <div className="basis-1/2 w-full">
                  <div className="w-full">
                    <p className="font-Philosopher font-semibold underline">
                      Templates:
                    </p>
                  </div>
                  <div className="pt-2">
                    <input
                      type="search"
                      name=""
                      className={`w-[95%] px-2 py-1 bg-slate-800 border-2 border-black font-Code text-sm text-white`}
                      placeholder="Search Templates"
                      onFocus={() => {
                        setMenuOpen(true);
                      }}
                    />
                  </div>
                  <div className="">{menuOpen && <AllTemplates language={language} onSelect={onSelect} />}</div>
                </div>
                <div className="basis-1/2 w-full">
                  <div className="w-full">
                    <p className="font-Philosopher font-semibold underline">
                      Name:
                    </p>
                  </div>
                  <div className="w-full pt-2">
                    <input
                      type="text"
                      name=""
                      className="w-[90%] px-2 py-1 text-sm border-2 border-black bg-slate-800 font-Code text-white"
                      placeholder="Name your file"
                    />
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      <div className="flex justify-center pb-4">
        <button
          type="button"
          className="px-4 py-1 border-2 border-white text-white font-Code hover:bg-white hover:text-black"
          onClick={onOpen}
        >
          New File
        </button>
      </div>
      <hr className="border-slate-700" />
      <div className="flex justify-center text-white font-Code pt-4">
        No files right now
      </div>
    </>
  );
};

const AllTemplates: React.FC = ({ language, onSelect } : {
    language: string;
    onSelect: (language: string) => void;
}) => {
  return (
    <div className="">
      <Menu isLazy>
        <MenuList bg="black">
          {languages.map((lang, index) => (
            <MenuItem
              key={index}
              onClick={() => onSelect(lang.language)}
            ></MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
};

export default AllFiles;
