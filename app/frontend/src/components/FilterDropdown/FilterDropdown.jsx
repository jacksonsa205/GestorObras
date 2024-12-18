import React, { useState } from 'react';
import Select, { components } from 'react-select';
import './FilterDropdown.css';
import { CustomMenu } from '../../components/CustomMenu/CustomMenu';

const CustomOption = (props) => (
    <components.Option {...props}>
        <input
            type="checkbox"
            checked={props.isSelected}
            onChange={(e) => e.stopPropagation()}
            className="custom-checkbox"
        />{" "}
        {props.label}
    </components.Option>
);

export const FilterDropdown = ({ label, options, value, onChange, isMulti = false, isButtonLimpar = true }) => {
    const [hasSelected, setHasSelected] = useState(false);
    const selectedCount = hasSelected ? (isMulti ? value.length : value ? 1 : 0) : 0;

    // Estilos customizados
    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: state.isFocused ? '#5a5278' : '#5a5278', // Cor da borda
            boxShadow: state.isFocused ? '0 0 0 1px #5a5278' : 'none', // Sombra ao focar
            '&:hover': {
                borderColor: '#5a5278', // Cor da borda ao passar o mouse
            },
        }),
        valueContainer: (base) => ({
            ...base,
            overflow: 'auto',
            maxHeight: 132,
            
        }),
        menu: (base) => ({
            ...base,
            fontSize: '0.75rem', // Tamanho da fonte das opções
        }),
        option: (base, state) => ({
            ...base,
            fontSize: '0.75rem', // Tamanho da fonte das opções
            '&:hover': {
                backgroundColor: '#5a5278', // Cor ao passar o mouse
                color: 'white', // Cor do texto ao passar o mouse (opcional)
            },
        }),
    };

    return (
        <div className="filter-dropdown-container">
            {/* Exibe a label com a quantidade de itens selecionados apenas se houver algum item selecionado */}
            {/* <label style={{ opacity: selectedCount > 0 ? 1 : 0.7 }}>{`${label}${selectedCount > 0 ? `: ${selectedCount}` : ''}`}</label> */}
            <Select
                value={isMulti ? options.filter(option => value.includes(option.value)) : options.find(option => option.value === value)}
                onChange={selectedOptions => {
                    setHasSelected(true);
                    if (isMulti) {
                        onChange(selectedOptions.map(option => option.value));
                    } else {
                        onChange(selectedOptions.value);
                    }
                }}
                options={options}
                isMulti={isMulti}
                closeMenuOnSelect={!isMulti}
                components={{ Menu: CustomMenu, Option: CustomOption }}
                isSearchable={true}
                placeholder='Selecione...'
                styles={customStyles}
                isButtonLimpar={isButtonLimpar}
            />
        </div>
    );
};
