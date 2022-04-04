import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'

// Cabeçalho do cadastro
const headerProps = {
    icon: "users",
    title: "Cadastro de Produtos Novos",
    subtitle: "Preencha o formulário abaixo "
}

// Dados do usuário que aparecerão no server
const baseUrl = 'http://localhost:3001/users'
const initialState = {
    user: { nameProduct: '', idProduct: '', quantity: '', },
    list: []
}

export default class UserCrud extends Component {

    // Iniciando cadastro do usuário
    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    // Limpando formulário
    clear() {
        this.setState({ user: initialState.user })
    }

    // Salvando formulário  (user)  
    save() {
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        axios[method](url, user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ user: initialState.user, list })
            })
    }

    // Atualizando a lista
    getUpdatedList(user) {
        const list = this.state.list.filter(u => u.id !== user.id)
        list.unshift(user)
        return list
    }

    // Atualizando campo do formulário
    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })
    }
    //  Preenchimento do formulário e botões
    renderForm() {
        return (
            <div className='form'>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome do produto</label>
                            <input type="text" className='form-control'
                                name="nameProduct"
                                value={this.state.user.nameProduct}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome do produto..." />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Código do Produto</label>
                            <input type="text" className='form-control'
                                name="idProduct"
                                value={this.state.user.idProduct}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o código do produto..." />
                        </div>
                    </div>
                    <div className="col-12 col-md-12" >
                        <div className="form-group">
                            <label>Quantidade de produtos</label>
                            <div></div>
                            <input type="number" className='form-control' class="col-md-1 "
                                name="quantity"
                                value={this.state.user.quantity}
                                onChange={e => this.updateField(e)} />

                        </div>

                    </div>
                </div>


                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(user) {
        this.setState({ user })
    }

    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>ID</th>
                        <th>Quantidade</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.nameProduct}</td>
                    <td>{user.idProduct}</td>
                    <td>{user.quantity}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }
    
    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}