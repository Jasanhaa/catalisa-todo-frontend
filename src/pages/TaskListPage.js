import { useCallback, useEffect, useState, React } from "react";
import { Layout, Row, Col, Table, Modal, Button, Popconfirm } from "antd";
import axios from "axios";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
const { Content } = Layout;

const { Column } = Table;

const TaskListPage = () => {
    const [tasks, setTasks] = useState([]);
    // const [categorys, setCategorys] = useState([]);
    const [loading, setLoading] = useState(false);

    const requestTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/tarefas')
            setTasks(response.data);
        } catch (error) {
            console.warn(error);
            Modal.error({
                title: "Não foi possível carregar suas tarefas, tente novamente mais tarde."
            })

        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        requestTasks();
    }, []);

    const completeTask = async (taskId) => {
        // console.log('clicou', taskId);
        try {
            setLoading(true);
            await axios.put('/tarefas/' + taskId + '/conclusao')
            await requestTasks();
        } catch (error) {
            console.warn(error);
            Modal.error({
                title: "Não foi possível concluir a tarefa, tente novamente mais tarde."
            })

        } finally {
            setLoading(false);
        }
    };

    const renderCompleteTask = (concluida, task) => {
        return (
            <Button
                onClick={() => {
                    completeTask(task.id);
                }}
            >
                {concluida ? '✅' : '❌'}
            </Button>
        );
    };

    const deleteTask = async (taskId) => {
        try {
            setLoading(true);
            await axios.delete('/tarefas/' + taskId)
            await requestTasks();
        } catch (error) {
            console.warn(error);
            Modal.error({
                title: "Não foi possível excluir a tarefa, tente novamente mais tarde."
            })
        } finally {
            setLoading(false);
        }
    };

    const renderDeleteTask = (task) => {
        return (
            <Popconfirm
                onConfirm={() => {
                    deleteTask(task.id);
                }}
                okText="Excluir"
                okType="danger"
                cancelText="Cancelar"
                title="Deseja sair do sistema?"
            >
                <Button
                    danger
                >
                    <DeleteOutlined />
                </Button>
            </Popconfirm >
        );
    };

    const alterTask = async (taskId) => {
        try {
            setLoading(true);
            await axios.put('/tarefas' + taskId)
            await requestTasks();
        } catch (error) {
            console.warn(error);
            Modal.error({
                title: "Não foi possível alterar a tarefa, tente novamente mais tarde."
            })
        } finally {
            setLoading(false);
        }
    };

    const renderAlterTask = (task) => {
        return (
            <Button
                type="text"
                onClick={() => {
                    alterTask(task.id);
                }}
            >
                <EditOutlined />
            </Button>
        )
    }

    const renderCategoria = useCallback((categoria) => {
        return categoria?.nome
    }, [])

    return (
        <Content>
            <Row gutter={[24, 24]} justify="center">
                <Col span={23}>
                    <Table
                        dataSource={tasks}
                        pagination={false}
                        loading={loading}
                        bordered>
                        <Column
                            title="ID"
                            dataIndex="id"
                            key="id"
                        />
                        <Column
                            title="Titulo"
                            dataIndex="titulo"
                            key="titulo"
                        />
                        <Column 
                            title="Alterar tarefa"
                            key="alterar tarefa"
                            render={renderAlterTask}
                        />
                        <Column
                            title="Categoria"
                            dataIndex="categoria"
                            key="categoria"
                            render={renderCategoria}
                        />
                        <Column
                            title="Criada em"
                            dataIndex="data_criacao"
                            key="data_criacao"
                            render={dataCriacao => {
                                return new Date(dataCriacao).toLocaleString();
                            }}
                        />
                        <Column
                            title="Concluída"
                            dataIndex="concluida"
                            key="concluida"
                            render={renderCompleteTask}
                        />

                        <Column
                            title="Excluir"
                            key="excluir"
                            render={renderDeleteTask}
                        />
                    </Table>
                </Col>

            </Row>
        </Content >
    );
}

export default TaskListPage;
