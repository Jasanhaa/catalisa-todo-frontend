import {
    Button, Card,
    Col, Form, Layout, Row,
    Typography, Modal, Checkbox,
} from 'antd';
//   import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import axios from 'axios';

import InputText from '../components/InputText';
import { validateCategory, validateTitulo } from '../helpers/validation-helper';

const { Content } = Layout;
const { Title } = Typography;

const TaskCreatePage = () => {
    // const navigate = useNavigate();
    const [formValues, setFormValues] = useState({concluida: false, titulo: ''})
    const [loading, setLoading] = useState(false);

    const handleSubscription = useCallback(async () => {
        try {
            setLoading(true);

            const { titulo, concluida, categoria_id } = formValues;

            if (!titulo) return;

            const body = {
                titulo: titulo,
                categoria_id: categoria_id,
                concluida: concluida,
            }

            await axios.post('/tarefas', body);
            Modal.success({
                title: 'Tarefa cadastrada com success',
            })
        } catch (error) {
            console.warn(error);
            const { response } = error;
            if (response?.status === 400) {
                Modal.error({
                    title: response.data.mensagem
                });
            } else {
                Modal.error({
                    title: 'Não foi possível criar a tarefa'
                })
            }
        } finally {
            setLoading(false);
        };
    }, [formValues]);

    const handleInputChange = useCallback((event) => {
        const { value } = event.target;

        setFormValues({
            ...formValues,
            titulo: value,
        })
    }, [formValues]);

    const handleInputChangeCategoria = useCallback((event) => {
        const { value } = event.target;

        setFormValues({
            ...formValues,
            categoria_id: value,
        })
    }, [formValues])

    const handleInputCheckbox = useCallback((event) => {
        const { checked } = event.target;
        console.log({checked})
        setFormValues({
            ...formValues,
            concluida: checked,
        })
    }, [formValues]);

    return (
        <Content>
            <Row
                justify="center"
            >
                <Col xs={24} sl={14} md={12} lg={10} xl={8}>
                    <Card style={{ margin: 24 }}>
                        <Title
                            level={3}
                            type="secundary"
                            style={{ textAlign: 'center', marginTop: 8 }}
                        >
                            Cadastre sua tarefa
                        </Title>

                        <Form layout="vertical">
                            <InputText
                                name="titulo"
                                label="Titulo"
                                size="large"
                                onChange={handleInputChange}
                                validate={validateTitulo}
                                disable={loading}
                                required
                            />

                            <InputText
                                name="categoria_id"
                                label="Categoria"
                                size="large"
                                onChange={handleInputChangeCategoria}
                                validate={validateCategory}
                                disable={loading}
                            />

                            <Checkbox
                                title="Concluida"
                                dataIndex="concluida"
                                key="concluida"
                                onChange={handleInputCheckbox}
                            >
                                Concluida
                            </Checkbox>

                            <Button
                                block
                                type="primary"
                                size="large"
                                onClick={handleSubscription}
                                loading={loading}
                            >
                                Cadastrar tarefa
                            </Button>

                        </Form>
                    </Card>
                </Col>
            </Row>
        </Content>
    );
}

export default TaskCreatePage;
