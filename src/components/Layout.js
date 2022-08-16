import React, { useContext, Suspense, useState, useRef } from "react";
import {
  Layout,
  Menu,
  Row,
  Col,
  Dropdown,
  Avatar,
  Skeleton
} from "antd";
import { 
  Route, 
  Link, 
  // Redirect 
} from "react-router-dom";
import routes from "../Router/Router";
import BreadCrumbMenu from "./BreadCrumbMenu";
import { FMSContext } from "../App";
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import "../App.css";
// import Cookies from "js-cookie";
import Changepwd from "./changePwd";
const { Header, Sider, Content } = Layout;

const budgetMenuObj = [
  { title: "用户列表1", url: "/budget/credit-budgeting", id: 1005100 },
  { title: "用户列表2", url: "/budget/GBA-funding", id: 1005200 }
];
const internalMenuObj = [
  { title: "测试1", url: "/internal/cost-centers", id: 1006100 },
  { title: "测试2", url: "/internal/sub-accounts", id: 1002200 }
];
const walletMenuObj = [
  { title: "测试3", url: "/wallet/user", id: 1002100 }
];
const creditMenuObj = [
  { title: "测试4", url: "/credit/purchase-list", id: 1001100 }
];
const withdrawalMenuObj = [
  { title: "测试5", url: "/withdrawal/teacher-withdrawals", id: 1003100 }
];
const voucherMenuObj = [
  { title: "测试6", url: "/voucher/campaigns", id: 1004100 }
];
// 侧边菜单
const menus = [
  {
    menuObj: budgetMenuObj,
    keyName: "用户1",
    iconClass: "user",
    id: 1005000,
  },
  {
    menuObj: internalMenuObj,
    keyName: "用户2",
    iconClass: "fire",
    id: 1006000,
  },
  {
    menuObj: walletMenuObj,
    keyName: "用户3",
    iconClass: "id-card",
    id: 1002000,
  },
  {
    menuObj: creditMenuObj,
    keyName: "测试1",
    iconClass: "glass",
    id: 1001000,
  },
  {
    menuObj: withdrawalMenuObj,
    keyName: "测试2",
    iconClass: "hourglass",
    id: 1003000,
  },
  {
    menuObj: voucherMenuObj,
    keyName: "测试3",
    iconClass: "heart",
    id: 1004000,
  }
];

function LayoutMenu(props) {
  const [openKeys, setOpenKeys] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  
  const { FMSstate } = useContext(FMSContext);
  // const { avatar_url, menus_obj_s, username, italki_email } = FMSstate;
  const { avatar_url, username, italki_email } = FMSstate;
  const changePwdRef = useRef(null)
  const logout = () => {
    localStorage.clear();
    // Cookies.remove("isLogin");
    props.history.push("/login");
  };
  const ItemSelectedStyle = (menu) => {
    //菜单选中样式
    if (window.location.pathname === menu.url) {
      return "ant-menu-item-selected margin-0";
    }
    return "menuItemCss margin-0";
  };
  /**
   * 获取将图片上传到网站所需的token
   */
  const getUploadToken = () => {
    let uploadToken;
    if (process.env.NODE_ENV === "production") {
      uploadToken =
        "1578043311c1Ow2pG6sRHJEzel6PBvovcKJbaaPjQu4b8yyXXZz9AUQOnJdgAjEGAg872l/xO";
    } else {
      uploadToken =
        "1578043311c1Ow2pG6sRHJEzel6PBvovcKJbaaPjQu4b8yyXXZz9AUQOnJdgAjEGAg872l/xO";
    }

    return uploadToken;
  };
  const onOpenChange = (keys) => {
    const rootKeys = [
      "1001000",
      "1002000",
      "1003000",
      "1004000",
      "1005000",
      "1006000",
      "1990000",
    ];
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  return (
    <Layout>
      <Header className="header-style">
        <Row gutter={[12, 12]}>
          <Col
            sm={8} lg={4} xl={3} xxl={2}
            onClick={() => setOpenKeys([])}
          >
            <Link to="/dashboard" style={{ color: "#fff", fontSize: 18 }}>
              CMS
            </Link>
            <span onClick={() => setCollapsed(!collapsed)}>
              {collapsed 
              ? <MenuUnfoldOutlined className="trigger" /> 
              : <MenuFoldOutlined className="trigger" />}
            </span>
          </Col>
          <Col sm={10} lg={17} xl={18} xxl={19}></Col>
          <Col sm={4} lg={2} xl={2}>
            <Dropdown
              className="float-right"
              overlay={
                <Menu>
                  <Menu.Item key="username" disabled>
                    {italki_email || '当前用户'}
                  </Menu.Item>
                  <Menu.Divider className='menu-divider' />
                  <Menu.Item
                    key="changepwd"
                    onClick={() => changePwdRef.current.open()}
                  >
                    <i className="fa fa-unlock" /> 修改密码
                  </Menu.Item>
                  <Menu.Item key="logout" onClick={logout}>
                    <i className="fa fa-sign-out" /> 退出
                  </Menu.Item>
                </Menu>
              }
            >
              <div>
                {avatar_url ? (
                  <Avatar src={avatar_url} size="small"></Avatar>
                ) : (
                  <Avatar size="small" icon={<UserOutlined />} />
                )}
                <span className='text-bold' style={{ marginLeft: 10, color: "white" }}>
                  {username}
                </span>
              </div>
            </Dropdown>
          </Col>
        </Row>
      </Header>
      <Layout>
        <Sider
          width="250"
          theme={'light'}
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <Menu theme={'light'} mode="inline" openKeys={openKeys} onOpenChange={onOpenChange}>
            <Menu.Item
              className="margin-0"
              onClick={() => setOpenKeys([])}
              key="dashboard"
            >
              <Link to="/dashboard" />
              <i
                className="fa fa-home"
                aria-hidden="true"
                style={{ transform: "scale(1.2)" }}
              >
                <Link to="/dashboard" />
              </i>
              <span style={{ marginLeft: 10 }}>
                {!collapsed ? "首页" : null}
              </span>
            </Menu.Item>

            {menus?.map(
              (item) =>
                (
                  <Menu.SubMenu
                    key={item.id}
                    icon={
                      <i
                        className={`fa fa-${item.iconClass}`}
                        aria-hidden="true"
                      ></i>
                    }
                    title={`${item.keyName}`}
                  >
                    {item.menuObj.map(
                      (item) =>
                        (
                          <Menu.Item
                            key={item.id}
                            className={ItemSelectedStyle(item)}
                          >
                            <Link className='meunItemLink' to={item.url}></Link>
                            <i
                              className="fa fa-circle"
                              aria-hidden="true"
                              style={{ transform: "scale(0.4)" }}
                            ></i>
                            {item.title}
                          </Menu.Item>
                        )
                    )}
                  </Menu.SubMenu>
                )
            )}
          </Menu>
        </Sider>
        
        <Content className="overflow-visible">
          <div className="breadcrumb-font">
            <BreadCrumbMenu />
            {routes?.map((route, index) => (
              <Suspense key={index} fallback={<Skeleton active />}>
                <Route
                  exact
                  path={route.path}
                  render={(props) => (
                    <route.component
                      {...props}
                      // routes={route.routes}
                      getUploadToken={getUploadToken}
                    />
                  )}
                />
                {/* <Redirect to="/dashboard"></Redirect> */}
              </Suspense>
            ))}
          </div>
        </Content>
      </Layout>
      <Changepwd ref={changePwdRef} />
    </Layout>
  );
}
export default LayoutMenu;
