let setWaitFunc = undefined;
let getWaitFunc = undefined;
export const waiting = {
    initStatus: (waitInitFunc, getWaitInitFunc) => {
        setWaitFunc = (status) => {
            waitInitFunc(status);
        };
        getWaitFunc = () => {
            return getWaitInitFunc();
        }
    },
    setWait: (status) => {
        if (setWaitFunc) {
            setWaitFunc(status)
        }
    },
    getWait: () => {
        if (getWaitFunc)
            return getWaitFunc();
        return false;
    }
}
