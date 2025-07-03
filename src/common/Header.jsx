import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'

export default function Header() {
    
    const location = useLocation();
    const navigate = useNavigate()

    function exit() {
        localStorage.removeItem('jwt_token')
        navigate('/login')
    }

    return (
        <Navbar className='fixed-top' bg="light" data-bs-theme="light">
            <Container>
                <Navbar.Brand as={Link} to="/">ccrayp-admin</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link 
                        as={Link} 
                        to="/technologies" 
                        active={location.pathname === '/technologies'}
                    >
                        Технологии
                    </Nav.Link>
                    <Nav.Link 
                        as={Link} 
                        to="/posts" 
                        active={location.pathname === '/posts'}
                    >
                        Записи
                    </Nav.Link>
                    <Nav.Link 
                        as={Link} 
                        to="/projects" 
                        active={location.pathname === '/projects'}
                    >
                        Проекты
                    </Nav.Link>
                </Nav>
                <Button variant='outline-danger' onClick={exit}>Выйти</Button>
            </Container>
        </Navbar>
    );
}
