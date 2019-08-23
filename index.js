const defaults = require('defaults');

const filterUniqueProps = (oldProps, newProps) => {
    return newProps.reduce((acc, item) => {
        if (!oldProps.has(item)) {
            acc.push(item);
        }
        return acc;
    }, []);
};

const wrapper = function(__createElement, opts) {
    const isFirefox = typeof InstallTrigger !== 'undefined';
    const options = defaults(opts, {
        propsBlackList: [],
        componentsBlackList: [],
        displayUnique: true,
        consoleNoticeType: 'info',
        consolePrefix: '',
        consoleText: 'should contain in propTypes:',
        consolePrefixColor: isFirefox ? 'white' : 'grey',
        consoleComponentColor: isFirefox ? 'skyblue' : 'DarkSlateGray',
        consoleTextColor: isFirefox ? 'white' : 'grey',
        consolePropsColor: isFirefox ? 'yellow' : 'Chocolate',
    });

    options.propsBlackList.push(...['__source', '__self']);

    const shownList = [];
    const propsByComponent = {};

    return function() {
        const args = [].splice.call(arguments, 0);
        const [component, props] = args;

        if (typeof component === 'function') {

            const propTypes = component.propTypes;
            const undeclaredProps = [];
            let innerName = component.name || component.displayName;

            if (component.displayName && component.name && component.displayName.indexOf('(') !== -1) {
                innerName = component.displayName.replace('()', `(${component.name})`);
            }

            if (propTypes && props) {
                Object.keys(props).forEach((prop)=> {
                    if (!propTypes[prop] && !options.propsBlackList.includes(prop) && !options.componentsBlackList.includes(innerName) &&
                        !options.componentsBlackList.includes(component.displayName) && !options.componentsBlackList.includes(component.name)) {
                        undeclaredProps.push(prop);
                    }
                });

                if (!propsByComponent[innerName]) {
                    propsByComponent[innerName] = new Set();
                }

                const displayProps = options.displayUnique ? filterUniqueProps(propsByComponent[innerName], undeclaredProps) : undeclaredProps;
                if (displayProps.length) {
                    const notice = `%c${options.consolePrefix}%c${innerName}%c ${options.consoleText} %c${displayProps.join(', ')}`;

                    if (!shownList.includes(notice)) {
                        console[options.consoleNoticeType](notice,
                            `color: ${options.consolePrefixColor}`,
                            `color: ${options.consoleComponentColor}`,
                            `color: ${options.consoleTextColor}`,
                            `color: ${options.consolePropsColor}`);
                        shownList.push(notice);
                    }
                }

                undeclaredProps.forEach(prop => propsByComponent[innerName].add(prop));
            }
        }

        return __createElement.apply(this, args);
    }
};

module.exports = function(react, options) {
    if (process.env.NODE_ENV !== 'production') {
        react.createElement = wrapper(react.createElement, options);
    }
};