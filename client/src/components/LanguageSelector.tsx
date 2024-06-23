import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "../utils/constants";

const languages = LANGUAGE_VERSIONS;

const LanguageSelector = ({
  language,
  onSelect,
}: {
  language: string;
  onSelect: (language: string) => void;
}) => {
  return (
    <>
      <Box ml={2} mb={4}>
        <Menu isLazy>
          <MenuButton as={Button}>{language}</MenuButton>
          <MenuList bg="black">
            {languages.map((lang, index) => (
              <MenuItem
                key={index}
                onClick={() => onSelect(lang.language)}
                bg="black.500"
              >
                <div className="flex flex-row w-full">
                  <div className="basis-1/2 w-full flex justify-start text-white font-bold">{lang.language}</div>
                  <div className="basis-1/2 w-full flex justify-end text-white">
                    {lang.version}
                  </div>
                </div>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>
    </>
  );
};

export default LanguageSelector;
