import { Container, Row, Col, Button } from "react-bootstrap";
import styled from "styled-components";

import { Link } from "react-router-dom";

const StyledCard = styled.div`
    border-radius: 25px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
`

export default function Main() {
    return (
        <Container>
            <Row className="d-flex justify-content-end">
                <Col>
                    <StyledCard className="m-4">
                        <div className="p-4">
                            <div className="d-flex justify-content-center">
                                    <h3>Графический интерфейс для <a href='https://ccrayp.onrender.com' target="_blank">ccrayp-api</a>.</h3>
                            </div>
                                <h5>Функционал</h5>
                                Реализован интерфес для создания, чтения, обновления и удаления контента.<br/>Для работы с контентом необходимо перейти в соответствующий раздел: <Link to={'/achievements'}>достижения</Link>, <Link to={'/technologies'}>технологии</Link>, <Link to={'/projects'}>проекты</Link>.<br/><br/>
                                <h5>Авторизация</h5>
                                Для работы с API необходимо пройти авторизацию.
                            <div className="d-flex justify-content-end">
                                <Button 
                                    as={Link} 
                                    to="/login" 
                                    variant="primary"
                                    className="ms-2"
                                >
                                    Авторизоваться
                                </Button>
                            </div>
                        </div>
                    </StyledCard>
                </Col>
            </Row>
        </Container>
    )
}