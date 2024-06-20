import {
    Box,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Text,
  } from '@chakra-ui/react';
import { LANGUAGE_VERSIONS } from '../utils/constants';

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ language, onSelect } : {
  language: string;
  onSelect: (language: string) => void;
}) => {
  return (
    <>
    <Box>
        <Menu>
            <MenuButton as={Button}>
                {language}
            </MenuButton>
            <MenuList>
                {languages.map((language, version) => (
                  <MenuItem onClick={() => onSelect(language[0])}>
                    {language}
                    &nbsp;
                    <Text as="span" color="gray.500" fontSize="sm">
                      {version}
                    </Text>
                  </MenuItem>
                ))}
            </MenuList>
        </Menu>
    </Box>
    </>
  )
}

export default LanguageSelector