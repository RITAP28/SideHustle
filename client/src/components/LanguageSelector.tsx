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
    <Box ml={2} mb={4}>
        <Menu isLazy>
            <MenuButton as={Button}>
                {language}
            </MenuButton>
            <MenuList bg="black">
                {languages.map((lang, version) => (
                  <MenuItem key={version} onClick={() => onSelect(lang[0])}>
                    {lang}
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