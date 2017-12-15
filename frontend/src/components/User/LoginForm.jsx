import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Form, Icon, Input, Button, Checkbox, Alert, message } from "antd";
import axios from 'axios'
import "./login-form.css";

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            alertDisplay: 'none',
            alertMessage: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields(async (err, formData) => {
            if (!err) {
                let response = await this.props.onLogin(formData);
                if (!response.data.isLogin) {
                    this.setState({
                        alertDisplay: 'block',
                        alertMessage: response.data.message
                    });
                }
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={{ width: "280px", margin: "50px auto" }}>
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator("username", {
                        rules: [
                            {
                                required: true,
                                message: "Please input your username!"
                            }
                        ]
                    })(
                        <Input
                            prefix={
                                <Icon
                                    type="user"
                                    style={{ color: "rgba(0,0,0,.25)" }}
                                />
                            }
                            placeholder="Username"
                        />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator("password", {
                        rules: [
                            {
                                required: true,
                                message: "Please input your Password!"
                            }
                        ]
                    })(
                        <Input
                            prefix={
                                <Icon
                                    type="lock"
                                    style={{ color: "rgba(0,0,0,.25)" }}
                                />
                            }
                            type="password"
                            placeholder="Password"
                        />
                    )}
                </FormItem>
                <FormItem>
                    {/*{getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className="login-form-forgot" href="">Forgot password</a>*/}
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                    >
                        Log in
                    </Button>
                    Or <Link to="/signup">sign up now!</Link>
                </FormItem>
            </Form>
            <Alert 
                style={{ display: this.state.alertDisplay }} 
                message={ this.state.alertMessage } 
                type="error" 
                showIcon
            />
            </div>
        );
    }
}

const LoginForm = Form.create()(NormalLoginForm);

export default LoginForm;