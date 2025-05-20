import { NavigateFunction } from "react-router";

/* 在非 React 组件外，也能调用路由跳转 */
const globalRouter = { navigate: undefined } as {
    navigate?: NavigateFunction;
};

export default globalRouter;

/*让你在项目的任意地方，不用通过 useNavigate()，就可以直接调用 navigate 来进行路由跳转。*/