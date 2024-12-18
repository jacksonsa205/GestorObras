import * as XLSX from 'xlsx';

export const exportToExcel = (data, fields, fileName) => {
    return new Promise((resolve, reject) => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';

        // Filtrar os dados para incluir apenas os campos especificados
        const filteredData = data.map(row =>
            fields.reduce((acc, field) => {
                acc[field] = row[field];
                return acc;
            }, {})
        );

        // Preparar os dados para exportação
        const ws = XLSX.utils.json_to_sheet(filteredData);

        // Configurar estilo do cabeçalho (header) para cinza
        ws['!cols'] = [];
        for (let i = 0; i < fields.length; i++) {
            ws['!cols'].push({ wch: 20 }); // Definir largura padrão das colunas
            let cell = ws[XLSX.utils.encode_cell({ r: 0, c: i })];
            if (cell) {
                cell.s = { fill: { fgColor: { rgb: 'FF888888' } }, alignment: { horizontal: 'center' } }; // Cinza escuro e centralizado
            }
        }

        // Adicionar filtros
        ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: fields.length - 1, r: filteredData.length } }) };

        // Centralizar dados
        for (let i = 1; i <= filteredData.length; i++) {
            for (let j = 0; j < fields.length; j++) {
                const cellRef = XLSX.utils.encode_cell({ r: i, c: j });
                let cell = ws[cellRef];
                if (cell) {
                    cell.s = { alignment: { horizontal: 'center' } };
                }
            }
        }

        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: fileType });
        const file = new File([blob], fileName + fileExtension);

        // Criar um link para download
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(file);
        downloadLink.download = fileName + fileExtension;

        // Modal de confirmação
        const confirmationModal = document.createElement('div');
        confirmationModal.innerHTML = `
            <div>Download do arquivo Excel</div>
            <div>O arquivo Excel está pronto para download. Deseja baixá-lo agora?</div>
            <button id="confirmButton">Sim</button>
            <button id="cancelButton">Cancelar</button>
        `;
        confirmationModal.style.position = 'fixed';
        confirmationModal.style.top = '50%';
        confirmationModal.style.left = '50%';
        confirmationModal.style.transform = 'translate(-50%, -50%)';
        confirmationModal.style.backgroundColor = 'white';
        confirmationModal.style.padding = '20px';
        confirmationModal.style.border = '1px solid black';
        document.body.appendChild(confirmationModal);

        // Adicionar eventos aos botões do modal
        document.getElementById('confirmButton').addEventListener('click', () => {
            downloadLink.click();
            document.body.removeChild(confirmationModal);
            resolve();
        });
        document.getElementById('cancelButton').addEventListener('click', () => {
            document.body.removeChild(confirmationModal);
            reject(new Error('Exportação cancelada pelo usuário'));
        });
    });
};