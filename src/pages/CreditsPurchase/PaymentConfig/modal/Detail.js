import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from "react";
import {
  Modal,
  Form,
  Row,
  Col,
  Spin,
  Tooltip,
  notification,
  message,
  Button,
  Table,
} from "antd";
import WriteLog from "../../../../components/CommonComponent/WriteLog";
import PaymentConfigInfo from "./PaymentConfigInfo";
import StatusCountry from "./StatusCountry";
import AddEditSort from "./AddEditSort";
import HasPermi from "../../../../components/CommonComponent/PermissionControl";
import { add_payment_or_detail } from "../service";

import { commonFilter } from "../../../../components/CommonComponent/CommonFunction";

const Detail = forwardRef((props, ref) => {
  const { curItem } = props;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [logModal, setLogModal] = useState(false);
  const [fresh, setFresh] = useState(false);
  const [details, setDetails] = useState(curItem);
  const [deleteSort, setDeleteSort] = useState(null);
  const statusCountryRef = useRef(null);
  const addEditSortRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
    },
  }));
  useEffect(() => {
    if (visible) {
      getDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, curItem, fresh]);
  const getDetails = () => {
    setLoading(true);
    add_payment_or_detail(null, null, curItem.pay_type)
      .then((res) => {
        const {
          data: { data },
        } = res;
        setDetails(data);
      })
      .catch((err) => {
        notification.error({
          message: "Error",
          description: "Cannot get data",
        });
      })
      .finally((_) => setLoading(false));
  };
  const submit = (log) => {
    let postData = {
      log_note: log
    };
    if(deleteSort) {
      postData.operate = 'delete_country_sort'
      postData.id = deleteSort.id
    } else {
      postData.operate = "change_pay_type_status"
      postData.status = 0
    }
    add_payment_or_detail(postData, "post", details.pay_type)
      .then((res) => {
        const {
          data: { data: success },
        } = res;
        success && message.success("Success");
        logModal.onCancel();
        setFresh(!fresh);
        setDeleteSort(null)
      })
      .catch((err) => message.error(err?.error?.msg));
  };
  const onClose = () => {
    setVisible(false);
  };
  const changeAble = (type) => {
    switch (type) {
      case "E":
        statusCountryRef.current.open(0);
        break;
      case "D":
        logModal.onShow();
        break;
      default:
        return null;
    }
  };
  return (
    <>
      <Modal
        visible={visible}
        title={`${details.pay_type}-${details.name}`}
        onCancel={onClose}
        onOk={form.submit}
        maskClosable={false}
        destroyOnClose
        width="65%"
        zIndex={1}
        footer={[<Button onClick={onClose}>Close</Button>]}
      >
        <Spin spinning={loading}>
          <Row justify="space-between" gutter={[8, 8]}>
            <Col span={12}>
              <span className="text-bold-7 default-font enable-bg">
                {details.status === 0 ? "Disable" : "Enable"}
              </span>
            </Col>
            <Col className="text-align-right" span={12}>
              {HasPermi(1001301) && details.status === 0 ? (
                <Button type="primary" onClick={() => changeAble("E")}>
                  Enable
                </Button>
              ) : (
                <Button type="primary" onClick={() => changeAble("D")}>
                  Disable
                </Button>
              )}
            </Col>
          </Row>
          <PaymentConfigInfo update={() => setFresh(!fresh)} curItem={details} />
          {details.status !== 0 && (
            <>
              <Row gutter={[8, 8]}>
                <Col span={24}>
                  <div className="form-title-top">
                    {details.status === 2
                      ? "Specified Countries can use"
                      : "Specified Countries cannot use"}
                    {HasPermi(1001301) && (
                      <Tooltip title="Edit Using Status">
                        <span
                          className="padding-0-5 link-hover-underline:hover"
                          onClick={() =>
                            statusCountryRef.current.open(1)
                          }
                        >
                          <i className="fa fa-edit blue table-hover-pointer"></i>
                        </span>
                      </Tooltip>
                    )}
                  </div>
                </Col>
              </Row>
              {![0, 1].includes(details.status) && (
                <Table
                  columns={[
                    {
                      title: "ID",
                      width: "30%",
                      dataIndex: "id",
                    },
                    {
                      title: "Country",
                      width: "30%",
                      render: (item) => commonFilter("gt", item.country),
                    },
                    {
                      title: "Default Sort",
                      width: "30%",
                      dataIndex: "default_sort",
                    },
                    {
                      render: () => null,
                    },
                  ]}
                  dataSource={details.country_s}
                  pagination={false}
                />
              )}
              <Row gutter={[8, 8]} className="line-dashed-top">
                <Col span={12}>Specified Country Sort</Col>
                <Col className="text-align-right" span={12}>
                  {HasPermi(1001301) && (
                    <Button
                      type="primary"
                      onClick={() => addEditSortRef.current.open()}
                    >
                      Add Sort
                    </Button>
                  )}
                </Col>
              </Row>
              {details.country_sort_s?.length > 0 && details.status !== 0 && (
                <Table
                  columns={[
                    {
                      title: "ID",
                      dataIndex: "id",
                      width: "30%",
                    },
                    {
                      title: "Country",
                      width: "30%",
                      render: (item) => commonFilter("gt", item.country),
                    },
                    {
                      title: "Sort",
                      width: "30%",
                      dataIndex: "sort",
                    },
                    {
                      className: "text-align-right",
                      render: (item) => (
                        <i
                          className="fa fa-close cursor-pointer"
                          onClick={() => {
                            setDeleteSort(item);
                            logModal.onShow();
                          }}
                        ></i>
                      ),
                    },
                  ]}
                  dataSource={details.country_sort_s}
                  pagination={false}
                />
              )}
            </>
          )}
        </Spin>
      </Modal>
      <StatusCountry
        update={() => setFresh(!fresh)}
        curItem={details}
        ref={statusCountryRef}
      />
      <AddEditSort
        update={() => setFresh(!fresh)}
        curItem={details}
        ref={addEditSortRef}
      />
      <WriteLog
        title={deleteSort ? "Delete Sort" : "Disable"}
        onOk={submit}
        onRef={(ref) => setLogModal(ref)}
      />
    </>
  );
});
export default Detail;
