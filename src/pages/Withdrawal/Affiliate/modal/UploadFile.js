import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Row, Button, Upload, Table, message } from "antd";
import { get_list_log_submit, edit_expandable_cash } from "../service";
import { commonFilter } from "../../../../components/CommonComponent/CommonFunction";
import WriteLog from "../../../../components/CommonComponent/WriteLog";
import { PreviewData } from "../../WithdrawalConst";

const UploadFile = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successNum, setSuccessNum] = useState();
  const [previewsible, setPreviewsible] = useState(false);
  const [filObj, setFileObj] = useState(null);
  const [result, setResult] = useState([]);
  const [logModal, setLogModal] = useState(false);
  const [processVisible, setProcessVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errArr, setErrArr] = useState([]);
  const [finish, setFinish] = useState(0);
  const [errNum, setErrNum] = useState(0);
  const [pagination, setPagination] = useState({
    pageSize: 20,
    current: 1,
    pageSizeOptions: ["10", "20", "50", "100"],
    showSizeChanger: true,
  });
  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
      resetFile()
      setPagination({
        pageSize: 20,
        current: 1,
        pageSizeOptions: ["10", "20", "50", "100"],
        showSizeChanger: true,
      });
    },
  }));
  const onOk = () => {
    setLoading(true);
    if (successNum === result.length) {
      setVisible(false)
      logModal.onShow()
    } else {
      let formData = new FormData();
      formData.append("csv_file", filObj.file);
      formData.append("operate", "check_accept_done_by_csv");
      get_list_log_submit(formData, "post", { dataType: "form" })
        .then((res) => {
          const {
            data: {
              data: { success },
              meta,
            },
          } = res;
          setResult(meta);
          setErrArr(meta.filter((item) => item.id === 0 || Number(item.user_id) !== item.w_user_id));
          if (success > 0) {
            setSuccessNum(success);
          }
        })
        .catch((err) => message.error(err?.error?.msg))
        .finally((_) => setLoading(false));
    }
  };
  const beforeUpload = (file) => {
    const { name } = file;
    const suffix = name.split(".")[name.split(".").length - 1];
    if (suffix !== "csv") {
      message.warning("Please select a CSV file");
      return false;
    }
    return true;
  };

  const Columns = [
    {
      title: "order_id",
      render: (item) => (
        <span
          className={
            item.id > 0 && Number(item.user_id) === Number(item.w_user_id)
              ? ""
              : "color-red"
          }
        >
          {item.order_id}
        </span>
      ),
    },
    {
      title: "w_user_id",
      dataIndex: "w_user_id",
    },
    {
      title: "user_id",
      dataIndex: "user_id",
    },
    {
      title: "Amount($)",
      render: (item) => commonFilter("centToUsd", item.amount),
    },
    ...PreviewData.filter(item => !['italki_fee','third_fee','is_mass','is_immediate'].includes(item)).map((item) => {
      return { title: item, dataIndex: item };
    }),
  ];
  const handleTableChange = (page) => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    setPagination({ ...pagination, ...page });
  };
  const resetFile = () => {
    setSuccessNum();
    setPreviewsible(false);
    setLoading(false);
    setFileObj(null);
    setResult([]);
    setErrArr([]);
    setFinish(0)
    setErrNum(0)
  };
  const submit = async (log_note) => {
    setProcessVisible(true)
    setProcessing(true)
    logModal.onCancel()
    let postDatas = []
    result.map(item => postDatas.push({
      operate: 'accept_done',
      id:item.id,
      user_id:item.user_id,
      money: parseInt((parseFloat(Number(item.money)) * 100).toFixed()),
      currency:item.currency,
      bill_id:item.bill_id,
      pay_user:item.pay_user,
      pay_date:item.pay_date,
      italki_fee:Number(item.italki_fee) * 100,
      third_fee:Number(item.third_fee) * 100,
      is_mass:item.is_mass,
      is_immediate:item.is_immediate,
      remark:item.remark || '',
      log_note
    }))
    // 全部返回再计算
    // const pros = postDatas.map(item => edit_expandable_cash(item, 'post', item['id']))
    // const results = await Promise.allSettled(pros)
    // // 过滤成功
    // const finished = results.filter(p => p.status === 'fulfilled')
    // // 过滤失败
    // const errors = results.filter(p => p.status === 'rejected')
    // setFinishErr({finished, errors})
    let countY = 0
    let countN = 0
    postDatas.forEach(item => {
      edit_expandable_cash(item, 'post', item['id'])
      .then(res => {
        if(res.data.data.success) {
          countY ++
          setFinish(countY)
          props.update()
        }
      })
      .catch(err => {
        countN ++
        setErrNum(countN)
      })
      .finally(_ => setProcessing(false))
    })
  };
  return (
    <>
      <Modal
        visible={visible}
        title="Complete Withdrawal Batch By CSV"
        cancelText="Cancel"
        okText={result.length > 0 ? "Confirm" : "Upload"}
        onCancel={() => {
          setVisible(false);
          resetFile();
        }}
        maskClosable={false}
        destroyOnClose
        onOk={onOk}
        confirmLoading={loading}
        okButtonProps={{ disabled: errArr.length > 0 || !filObj }}
      >
        <Row justify="end" className="margin-bottom-15">
          <Upload
            accept=".csv"
            method="post"
            name="file"
            customRequest={(file) => setFileObj(file)}
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={(info) => {
              info.fileList = [];
              resetFile();
            }}
          >
            {filObj?.file?.name && <span>{filObj.file.name}</span>} &nbsp;
            <Button type="primary">Select one CSV file</Button>
          </Upload>
        </Row>
        <Row justify="end">
          <p>need : order_id*,money*,currency,bill_id*,user_id*,pay_date,pay_user</p>
        </Row>
        {result.length > 0 && (
          <Row justify="end" className="margin-30-15">
            <span className="color-red">
              {`Total ${result.length} datas`}, &nbsp;
              {errArr.length > 0 && (
                <span className="text-bold">{`${errArr.length} Errors`}</span>
              )}
            </span>
            &nbsp;
            {successNum > 0 && (
              <span className="span-link blue" onClick={() => setPreviewsible(true)}>
                {" "}
                Preview Data{" "}
              </span>
            )}
          </Row>
        )}
      </Modal>
      <Modal
        visible={previewsible}
        title="Preview Upload Data"
        onCancel={() => setPreviewsible(false)}
        footer={null}
        width="90%"
        zIndex={1001}
      >
        <Table
          pagination={{
            ...pagination,
          }}
          columns={Columns}
          dataSource={result}
          tableLayout="fixed"
          rowKey="id"
          size="small"
          onChange={handleTableChange}
        />
      </Modal>
      <Modal
        visible={processVisible}
        title="Complete Withdrawal Batch By CSV"
        onCancel={() => setProcessVisible(false)}
        footer={[<Button key='1' disabled={processing} onClick={() => setProcessVisible(false)}>Close</Button>]}
        zIndex={1002}
      >
        <h3 className="color-red text-align-center">It's processing, please don't close</h3>
        <br/>
        <p className="text-lb text-align-center">
          Total <span>{result.length}</span> withdrawals
          , <span>{finish || 0}</span> Completed
          , <span className="color-red">{errNum || 0} Error</span>
        </p>
      </Modal>
      <WriteLog
        title="Complete Withdrawal Batch By CSV"
        onOk={submit}
        onRef={(ref) => setLogModal(ref)}
      />
    </>
  );
});
export default UploadFile;
