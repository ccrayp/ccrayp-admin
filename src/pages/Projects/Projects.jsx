import { Container, Button, Row, Col, Table, Image, Dropdown } from "react-bootstrap"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getData } from "../utilities"

import Loading from "../../common/Loading"
import ModalProject from "./ModalProject"

export default function Projects() {

    const imgPrefix = 'https://raw.githubusercontent.com/ccrayp/ccrayp-api/refs/heads/main/assets/projects/'
    const navigate = useNavigate()
    const [projects, setProjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [idToEdit, setIdToEdit] = useState(null)

    async function handleOnSuccess() {
        getData({
            setData: setProjects,
            setIsLoading: setIsLoading,
            tableName: 'project',
            navigate: navigate
        })
    }

    const handleCloseModal = () => {
        setIdToEdit(null)
        setShowModal(false)
    }
    const handleShowModal = (id) => {
        setIdToEdit(id)
        setShowModal(true)
    }

    useEffect(() => {
        getData({
            setData: setProjects,
            setIsLoading: setIsLoading,
            tableName: 'project',
            navigate: navigate
        })
    }, [navigate])

    if (isLoading) {
        return <Loading /> 
    }

    if (!projects.length) {
        return (
            <Container className="d-flex flex-column justify-content-center align-items-center">
                <Row className="text-center mt-5">
                    <Col>
                        <h1 className="mb-4">Данные не найдены</h1>
                        <Button onClick={() => handleShowModal(null)}>Добавить проект</Button>
                    </Col>
                </Row>
                <ModalProject showModal={showModal} handleCloseModal={handleCloseModal} handleOnSuccess={handleOnSuccess} id={idToEdit} imgPrefix={imgPrefix} />
            </Container>
        )
    }
    else {
        return (
            <>
                <Dropdown className="position-fixed ms-4 mt-4">
                    <Dropdown.Toggle variant="dark" id="dropdown-basic">Меню</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleShowModal(null)}>Добавить проект</Dropdown.Item>
                        <Dropdown.Item onClick={() => getData({
                            setData: setProjects,
                            setIsLoading: setIsLoading,
                            tableName: 'project',
                            navigate: navigate
                        })}>Обновить данные</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Container className="d-flex flex-column justify-content-center align-items-center">
                    <Row className="mt-4 mb-4 text-center w-100" style={{ borderRadius: '25px', boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)'}}>
                        <Col className="p-4 pb-2">
                            <Table striped bordered hover className="text-start">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Заголовок</th>
                                        <th>Текст</th>
                                        <th>Фотография</th>
                                        <th>Технологии</th>
                                        <th>Ссылка</th>
                                        <th>Показать</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((item, index) => (
                                        <tr key={index} onClick={() => handleShowModal(item.id)}>
                                            <td>{item.id}</td>
                                            <td>{item.label}</td>
                                            <td>{item.text}</td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <Image src={imgPrefix + item.img} alt={item.img} className="mb-3" style={{ maxHeight: '200px' }} />
                                                </div>
                                            </td>
                                            <td>{item.stack}</td>
                                            <td>{item.link}</td>
                                            <td>{item.mode ? 'Да' : 'Нет'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>

                <ModalProject showModal={showModal} handleCloseModal={handleCloseModal} handleOnSuccess={handleOnSuccess} id={idToEdit} imgPrefix={imgPrefix} />
            </>
        )
    }
}