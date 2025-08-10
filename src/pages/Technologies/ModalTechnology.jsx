import { useEffect, useState, useRef } from "react"
import { Modal, Button, Form, InputGroup, Image } from "react-bootstrap"
import { isTokenAvailable } from "../../common/utilities"
import { getTableItemByID,  deleteTableItemById, updateTableItemById, newTableItemByData } from "../utilities"
import { useNavigate } from "react-router-dom";
import Loading from "../../common/Loading";

const tableName = 'technology'

export default function ModalTechnology({ id = null, imgPrefix, showModal, handleCloseModal, handleOnSuccess }) {
    
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
            console.error("Ошибка загрузки технологии:" + error);
            setData({});
        } finally {
            setIsLoading(false);
        }
    }

    function deleteTechnology() {
        async function deleteFunc() {
            const res = confirm(`Вы уверены, что ходите удалить технологии id: ${id}?`)
            if (res) {
                setIsLoading(true)
                try {
                    const res = await deleteTableItemById(id, tableName)
                    
                    if(res.status === 200)
                        await handleOnSuccess()
                    else
                        throw new Error((await res.json()).message)
                }
                catch (error) {
                    alert('Ошибка при удалении технологии:' + error.message)
                }
                finally {
                    setIsLoading(false)
                    handleCloseModal(true)
                }
            }
            else
                alert('Отмена удаления технологии')
        }
        deleteFunc()
    }

    function updateTechnology() {
        async function updateFunc() {
            const res = confirm(`Вы уверены, что хотите обновить технологию id: ${id}?`)
            if (res) {
                setIsLoading(true)
                try {
                    const res = await updateTableItemById(id, new FormData(formRef.current), tableName)
                    
                    if(res.status === 200)
                        await handleOnSuccess()
                    else
                        throw new Error((await res.json()).message)
                }
                catch (error) {
                    alert('Ошибка при обновлении технологии:' + error.message)
                }
                finally {
                    setIsLoading(false)
                    checkAuthAndLoadData()
                }
            }
            else
                alert('Отмена обновления технологии')
        }
        updateFunc()
    }

    function newTechnology() {
        async function newFunc() {
            setIsLoading(true)
            try {
                const res = await newTableItemByData(new FormData(formRef.current), tableName)
                if (res.status === 201) {
                    await handleOnSuccess()
                    closeModal()
                }
                else
                    throw new Error((await res.json()).message)
            }
            catch (error) {
                alert('Ошибка при добавлении технологии:' + error.message)
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
            checkAuthAndLoadData()
        else
            setData({});
    }, [showModal, id, navigate]);

    if (id) {
        return (
            <Modal show={showModal} onHide={closeModal} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Редактирование технологии</Modal.Title>
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
                                    <InputGroup.Text>Группа</InputGroup.Text>
                                    <Form.Select name="group" as='textarea' rows={1} defaultValue={data.group} >
                                        <option value='lang_tech'>Языки и технологии</option>
                                        <option value='ide_os'>IDE и ОС</option>        
                                        <option value='fund'>Фунадментальные</option>        
                                    </Form.Select>
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>Фотография</InputGroup.Text>
                                    <Form.Control name="img" as='textarea' rows={1} defaultValue={data.img} />
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>Показать</InputGroup.Text>
                                    <Form.Select name="mode" as='textarea' rows={1} defaultValue={data.mode} >
                                        <option value='true'>Да</option>        
                                        <option value='false'>Нет</option>        
                                    </Form.Select>
                                </InputGroup>
                                <div className="d-flex justify-content-center">
                                    <a href={imgPrefix + data.img} target="blank">
                                        <Image src={imgPrefix + data.img} alt={data.img} className="mb-3" style={{ maxHeight: '300px', maxWidth: '500px' }} />
                                    </a>
                                </div>
                            </Form>
                        ) : (
                            "Не удалось загрузить данные технологии"
                        )
                    )}
                </Modal.Body>
            
                <Modal.Footer>
                    <Button variant="danger" onClick={deleteTechnology}>
                        Удалить
                    </Button>
                    <Button variant="success" onClick={updateTechnology}>
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
                    <Modal.Title>Добавление технологии</Modal.Title>
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
                                    <InputGroup.Text>Группа</InputGroup.Text>
                                    <Form.Select name="group" as='textarea' rows={1} >
                                        <option value='lang_tech'>Языки и технологии</option>
                                        <option value='ide_os'>IDE и ОС</option>        
                                        <option value='fund'>Фунадментальные</option>        
                                    </Form.Select>
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>Фотография</InputGroup.Text>
                                    <Form.Control name="img" as='textarea' rows={1} />
                                </InputGroup>
                                <InputGroup >
                                    <InputGroup.Text>Показать</InputGroup.Text>
                                    <Form.Select name="mode" as='textarea' rows={1} >
                                        <option value='true'>Да</option>        
                                        <option value='false'>Нет</option>        
                                    </Form.Select>
                                </InputGroup>
                            </Form>
                        )
                    }
                </Modal.Body>
            
                <Modal.Footer>
                    <Button variant="success" onClick={newTechnology}>
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