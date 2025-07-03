import { Container, Row, Col, Spinner } from "react-bootstrap"

export default function Loading() {
    return (
            <Container className="d-flex flex-column justify-content-center align-items-center">
                <Row className="text-center mt-5">
                    <Col>
                        <Spinner animation="border" variant="primary" />
                    </Col>
                </Row>
            </Container>
        )
}