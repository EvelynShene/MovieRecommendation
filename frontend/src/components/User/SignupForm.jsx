import React from 'react'
import { Link, Redirect } from 'react-router-dom';
import { Form, Input, Button, Alert, message } from 'antd'
import axios from 'axios'

const FormItem = Form.Item;

class RegistrationForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isDone: false,
            confirmDirty: false, 
            alertDisplay: 'none',
            alertMessage: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.checkConfirm = this.checkConfirm.bind(this);
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, formData) => {
            if (!err) {
                let response = await axios.post('/api/user/signup', formData);
                if (response.data.isSignup) {
                    this.setState({
                        isDone: true
                    });
                    message.success(response.data.message);
                } else {
                    this.setState({
                        alertDisplay: 'block',
                        alertMessage: response.data.message
                    });
                }
            }
        });
    };
    
    handleConfirmBlur(e) {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    
    checkPassword(rule, value, callback) {
        const form = this.props.form;
        if (value && value !== form.getFieldValue("password")) {
            callback("Two passwords that you enter is inconsistent!");
        } else {
            callback();
        }
    };
    
    checkConfirm(rule, value, callback) {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(["confirm"], { force: true });
        }
        callback();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 }
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 14,
                    offset: 6
                }
            }
        };
        if (this.state.isDone) {
            return <Redirect to="/login" />;
        }
        return (
            <div style={{ width: "400px", margin: "50px auto" }}>
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="E-mail" hasFeedback>
                    {getFieldDecorator("email", {
                        rules: [
                            {
                                type: "email",
                                message: "The input is not valid E-mail!"
                            },
                            {
                                required: true,
                                message: "Please input your E-mail!"
                            }
                        ]
                    })(<Input maxLength="25" />)}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={<span>Username&nbsp;</span>}
                    hasFeedback
                >
                    {getFieldDecorator("username", {
                        rules: [
                            {
                                required: true,
                                message: "Please input your username!",
                                whitespace: true
                            }
                        ]
                    })(<Input maxLength="25" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Password" hasFeedback>
                    {getFieldDecorator("password", {
                        rules: [
                            {
                                required: true,
                                message: "Please input your password!"
                            },
                            {
                                min: 6,
                                message: "Your password must be at least 6 characters!"
                            },
                            {
                                validator: this.checkConfirm
                            }
                        ]
                    })(<Input maxLength="25" type="password" />)}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Confirm"
                    hasFeedback
                >
                    {getFieldDecorator("confirm", {
                        rules: [
                            {
                                required: true,
                                message: "Please confirm your password!"
                            },
                            {
                                validator: this.checkPassword
                            }
                        ]
                    })(
                        <Input
                            type="password"  
                            maxLength="25"
                            onBlur={this.handleConfirmBlur}
                        />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Sign up
                    </Button>
                    <div>Or <Link to="/login">log in existing account</Link></div>
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

const SignUpForm = Form.create()(RegistrationForm);

export default SignUpForm;