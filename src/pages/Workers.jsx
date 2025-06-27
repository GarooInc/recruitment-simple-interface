import styles from './workers.module.css';

import { useState, useEffect } from 'react';
import { Card, Tabs, Tab, Table, Button, Badge, Spinner, Alert, Image } from 'react-bootstrap';
import { useWorker } from '../config/WorkerProvider';
import WorkerModal from '../components/WorkerModal';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import garooLogo from '../assets/img/garoo-logo.png';

const Workers = () => {

    const { triggerN8N, data: dataFromState, loading, error } = useWorker();

    const [data, setData] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);

    useEffect(() => {
        if (dataFromState) {
            setData(dataFromState);
        }
    }, [dataFromState]);

    const handleClick = async () => {
        try {
            await triggerN8N();
        }
        catch (err) {
            console.error('Error en el componente:', err);
        }
    };

    const handleViewDetails = (worker) => {
        setSelectedWorker(worker);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedWorker(null);
    };

    const generateWorkerPDF = (worker) => {
        const doc = new jsPDF();

        // Título del documento
        doc.setFontSize(20);
        doc.setTextColor(33, 37, 41);
        doc.text('Información del Trabajador', 14, 22);

        // Información básica
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('Datos Personales', 14, 35);

        // Crear tabla de datos personales
        const personalData = [
            ['Nombre Completo', worker['Nombre Completo'] || 'N/A'],
            ['Puesto', worker['Puesto Solicitud'] || worker['Experiencia Puesto'] || 'N/A'],
            ['Nacionalidad', worker.Nacionalidad || 'N/A'],
            ['Teléfono', worker.Telefono || 'N/A'],
            ['Email', worker.Email || 'N/A'],
            ['Dirección', worker.Direccion || 'N/A'],
            ['Estado Civil', worker['Estado Civil'] || 'N/A'],
            ['Disponibilidad', worker['Disponibilidad Laboral'] || 'N/A'],
            ['Pretención Salarial', worker['Pretencion Salarial'] ? `Q${worker['Pretencion Salarial'].toLocaleString()}` : 'N/A']
        ];

        // Agregar tabla al PDF usando autoTable
        autoTable(doc, {
            startY: 40,
            head: [['Campo', 'Valor']],
            body: personalData,
            theme: 'grid',
            headStyles: {
                fillColor: [52, 58, 64],
                textColor: 255,
                fontStyle: 'bold'
            },
            styles: {
                cellPadding: 3,
                fontSize: 10,
                valign: 'middle'
            },
            columnStyles: {
                0: { cellWidth: 60, fontStyle: 'bold' },
                1: { cellWidth: 'auto' }
            }
        });

        // Agregar sección de Educación
        doc.addPage();
        doc.setFontSize(14);
        doc.setTextColor(33, 37, 41);
        doc.text('Educación', 14, 20);

        const educationData = [
            ['Título', worker['Educacion Titulo'] || 'N/A'],
            ['Institución', worker['Educacion Institucion'] || 'N/A'],
            ['Nivel Educativo', worker['Educacion Nivel Educativo'] || 'N/A'],
            ['Período', `${formatPeriod(worker['Educacion Periodo Inicio'])} - ${formatPeriod(worker['Educacion Periodo Fin'])}`]
        ];

        autoTable(doc, {
            startY: 30,
            head: [['Campo', 'Información']],
            body: educationData,
            theme: 'grid',
            headStyles: {
                fillColor: [52, 58, 64],
                textColor: 255,
                fontStyle: 'bold'
            }
        });

        // Agregar sección de Experiencia Laboral
        doc.addPage();
        doc.setFontSize(14);
        doc.text('Experiencia Laboral', 14, 20);

        const experienceData = [
            ['Empresa', worker['Experiencia Nombre Empresa'] || 'N/A'],
            ['Puesto', worker['Experiencia Puesto'] || 'N/A'],
            ['Período', `${formatExperienceDate(worker['Experiencia Fecha Ingreso Mes'], worker['Experiencia Fecha Ingreso Ano'])} - ${formatExperienceDate(worker['Experiencia Fecha Egreso Mes'], worker['Experiencia Fecha Egreso Ano'])}`],
            ['Salario Final', worker['Experiencia Salario Final'] ? `Q${worker['Experiencia Salario Final'].toLocaleString()}` : 'N/A'],
            ['Jefe Inmediato', worker['Experiencia Jefe Inmediato'] || 'N/A'],
            ['Motivo de Retiro', worker['Experiencia Motivo Retiro'] || 'N/A'],
            ['Desempeño', worker['Experiencia Desempeno'] || 'N/A']
        ];

        autoTable(doc, {
            startY: 30,
            head: [['Campo', 'Información']],
            body: experienceData,
            theme: 'grid',
            headStyles: {
                fillColor: [52, 58, 64],
                textColor: 255,
                fontStyle: 'bold'
            }
        });

        // Agregar fecha de generación
        const date = new Date();
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(`Generado el: ${date.toLocaleString()}`, 14, doc.internal.pageSize.height - 10);

        // Guardar el PDF
        doc.save(`CV_${worker['Nombre Completo']?.replace(/\s+/g, '_') || 'trabajador'}.pdf`);
    };

    // Función auxiliar para formatear fechas
    const formatPeriod = (period) => {
        if (!period) return 'N/A';
        return period;
    };

    const formatExperienceDate = (month, year) => {
        if (!month || !year) return 'N/A';
        return `${month}/${year}`;
    };

    return (
        <div className="mt-4">
            <Card>
                <Card.Body>
                    <Card.Title className='mb-5 d-flex justify-content-between mx-1'>
                        <span className='fs-1 fw-bold'>Reclutamiento</span>
                        <Image src={garooLogo} roundedCircle fluid width={100} height={100} className='border border-primary border-2' />
                    </Card.Title>

                    <div className='mx-4'>
                        <Button
                            variant="primary"
                            onClick={handleClick}
                            disabled={loading}
                            className="mb-3"
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Procesando...
                                </>
                            ) : 'Actualizar Datos'}
                        </Button>

                        {error && (
                            <Alert variant="danger" className="mt-3">
                                <Alert.Heading>Error</Alert.Heading>
                                <p>{error.message}</p>
                            </Alert>
                        )}

                        <Tabs
                            defaultActiveKey="workers"
                            transition={false}
                            id="workers-tabs"
                            className="mb-3"
                        >
                            <Tab eventKey="workers" title="Tabla">
                                <div className="table-responsive">
                                    <Table hover className={`${styles['table']} ${styles['fs-10']}`}>
                                        <thead className='table-secondary'>
                                            <tr>
                                                <th>#</th>
                                                <th>Nombre Completo</th>
                                                <th>Puesto</th>
                                                <th>Nacionalidad</th>
                                                <th>Disponibilidad</th>
                                                <th>Pretención Salarial</th>
                                                <th>Educación</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {Array.isArray(data) && data.map((worker, index) => (
                                                <tr key={worker.id || index}>
                                                    <td>{index + 1}</td>
                                                    <td>{worker['Nombre Completo'] || 'N/A'}</td>
                                                    <td>{worker['Puesto Solicitud'] || worker['Experiencia Puesto'] || 'N/A'}</td>
                                                    <td>{worker.Nacionalidad || 'N/A'}</td>
                                                    <td>
                                                        <Badge
                                                            bg={worker['Disponibilidad Laboral'] === 'Inmediata' ? 'success' : 'warning'}
                                                            className="text-capitalize"
                                                        >
                                                            {worker['Disponibilidad Laboral'] || 'No especificada'}
                                                        </Badge>
                                                    </td>
                                                    <td>Q{worker['Pretencion Salarial']?.toLocaleString() || 'N/A'}</td>
                                                    <td>
                                                        {worker['Educacion Titulo'] || 'N/A'}
                                                        {worker['Educacion Institucion'] && ` (${worker['Educacion Institucion']})`}
                                                    </td>

                                                    <td>
                                                        <div className='d-flex gap-1'>
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                className="me-1"
                                                                title="Ver detalles"
                                                                onClick={() => handleViewDetails(worker)}
                                                            >
                                                                <i className="bi bi-eye"></i>
                                                            </Button>

                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                title="Descargar PDF"
                                                                onClick={() => generateWorkerPDF(worker)}
                                                            >
                                                                <i className="bi bi-file-earmark-pdf"></i>
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Tab>
                            <Tab eventKey="response" title="Respuesta del servidor">
                                <div className="mt-4">
                                    <h4>Respuesta del servidor:</h4>
                                    <pre className="bg-light p-3 rounded">
                                        {JSON.stringify(data, null, 2)}
                                    </pre>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </Card.Body>
            </Card>

            {/* Modal de detalles del trabajador */}
            {selectedWorker && (
                <WorkerModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    workerData={selectedWorker}
                />
            )}
        </div>
    );
};

export default Workers;