import propTypes from 'prop-types';
import forgottenPropTypes from '../index';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, {shallow} from 'enzyme';
Enzyme.configure({adapter: new Adapter()});

let React;

function resetReact(options) {
    React = require('react');
    forgottenPropTypes(React, options);
}

const ComponentWithNoPropTypes = () => <div/>;

const ComponentWithEmptyPropType = () => <div/>;
ComponentWithEmptyPropType.propTypes = {};

const ComponentWithPropType = () => <div/>;
ComponentWithPropType.propTypes = {haveProp: propTypes.any};

const ComponentWithPropTypeAndForget = () => <div/>;
ComponentWithPropTypeAndForget.propTypes = {haveProp: propTypes.any};
ComponentWithPropTypeAndForget.forgetProps = ['hiddenProp'];

const ComponentWithoutPropTypeButForget = () => <div/>;
ComponentWithoutPropTypeButForget.propTypes = {otherProp: propTypes.any};
ComponentWithoutPropTypeButForget.forgetProps = ['hiddenProp'];

describe('forgotten-prop-types tests', () => {
    let consoleLog = '';

    global.console.info = (msg) => {
        consoleLog += msg;
    };

    beforeEach(() => {
        consoleLog = '';
    });

    it('#1 Component not contains propTypes and should be noticed', () => {
        resetReact({require: true});
        shallow(<ComponentWithNoPropTypes testProp={true}/>);
        expect(consoleLog).toBe('%c%cYou should set propTypes in %cComponentWithNoPropTypes%c, it have props: %ctestProp');
    });

    it('#2 Component have undeclared prop and should be noticed', () => {
        shallow(<ComponentWithPropType testProp={true}/>);
        expect(consoleLog).toBe('%c%cComponentWithPropType%c should contain in propTypes: %ctestProp');
    });

    it('#3 Component have forgetProp and not spawn notice at this prop', () => {
        shallow(<ComponentWithPropTypeAndForget haveProp={true} hiddenProp={true}/>);
        expect(consoleLog).toBe('');
    });

    it('#4 Component have forgetProp but not have one prop declared and should be noticed about one', () => {
        shallow(<ComponentWithoutPropTypeButForget haveProp={true} hiddenProp={true}/>);
        expect(consoleLog).toBe('%c%cComponentWithoutPropTypeButForget%c should contain in propTypes: %chaveProp');
    });

    it('#5 Props should be noticed twice if unique not activated', () => {
        resetReact({displayUnique: false});
        shallow(<ComponentWithEmptyPropType haveProp={true}/>);
        shallow(<ComponentWithEmptyPropType haveProp={true}/>);
        expect(consoleLog).toBe('%c%cComponentWithEmptyPropType%c should contain in propTypes: %chaveProp%c%cComponentWithEmptyPropType%c should contain in propTypes: %chaveProp');
    });

    it('#6 Props should be noticed once if unique activated', () => {
        resetReact({displayUnique: true});
        shallow(<ComponentWithEmptyPropType haveProp={true}/>);
        shallow(<ComponentWithEmptyPropType haveProp={true}/>);
        expect(consoleLog).toBe('%c%cComponentWithEmptyPropType%c should contain in propTypes: %chaveProp');
    });
});
