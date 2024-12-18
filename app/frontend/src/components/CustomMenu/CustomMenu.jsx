import React from 'react';
import { components } from 'react-select';
import './CustomMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

export const CustomMenu = (props) => {
    const allSelected = props.getValue().length === props.options.length;

    const handleSelectAll = () => {
        const allOptions = props.options.map(option => ({ value: option.value, label: option.label }));
        props.selectProps.onChange(allOptions);
    };

    const handleClearAll = () => {
        props.selectProps.onChange([]);
    };

    return (
        <components.Menu {...props}>
            <div className="custom-actions">
                <div className="custom-action-buttons">
                    {props.selectProps.isButtonLimpar && !allSelected && (
                        <div
                            className="custom-select-all"
                            aria-label="Select all"
                            onClick={handleSelectAll}
                        >
                            <FontAwesomeIcon icon={faCheckSquare} style={{  fontSize: '0.75rem'  }} /> Sel. Todos
                        </div>
                    )}
                    {props.selectProps.isButtonLimpar && (
                        <div
                            className={`custom-clear-all ${allSelected ? 'align-center' : ''}`}
                            aria-label="Clear all"
                            onClick={handleClearAll}
                        >
                            <FontAwesomeIcon icon={faTrash} style={{  fontSize: '0.75rem'  }} /> Limpar Todos
                        </div>
                    )}
                </div>
                {props.children}
            </div>
        </components.Menu>
    );
};

