import { useState } from 'react';
import { Container, Row, Col, Card, Modal, Button } from "react-bootstrap";
import styles from './gallery.module.css';

const Gallery = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const images = [
        {
            title: "Centro Comercial",
            url: "https://cdn.discordapp.com/attachments/1392306767395815435/1392307098439913502/shopping-malls-los-angeles-1024x683.jpg?ex=686fb748&is=686e65c8&hm=94fb521725838a69776ba141b6cedf0f7306756816955288ef3d3f58be1d4dc5&"
        },
        {
            title: "Tienda de Moda",
            url: "https://cdn.discordapp.com/attachments/1392306767395815435/1392307129703993409/donde-ir-de-compras.jpg?ex=686fb74f&is=686e65cf&hm=55565d75e98261792122d11cb56ab8d1fe31294d966e9266b4a745750b3043ae&"
        },
        {
            title: "Galería Comercial",
            url: "https://cdn.discordapp.com/attachments/1392306767395815435/1392307164403466381/ovation.jpg?ex=686fb757&is=686e65d7&hm=51c289fa94578525319c3cd6cb47071a0f502a9be9a53ea34259462e87c69840&"
        },
    ];

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedImage(null);
    };

    return (
        <Container className="py-4 px-3 px-md-4 px-lg-5">
            <h1 className="text-center mb-4 mb-md-5">Galería de Imágenes</h1>

            <Row className="g-3 g-md-4">
                {images.map((image, index) => (
                    <Col key={index} xs={12} sm={6} lg={4} className="mb-3 mb-md-4">
                        <Card
                            className={styles.galleryCard}
                            onClick={() => handleImageClick(image)}
                        >
                            <div className={styles.imageContainer}>
                                <Card.Img
                                    variant="top"
                                    src={image.url}
                                    className="img-fluid"
                                    alt={image.title}
                                />
                            </div>
                            <Card.Body>
                                <Card.Title className="text-center m-0">{image.title}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Modal para mostrar la imagen en grande */}
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                size="lg"
                centered
                className={styles.modalCustom}
            >
                <Modal.Header closeButton closeVariant="white" className={styles.modalHeader}>
                    <Modal.Title>{selectedImage?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0 d-flex justify-content-center bg-dark">
                    {selectedImage && (
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.title}
                            className="img-fluid"
                            style={{ maxHeight: '80vh', width: 'auto', maxWidth: '100%' }}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer className={styles.modalFooter}>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Gallery;