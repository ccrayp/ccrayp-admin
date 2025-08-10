import { useEffect, useState, useRef } from "react"
import { Modal, Button, Form, InputGroup, Image } from "react-bootstrap"
import { isTokenAvailable } from "../../common/utilities"
import { getTableItemByID,  deleteTableItemById, updateTableItemById, newTableItemByData } from "../utilities"
import { useNavigate } from "react-router-dom";
import Loading from "../../common/Loading";

const tableName = 'post'

export default function ModalPost({ id = null, imgPrefix, showModal, handleCloseModal, handleOnSuccess }) {
    
    const formRef = useRef(null);
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    async function checkAuthAndLoadData() {
        setIsLoading(true);
        
        if (!await isTokenAvailable()) {
            navigate('/login');
            return;
        }
        
        try {
            const response = await getTableItemByID(id, tableName);
            setData(response || {});
        } catch (error) {
            console.error("Ошибка загрузки записи:" + error);
            setData({});
        } finally {
            setIsLoading(false);
        }
    }

    function deletePost() {
        async function deleteFunc() {
            const res = confirm(`Вы уверены, что ходите удалить запись id: ${id}?`)
            if (res) {
                setIsLoading(true)
                try {
                    const res = await deleteTableItemById(id, tableName)
                    if(res.ok)
                        await handleOnSuccess()
                    else
                        throw new Error((await res.json()).message)
                }
                catch (error) {
                    alert('Ошибка при удалении записи:' + error.message)
                }
                finally {
                    setIsLoading(false)
                    handleCloseModal(true)
                }
            }
            else
                alert('Отмена удаления записи')
        }
        deleteFunc()
    }

    function updatePost() {
        async function updateFunc() {
            const res = confirm(`Вы уверены, что ходите обновить запись id: ${id}?`)
            if (res) {
                setIsLoading(true)
                try {
                    const res = await updateTableItemById(id, new FormData(formRef.current), tableName)
                    if(res.ok)
                        await handleOnSuccess()
                    else
                        throw new Error((await res.json()).message)
                }
                catch (error) {
                    alert('Ошибка при обновлении записи:' + error.message)
                }
                finally {
                    setIsLoading(false)
                    checkAuthAndLoadData()
                }
            }
            else
                alert('Отмена обновления записи')
        }
        updateFunc()
    }

    function newPost() {
        async function newFunc() {
            setIsLoading(true)
            try {
                const res = await newTableItemByData(new FormData(formRef.current), tableName)
                if (res.ok) {
                    await handleOnSuccess()
                    closeModal()
                }
                else
                    throw new Error((await res.json()).message)
            }
            catch (error) {
                alert('Ошибка при добавлении записи:' + error.message)
            }
            finally {
                setIsLoading(false)
            }
        }
        newFunc()
    }

    function closeModal() {
        handleCloseModal()
    }

    function closeModalAndSave() {
        const res = confirm('Вы уверены, что хотите выйти?\n\nДАННЫХ НЕ СОХРАНЯТСЯ!!!')
        if (res)
            handleCloseModal()
    }

    useEffect(() => {
        if (showModal && id)
            checkAuthAndLoadData();
        else
            setData({});
    }, [showModal, id, navigate]);

    if (id) {
        return (
            <Modal show={showModal} onHide={closeModal} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Редактирование записи</Modal.Title>
                </Modal.Header>
            
                <Modal.Body>
                    {isLoading ? (
                        <Loading />
                    ) : (
                        data.id ? (
                            <Form ref={formRef}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>Название</InputGroup.Text>
                                    <Form.Control name="label" as='textarea' rows={1} defaultValue={data.label} />
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>Текст</InputGroup.Text>
                                    <Form.Control name="text" as='textarea' rows={3} defaultValue={data.text} />
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>Фотография</InputGroup.Text>
                                    <Form.Control name="img" as='textarea' rows={1} defaultValue={data.img} />
                                </InputGroup>
                                <div className="d-flex justify-content-center">
                                    <a href={imgPrefix + data.img} target="blank">
                                        <Image src={imgPrefix + data.img} alt={data.img} className="mb-3" style={{ maxHeight: '300px', maxWidth: '500px' }} />
                                    </a>
                                </div>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>Дата проведения</InputGroup.Text>
                                    <Form.Control name="date" as='textarea' rows={1} defaultValue={data.date} />
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text><a href={data.link} target="blank" style={{ textDecoration: 'none' }}>Ссылка на мероприятие</a></InputGroup.Text>
                                    <Form.Control name="link" as='textarea' rows={1} defaultValue={data.link} />
                                </InputGroup>
                                <InputGroup>
                                    <InputGroup.Text>Показать</InputGroup.Text>
                                    <Form.Select name="mode" as='textarea' rows={1} defaultValue={data.mode} >
                                        <option value='true'>Да</option>        
                                        <option value='false'>Нет</option>        
                                    </Form.Select>
                                </InputGroup>
                            </Form>
                        ) : (
                            "Не удалось загрузить данные записи"
                        )
                    )}
                </Modal.Body>
            
                <Modal.Footer>
                    <Button variant="danger" onClick={deletePost}>
                        Удалить
                    </Button>
                    <Button variant="success" onClick={updatePost}>
                        Сохранить
                    </Button>
                    <Button variant="primary" onClick={closeModal}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
    else {
        return (
            <Modal show={showModal} onHide={closeModalAndSave} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Добавление записи</Modal.Title>
                </Modal.Header>
            
                <Modal.Body>
                    {isLoading ? (
                        <Loading />
                    ) : (
                            <Form ref={formRef}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>Название</InputGroup.Text>
                                    <Form.Control name="label" as='textarea' rows={1} />
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>Текст</InputGroup.Text>
                                    <Form.Control name="text" as='textarea' rows={3} />
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>Фотография</InputGroup.Text>
                                    <Form.Control name="img" as='textarea' rows={1} />
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>Дата проведения</InputGroup.Text>
                                    <Form.Control name="date" as='textarea' rows={1} />
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>Ссылка на мероприятие</InputGroup.Text>
                                    <Form.Control name="link" as='textarea' rows={1} />
                                </InputGroup>
                                <InputGroup >
                                    <InputGroup.Text>Показать</InputGroup.Text>
                                    <Form.Select name="mode" as='textarea' rows={1}>
                                        <option value='true'>Да</option>        
                                        <option value='false'>Нет</option>        
                                    </Form.Select>
                                </InputGroup>
                            </Form>
                        )
                    }
                </Modal.Body>
            
                <Modal.Footer>
                    <Button variant="success" onClick={newPost}>
                        Сохранить
                    </Button>
                    <Button variant="primary" onClick={closeModalAndSave}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}