import { Form } from 'antd';
import React, { Component } from 'react';
import classNames from 'classnames';
import LoginContext from './LoginContext';
import LoginItem from './LoginItem';
import LoginSubmit from './LoginSubmit';
import styles from './index.less';

class Login extends Component {

  static Submit = LoginSubmit;

  static defaultProps = {
    className: '',
    defaultActiveKey: '',
    onTabChange: () => {},
    onSubmit: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      type: props.defaultActiveKey,
      tabs: [],
      active: {},
    };
  }

  componentDidMount() {
    const { form, onCreate } = this.props;

    if (onCreate) {
      onCreate(form);
    }
  }

  onSwitch = type => {
    this.setState(
      {
        type,
      },
      () => {
        const { onTabChange } = this.props;

        if (onTabChange) {
          onTabChange(type);
        }
      },
    );
  };

  getContext = () => {
    const { form } = this.props;
    const { tabs = [] } = this.state;
    return {
      tabUtil: {
        addTab: id => {
          this.setState({
            tabs: [...tabs, id],
          });
        },
        removeTab: id => {
          this.setState({
            tabs: tabs.filter(currentId => currentId !== id),
          });
        },
      },
      form: { ...form },
      updateActive: activeItem => {
        const { type = '', active = {} } = this.state;

        if (active[type]) {
          active[type].push(activeItem);
        } else {
          active[type] = [activeItem];
        }

        this.setState({
          active,
        });
      },
    };
  };
  
  handleSubmit = e => {
    e.preventDefault();
    const { active = {}, type = '' } = this.state;
    const { form, onSubmit } = this.props;
    const activeFields = active[type] || [];

    if (form) {
      form.validateFields(
        activeFields,
        {
          force: true,
        },
        (err, values) => {
          if (onSubmit) {
            onSubmit(err, values);
          }
        },
      );
    }
  };

  render() {
    const { className, children } = this.props;
    return (
      <LoginContext.Provider value={this.getContext()}>
        <div className={classNames(className, styles.login)}>
          <Form onSubmit={this.handleSubmit}>
            { children }
          </Form>
        </div>
      </LoginContext.Provider>
    );
  }
}

Object.keys(LoginItem).forEach(item => {
  Login[item] = LoginItem[item];
});
export default Form.create()(Login);
