import React from "react";
import PropTypes from "prop-types";
import { Input } from "@progress/kendo-react-inputs";

export default class TokenForm extends React.Component {
  static propTypes = {
    setToken: PropTypes.func.isRequired
  };

  handleSubmit = event => {
    event.preventDefault();
    const { setToken } = this.props;
    const token = process.env.REACT_APP_GIT_HUB_TOKEN;
    console.log('\n', 'token', '\n', '\n', token )
    if (token) {
      setToken(token);
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Input
          name="token"
          placeholder="Enter whatever, it's hardcoded"
          ref={input => {
            this.tokenInput = input;
          }}
        />
      </form>
    );
  }
}
