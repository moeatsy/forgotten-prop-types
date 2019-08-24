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
    const shownList = [];
    const propsByComponent = {};
    const componentsByName = new Set();
    const isFirefox = typeof InstallTrigger !== 'undefined';
    const options = defaults(opts, {
        propsBlackList: [],
        componentsBlackList: [],
        displayUnique: true,
        require: false,
        consoleNoticeType: 'info',
        consolePrefix: '',
        consolePrefixColor: isFirefox ? 'white' : 'grey',
        consoleComponentColor: isFirefox ? 'skyblue' : 'darkslategray',
        consoleTextColor: isFirefox ? 'white' : 'grey',
        consolePropsColor: isFirefox ? 'yellow' : 'chocolate',
        consoleUndefinedColor: isFirefox ? 'red' : 'maroon'
    });

    options.propsBlackList.push(...['__source', '__self', 'ref', 'key']);

    return function() {
        const args = [].splice.call(arguments, 0);
        const [component, componentProps] = args;

        if (typeof component === 'function' && componentProps) {
            const propTypes = component.propTypes;
            const forgetProps = component.forgetProps || [];
            let innerName = component.name || component.displayName;

            if (component.displayName && component.name && component.displayName.indexOf('(') !== -1) {
                innerName = component.displayName.replace('()', `(${component.name})`);
            }

            const undeclaredProps = Object.keys(componentProps).reduce((acc, prop) => {
                if ((!propTypes || !propTypes[prop])
                    && !options.propsBlackList.includes(prop)
                    && !options.componentsBlackList.includes(innerName)
                    && !options.componentsBlackList.includes(component.displayName)
                    && !options.componentsBlackList.includes(component.name)
                    && !forgetProps.includes(prop)) {
                    acc.push(prop);
                }
                return acc;
            }, []);

            if (propTypes) {

                if (!propsByComponent[innerName]) {
                    propsByComponent[innerName] = new Set();
                }

                const displayProps = options.displayUnique ?
                    filterUniqueProps(propsByComponent[innerName], undeclaredProps) : undeclaredProps;

                if (displayProps.length) {
                    const notice = `%c${options.consolePrefix}%c${innerName}%c should contain in propTypes: %c${displayProps.join(', ')}`;

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

            } else {

                if (options.require
                    && undeclaredProps.length
                    && innerName
                    && !componentsByName.has(innerName)
                    && innerName[0] === innerName[0].toUpperCase()) {

                    const notice = `%c${options.consolePrefix}%cYou should set propTypes in %c${innerName}%c, it have props: %c${undeclaredProps.join(', ')}`;
                    console[options.consoleNoticeType](notice,
                        `color: ${options.consolePrefixColor}`,
                        `color: ${options.consoleUndefinedColor}`,
                        `color: ${options.consoleComponentColor}`,
                        `color: ${options.consoleUndefinedColor}`,
                        `color: ${options.consolePropsColor}`);
                    componentsByName.add(innerName);
                }
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