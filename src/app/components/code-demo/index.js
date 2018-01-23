import React from 'react';
import { Icon } from 'bilo-ui'
import './style.scss'
import Highlight from 'react-highlight.js'
import jsxToString from 'jsx-to-string-2'
import reactElementToJSXString from 'react-element-to-jsx-string';
import ReactElementToString from 'react-element-to-string'
import ReactElementObjectToString from 'react-elements-to-string'

class CodeDemo extends React.Component {
    constructor(props) {
        super(props)
        this.snippet = `
        class CodeSnippet {
            constructor(props) {
                this.name = "CodeDemoComponent"
            }
            render() {
                return (
                    <div></div>
                )
            }
        }
        `
    }
    state = {
        isOpen: true
    }

    

    componentDidMount() {
        const { code } = this.props;
        console.log({code})
        this.setState({
            // codeString: ReactElementToString(code)
            codeString: jsxToString(code)
        })
    }
    
    toggle() {
        this.setState({
            ...this.state,
            isOpen: !this.state.isOpen
        })
        console.log(this.jsxCodeRef)
    }
    
    render() {
        const { isOpen, codeString } = this.state;
        const { code } = this.props;
        return this.state && code ? (
            <div className='ws-card'>
                <div className='code-block'>
                    <div className='toggle' onClick={() => this.toggle()}>
                        <Icon name='code' /> {isOpen ? 'hide' : 'code'}
                    </div>
                    <br />
                    <div>
                        {
                            code && isOpen
                            ? <Highlight language={'html'}>
                                {codeString ? codeString : ''}
                                {/* <ReactElementObjectToString reactElements={ code } /> */}
                            </Highlight> 
                            :null
                        }
                    </div>
                </div>
                { code }
            </div>
        ) : null
    }
}

export default CodeDemo;