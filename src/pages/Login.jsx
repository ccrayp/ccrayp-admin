import { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Spinner } from "react-bootstrap";
import styled from "styled-components";

import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { isTokenAvailable } from "../common/utilities";
import { useNavigate } from 'react-router-dom';
import Loading from '../common/Loading';

const StyledCard = styled.div`
    border-radius: 25px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;
`

export default function Login() {

    const navigate = useNavigate()
    const loginRef = useRef();
    const passwordRef = useRef();
    const [isLoading, setIsLoading] = useState(true)
    const [isAvailable, setIsAvailable] = useState(null)
    const [isAuthing, setIsAuting] = useState(false)

    useEffect(() => {
        async function checkAuth() {
            const authStatus = await isTokenAvailable();
            setIsAvailable(authStatus);
            setIsLoading(false)
        }
        checkAuth();
    }, [])

    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    async function login() {
        const username = loginRef.current.value
        const password = passwordRef.current.value
    
        if (!username || !password) {
            alert('Введите логин и пароль');
            return;
        }
    
        const data = {
            username: username,
            password: password
        };
    
        try {
            setIsAuting(true)
            const response = await fetch('https://ccrayp.onrender.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
    
            const result = await response.json();
            
            if (response.ok) {
                localStorage.setItem('jwt_token', result.access_token);
                alert('Авторизация пройшла успешно!')
                navigate('/')
            } else {
                alert(result.error || 'Ошибка авторизации');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
        finally {
            setIsAuting(false)
        }
    }

    if (isLoading) {
        return <Loading /> 
    }

    if (isAvailable !== null && !isAvailable) {
        if (isAuthing) {
            return (
                <Container className="d-flex flex-column justify-content-center">
                    <Row className="justify-content-center">
                        <Col xs={12} md={8} lg={6}>
                            <StyledCard className="m-4 p-4">
                                <div className='d-flex justify-content-center'>
                                    <h3>Авторизация</h3>
                                </div>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Логин</Form.Label>
                                        <Form.Control disabled type="login" placeholder="Введите логин" ref={loginRef} />
                                    </Form.Group>
                            
                                    <Form.Group className="mb-3" controlId="formPassword">
                                        <Form.Label>Пароль</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                disabled
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Введите пароль"
                                                ref={passwordRef}
                                            />
                                            <Button
                                                disabled
                                                variant="outline-secondary"
                                                onClick={togglePassword}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </Button>
                                        </InputGroup>
                                    </Form.Group>
                                    <Row>
                                        <Col sm={8}>
                                            <Spinner animation="border" variant="primary" />
                                        </Col>
                                        <Col sm={4} className="d-flex justify-content-end">
                                            <Button variant="primary" onClick={() => login()} disabled>
                                                Войти
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </StyledCard>
                        </Col>
                    </Row>
                </Container>
            )
        }
        else {
            return (
                <Container className="d-flex flex-column justify-content-center">
                    <Row className="justify-content-center">
                        <Col xs={12} md={8} lg={6}>
                            <StyledCard className="m-4 p-4">
                                <div className='d-flex justify-content-center'>
                                    <h3>Авторизация</h3>
                                </div>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Логин</Form.Label>
                                        <Form.Control type="login" placeholder="Введите логин" ref={loginRef} />
                                    </Form.Group>
                            
                                    <Form.Group className="mb-3" controlId="formPassword">
                                        <Form.Label>Пароль</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Введите пароль"
                                                ref={passwordRef}
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                onClick={togglePassword}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </Button>
                                        </InputGroup>
                                    </Form.Group>
                                    <div className="d-flex justify-content-end">
                                        <Button variant="primary" onClick={() => login()}>
                                            Войти
                                        </Button>
                                    </div>
                                </Form>
                            </StyledCard>
                        </Col>
                    </Row>
                </Container>
            )
        }
    }
    else if(isAvailable !== null && isAvailable) {
        return (
            <Container className="d-flex flex-column justify-content-center">
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <StyledCard className="m-4 p-4">
                            <div className='d-flex justify-content-center'>
                                <h3>Авторизация</h3>
                            </div>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Логин</Form.Label>
                                    <Form.Control disabled type="login" placeholder="Введите логин" ref={loginRef} />
                                </Form.Group>
                                
                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Пароль</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Введите пароль"
                                            ref={passwordRef}
                                            disabled
                                        />
                                        <Button
                                            variant="outline-secondary"
                                            onClick={togglePassword}
                                            disabled
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </Button>
                                    </InputGroup>
                                </Form.Group>
                                <Row>
                                    <Col sm={8}>
                                        <h4>Уже авторизован</h4>
                                    </Col>
                                    <Col sm={4} className="d-flex justify-content-end">
                                        <Button variant="primary" onClick={() => login()} disabled>
                                            Войти
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </StyledCard>
                    </Col>
                </Row>
            </Container>
        )
    }
}