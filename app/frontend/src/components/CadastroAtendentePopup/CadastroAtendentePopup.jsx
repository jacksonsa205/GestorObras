import React, { useState, useRef } from 'react';
import Select from 'react-select';
import './CadastroAtendentePopup.css';

export const CadastroAtendentePopup = ({ onClose, onCadastrarAtendente, optionsAtendente }) => {
    const [selectedAtendente, setSelectedAtendente] = useState(null);
    const popupRef = useRef(null);

    const handleConfirmCadastro = () => {
        if (!selectedAtendente || !selectedAtendente.value) {
            alert('Por favor, selecione um atendente');
            return;
        }

        const selectedAtendenteId = selectedAtendente.value;
        onCadastrarAtendente(selectedAtendenteId);
        onClose();
    };

    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            onClose();
        }
    };

    return (
        <div className="popup-container" onClick={handleClickOutside}>
            <div ref={popupRef} className="popup">
                <div className="popup-header">
                    <h2>Cadastrar atendente no Painel Gerencial</h2>
                </div>
                <div className="popup-body">
                    <label htmlFor="tecnico-select">Selecione um técnico:</label>
                    <Select
                        id="tecnico-select"
                        options={optionsAtendente}
                        isSearchable={true}
                        placeholder="Digite para pesquisar..."
                        onChange={setSelectedAtendente}
                    />
                </div>
                <div className="popup-footer">
                    <div className="btn-cadastrar-btn" onClick={handleConfirmCadastro}>Cadastrar</div>
                    <div className="btn-cancelar-btn" onClick={onClose}>Cancelar</div>
                </div>
            </div>
        </div>
    );
};
