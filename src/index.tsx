import React from 'react';
import ReactDom from 'react-dom';
import Drag from './page-drag';
import './index.less'

interface AppProps { }

const App:React.FC<AppProps> = () => {
    return <Drag/>
}
ReactDom.render(<App/>, document.getElementById('root'))