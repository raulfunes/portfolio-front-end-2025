import { useTranslation } from 'react-i18next';
import Select from 'react-select';

const options = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
];

const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: '#06132b',
      borderRadius: '8px',
      border: 'none',
      padding: '2px 4px',
      width: "130px",
    }),
    singleValue: (base: any) => ({
        ...base,
        color: '#f2f2f2',
        fontWeight: '500',
      }),
    menu: (base: any) => ({
      ...base,
      borderRadius: '8px',
      backgroundColor: '#06132b',
      width: "130px",
      margin: "0",
      zIndex: 9999,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? '#06139b' : '#06132b',
      color: '#f2f2f2',
      padding: 10,
    }),
  };

export const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const handleChange = (selectedOption: any) => {
        i18n.changeLanguage(selectedOption.value);
    };

    return (
        <Select
        options={options}
        defaultValue={i18n.language? options.filter(option => option.value === i18n.language) : options[0]}
        onChange={handleChange}
        styles={customStyles}
        />
    );
}